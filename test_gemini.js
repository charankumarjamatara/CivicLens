require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('your-gemini')) {
    console.error('Error: GEMINI_API_KEY is not configured in .env file.');
    process.exit(1);
  }

  console.log('Initializing GoogleGenerativeAI with key:', apiKey.substring(0, 10) + '...');
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Attempt with different model names
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro"];
    let responseText = "";
    let successfulModel = "";

    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say 'CivicLens AI Gemini integration is operational!' using model " + modelName);
        responseText = result.response.text().trim();
        successfulModel = modelName;
        break; // Stop if success
      } catch (err) {
        console.warn(`Model ${modelName} failed:`, err.message || err);
      }
    }
    
    if (successfulModel) {
      console.log('\n--- RESPONSE FROM GEMINI ---');
      console.log(responseText);
      console.log('----------------------------\n');
      console.log(`Gemini API test completed successfully using model: ${successfulModel}!`);
    } else {
      console.error('All models failed. Please verify API key permissions and model availability.');
    }
  } catch (error) {
    console.error('Gemini API test failed:', error);
  }
}

testGemini();
