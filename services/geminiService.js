const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');

async function analyzeImage(photo, userDescription) {
  const apiKey = process.env.GEMINI_API_KEY;
  const isMockMode = !apiKey || apiKey.includes('your-gemini');

  if (isMockMode) {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Analyze description keywords to suggest category
    let category = 'Road Maintenance';
    let title = 'Road Pavement Hazard';
    let dept = 'Road Maintenance';
    let severity = 'Medium';
    let desc = 'Large pothole on the road creating safety risks for passing drivers.';

    const textLower = (userDescription || '').toLowerCase();
    if (textLower.includes('trash') || textLower.includes('garbage') || textLower.includes('waste') || textLower.includes('dirty')) {
      category = 'Sanitation';
      title = 'Garbage Pileup in Public Walkway';
      dept = 'Sanitation';
      severity = 'Low';
      desc = 'Uncollected garbage bags overflowing on the footpath, attracting pests.';
    } else if (textLower.includes('light') || textLower.includes('power') || textLower.includes('electric') || textLower.includes('wire')) {
      category = 'Electricity';
      title = 'Broken Street Light Pole';
      dept = 'Electricity';
      severity = 'High';
      desc = 'Street light out of service or exposed electrical wiring dangling low.';
    } else if (textLower.includes('drain') || textLower.includes('flood') || textLower.includes('sewer') || textLower.includes('water')) {
      category = 'Drainage';
      title = 'Clogged Stormwater Drain';
      dept = 'Drainage';
      severity = 'High';
      desc = 'Water overflowing from local drain clogging up roads and causing bad odor.';
    }

    // Cleanup uploaded file
    try { fs.unlinkSync(photo.path); } catch (e) {}

    return {
      category,
      severity,
      generated_title: title,
      generated_description: desc + (userDescription ? ` (Based on user note: "${userDescription}")` : ''),
      department: dept,
      reason: 'Identified through image matching patterns (Mock Mode).',
      confidence: 0.92
    };
  }

  // Live Mode: Gemini API Integration using @google/genai
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      You are an expert AI civic assistant for CivicLens AI.
      Analyze this uploaded image and the citizen's optional description: "${userDescription || ''}".
      
      Generate a structured JSON output with the following fields:
      1. "category": Must be exactly one of: "Road Maintenance", "Sanitation", "Electricity", "Drainage", "Water Supply", "Other".
      2. "severity": Must be exactly one of: "Low", "Medium", "High", "Critical".
      3. "generated_title": A brief, professional title summarizing the issue (maximum 6 words).
      4. "generated_description": A polished, detailed, grammatically correct description of the issue suitable for city planners.
      5. "department": Recommend the responsible municipal department from: "Road Maintenance", "Sanitation", "Electricity", "Drainage", "Water Supply".
      6. "reason": Explain briefly why this category and department were recommended.
      7. "confidence": A float confidence score between 0.0 and 1.0.

      Respond ONLY with a valid JSON block. Do not include markdown tags, code snippets, or backticks.
    `;

    const imageBuffer = fs.readFileSync(photo.path);
    const mimeType = photo.mimetype;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: imageBuffer.toString("base64")
          }
        },
        {
          text: prompt
        }
      ]
    });

    const responseText = response.text || "";
    
    // Cleanup uploaded file
    try { fs.unlinkSync(photo.path); } catch (e) {}

    // Parse JSON safely (removing markdown code blocks if any were returned)
    const match = responseText.match(/\{[\s\S]*\}/);
    let json = {};
    if (match) {
      json = JSON.parse(match[0]);
    } else {
      json = JSON.parse(responseText);
    }
    return json;
  } catch (error) {
    // Cleanup uploaded file
    try { fs.unlinkSync(photo.path); } catch (e) {}
    throw error;
  }
}

module.exports = {
  analyzeImage
};
