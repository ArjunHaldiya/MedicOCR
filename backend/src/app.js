const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const medicationRoutes = require('./routes/medication');
const prescriptionRoutes = require('./routes/prescription');
const reminderRoutes = require('./routes/reminders');

const app = express()

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        },
    },

    hsts : {
        maxAge: 31536000,
        includeSubDomains: true,
        preload : true
    }
}));



const corsOps = {
    origin : function (origin, callback) {
        if (!origin) return callback(null, true);

        const allowedOrigin = process.env.CORS_ORIGIN ?
        process.env.CORS_ORIGIN.split(','):
        ['http://localhost:3000', 'http://localhost:19000'];


        if (allowedOrigin.indexOf(origin) !== -1) {
            callback(null ,true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },

    credentials : true,
    optionsSuccessStatus : 200
};

app.use(cors(corsOps));


const limiter = rateLimit({
    windowMs : parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max : parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message :  'Too many requests from this IP, try again later.',
    standardHeaders : true,
    legacyHeaders: false,
});

app.use(limiter);

const authLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 5,
    message : 'Too many login attempts, please try again later.',
    skipSuccessfulRequests : true,
});

if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}else {
    app.use(morgan('combined'));
}

app.use(express.json({
    limit: '10mb'
}));

app.use(express.urlencoded({
    extended : true,
    limit : '10mb'
}));

app.use((req, res, next) => {
    req.requestTime = new Date().toString();
    next();
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status : 'OK',
        timestamp : new Date().toISOString(),
        uptime : process.uptime(),
        environment : process.env.NODE_ENV,
        version : process.env.npm_package_version || '1.0.0'});
});


const API_VERSION = process.env.API_VERSION || 'v1';

app.get('/', (req, res) => {
    res.json ({
        message : 'MedicOCR API',
        version : API_VERSION,
        endpoints : {
            health : '/health',
            api : `/api/${API_VERSION}`,
            docs: `/api/${API_VERSION}/docs`
        }
    });
});

app.use(`/api/${API_VERSION}/auth`, authLimiter, authRoutes);
app.use(`/api/${API_VERSION}/medications`, medicationRoutes);
app.use(`/api/${API_VERSION}/prescriptions` , prescriptionRoutes);
app.use(`/api/${API_VERSION}/reminders`, reminderRoutes);


app.use((req, res, next ) => {
    res.status(404).json({
        success : false,
        message : 'route not found',
        path : req.originalUrl,
        method : req.method
    });
});

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.use((err, req, res, next ) =>{
    console.error('Error : ',  err.message);

    const isDevelopment = process.env.NODE_ENV ==='development';
    
    res.status(err.statusCode || 500).json({
        success : false,
        message: err.message || 'Internal server error',
        ...(isDevelopment && { stack : err.stack}),
        timestamp : new Date().toISOString()
    });
});

module.exports = app;