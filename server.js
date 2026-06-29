require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

// Import Custom Middlewares and Routes
const corsMiddleware = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');
const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 8080 : 3000);
const PUBLIC_DIR = __dirname;

// Global Middlewares
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API Routes
app.use('/api', apiRouter);

// Serve Client App Static Assets
// Redirect '/' and '/index.html' to the enhanced hero landing page
app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'civiclens_ai_landing_page_enhanced_hero', 'index.html'));
});

// Serve other static files
app.use(express.static(PUBLIC_DIR));
app.use('/uploads', express.static(path.join(PUBLIC_DIR, 'uploads')));

// Fallback Middleware (SPA support or direct static link routing)
app.use((req, res, next) => {
  const safeUrl = req.path.split('?')[0];
  const filePath = path.join(PUBLIC_DIR, safeUrl);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  res.status(404).send('File Not Found');
});

// Global Error Handler Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  const isMockMode =
    !process.env.SUPABASE_URL ||
    process.env.SUPABASE_URL.includes('your-supabase') ||
    !process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY.includes('your-gemini');

  console.log(`==================================================`);
  console.log(`CivicLens AI Mode: ${isMockMode ? 'MOCK MODE (No real API credentials)' : 'LIVE MODE (Supabase & Gemini Active)'}`);
  console.log(`CivicLens AI Server Running at http://localhost:${PORT}`);
  console.log(`==================================================`);
});
