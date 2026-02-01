const Medication = require('../models/Medication');

exports.addMedication = async(req, res) => {
    try{
        const  { medication_name , dosage, frequency , instructions } = req.body;

        if(!medication_name){
            return res.status(400).json({
                success: false,
                message : 'Medicine name required'
            });
        }

        const medicationData = {
            user_id : req.user.userId,
            medication_name,
            dosage,
            frequency,
            instructions
        };

        const medication = await Medication.createMedication(medicationData);
        res.status(200).json({success: true, medication});
    }catch(error){
        console.error('Add medication error ', error);
        res.status(500).json({
            success : false,
            message : 'Server error'
        });
    }
};

exports.getMedications = async (req, res)  =>{
    try{
        const medications = await Medication.findByUserId(req.user.userId);
        res.status(200).json({
            success : true,
            medications
        });
    }catch(error){
        console.error('Get medications error', error);
        res.status(500).json({
            success : false,
            message : 'Server error'
        });
    }
};

exports.getMedication = async(req, res) => {
    try{

        console.log('req.user:', req.user);  // See what's in the token
        console.log('req.params.id:', req.params.id);
        const medication = await Medication.findById(req.params.id);
        
        console.log('medication:', medication);
        console.log('medication.user_id:', medication.user_id);
        console.log('req.user.userId:', req.user.userId);
        console.log('Are they equal?', medication.user_id === req.user.userId);
        console.log('Types:', typeof medication.user_id, typeof req.user.userId);

        if(!medication){
            return res.status(401).json({
                success : false,
                message :  'Medication not found'
            });
        }

        if(medication.user_id !== req.user.userId){
            return res.status(403).json({
                success : false,
                message : 'Unauthorized'
            });
        }
        res.status(200).json({
            success : true,
            medication
        });
    }catch(error){
        console.error('Get medicaiton error', error);
        res.status(500).json({
            success : false,
            message : 'Server Error'
        });
    }
};

exports.updateMedication = async(req, res) => {
    try{
        const  { medication_name, dosage, frequency, instructions, is_active} = req.body;

        const medication = await Medication.findById(req.params.id);
        console.log('UPDATE - medication:', medication);
        console.log('UPDATE - medication.user_id:', medication.user_id);
        console.log('UPDATE - req.user.userId:', req.user.userId);
        console.log('UPDATE - Are equal?', medication.user_id === req.user.userId);
        
        if(!medication){
            return res.status(401).json({
                success : false, message : 'Medication not found'
            });
        }

        if(medication.user_id !== req.user.userId){
            return res.status(403).json({
                success : false , message : 'Unauthorized'
            });
        }

        const updation = await Medication.updateMedication(req.params.id, req.body);
        res.status(200).json({
            success : true,
            updation
        });

    }catch(error){
        console.error('Updation Error', error);
        res.status(500).json({success : false, message : 'Server error'});
    }
};


exports.deleteMedication  = async(req, res) => {
    try{
    const medication = await Medication.findById(req.params.id);
    console.log('Delete - medication:', medication);
    console.log('Delete - medication.user_id:', medication.user_id);
    console.log('Delete - req.user.userId:', req.user.userId);
    console.log('Delete - Are equal?', medication.user_id === req.user.userId);
    if(!medication){
        return res.status(404).json({
            success : false,
            message : 'Medication not found'
        });
    }

    if(medication.user_id !== req.user.userId){
        return res.status(403).json({
            success : false,
            message : 'Unauthorized'
        });
    }

    const deleted = await Medication.deleteMedication(req.params.id);
    res.status(200).json({
        success : true,
        deleted
    });
    }catch(error){
        console.error('Deletion Error' , error);
        res.status(500).json({
            success : false,
            message : 'Server error'
        });
    }
};