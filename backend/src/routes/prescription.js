const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
router.use(authMiddleware.protect);

router.post('/' ,upload.single('prescription_image'), prescriptionController.uploadPrescription);
router.get('/', prescriptionController.getPrescriptions);
router.get('/:id', prescriptionController.getPrescription);
router.delete('/:id', prescriptionController.deletePrescription);

module.exports = router;
