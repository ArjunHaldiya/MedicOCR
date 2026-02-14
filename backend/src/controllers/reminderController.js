const Reminder = require('../models/Reminder');
const Medication = require('../models/Medication');

exports.createReminder = async (req, res) => {
    try{
        const { medication_id, reminder_time, days_of_the_week} = req.body;

        if( !medication_id || !reminder_time){
            return res.status(400).json({
                success : false,
                message: 'Medication ID and time required'
            });
        }

        const medication = await Medication.findById(Number(medication_id));
        if (!medication) {
            return res.status(404).json({ success: false, message: 'Medication not found' });
        }
        if (Number(medication.user_id) !== Number(req.user.userId)) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        const reminderData = {
            user_id : req.user.userId,
            medication_id,
            reminder_time,
            days_of_the_week: days_of_the_week || null
        };

        const reminder = await Reminder.create(reminderData);
        res.status(201).json({ success: true, message: 'Reminder created', reminder });
    }catch (error) {
        console.error('Create reminder error : ' , error);
        res.status(500).json({
            success : false,
            message : 'Server Error'
        });
    }
};

exports.getReminders = async (req, res) => {
    try{
        const reminders = await Reminder.findByUserId(req.user.userId);
        res.json({ success : true, reminders });
    }catch(error){
        res.status(500).json({
            success : false, message : 'Server Error'
        });
    }
};

exports.updateReminder = async (req, res) => {
    try{
        const reminder = await Reminder.findById(req.params.id);
        if(!reminder || reminder.user_id !== req.user.userId){
            return res.status(403).json({
                success : false,
                message : 'Unauthorized'
            });
        }
        const updated = await Reminder.update(req.params.id, req.body);
        res.json({ success : true, reminder : updated });
    }catch(error){
        console.error("Update Error :", error);
        res.status(500).json({ success : false, message : 'Server Error' });
    }
};

exports.deleteReminder = async(req, res) => {
    try{
        const reminder = await Reminder.findById(req.params.id);
        if(!reminder){
            return res.status(404).json({ success: false, message: 'Reminder not found' });
        }
        if(reminder.user_id !== req.user.userId){
            return res.status(403).json({
                success : false, message : 'Unauthorized'
            });
        }
        await Reminder.delete(req.params.id);
        res.json({ success : true, message : 'Deleted' });
    }catch(error){
        res.status(500).json({ success : false, message : 'Server Error' });
    }
};
