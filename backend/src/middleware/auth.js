const jwt = require('jsonwebtoken');

exports.protect = async(req, res, next) => {
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ success: false, message: 'Server misconfiguration' });
    }
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(400).json({
                success : false,
                message : 'No token provided'
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded  = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    }catch(error){
        return res.status(401).json({
            success:false,
            message : 'Invalid Token'
        });
    }
};