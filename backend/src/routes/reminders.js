const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware.protect);
router.post('/', reminderController.createReminder);
router.get('/', reminderController.getReminders);
router.put('/:id', reminderController.updateReminder);
router.delete('/:id', reminderController.deleteReminder);

module.exports = router;