const { Patient, MedicalPatient, sequelize } = require('../models'); // Added sequelize here
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { Op } = require('sequelize');

class ExportController {
    static async exportExcel(req, res) {
        try {
            const data = await ExportController.getAllReportData(req.query);
            
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Patients Report');
            
            // Add headers
            worksheet.columns = [
                { header: 'No', key: 'no', width: 5 },
                { header: 'Patient Name', key: 'name', width: 30 },
                { header: 'Patient Code', key: 'codeId', width: 15 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Birth Date', key: 'birthDate', width: 15 },
                { header: 'Total Treatments', key: 'totalTreatments', width: 15 },
                { header: 'Total Medicines', key: 'totalMedicines', width: 15 },
                { header: 'Total Cost', key: 'totalCost', width: 15, style: { numFmt: '"Rp"#,##0.00' } }
            ];
            
            // Style header
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF084CA4' }
                };
            });
            
            // Add data
            data.forEach((patient, index) => {
                worksheet.addRow({
                    no: index + 1,
                    name: patient.name,
                    codeId: patient.codeId,
                    email: patient.email,
                    birthDate: patient.birthDate,
                    totalTreatments: patient.totalTreatments,
                    totalMedicines: patient.totalMedicines,
                    totalCost: patient.totalCost
                });
            });
            
            // Set response headers
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=patients_report.xlsx');
            
            // Send the file
            await workbook.xlsx.write(res);
            res.end();
            
        } catch (error) {
            console.error('Export error:', error);
            res.status(500).json({ 
                code: 500,
                status: 'error',
                message: 'Failed to generate Excel report'
            });
        }
    }

    static async getAllReportData(queryParams) {
        const queryOptions = {
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

        if (queryParams.search) {
            queryOptions.include[0].where = {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${queryParams.search}%` }},
                    { codeId: { [Op.iLike]: `%${queryParams.search}%` }}
                ]
            };
        }

        const data = await MedicalPatient.findAll(queryOptions);

        return data.map(record => ({
            id: record.Patient.id,
            name: record.Patient.name,
            codeId: record.Patient.codeId,
            totalTreatments: record.dataValues.totalTreatments,
            totalMedicines: record.dataValues.totalMedicines,
            totalCost: record.dataValues.totalCost,
            email: record.Patient.email,
            birthDate: record.Patient.birthDate
        }));
    }

    static drawTable(doc, table) {
        const tableTop = 100;
        const rowHeight = 30;
        const colWidth = 100;
        const margin = 20;
        
        // Draw headers
        doc.font('Helvetica-Bold');
        table.headers.forEach((header, i) => {
            doc.text(header, margin + (i * colWidth), tableTop, {
                width: colWidth,
                align: 'left'
            });
        });
        
        // Draw rows
        doc.font('Helvetica');
        table.rows.forEach((row, rowIndex) => {
            const y = tableTop + ((rowIndex + 1) * rowHeight);
            
            row.forEach((cell, colIndex) => {
                doc.text(cell.toString(), margin + (colIndex * colWidth), y, {
                    width: colWidth,
                    align: 'left'
                });
            });
        });
        
        // Draw borders
        doc.rect(margin, tableTop, colWidth * table.headers.length, rowHeight * (table.rows.length + 1))
           .stroke();
    }
}

module.exports = ExportController;