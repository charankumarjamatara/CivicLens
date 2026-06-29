// CivicLens AI — Frontend Configuration
// This file is overwritten during deployment to point to the live Google Cloud Run backend.
// In local development, it defaults to the same host.
window.BACKEND_URL = window.location.origin;
if (window.BACKEND_URL.includes('localhost') || window.BACKEND_URL.includes('127.0.0.1')) {
  window.BACKEND_URL = 'http://localhost:3000';
}
