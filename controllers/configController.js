function getConfig(req, res) {
  const isMockMode = 
    !process.env.SUPABASE_URL || 
    process.env.SUPABASE_URL.includes('your-supabase') ||
    !process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY.includes('your-gemini');

  res.json({
    isMockMode,
    backendUrl: process.env.BACKEND_URL || '', 
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
  });
}

module.exports = {
  getConfig
};
