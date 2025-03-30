const { Sequelize } = require("sequelize");
const { Treatment, Medicine, sequelize } = require("../models");

class StatisticController {
    static async getAll(req, res, next) {
        const t = await sequelize.transaction();
        try {

            const treatments = await Treatment.findAll({
                attributes: [
                    'id',
                    'name',
                    [Sequelize.literal(`(
                        SELECT COALESCE(SUM("mt"."quantity" * "Treatment"."cost"), 0)
                        FROM "MedicalTreatments" AS "mt"
                        WHERE "mt"."treatmentId" = "Treatment"."id"
                    )`), 'totalProfit']
                ],
                transaction: t,
                raw: true
            });

            const medicines = await Medicine.findAll({
                attributes: [
                    'id',
                    'name',
                    [Sequelize.literal(`(
                        SELECT COALESCE(SUM("mm"."quantity" * "Medicine"."price"), 0)
                        FROM "MedicalMedicines" AS "mm"
                        WHERE "mm"."medicineId" = "Medicine"."id"
                    )`), 'totalProfit']
                ],
                transaction: t,
                raw: true
            });

            await t.commit();

            res.status(200).json({
                code: 200,
                status: 'success',
                message: 'Successfully retrieved profit statistics by category',
                data: {
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

module.exports = StatisticController;