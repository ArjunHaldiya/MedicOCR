const { query }  = require('../config/database');

const Prescription = {
    create  : async (data) =>{
        const {user_id, image_url, source_language, target_language, status} = data;
        const sql = `INSERT INTO prescription (user_id, image_url, source_language, target_language, status)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [user_id, image_url, source_language, target_language, status];
        const result = await query(sql , values);
        return result.rows[0];
    },

    findByUserId : async(UserId) => {
        const sql = `SELECT * FROM prescription WHERE user_id = $1 ORDER BY created_at`;
        const result = await query(sql, [UserId]);
        return result.rows;
    },

    findById : async (id) => {
        const sql = `SELECT * FROM prescription WHERE id = $1`;
        const result  = await query(sql , [id]);
        return result.rows[0] || null;
    },

    updateProcessingResults  : async (id, data) => {
        if (process.env.NODE_ENV === 'development') {
            console.log("Data: ", data);
            console.log("Id:", id);
        }

        const sql = `UPDATE prescription
        SET ocr_text = $1, translated_text = $2, simplified_text = $3, status = $4,
        updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *`;
        
        const values =  [data.ocr_text, data.translated_text, data.simplified_text, data.status, id];

        const result = await query(sql , values);
        return result.rows[0];
    },

    delete : async(id) => {
        const sql = `DELETE FROM prescription WHERE id = $1`;
        await query(sql, [id]);
    }
};

module.exports = Prescription;