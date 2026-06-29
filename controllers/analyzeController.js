const geminiService = require('../services/geminiService');

async function analyze(req, res, next) {
  try {
    const photo = req.file;
    const userDescription = req.body.description || '';

    if (!photo) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const data = await geminiService.analyzeImage(photo, userDescription);
    data.image_url = `/uploads/${photo.filename}`;
    res.json(data);
  } catch (error) {
    next(error); // Forward to global error handler
  }
}

module.exports = {
  analyze
};
