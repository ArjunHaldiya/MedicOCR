const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

exports.simplifyMedicalText = async (text, language = 'en') => {
  try {
    if (!text) return null;
    
    const prompt = `You are a medical translator for patients. Simplify the following medical prescription text into easy-to-understand language for a non-medical person. Keep all medication names, dosages, and important instructions intact, but explain medical terms in simple words.

Text to simplify:
${text}

Language: ${language}

Provide a clear, simple explanation that a patient can easily understand.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Simplification error:', error);
    throw new Error('Failed to simplify text');
  }
};