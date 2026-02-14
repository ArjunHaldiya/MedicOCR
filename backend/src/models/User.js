const  { query } = require('../config/database');

const User = {
    createUser : async (userData) =>{
        const { full_name, email, password_hash, dateOfBirth, role, preferred_language} = userData;

        const sql = `INSERT INTO users (full_name, email, password_hash, dateOfBirth, role, preferred_language)
        VALUES ($1 , $2, $3, $4, $5, $6)
        RETURNING id, full_name, email, dateOfBirth, role, preferred_language, is_active, profile_completed ,updated_at 
        `;

        const values = [full_name, email, password_hash, dateOfBirth, role, preferred_language];

        const result = await query(sql , values);

        return result.rows[0];
    
    },

    findUserByEmail : async(email) => {
        const sql = 'SELECT * FROM users WHERE email = $1';
        const result = await query(sql , [email]);
        return result.rows[0] || null;
    },

    findUserByUserId : async(userId) => {
        const sql = 'SELECT id, full_name, email , dateOfBirth, role, preferred_language, is_active, profile_completed, created_at, updated_at, lastLogin FROM users WHERE id = $1';
        const result = await query(sql , [userId]);
        return result.rows[0] || null;
    },

    updateLastLogin : async(userId) => {
        const sql = `UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = $1`;
        const result = await query(sql , [userId]);
    }
};

module.exports = User;