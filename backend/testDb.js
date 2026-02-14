const { testConnection } = require('./src/config/database.js');

testConnection()
    .then(success=> {
        if(success) {
            console.log('Database Setup woking');
        }else{
            console.log('Database setup failed');
            process.exit(1);
        }
    });

