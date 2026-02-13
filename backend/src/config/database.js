const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,


    max : 20,
    min : 5,
    idleTimeoutMillis : 30000,
    connectionTimeoutMillis : 2000,


    statement_timeout : 10000,

    ssl : process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized : false}
    : false
};


const pool = new Pool(poolConfig);

pool.on('connect', (client) => {
    console.log('New database client connected');
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle database client', err);
});

pool.on('remove', (client) => {
    console.log('Database client removed');
});


//Helper function to check if the database is connected and reachable


const testConnection = async() => {
    try{
        const result = await pool.query('SELECT NOW() as current_time,  version() as pg_version');
        if(!result || !result.rows || result.rows.length === 0){
            console.error('Database query returned no results');
            return false;
        }
        
        console.log('Database connection successful');
        
        const versionInfo = result.rows[0].pg_version || 'Unknown';
        const versionNumber = versionInfo.includes(' ') ? versionInfo.split(' ')[1] : versionInfo;

        console.log(`PostgreSQL version : ${versionNumber}`);
        console.log(`Server time: ${result.rows[0].current_time}`)
        return true;
    } catch(error) {
        console.error('Database connection failed', error.message);
        return false;
    }
};


//Execute query with error handling

const query = async(text, params) => {
    const start = Date.now();
    try{
        const result = await pool.query(text, params);

        const duration = Date.now() - start;

        console.log(`Query executed in ${duration} ms, returned ${result.rowCount} rows`);

        return result;
    } catch(error) {
        console.error('Database query error:', error.message);
        console.error(`Query : ${text.substring(0,100)}...`);

        throw error;
    }
};

const getClient = async() => {
    try{
        const client = await pool.connect();

        const originalQuery = client.query.bind(client);
        client.query = async(...args) =>{
            const start = Date.now();
            const result = await originalQuery(...args);
            const duration = Date.now() - start;

            console.log(`Transaction query executed in ${duration} ms`);

            return result;
        };

        return client;
    }
    catch(error){
        console.error('failed to get client from the pool' , error.message);
        throw error;
    }
};

const closePool = async() => {
    try{
        await pool.end();
        console.log('Database pool closed successfully');
    }
    catch(error) {
        console.error('Error closing the database pool');
        throw error;
    }
};

process.on('SIGINT' ,async() => {
    console.log('\n Received SIGINT, closing database connections...');
    await closePool();
    process.exit(0);
});

process.on('SIGTERM' ,async() => {
    console.log('\n Received SIGTERM, closing database connections...');
    await closePool();
    process.exit(0);
});

module.exports = {
    pool,
    query,
    getClient,
    testConnection,
    closePool
};
