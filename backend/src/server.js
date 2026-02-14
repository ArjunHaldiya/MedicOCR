const app = require('./app');
const { testConnection, closePool } = require('./config/database.js');
require('dotenv').config();
const { startReminder } = require('./services/notificationService.js');
const PORT = process.env.PORT || 5000;

let server;

const serverStart = async() => {
    try{
        console.log('Checking for connection');
        const connectionDb = await testConnection();

        if(!connectionDb){
            console.error('Failed to connect to the database');
            process.exit(1);
        }

        server = app.listen(PORT, () =>{
            console.log(`Server: ${process.env.NODE_ENV} mode on port ${PORT}`);
            console.log(`Health check : http://localhost:${PORT}/health`);
            console.log(`API: http://localhost:${PORT}/api/v1`);
        });

        return server;
    }catch(error){
        console.error('Failed to start the server', error.message);
        process.exit(1);
    }
};

serverStart().then(() => {
    startReminder();
});


const shutDown = async(signal) => {
    console.log('Shutting down the server');
    try{
        if (server) {
            await new Promise((resolve, reject) =>{
            server.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        console.log('HTTP Server closed');

        await closePool();
        console.log('Database connection closed');

        console.log('Goodbye');
        process.exit(0);
    }
    }catch(error){
        console.error('Error during shutdown' , error.message);
        process.exit(1);
    }
};

process.on('SIGINT', () =>{shutDown('SIGINT');});
process.on('SIGTERM', () =>{shutDown('SIGTERM');});

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception: Shutting down...');
    console.error(error);
    process.exit(1);
});

process.on('unhandledRejection', (reason , promise) => {
    console.error('Unhandled Rejection : Shutting down...');
    console.error('Reason: ', reason);
    console.error('Promise: ', promise);
    process.exit(1);
});