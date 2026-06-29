const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const configController = require('../controllers/configController');
const analyzeController = require('../controllers/analyzeController');
const duplicateController = require('../controllers/duplicateController');

const router = express.Router();

// Set up file upload destination inside workspace
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: 'uploads/' });

// Define routes
router.get('/config', configController.getConfig);
router.post('/analyze', upload.single('photo'), analyzeController.analyze);
router.post('/duplicate-check', duplicateController.duplicateCheck);

module.exports = router;
