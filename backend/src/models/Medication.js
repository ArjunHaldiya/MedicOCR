const { query } = require('../config/database');
const { findUserByUserId } = require('./User');

const Medication = {
    createMedication : async (medicationData) => {
        const  { user_id , medication_name, dosage, frequency, instructions } = medicationData;

        const sql = `INSERT INTO medication (user_id , medication_name, dosage, frequency, instructions)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;

        const values = [user_id , medication_name, dosage, frequency, instructions];
        const result = await query(sql , values);

        return result.rows[0];
    },

    findByUserId : async (userId) => {
        const sql = `SELECT * FROM medication where user_id = $1 AND is_active = true`;
        const result = await query(sql, [userId]);
        return result.rows;

    },

    findById : async (medicationId) => {
        const sql = `SELECT * FROM medication where id = $1`;
        const result = await query(sql, [medicationId]);
        return result.rows[0] || null;
    },

    updateMedication : async (medicationId, updateData) =>{
        const current = await Medication.findById(medicationId);
        if (!current) return null;

        const medication_name = updateData.medication_name !== undefined ? updateData.medication_name : current.medication_name;
        const dosage = updateData.dosage !== undefined ? updateData.dosage : current.dosage;
        const frequency = updateData.frequency !== undefined ? updateData.frequency : current.frequency;
        const instructions = updateData.instructions !== undefined ? updateData.instructions : current.instructions;
        const is_active = updateData.is_active !== undefined ? updateData.is_active : current.is_active;

        const sql = `UPDATE medication SET
        medication_name = $1, dosage = $2, frequency = $3, instructions = $4, is_active = $5
        WHERE id = $6
        RETURNING *`;
        const values = [medication_name, dosage, frequency, instructions, is_active, medicationId];
        const result = await query(sql , values);
        return result.rows[0];
    },

    deleteMedication : async(medicationId) => {
        const sql = `DELETE FROM medication WHERE id = $1`;
        const result = await query(sql , [medicationId]);
    }     
};

module.exports = Medication;
