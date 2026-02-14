const { Translate } = require('@google-cloud/translate').v2;

const translate = new Translate({
  key: process.env.GOOGLE_CLOUD_API_KEY
});

exports.translateText = async (text, targetLanguage, sourceLanguage = 'en') => {
  try {
    if (!text) return null;
    
    // Skip if source and target are same
    if (sourceLanguage === targetLanguage) return text;
    
    const [translation] = await translate.translate(text, {
      from: sourceLanguage,
      to: targetLanguage
    });
    
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate text');
  }
};