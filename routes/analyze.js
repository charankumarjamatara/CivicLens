const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

router.post("/analyze", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file uploaded" });
        }

        const imageBytes = fs.readFileSync(req.file.path);

        const prompt = `
You are an AI civic complaint classifier.

Analyze this uploaded image and return ONLY valid JSON.

JSON Format:

{
  "category":"",
  "severity":"",
  "title":"",
  "description":"",
  "department":"",
  "reason":"",
  "confidence":0
}

Rules:

Category can be only one of:

Road Damage
Garbage
Street Light
Water Leakage
Drainage
Traffic
Electricity
Public Property
Others

Severity:
Low
Medium
High
Critical

Title:
Generate a short issue title.

Description:
Generate a detailed complaint description suitable for submitting to a municipality.

Department:
Suggest the responsible department.

Reason:
Explain why the image belongs to the predicted category.

Confidence:
Integer between 0 and 100.

Return JSON only.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    inlineData: {
                        mimeType: req.file.mimetype,
                        data: imageBytes.toString("base64")
                    }
                },
                {
                    text: prompt
                }
            ]
        });

        fs.unlinkSync(req.file.path);

        let text = response.text || "";

        let json = {};
        try {
            // Attempt to find JSON object in the text
            const match = text.match(/\{[\s\S]*\}/);
            if (match) {
                json = JSON.parse(match[0]);
            } else {
                json = JSON.parse(text);
            }
        } catch (parseErr) {
            console.error("JSON Parse Error:", parseErr, "Text was:", text);
            throw new Error("Failed to parse JSON from AI response.");
        }

        res.json(json);

    } catch (err) {
        console.error(err);
        // Attempt to clean up file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            error: err.message || "AI analysis failed"
        });
    }
});

module.exports = router;
