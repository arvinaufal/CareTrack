const { bcryptCompare } = require("../helpers/bcryptjs");
const { createToken, encryptData, decryptData } = require("../helpers/jwt");
const { Treatment, sequelize, MedicalTreatment } = require("../models");
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const { Op, Sequelize } = require('sequelize');
const { validateEmail } = require("../helpers/general");

class TreatmentController {
    static async getAll(req, res, next) {
        const { perPage = 10, page = 1, search } = req.query;
        console.log(req.query, 'reqquery');
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

            const { count, rows: data } = await Treatment.findAndCountAll(queryOptions);
        
            const response = {
                code: 200,
                status: 'success',
                message: 'Successfully retrieved treatment data',
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
            const { code, name, cost } = req.body;
        
            if (!code)  throw ({ name: `EmptyCode`, origin: 'TreatmentController' });
            if (!name)  throw ({ name: `EmptyName`, origin: 'TreatmentController' });
            if (!cost)  throw ({ name: `EmptyCost`, origin: 'TreatmentController' });

        
            const existingTreatment = await Treatment.findOne({ where: { code }});
        
            if (existingTreatment) throw ({ name: `DuplicateCode`, origin: 'TreatmentController' })
        
            const treatment = await Treatment.create({
                code,
                name,
                cost
            });
        
            return res.status(201).json({
                code: 201,
                status: 'success',
                message: 'Treatment created successfully',
                data: treatment
            });
        
        } catch (error) {
            console.error('Error creating treatment:', error);
    
            next(error);
        }
    }
    static async update(req, res, next) {
        const { treatmentId } = req.params;
        try {
            const { code, name, cost } = req.body;
        
            if (!code)  throw ({ name: `EmptyCode`, origin: 'TreatmentController' });
            if (!name)  throw ({ name: `EmptyName`, origin: 'TreatmentController' });
            if (!cost)  throw ({ name: `EmptyCost`, origin: 'TreatmentController' });

        
            const treatment = await Treatment.findByPk(treatmentId);
        
            if (!treatment) throw ({ name: `TreatmentNotExists`, origin: 'TreatmentController' });
        
            await treatment.update({
                code,
                name,
                cost
            });
        
            return res.status(200).json({
                code: 200,
                status: 'success',
                message: 'Treatment updated successfully',
                data: treatment
            });
        
        } catch (error) {
            console.error('Error updating treatment:', error);
    
            next(error);
        }
    }

    static async delete(request, response, next) {
        const { treatmentId } = request.params;
        const t = await sequelize.transaction();
        try {
            let treatment = await Treatment.findByPk(treatmentId, { transaction: t });
            if (!treatment) throw ({ name: `TreatmentNotExists`, origin: 'TreatmentController' });
    
            await MedicalTreatment.destroy({
                where: { treatmentId },
                transaction: t
            });
    
            await treatment.destroy({ transaction: t });
            await t.commit();
            
            response.status(200).json({
                code: 200,
                status: 'success', 
                message: `Treatment and all related MedicalTreatments successfully deleted`
            });
        } catch (error) {
            await t.rollback();
            next(error);
        }
    }
}

module.exports = TreatmentController;