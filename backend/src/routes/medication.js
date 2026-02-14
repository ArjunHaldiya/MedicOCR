const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.protect);

router.post('/' , medicationController.addMedication);
router.get('/', medicationController.getMedications);
router.get('/:id', medicationController.getMedication);
router.put('/:id', medicationController.updateMedication);
router.delete('/:id', medicationController.deleteMedication);

module.exports = router;
