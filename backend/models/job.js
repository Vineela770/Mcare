// models/job.model.js
const pool = require('../config/db');

const Job = {
    // Logic to find all jobs
    findAll: async () => {
        const result = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
        return result.rows;
    },
    
    // Logic to find featured jobs for the home page
    findFeatured: async () => {
        const result = await pool.query('SELECT * FROM jobs WHERE is_featured = true');
        return result.rows;
    }
};

module.exports = Job;