const Prescription = require('../models/Prescription');
const ocrService = require('../services/ocrServices');
const translationService = require('../services/translationService');
const simplificationService = require('../services/simplificationService');

exports.uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }
    
    const { source_language, target_language } = req.body;
    
    // Create prescription record
    const prescriptionData = {
      user_id: req.user.userId,
      image_url: req.file.path,
      source_language: source_language || 'en',
      target_language: target_language || 'en',
      status: 'processing'
    };
    
    const prescription = await Prescription.create(prescriptionData);
    
    processPrescription(prescription.id, req.file.path, source_language || 'en', target_language || 'en').catch(err => console.error('Processing Error', err));
    
    res.status(201).json({ 
      success: true, 
      message: 'Prescription uploaded, processing...',
      prescription 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Background processing function
async function processPrescription(prescriptionId, imagePath, sourceLang, targetLang) {
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    console.log('Starting processing', prescriptionId);
    console.log('Image path:', imagePath);
    console.log('Google key:', process.env.GOOGLE_CLOUD_API_KEY ? 'SET' : 'MISSING');
    console.log('Gemini key:', process.env.GEMINI_API_KEY ? 'SET' : 'MISSING');
  }
  try {
    // Step 1: OCR
    const ocrText = await ocrService.extractTextFromImage(imagePath);
    if (isDev) console.log('OCR Text', ocrText);
    // Step 2: Translate
    const translatedText = await translationService.translateText(ocrText, targetLang, sourceLang);
    if (isDev) console.log('Translated Text', translatedText);
    // Step 3: Simplify(Skipping gemini for now)
    const simplifiedText = translatedText;
    if (isDev) console.log('Simplified Text', simplifiedText);
    // Update prescription
    await Prescription.updateProcessingResults(prescriptionId, {
      ocr_text: ocrText,
      translated_text: translatedText,
      simplified_text: simplifiedText,
      status: 'completed'
    });
    if (isDev) console.log(`Prescription ${prescriptionId} processed successfully`);
  } catch (error) {
    console.error(`❌ Processing failed for prescription ${prescriptionId}:`, error);
    
    // Mark as failed
    await Prescription.updateProcessingResults(prescriptionId, {
      ocr_text: null,
      translated_text: null,
      simplified_text: null,
      status: 'failed'
    });
  }
};

exports.getPrescriptions = async( req, res) => {
    try{
        const prescriptions = await Prescription.findByUserId(req.user.userId);
        res.status(200).json({success: true, prescriptions});
    }catch(error){
        console.error("Get prescriptions error", error);
        res.status(500).json({success : false, message : 'Server Error'});
    }
};

exports.getPrescription = async( req, res) => {
    try{
        const prescription = await Prescription.findById(req.params.id);
        if(!prescription){
            return res.status(404).json({success : false, message : "Prescription not found"});
        }
        if(prescription.user_id !== req.user.userId){
            return res.status(403).json({success : false, message : "Unauthorized"});
        }
        res.status(200).json({success: true, prescription});
    }catch(error){
        console.error("Get prescriptions error", error);
        res.status(500).json({success : false, message : 'Server Error'});
    }
};

exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    if (prescription.user_id !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    await Prescription.delete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
