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
        console.log('Medication : ', medication);
        console.log('Medication.user_id: ', medication.user_id);
        console.log('req.user.userId: ',  req.user.userId);
        if (Number(medication.user_id) !== Number(req.user.userId)) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        const reminderData = {
            user_id : req.user.user_id,
            medication_id,
            reminder_time,
            days_of_the_week: days_of_the_week || null
        };

        const reminder = await Reminder.create(reminderData);
        res.status(201).json({success: true,
            message : 'Server Error'
        });
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
        const reminder = await Reminder.findByUserId(req.params.userId);
        res.json({success : true, reminder});
    }catch(error){
        res.status(500).json({
            success : false, message : 'Server Error'
        });
    }
};

exports.updateReminder = async (req, res) => {
    try{
        const reminder = await Reminder.findBy(req.params.id);
        if(!reminder || reminder.userId !== req.user.userId){
            console.log("ID", reminder.userId);
            return res.status(403).json({
                success : false,
                message : 'Unauthorized'
            });
        }
        const updated = await Reminder.updateReminders(req.params.id, req.body);
        res.json({success : true, reminder : updated});
    }catch(error){
        console.error("Update Error :", error);
        res.status(500).json({success : false, message : 'Server Error'});
    }
};

exports.deleteReminder = async(req, res) => {
    try{
        const reminder = await Reminder.findByUserId(req.user.userId);
        if(!reminder || reminder.user_id !== req.user.userId){
            return res.status(403).json({
                success : false, message : 'Unauthorized'
            });
        }
        await Reminder.delete(req.params.id);
        res.json({success : true, message : 'Deleted'});
    }catch(error){
        res.status(500).json({success : false, message : 'Server Error'});
    }
};
