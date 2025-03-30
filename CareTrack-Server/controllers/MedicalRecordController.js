const { bcryptCompare } = require("../helpers/bcryptjs");
const { createToken, encryptData, decryptData } = require("../helpers/jwt");
const { Treatment, Patient, MedicalPatient, MedicalTreatment, MedicalMedicine, sequelize, Medicine } = require("../models");
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const { Op, Sequelize } = require('sequelize');
const { validateEmail } = require("../helpers/general");

class MedicalRecordController {
    static async getAll(req, res, next) {
        const { perPage = 10, page = 1, search } = req.query;
        try {
            let offset = 0;
            let queryOptions = {
                include: [
                    {
                        model: Patient,
                        attributes: ['id', 'codeId', 'name', 'email', 'birthDate'],
                        where: {}, 
                        required: true
                    },
                    {
                        model: Medicine,
                        through: { attributes: ['quantity'] },
                        attributes: ['id', 'name', 'price']
                    },
                    {
                        model: Treatment,
                        through: { attributes: ['quantity'] },
                        attributes: ['id', 'name', 'cost']
                    }
                ],
                order: [['id', 'DESC']]
            };
    
            if (search) {
                queryOptions.include[0].where = {
                    [Op.or]: [
                        { name: { [Op.iLike]: `%${search}%` }}
                    ]
                };
            }
    
            if (perPage !== 'all') {
                offset = (page - 1) * perPage;
                queryOptions.limit = parseInt(perPage);
                queryOptions.offset = offset;
            }
    
            const { count, rows: data } = await MedicalPatient.findAndCountAll(queryOptions);
    
            const response = {
                code: 200,
                status: 'success',
                message: 'Successfully retrieved Medical Patient data',
                data,
                total: count,
                page: perPage !== 'all' ? parseInt(page) : null,
                perPage: perPage !== 'all' ? parseInt(perPage) : null,
                offset: perPage !== 'all' ? offset : null
            };
    
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        const t = await sequelize.transaction();
        try {
            const { 
                date, 
                totalPrice,
                treatments,
                medicines,
                note,
                isNewPatient,
                newPatient  
            } = req.body;
    
            let patientId = req.body.patientId;
    
            if (!date) throw ({ name: `EmptyDate`, origin: 'MedicalRecordController' });
            if (!totalPrice || totalPrice < 1) throw ({ name: `InvalidTotalPrice`, origin: 'MedicalRecordController' });
            if (!treatments || treatments.length < 1) throw ({ name: `EmptyTreatments`, origin: 'MedicalRecordController' });
            if (!medicines || medicines.length < 1) throw ({ name: `EmptyMedicines`, origin: 'MedicalRecordController' });
    
            if (isNewPatient) {
                if (!newPatient?.name?.trim()) throw ({ name: `EmptyPatientName`, origin: 'MedicalRecordController' });
                if (newPatient.name.trim().length > 200) throw ({ name: `PatientNameTooLong`, origin: 'MedicalRecordController' });
                
                if (!newPatient?.birthDate) throw ({ name: `EmptyBirthDate`, origin: 'MedicalRecordController' });
                
                if (!newPatient?.email?.trim()) throw ({ name: `EmptyEmail`, origin: 'MedicalRecordController' });
                if (!validateEmail(newPatient.email)) throw ({ name: `InvalidEmail`, origin: 'MedicalRecordController' });
                if (newPatient.email.trim().length > 200) throw ({ name: `EmailTooLong`, origin: 'MedicalRecordController' });
                
                if (!newPatient?.codeId?.trim()) throw ({ name: `EmptyPatientCode`, origin: 'MedicalRecordController' });
                if (newPatient.codeId.trim().length > 8) throw ({ name: `PatientCodeTooLong`, origin: 'MedicalRecordController' });
    
                const existedPatient = await Patient.findOne({ 
                    where: { 
                        [Op.or]: [
                            { email: newPatient.email },
                            { codeId: newPatient.codeId }
                        ]
                    },
                    transaction: t
                });
    
                if (existedPatient) throw ({ name: `DuplicatePatient`, origin: 'MedicalRecordController' });
    
                const createdPatient = await Patient.create({
                    codeId: newPatient.codeId,
                    email: newPatient.email,
                    name: newPatient.name,
                    birthDate: newPatient.birthDate,
                }, { transaction: t });
    
                patientId = createdPatient.id;
            } else {
                if (!patientId) throw ({ name: `EmptyPatientId`, origin: 'MedicalRecordController' });
                
                const patientExists = await Patient.findByPk(patientId, { transaction: t });
                if (!patientExists) throw ({ name: `PatientNotFound`, origin: 'MedicalRecordController' });
            }
    
            const medicalPatient = await MedicalPatient.create({
                patientId,
                date,
                totalCost: totalPrice,
                note
            }, { transaction: t });
    
            const treatmentPromises = treatments.map(treatment => 
                MedicalTreatment.create({
                    medicalPatientId: medicalPatient.id,
                    treatmentId: treatment.id,
                    quantity: treatment.quantity
                }, { transaction: t })
            );
    
            const medicinePromises = medicines.map(medicine => 
                MedicalMedicine.create({
                    medicalPatientId: medicalPatient.id,
                    medicineId: medicine.id,
                    quantity: medicine.quantity
                }, { transaction: t })
            );
    
            await Promise.all([...treatmentPromises, ...medicinePromises]);
            await t.commit();
    
            res.status(201).json({
                code: 201,
                status: 'success',
                message: 'Medical record created successfully',
                data: {
                    ...medicalPatient.toJSON(),
                    treatments,
                    medicines
                }
            });
    
        } catch (error) {
            await t.rollback();
            next(error);
        }
    }
}

module.exports = MedicalRecordController;