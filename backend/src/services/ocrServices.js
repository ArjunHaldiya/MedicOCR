const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
  apiKey: process.env.GOOGLE_CLOUD_API_KEY
});

exports.extractTextFromImage = async (imagePath) => {
  try {
    const [result] = await client.textDetection(imagePath);
    const detections = result.textAnnotations;
    
    if (!detections || detections.length === 0) {
      return 'No Text Found';
    }
    
    return detections[0].description;
  } catch (error) {
    console.error('OCR error:', error);
    throw new Error('Failed to extract text from image');
  }
};