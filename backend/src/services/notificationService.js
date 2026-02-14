const cron = require('node-cron');
const Reminder = require('../models/Reminder')

const startReminder = () => {
    cron.schedule('* * * * *', async() => {
        try{
            const now = new Date();
            const currTime = `${now.getHours().toString().padStart(2,0)}:${now.getMinutes().toString().padStart(2,0)}:00`;
            const currDay = ['sun', 'mon', 'tues', 'wed', 'thurs','fri','sat'][now.getDay()];

            const reminders = await Reminder.getDueReminders();

            for (const reminder of reminders){
                if (reminder.reminder_time.substring(0,5) == currTime.substring(0,5)){
                    if(!reminder.days_of_the_week || reminder.days_of_the_week.includes(currDay)){
                        console.log(`Reminder : ${reminder.medication_name} at ${reminder.reminder_time}`);
                        await Reminder.markAsSent(reminder.id);
                    }
                } 
            }
        } catch(err){
            console.error('Reminder job error', err);
        }
    });
};

module.exports = { startReminder };