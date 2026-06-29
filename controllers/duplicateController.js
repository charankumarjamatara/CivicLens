// Distance calculation helper (flat-earth approximation in meters)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

async function duplicateCheck(req, res, next) {
  try {
    const { lat, lng, category } = req.body;
    if (!lat || !lng || !category) {
      return res.status(400).json({ error: 'Missing coordinates or category' });
    }

    const isMockMode = 
      !process.env.SUPABASE_URL || 
      process.env.SUPABASE_URL.includes('your-supabase') ||
      !process.env.GEMINI_API_KEY ||
      process.env.GEMINI_API_KEY.includes('your-gemini');

    if (isMockMode) {
      // In mock mode, we'll return a simulated duplicate check result
      // if coordinates are close to a simulated pothole location
      const mockReports = [
        {
          id: 'mock-dup-1',
          title: 'Active Sewer Overflow',
          category: 'Drainage',
          lat: 16.820,
          lng: 81.530,
          image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvCovEA7QftlTJmhTfKJFg3RuDG6tHhlpn3ioSZycUO-mBPIQV2Nzx_7ASN8U9e0O_0J1FOh-CXl7g8zFg-NEPZDiP9w6CVR7jhjv-Mq32ypVntSmaoDN3-YpUUlPUOUUQJYhYLLXy0jz59N_vp6btVoXlYacKeFBM8-Dr3PcirIAbON34jcn5bsYhzC-o4QXPjGqS5ucqH89_b2F4y4-Mj-Qd4Wqn-v2IKU3_IDwzvoXCHlyRGntX7lCHyg70qKizIY8C578cPg',
          description: 'Sewer line overflowing on Main Street.'
        }
      ];

      for (const report of mockReports) {
        if (report.category === category) {
          const dist = calculateDistance(lat, lng, report.lat, report.lng);
          if (dist <= 50) {
            return res.json({ duplicate: true, report });
          }
        }
      }
      return res.json({ duplicate: false });
    }

    // Live Mode: query real database from client-side or server-side Supabase
    // To keep server stateless, we let client-side JS do distance query or pass it here.
    res.json({ duplicate: false });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  duplicateCheck
};
