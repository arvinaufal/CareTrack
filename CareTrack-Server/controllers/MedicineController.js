const { bcryptCompare } = require("../helpers/bcryptjs");
const { createToken, encryptData, decryptData } = require("../helpers/jwt");
const { Medicine, sequelize, MedicalMedicine} = require("../models");
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const { Op, Sequelize } = require('sequelize');
const { validateEmail } = require("../helpers/general");

class MedicineController {
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

            const { count, rows: data } = await Medicine.findAndCountAll(queryOptions);
        
            const response = {
                code: 200,
                status: 'success',
                message: 'Successfully retrieved medicine data',
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
            const { code, name, price } = req.body;
        
            if (!code)  throw ({ name: `EmptyCode`, origin: 'MedicineController' });
            if (!name)  throw ({ name: `EmptyName`, origin: 'MedicineController' });
            if (!price)  throw ({ name: `EmptyPrice`, origin: 'MedicineController' });

        
            const existingMedicine = await Medicine.findOne({ where: { code }});
        
            if (existingMedicine) throw ({ name: `DuplicateCode`, origin: 'MedicineController' })
        
            const medicine = await Medicine.create({
                code,
                name,
                price
            });
        
            return res.status(201).json({
                code: 201,
                status: 'success',
                message: 'Medicine created successfully',
                data: medicine
            });
        
        } catch (error) {
            console.error('Error creating medicine:', error);
    
            next(error);
        }
    }
    static async update(req, res, next) {
        const { medicineId } = req.params;
        try {
            const { code, name, price } = req.body;
        
            if (!code)  throw ({ name: `EmptyCode`, origin: 'MedicineController' });
            if (!name)  throw ({ name: `EmptyName`, origin: 'MedicineController' });
            if (!price)  throw ({ name: `EmptyPrice`, origin: 'MedicineController' });

        
            const medicine = await Medicine.findByPk(medicineId);
        
            if (!medicine) throw ({ name: `MedicineNotExists`, origin: 'MedicineController' });
        
            await medicine.update({
                code,
                name,
                price
            });
        
            return res.status(200).json({
                code: 200,
                status: 'success',
                message: 'Medicine updated successfully',
                data: medicine
            });
        
        } catch (error) {
            console.error('Error updating medicine:', error);
    
            next(error);
        }
    }

    static async delete(request, response, next) {
        const { medicineId } = request.params;
        const t = await sequelize.transaction();
        try {
            let medicine = await Medicine.findByPk(medicineId, { transaction: t });
            if (!medicine) throw ({ name: `MedicineNotExists`, origin: 'MedicineController' });
    
            await MedicalMedicine.destroy({
                where: { medicineId },
                transaction: t
            });
    
            await medicine.destroy({ transaction: t });
            await t.commit();
            
            response.status(200).json({
                code: 200,
                status: 'success', 
                message: `Medicine and all related MedicalMedicines successfully deleted`
            });
        } catch (error) {
            await t.rollback();
            next(error);
        }
    }
}

module.exports = MedicineController;