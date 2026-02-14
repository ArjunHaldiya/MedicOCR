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
        res.status(201).json({ success: true, medication });
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
        const medication = await Medication.findById(req.params.id);

        if(!medication){
            return res.status(404).json({
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
        console.error('Get medication error', error);
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

        if(!medication){
            return res.status(404).json({
                success : false, message : 'Medication not found'
            });
        }

        if(medication.user_id !== req.user.userId){
            return res.status(403).json({
                success : false , message : 'Unauthorized'
            });
        }

        const updated = await Medication.updateMedication(req.params.id, req.body);
        res.status(200).json({
            success : true,
            medication: updated
        });

    }catch(error){
        console.error('Updation Error', error);
        res.status(500).json({success : false, message : 'Server error'});
    }
};


exports.deleteMedication  = async(req, res) => {
    try{
    const medication = await Medication.findById(req.params.id);
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