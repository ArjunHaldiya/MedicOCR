const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../models/User');


exports.register = async (req , res) =>{
    try{
        const { full_name, email , password, dateOfBirth, role, preferred_language  } = req.body;

        if (!email || !password){
            return res.status(400).json({
                success: false,
                message : 'Email and Password are required',
            });
        }

        const existingUser = await users.findUserByEmail(email);
        if(existingUser){
            return res.status(400).json({
                success : false,
                message : 'Email already exists'
            });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const userData =  { full_name , email, password_hash, dateOfBirth, role, preferred_language };
        const newUser = await users.createUser(userData);

        const token = jwt.sign({
            userId : newUser.id, email : newUser.email , role : newUser.role},
            process.env.JWT_SECRET,
            { expiresIn : '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration Successful',
            token: token,
            user : newUser,
        });

    }catch(error){
        console.error('Registration error: ', error);
        res.status(500).json({success: false , message : 'Server error'});
    }
    };

    exports.login = async(req, res) =>{
        try {
            const {email , password} = req.body;

            if(!email || !password){
                return res.status(400).json({
                    success : false,
                    message : 'Email and Password Required',
                });
            }


            const existingUser = await users.findUserByEmail(email);
            if(!existingUser){
                return res.status(401).json({
                    success: false,
                    message : 'Invalid Credentials'
                });
            }
            
            const comparePass = await bcrypt.compare(password, existingUser.password_hash);
            if(!comparePass){
                return res.status(401).json({
                    success : false,
                    message : 'Invalid Credentials'
                });
            }

            await users.updateLastLogin(existingUser.id);
            const token = jwt.sign({
                userId : existingUser.id, email : existingUser.email , role : existingUser.role},
                process.env.JWT_SECRET,
                { expiresIn : '7d' }
            );

            const { password_hash, ...userWithoutPassword} = existingUser;
            return res.status(200).json({
                success : true,
                message : 'Login successful',
                token : token,
                user : userWithoutPassword
            });
        } catch(error) {
            console.error('Login error:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    exports.getMe = async (req, res) =>{
        try{
            const user = await users.findUserByUserId(req.user.userId);
            if(!user){
                return res.status(400).json({
                    success : false,
                    message : 'User not found'
                });
            }
            res.json({
                    success: true,
                    user
                });
        }catch(error){
            res.status(500).json({
                success: false,
                message : 'Server error'
            })
        }
    };