const express = require('express');
// const HistoryController = require('../controllers/HistoryController');
const UserController = require('../controllers/UserController');
const errorHandler = require('../middlewares/errorHandler');
const MedicineController = require('../controllers/MedicineController');
const authentication = require('../middlewares/authentication');
const TreatmentController = require('../controllers/TreatmentController');
const PatientController = require('../controllers/PatientController');
const MedicalRecordController = require('../controllers/MedicalRecordController');
const ExportController = require('../controllers/ExportController');
const StatisticController = require('../controllers/StatisticController');
// const BookController = require('../controllers/BookController');
// const MailController = require('../controllers/mails/MailController');
const router = express.Router();

router.post('/api/register', UserController.create);
router.post('/api/login', UserController.login);
router.post('/api/verify', UserController.verify);

router.get('/api/master/medicines', authentication, MedicineController.getAll);
router.post('/api/master/medicines', authentication, MedicineController.create);
router.put('/api/master/medicines/:medicineId', authentication, MedicineController.update);
router.delete('/api/master/medicines/:medicineId', authentication, MedicineController.delete);

router.get('/api/master/treatments', authentication, TreatmentController.getAll);
router.post('/api/master/treatments', authentication, TreatmentController.create);
router.put('/api/master/treatments/:treatmentId', authentication, TreatmentController.update);
router.delete('/api/master/treatments/:treatmentId', authentication, TreatmentController.delete);

router.get('/api/master/patients', authentication, PatientController.getAll);
router.post('/api/master/patients', authentication, PatientController.create);
router.put('/api/master/patients/:patientId', authentication, PatientController.update);
router.delete('/api/master/patients/:patientId', authentication, PatientController.delete);


router.get('/api/patients', authentication, PatientController.getAllMedicalPatient);
router.get('/api/medical-records', authentication, MedicalRecordController.getAll);
router.post('/api/medical-records', authentication, MedicalRecordController.create);

router.get('/api/statistics', authentication, StatisticController.getAll);
router.get('/api/export/excel', ExportController.exportExcel);

router.use(errorHandler.handler);

module.exports = router;