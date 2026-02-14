const { query }  = require('../config/database');

const Reminder = {
    create : async (data) => {
        const sql = `
        INSERT INTO reminders (user_id, medication_id, reminder_time, days_of_the_week, is_active)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;

        const result = await query(sql, [data.user_id, data.medication_id, data.reminder_time, data.days_of_the_week, true]);
        return result.rows[0];
    },

    findByUserId: async (userId) => {
        const sql = `SELECT * FROM reminders WHERE user_id = $1 ORDER BY reminder_time`;
        const result = await query(sql , [userId]);
        return result.rows;
    },

    findById: async (id) => {
        const sql = `SELECT * FROM reminders WHERE id = $1`;
        const result = await query(sql, [id]);
        return result.rows[0] || null;
    },

    update: async(id, data) => {
        const sql = `UPDATE reminders
        SET reminder_time = $1, days_of_the_week = $2, is_active = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4 RETURNING *`;
        const result = await query(sql, [data.reminder_time, data.days_of_the_week, data.is_active, id]);
        return result.rows[0];
    },

    delete : async (id) => {
        const sql = `DELETE FROM reminders WHERE id = $1`;
        await query(sql, [id]);
    },

    getDueReminders: async () => {
        const sql = `SELECT r.*, m.medication_name
        FROM reminders r
        JOIN medication m ON r.medication_id = m.id
        WHERE r.is_active = true
        AND (r.last_sent_at IS NULL OR r.last_sent_at < CURRENT_DATE)`;

        const result = await query(sql);
        return result.rows;
    },

    markAsSent : async(id) => {
        const sql = `UPDATE reminders SET last_sent_at = CURRENT_TIMESTAMP WHERE id = $1`;
        await query(sql, [id]);
    }
};

module.exports = Reminder;
