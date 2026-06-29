const cors = require('cors');

const allowedOrigins = [
  /\.web\.app$/,           // Firebase Hosting (*.web.app)
  /\.firebaseapp\.com$/,   // Firebase Hosting (*.firebaseapp.com)
  /\.github\.io$/,         // GitHub Pages (*.github.io)
  /localhost:\d+$/,         // Local development
  /127\.0\.0\.1:\d+$/      // Local development (IP)
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., curl, mobile apps, same-origin)
    if (!origin) return callback(null, true);
    
    const allowed = allowedOrigins.some(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(origin);
      }
      return pattern === origin;
    });

    if (allowed) return callback(null, true);

    // Also allow custom domain set via environment variable
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }

    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true
};

module.exports = cors(corsOptions);
