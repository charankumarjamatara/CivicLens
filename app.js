/**
 * CivicLens AI — Unified Client API Layer (app.js)
 * Loaded globally on every page via <script src="/app.js">
 *
 * Provides window.CivicDB — a unified interface that:
 *  - In LIVE mode: uses real Supabase for auth, reports, verifications, comments
 *  - In MOCK mode: uses localStorage-based mock data (no credentials required)
 *
 * The backend URL is auto-detected:
 *  - Local dev:   http://localhost:3000
 *  - Production:  fetched from /api/config response (Cloud Run URL)
 */

(function () {
  'use strict';

  // ─── Backend URL Resolution ─────────────────────────────────────────────────
  // Detect if running on Firebase Hosting (production) or localhost (dev)
  const isLocalDev = (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );

  // In production (Firebase Hosting), API calls go to Cloud Run backend URL.
  // window.BACKEND_URL is injected by the deploy process, or falls back to /api
  // (which only works in local dev where server.js serves both API and static files).
  let BACKEND_URL = window.BACKEND_URL || (isLocalDev ? '' : '');

  // ─── Mock Data Seed ─────────────────────────────────────────────────────────
  const MOCK_USERS = [
    { id: 'user-1', email: 'charan@civiclens.ai', password: 'password', name: 'Charan Kumar', civic_score: 420, rank: 'Civic Champion', avatar: null },
    { id: 'user-2', email: 'sarah@civiclens.ai', password: 'password', name: 'Sarah Johnson', civic_score: 980, rank: 'Community Hero', avatar: null },
    { id: 'user-3', email: 'david@civiclens.ai', password: 'password', name: 'David Lee', civic_score: 845, rank: 'Civic Champion', avatar: null },
    { id: 'guest@civiclens.ai', email: 'guest@civiclens.ai', password: 'Password123', name: 'Guest Judge', civic_score: 250, rank: 'Active Citizen', avatar: null },
  ];

  const MOCK_REPORTS = [
    {
      id: 'report-1',
      user_id: 'user-1',
      title: 'Severe Pothole on Oak Street',
      description: 'Deep pothole taking up half the lane heading southbound. Multiple cars have swerved to avoid it.',
      category: 'Road Maintenance',
      severity: 'High',
      department: 'Public Works',
      status: 'In Progress',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFaE-Uyv5eoy-2qFDUayO2zgcExdnYv7SXU6bLkf-R_QANU7fynB-DvTsrRKzvBJwE73YrN8MZYJ9JFfp75Xi-LcUrCxpKlb3dFRYO3ArjQr4P-TJE-ML_WeAM-GwsdRMXYFxDqBZARxVoflCjmCVCi1THAD8Zv2NWy2ZOF6I3hzxsNLw1zOTN1vDn5D0bsKGmvifEWhFzssnSywBdJyVmTyd7yhoBPTSzfLUlJPinhzbjtR2RZKTk90O97q26E5MDojkjfrsWag',
      latitude: 16.8215,
      longitude: 81.5284,
      confidence: 0.96,
      ai_reason: 'Large cavity detected in road surface; classified as High severity road hazard.',
      support_count: 28,
      verification_count: 30,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'report-2',
      user_id: 'user-2',
      title: 'Broken Streetlamp on Maple Ave',
      description: 'The streetlight outside 402 Maple Ave has been flickering for a week and is now completely out.',
      category: 'Electricity',
      severity: 'Medium',
      department: 'Electricity Board',
      status: 'Under Review',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpxY_mrVNJiVooxWcDrjUTBEp-693Z4yiFixXawbOSqmxbrmLNDOhg9HfrF9ZxrZ94ccRM7I_7MZqsfq8miGSHZfwGKS2tEGIoHBhnrZS32VfN6GAUNsl9yCqPKvBjjJ8ZdG-xsybUy-7BqcJWqbFsZUiGy_T-bpRU1tdgyNxJkvsRPxjmECrojOKmf-KjeMqsPkVWDYXlktprok48kUVXtkHqEsRXNwmcIx14eEIlE40VmriFW41uxIYkAar7QtF7FqPRHyR96w',
      latitude: 16.8198,
      longitude: 81.5311,
      confidence: 0.88,
      ai_reason: 'Streetlight fixture appears dark and tilted. Medium severity public safety issue.',
      support_count: 12,
      verification_count: 15,
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'report-3',
      user_id: 'user-1',
      title: 'Clogged Drain Causing Waterlogging',
      description: 'Storm drain at the junction is completely blocked. During rain, the entire road floods.',
      category: 'Drainage',
      severity: 'Critical',
      department: 'Municipal Corporation',
      status: 'Open',
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWM_kizjNiLIrGZkyVrsgJSqn1QdASlX4ThbYCqZKFYi9I_krAUy3gIvEkqPzlAXniIvC4qB06v0xmXKJw7eSLQqGvHGIy5vlDABz-O4wS60fQ1s3tdK0lQYX9VEfeT-CbY1_t0J74mDm303yq8NkKSBnTgp8U6C25qnlcC-Pmn8CxRxfu8R8hwHo23PiJZXHKROt580_-P0KgQ6SolcRh8lXkauQyenLfp6vfRj5vF2XpqgBU9i_q8jEQTzR7ReJP49aSJaakkw',
      latitude: 16.8231,
      longitude: 81.5267,
      confidence: 0.94,
      ai_reason: 'Blocked drain with visible debris accumulation. Risk of flooding classified Critical.',
      support_count: 45,
      verification_count: 50,
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'report-4',
      user_id: 'user-3',
      title: 'Overflowing Garbage Near Market',
      description: 'Bins near the main market have not been collected for 3 days. Severe sanitation issue.',
      category: 'Sanitation',
      severity: 'High',
      department: 'Sanitation Department',
      status: 'Resolved',
      image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800',
      latitude: 16.8245,
      longitude: 81.5299,
      confidence: 0.91,
      ai_reason: 'Overflowing bins and organic waste accumulation detected. High sanitation risk.',
      support_count: 33,
      verification_count: 40,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const MOCK_LEADERBOARD = [
    { id: 'user-2', name: 'Sarah Johnson', score: 980, rank: 'Community Hero', reports: 42, resolved: 38, verifications: 89, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
    { id: 'user-3', name: 'David Lee', score: 845, rank: 'Civic Champion', reports: 35, resolved: 29, verifications: 67, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
    { id: 'user-4', name: 'Priya Sharma', score: 320, rank: 'Active Citizen', reports: 8, resolved: 5, verifications: 28, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    { id: 'user-5', name: 'Rahul Verma', score: 210, rank: 'Active Citizen', reports: 5, resolved: 3, verifications: 15, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' },
  ];

  // ─── LocalStorage Helpers ───────────────────────────────────────────────────
  const LS = {
    get: (key) => {
      try { return JSON.parse(localStorage.getItem('civicdb_' + key)); } catch { return null; }
    },
    set: (key, val) => {
      try { localStorage.setItem('civicdb_' + key, JSON.stringify(val)); } catch {}
    },
    remove: (key) => { localStorage.removeItem('civicdb_' + key); }
  };

  // ─── CivicDB Interface ──────────────────────────────────────────────────────
  const CivicDB = {
    isMock: true,
    _supabase: null,
    _config: null,

    /**
     * Initialize: fetch config from backend, decide mock vs live mode
     */
    async init() {
      if (this._config) return; // Already initialized

      try {
        const configUrl = window.BACKEND_URL ? window.BACKEND_URL + '/api/config' : '/api/config';
        const res = await fetch(configUrl, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error('Config fetch failed');
        this._config = await res.json();

        if (this._config.backendUrl) {
          BACKEND_URL = this._config.backendUrl;
          window.BACKEND_URL = BACKEND_URL;
        }

        this.isMock = true; // FORCE MOCK MODE FOR DEMO PRESENTATION
        console.log('[CivicDB] Forcing Mock Mode for Demo Presentation to Judges');

        // Initialize Supabase if in live mode
        if (!this.isMock && this._config.supabaseUrl && this._config.supabaseAnonKey) {
          if (typeof window.supabase !== 'undefined') {
            this._supabase = window.supabase.createClient(
              this._config.supabaseUrl,
              this._config.supabaseAnonKey
            );
          }
        }
      } catch (err) {
        console.warn('[CivicDB] Config fetch failed, using mock mode:', err.message);
        this.isMock = true;
        this._config = { isMockMode: true };
      }

      // Seed mock data if first time
      if (this.isMock) this._seedMockData();

      // Perform route protection
      await this.checkAuthRoute();
    },

    async checkAuthRoute() {
      const path = window.location.pathname;
      const isPublicPage = (
        path.endsWith('/civiclens_ai_landing_page_enhanced_hero/index.html') ||
        path.endsWith('/civiclens_ai_landing_page_enhanced_hero/') ||
        path.endsWith('/civiclens_ai_login/index.html') ||
        path.endsWith('/civiclens_ai_login/') ||
        path.includes('/civiclens_ai_municipality_operations_dashboard_demo/') ||
        path === '/' ||
        (path.endsWith('/index.html') && !path.includes('civiclens_ai_'))
      );

      if (!isPublicPage) {
        const user = await this.getCurrentUser();
        if (!user) {
          console.warn('[CivicDB] Unauthenticated access to protected route, redirecting to login...');
          window.location.href = '../civiclens_ai_login/index.html';
        }
      }
    },

    _seedMockData() {
      if (!LS.get('comments')) {
        LS.set('comments', []);
      }
      if (!LS.get('verifications')) {
        LS.set('verifications', []);
      }
    },
    
    _generateDemoDataForUser(userId) {
      const demoReports = [];
      
      const realImages = [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBFaE-Uyv5eoy-2qFDUayO2zgcExdnYv7SXU6bLkf-R_QANU7fynB-DvTsrRKzvBJwE73YrN8MZYJ9JFfp75Xi-LcUrCxpKlb3dFRYO3ArjQr4P-TJE-ML_WeAM-GwsdRMXYFxDqBZARxVoflCjmCVCi1THAD8Zv2NWy2ZOF6I3hzxsNLw1zOTN1vDn5D0bsKGmvifEWhFzssnSywBdJyVmTyd7yhoBPTSzfLUlJPinhzbjtR2RZKTk90O97q26E5MDojkjfrsWag',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCpxY_mrVNJiVooxWcDrjUTBEp-693Z4yiFixXawbOSqmxbrmLNDOhg9HfrF9ZxrZ94ccRM7I_7MZqsfq8miGSHZfwGKS2tEGIoHBhnrZS32VfN6GAUNsl9yCqPKvBjjJ8ZdG-xsybUy-7BqcJWqbFsZUiGy_T-bpRU1tdgyNxJkvsRPxjmECrojOKmf-KjeMqsPkVWDYXlktprok48kUVXtkHqEsRXNwmcIx14eEIlE40VmriFW41uxIYkAar7QtF7FqPRHyR96w',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAWM_kizjNiLIrGZkyVrsgJSqn1QdASlX4ThbYCqZKFYi9I_krAUy3gIvEkqPzlAXniIvC4qB06v0xmXKJw7eSLQqGvHGIy5vlDABz-O4wS60fQ1s3tdK0lQYX9VEfeT-CbY1_t0J74mDm303yq8NkKSBnTgp8U6C25qnlcC-Pmn8CxRxfu8R8hwHo23PiJZXHKROt580_-P0KgQ6SolcRh8lXkauQyenLfp6vfRj5vF2XpqgBU9i_q8jEQTzR7ReJP49aSJaakkw',
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800'
      ];
      
      // 1. Generate 5 verified reports for current user
      for(let i=0; i<5; i++) {
        demoReports.push({
          id: 'demo-ver-' + i,
          user_id: userId,
          title: 'Verified Report ' + (i+1),
          description: 'This issue was successfully verified by the community and is being addressed.',
          category: 'General Maintenance',
          severity: 'Low',
          department: 'Public Works',
          status: 'Resolved',
          image_url: realImages[i % realImages.length],
          latitude: 16.82 + (i * 0.001),
          longitude: 81.53 + (i * 0.001),
          confidence: 0.95,
          ai_reason: 'High confidence match for civic issue.',
          support_count: 5,
          verification_count: 5,
          created_at: new Date(Date.now() - (i+1) * 24 * 60 * 60 * 1000).toISOString()
        });
      }
      
      // 2. Generate 5 unverified reports for current user
      for(let i=0; i<5; i++) {
        demoReports.push({
          id: 'demo-unv-' + i,
          user_id: userId,
          title: 'Unverified Report ' + (i+1),
          description: 'Waiting for community verification.',
          category: 'Public Safety',
          severity: 'Medium',
          department: 'Public Works',
          status: 'Open',
          image_url: realImages[(i + 1) % realImages.length],
          latitude: 16.82 + (i * 0.002),
          longitude: 81.53 + (i * 0.002),
          confidence: 0.90,
          ai_reason: 'Medium confidence match for civic issue.',
          support_count: 1,
          verification_count: 1,
          created_at: new Date(Date.now() - i * 60 * 60 * 1000).toISOString()
        });
      }
      
      // 3. Generate 10 explore reports (for other users) to be verified
      for(let i=0; i<10; i++) {
        demoReports.push({
          id: 'demo-exp-' + i,
          user_id: 'user-2', // some other user
          title: 'Community Issue ' + (i+1),
          description: 'Please help verify this issue in our neighborhood.',
          category: 'Infrastructure',
          severity: 'High',
          department: 'Municipal',
          status: 'Open',
          image_url: realImages[(i + 2) % realImages.length],
          latitude: 16.82 + (i * 0.003),
          longitude: 81.53 + (i * 0.003),
          confidence: 0.92,
          ai_reason: 'High confidence match for civic issue.',
          support_count: 2,
          verification_count: 2,
          created_at: new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString()
        });
      }
      
      return [...MOCK_REPORTS, ...demoReports];
    },

    // ── Auth Methods ────────────────────────────────────────────────────────

    async getCurrentUser() {
      await this.init();

      if (!this.isMock && this._supabase) {
        const { data: { user } } = await this._supabase.auth.getUser();
        if (user) {
          // Fetch profile from users table
          const { data: profile } = await this._supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          return profile || { id: user.id, name: user.email, email: user.email, civic_score: 0, rank: 'Newcomer' };
        }
        return null;
      }

      // Mock mode
      return LS.get('current_user');
    },

    async login(email, password) {
      await this.init();

      if (!this.isMock && this._supabase) {
        const { data, error } = await this._supabase.auth.signInWithPassword({ email, password });
        if (error) {
          console.warn('[CivicDB] Supabase login failed:', error.message, '- Falling back to mock mode.');
          this.isMock = true;
          LS.set('forceMock', true);
        } else {
          return data.user;
        }
      }

      // Mock login
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (!user) {
        // If guest login fallback, create guest if not exists
        if (email === 'guest@civiclens.ai') {
           const safeUser = { id: 'mock-user-guest', name: 'Guest Judge', email: 'guest@civiclens.ai', civic_score: 50, rank: 'Newcomer' };
           LS.set('current_user', safeUser);
           return safeUser;
        }
        throw new Error('Invalid email or password. Try: charan@civiclens.ai / password');
      }
      const { password: _, ...safeUser } = user;
      LS.set('current_user', safeUser);
      return safeUser;
    },

    async signUp(email, password, name, address, locationGranted) {
      await this.init();

      if (!this.isMock && this._supabase) {
        const { data, error } = await this._supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
           console.warn('[CivicDB] Supabase signUp failed:', error.message, '- Falling back to mock mode.');
           this.isMock = true;
           LS.set('forceMock', true);
        } else if (data.user) {
          // Upsert profile data on signup
          await this._supabase.from('profiles').upsert({
            id: data.user.id,
            name: name,
            email: email,
            address: address,
            civic_score: 10, // Starting bonus
            rank: 'Newcomer'
          }, { onConflict: 'id' });

          if(locationGranted) {
            window.localStorage.setItem('location_granted', 'true');
          }
          return data.user;
        }
      }

      // Mock signup
      const newUser = {
        id: 'user-' + Date.now(),
        email,
        name,
        address,
        civic_score: 0,
        rank: 'Newcomer',
        avatar: null
      };
      MOCK_USERS.push({ ...newUser, password });
      LS.set('current_user', newUser);
      if (locationGranted) LS.set('location_granted', true);
      return newUser;
    },

    async logout() {
      await this.init();
      if (!this.isMock && this._supabase) {
        await this._supabase.auth.signOut();
      }
      LS.remove('current_user');
      window.location.href = '../civiclens_ai_landing_page_enhanced_hero/index.html';
    },

    // ── Reports Methods ─────────────────────────────────────────────────────

    async getReports(filters = {}) {
      await this.init();

      if (!this.isMock && this._supabase) {
        try {
          let query = this._supabase.from('reports').select('*').order('created_at', { ascending: false });
          if (filters.user_id) query = query.eq('user_id', filters.user_id);
          if (filters.status) query = query.eq('status', filters.status);
          const { data, error } = await query;
          if (error) throw new Error(error.message);
          return data || [];
        } catch (err) {
          console.warn('[CivicDB] Supabase query failed, falling back to mock reports:', err.message);
          // Fall through to mock logic
        }
      }

      // Mock
      const currentUser = await this.getCurrentUser();
      const currentUserId = currentUser ? currentUser.id : 'user-1';
      
      // Check if we need to generate demo data for the current user
      if (LS.get('demo_user_id_v2') !== currentUserId) {
         const newReports = this._generateDemoDataForUser(currentUserId);
         LS.set('reports', newReports);
         LS.set('demo_user_id_v2', currentUserId);
         
         if (currentUser) {
           currentUser.civic_score = 900; // Put them in 2nd place
           currentUser.rank = 'Civic Champion';
           LS.set('current_user', currentUser);
         }
      }
      
      let reports = LS.get('reports') || MOCK_REPORTS;
      if (filters.user_id) reports = reports.filter(r => r.user_id === filters.user_id);
      if (filters.status) reports = reports.filter(r => r.status === filters.status);
      return reports;
    },

    async createReport(reportData) {
      await this.init();
      const user = await this.getCurrentUser();
      if (!user) throw new Error('Must be logged in to submit a report.');

      const newReport = {
        id: 'report-' + Date.now(),
        user_id: user.id,
        title: reportData.title,
        description: reportData.description,
        category: reportData.category,
        severity: reportData.severity,
        department: reportData.department,
        status: 'Open',
        image_url: reportData.image_url || '',
        latitude: reportData.latitude || 16.820,
        longitude: reportData.longitude || 81.530,
        confidence: reportData.confidence || 0.90,
        ai_reason: reportData.ai_reason || '',
        support_count: 0,
        verification_count: 0,
        created_at: new Date().toISOString()
      };

      if (!this.isMock && this._supabase) {
        const { data, error } = await this._supabase.from('reports').insert(newReport).select().single();
        if (error) throw new Error(error.message);
        // Award +10 points
        await this._supabase.rpc('increment_score', { user_id: user.id, points: 10 });
        return data;
      }

      // Mock
      const reports = LS.get('reports') || [];
      reports.unshift(newReport);
      LS.set('reports', reports);
      // Update user score
      const currentUser = LS.get('current_user');
      if (currentUser) {
        currentUser.civic_score = (currentUser.civic_score || 0) + 10;
        LS.set('current_user', currentUser);
      }
      return newReport;
    },

    async updateReportStatus(reportId, newStatus) {
      await this.init();

      if (!this.isMock && this._supabase) {
        const { error } = await this._supabase
          .from('reports')
          .update({ status: newStatus })
          .eq('id', reportId);
        if (error) throw new Error(error.message);

        // If resolved, find reporter and award +20 points
        if (newStatus === 'Resolved') {
          const { data: report } = await this._supabase.from('reports').select('user_id').eq('id', reportId).single();
          if (report) {
            await this._supabase.rpc('increment_score', { user_id: report.user_id, points: 20 });
          }
        }
        return;
      }

      // Mock
      const reports = LS.get('reports') || [];
      const idx = reports.findIndex(r => r.id === reportId);
      if (idx >= 0) {
        const oldStatus = reports[idx].status;
        reports[idx].status = newStatus;
        LS.set('reports', reports);

        // If resolved, award +20 to the reporter (if it's the current user)
        if (newStatus === 'Resolved' && oldStatus !== 'Resolved') {
          const currentUser = LS.get('current_user');
          if (currentUser && currentUser.id === reports[idx].user_id) {
            currentUser.civic_score = (currentUser.civic_score || 0) + 20;
            LS.set('current_user', currentUser);
          }
        }
      }
    },

    // ── Verification Methods ────────────────────────────────────────────────

    calculateRank(score) {
      if (score >= 600) return 'Community Hero';
      if (score >= 300) return 'Civic Champion';
      if (score >= 100) return 'Active Citizen';
      return 'Newcomer';
    },

    async verifyReport(reportId, isSupport) {
      await this.init();
      const user = await this.getCurrentUser();
      if (!user) throw new Error('Must be logged in to verify reports.');

      if (!this.isMock && this._supabase) {
        // Upsert verification
        const { error } = await this._supabase.from('verifications').upsert({
          report_id: reportId,
          user_id: user.id,
          is_support: isSupport
        }, { onConflict: 'report_id,user_id' });
        if (error) throw new Error(error.message);

        // Refresh counts
        const { data: verifications } = await this._supabase
          .from('verifications')
          .select('is_support')
          .eq('report_id', reportId);

        const supportCount = verifications.filter(v => v.is_support).length;
        const deniedCount = verifications.filter(v => !v.is_support).length;
        
        let newStatus = undefined;
        if (supportCount >= 5) newStatus = 'Community Verified';
        if (deniedCount >= 3) newStatus = 'Rejected';

        await this._supabase.from('reports').update({
          support_count: supportCount,
          verification_count: verifications.length,
          status: newStatus || undefined
        }).eq('id', reportId);

        // Award +4 points for verifying
        await this._supabase.rpc('increment_score', { user_id: user.id, points: 4 });
        
        if (deniedCount === 3) { // Trigger only once when it hits 3
          const { data: report } = await this._supabase.from('reports').select('user_id').eq('id', reportId).single();
          if (report) {
            await this._supabase.rpc('increment_score', { user_id: report.user_id, points: -15 });
          }
        }
        return;
      }

      // Mock
      const reports = LS.get('reports') || [];
      const idx = reports.findIndex(r => r.id === reportId);
      if (idx >= 0) {
        reports[idx].verification_count = (reports[idx].verification_count || 0) + 1;
        reports[idx].denied_count = reports[idx].denied_count || 0;
        
        if (isSupport) {
          reports[idx].support_count = (reports[idx].support_count || 0) + 1;
          reports[idx].confidence = Math.min((reports[idx].confidence || 0) + 0.05, 1.0);
        } else {
          reports[idx].denied_count += 1;
          reports[idx].confidence = Math.max((reports[idx].confidence || 0) - 0.05, 0.0);
        }
        
        if (reports[idx].support_count >= 5 && reports[idx].status === 'Open') {
          reports[idx].status = 'Community Verified';
        }
        
        let applyPenalty = false;
        if (reports[idx].denied_count >= 3 && reports[idx].status !== 'Rejected') {
          reports[idx].status = 'Rejected';
          applyPenalty = true;
        }
        
        LS.set('reports', reports);
        
        // Apply penalty if needed
        if (applyPenalty) {
          const reporterId = reports[idx].user_id;
          const mockUsers = MOCK_USERS; // Usually we'd update global, but here we can update current_user if it's them
          const currentUser = LS.get('current_user');
          if (currentUser && currentUser.id === reporterId) {
             currentUser.civic_score = (currentUser.civic_score || 0) - 15;
             currentUser.rank = this.calculateRank(currentUser.civic_score);
             LS.set('current_user', currentUser);
          }
        }
      }

      // Award +4 points in mock to verifier
      const currentUser = LS.get('current_user');
      if (currentUser) {
        currentUser.civic_score = (currentUser.civic_score || 0) + 4;
        currentUser.verifications = (currentUser.verifications || 0) + 1;
        currentUser.rank = this.calculateRank(currentUser.civic_score);
        LS.set('current_user', currentUser);
      }
    },

    // ── Leaderboard Methods ─────────────────────────────────────────────────

    async getLeaderboard() {
      await this.init();

      if (!this.isMock && this._supabase) {
        try {
          const { data, error } = await this._supabase
            .from('profiles')
            .select('id, name, civic_score, rank, avatar')
            .order('civic_score', { ascending: false })
            .limit(20);
          if (error) throw new Error(error.message);
          return (data || []).map(u => ({ ...u, score: u.civic_score }));
        } catch (err) {
          console.warn('[CivicDB] Supabase query failed, falling back to mock leaderboard:', err.message);
          // Fall through to mock logic
        }
      }

      // Mock — sort by score descending
      let leaderboard = [...MOCK_LEADERBOARD];
      const currentUser = await this.getCurrentUser();
      
      if (currentUser) {
        leaderboard.push({
          id: currentUser.id,
          name: currentUser.name || 'Current User',
          score: currentUser.civic_score || 900,
          rank: currentUser.rank || 'Civic Champion',
          reports: 10,
          resolved: 5,
          verifications: 22,
          avatar: currentUser.avatar
        });
      }
      
      return leaderboard.sort((a, b) => b.score - a.score);
    },

    // ── Comments Methods ────────────────────────────────────────────────────

    async getComments(reportId) {
      await this.init();

      if (!this.isMock && this._supabase) {
        const { data, error } = await this._supabase
          .from('comments')
          .select('*, users(name)')
          .eq('report_id', reportId)
          .order('created_at', { ascending: true });
        if (error) throw new Error(error.message);
        return (data || []).map(c => ({ ...c, user_name: c.users?.name || 'Community Member' }));
      }

      // Mock
      const allComments = LS.get('comments') || [];
      return allComments.filter(c => c.report_id === reportId);
    },

    async addComment(reportId, text) {
      await this.init();
      const user = await this.getCurrentUser();
      if (!user) throw new Error('Must be logged in to comment.');

      const newComment = {
        id: 'comment-' + Date.now(),
        report_id: reportId,
        user_id: user.id,
        user_name: user.name,
        comment: text,
        created_at: new Date().toISOString()
      };

      if (!this.isMock && this._supabase) {
        const { error } = await this._supabase.from('comments').insert({
          report_id: reportId,
          user_id: user.id,
          comment: text
        });
        if (error) throw new Error(error.message);
        return newComment;
      }

      // Mock
      const comments = LS.get('comments') || [];
      comments.push(newComment);
      LS.set('comments', comments);
      return newComment;
    }
  };

  // Expose globally
  window.CivicDB = CivicDB;

  // Auto-init on load and bind global events
  CivicDB.init()
    .then(() => {
      document.addEventListener('click', (e) => {
        const logoutBtn = e.target.closest('#logout-sidebar-btn');
        if (logoutBtn) {
          e.preventDefault();
          CivicDB.logout();
        }
      });
    })
    .catch(err => console.warn('[CivicDB] Init warning:', err.message));

})();

