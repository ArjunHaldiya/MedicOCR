const express = require('express');
const router = express.Router();
const medicaitonController = require('../controllers/medicationController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.protect);

router.post('/' , medicaitonController.addMedication);
router.get('/', medicaitonController.getMedications);
router.get('/:id', medicaitonController.getMedication);
router.put('/:id', medicaitonController.updateMedication);
router.delete('/:id', medicaitonController.deleteMedication);

module.exports = router;
