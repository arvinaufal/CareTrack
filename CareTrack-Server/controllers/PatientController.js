const { bcryptCompare } = require("../helpers/bcryptjs");
const { createToken, encryptData, decryptData } = require("../helpers/jwt");
const { Treatment, Patient, MedicalPatient, MedicalTreatment, MedicalMedicine, sequelize, Medicine } = require("../models");
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const { Op, Sequelize } = require('sequelize');
const { validateEmail } = require("../helpers/general");

class PatientController {
    static async getAll(req, res, next) {
        const { perPage = 10, page = 1, search } = req.query;
        try {
            let offset = 0;
            let queryOptions = {
                where: {},
                order: [['id', 'DESC']]
            };
        
            if (search) {
                queryOptions.where.name = {
                    [Sequelize.Op.iLike]: `%${search}%`
                };
            }

            if (perPage !== 'all') {
                offset = (page - 1) * perPage;
                queryOptions.limit = parseInt(perPage);
                queryOptions.offset = offset;
            }

            const { count, rows: data } = await Patient.findAndCountAll(queryOptions);
        
            const response = {
                code: 200,
                status: 'success',
                message: 'Successfully retrieved patient data',
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
        try {
            const { codeId, name, email, birthDate } = req.body;
        
            if (!codeId)  throw ({ name: `EmptyCodeId`, origin: 'PatientController' });
            if (!name)  throw ({ name: `EmptyName`, origin: 'PatientController' });
            if (!email)  throw ({ name: `EmptyEmail`, origin: 'PatientController' });
            if (!validateEmail(email))  throw ({ name: `InvalidEmail`, origin: 'PatientController' });
            if (!birthDate)  throw ({ name: `EmptyBirthdate`, origin: 'PatientController' });

        
            const existingPatient = await Patient.findOne({ where: { codeId }});
        
            if (existingPatient) throw ({ name: `DuplicateCodeId`, origin: 'PatientController' })
        
            const patient = await Patient.create({
                codeId,
                name,
                email,
                birthDate
            });
        
            return res.status(201).json({
                code: 201,
                status: 'success',
                message: 'Patient created successfully',
                data: patient
            });
        
        } catch (error) {
            console.error('Error creating patient:', error);
    
            next(error);
        }
    }

    static async update(req, res, next) {
        const { patientId } = req.params;
        try {
            const { codeId, name, email, birthDate } = req.body;
        
            if (!codeId)  throw ({ name: `EmptyCodeId`, origin: 'PatientController' });
            if (!name)  throw ({ name: `EmptyName`, origin: 'PatientController' });
            if (!email)  throw ({ name: `EmptyEmail`, origin: 'PatientController' });
            if (!validateEmail(email))  throw ({ name: `InvalidEmail`, origin: 'PatientController' });
            if (!birthDate)  throw ({ name: `EmptyBirthdate`, origin: 'PatientController' });

        
            const patient = await Patient.findByPk(patientId);
        
            if (!patient) throw ({ name: `PatientNotExists`, origin: 'PatientController' });
        
            await patient.update({
                codeId,
                name,
                email,
                birthDate
            });
        
            return res.status(200).json({
                code: 200,
                status: 'success',
                message: 'Patient updated successfully',
                data: patient
            });
        
        } catch (error) {
            console.error('Error updating patient:', error);
    
            next(error);
        }
    }

    static async delete(request, response, next) {
        const { patientId } = request.params;
        const t = await sequelize.transaction();
        try {
            let patient = await Patient.findByPk(patientId, { transaction: t });
            if (!patient) throw ({ name: `PatientNotExists`, origin: 'PatientController' });
    
            const medicalPatients = await MedicalPatient.findAll({
                where: { patientId },
                transaction: t
            });

            const medicalPatientIds = medicalPatients.map(mp => mp.id);
    
            await MedicalTreatment.destroy({
                where: { medicalPatientId: medicalPatientIds },
                transaction: t
            });
    
            await MedicalMedicine.destroy({
                where: { medicalPatientId: medicalPatientIds },
                transaction: t
            });

            await MedicalPatient.destroy({
                where: { patientId },
                transaction: t
            });

            await patient.destroy({ transaction: t });
            await t.commit();
            
            response.status(200).json({
                code: 200,
                status: 'success', 
                message: `Patient and all related medical records successfully deleted`
            });
        } catch (error) {
            await t.rollback();
            next(error);
        }
    }

    static async getAllMedicalPatient(req, res, next) {
        const { perPage = 10, page = 1, search } = req.query;
        try {
            let offset = 0;
            let queryOptions = {
                attributes: [
                    'patientId',
                    [sequelize.fn('COUNT', sequelize.col('MedicalPatient.id')), 'totalRecords'],
                    [sequelize.fn('SUM', sequelize.col('totalCost')), 'totalCost'],
                    [sequelize.fn('SUM', sequelize.literal('(SELECT COUNT(*) FROM "MedicalTreatments" WHERE "MedicalTreatments"."medicalPatientId" = "MedicalPatient"."id")')), 'totalTreatments'],
                    [sequelize.fn('SUM', sequelize.literal('(SELECT COUNT(*) FROM "MedicalMedicines" WHERE "MedicalMedicines"."medicalPatientId" = "MedicalPatient"."id")')), 'totalMedicines']
                ],
                include: [
                    {
                        model: Patient,
                        attributes: ['id', 'codeId', 'name', 'email', 'birthDate'],
                        required: true
                    }
                ],
                group: ['patientId', 'Patient.id'],
                order: [[sequelize.literal('"totalCost"'), 'DESC']]
            };
    
            if (search) {
                queryOptions.include[0].where = {
                    [Op.or]: [
                        { name: { [Op.iLike]: `%${search}%` }},
                        { codeId: { [Op.iLike]: `%${search}%` }}
                    ]
                };
            }
    
            if (perPage !== 'all') {
                offset = (page - 1) * perPage;
                queryOptions.limit = parseInt(perPage);
                queryOptions.offset = offset;
            }
            
            const countQuery = {...queryOptions};
            delete countQuery.limit;
            delete countQuery.offset;
            const countResult = await MedicalPatient.findAll(countQuery);
            const totalPatients = countResult.length;

            const data = await MedicalPatient.findAll(queryOptions);

            const formattedData = data.map(record => ({
                id: record.Patient.id,
                name: record.Patient.name,
                codeId: record.Patient.codeId,
                totalTreatments: record.dataValues.totalTreatments,
                totalMedicines: record.dataValues.totalMedicines,
                totalCost: record.dataValues.totalCost,
                email: record.Patient.email,
                birthDate: record.Patient.birthDate
            }));
    
            const response = {
                code: 200,
                status: 'success',
                message: 'Successfully retrieved patient summary data',
                data: formattedData,
                total: totalPatients,
                page: perPage !== 'all' ? parseInt(page) : null,
                perPage: perPage !== 'all' ? parseInt(perPage) : null,
                offset: perPage !== 'all' ? offset : null
            };
    
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PatientController;