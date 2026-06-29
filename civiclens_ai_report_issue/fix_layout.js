const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Replace top navbar with the sidebar
const topNavStart = html.indexOf('<!-- TopNavBar -->');
const topNavEnd = html.indexOf('</header>', topNavStart) + 9;

const sidebarHTML = `
  <!-- SideNavBar (Unified Sidebar Component) -->
  <aside class="fixed left-0 top-0 h-screen w-20 md:w-64 bg-surface dark:bg-surface-dim border-r border-outline-variant/30 flex flex-col transition-all duration-300 z-50">
    <div class="h-20 flex items-center justify-center md:justify-start md:px-lg border-b border-outline-variant/30">
      <span class="material-symbols-outlined text-primary text-3xl md:hidden">eco</span>
      <h1 class="hidden md:block font-headline-md text-xl text-primary font-bold">CivicLens AI</h1>
    </div>
    <nav class="flex-1 py-lg flex flex-col gap-sm px-xs md:px-md">
      <a href="../civiclens_ai_user_dashboard/index.html" class="nav-item group relative flex items-center justify-center md:justify-start gap-md px-md py-md rounded-full text-on-surface-variant hover:bg-secondary-container/50 hover:text-on-surface transition-all">
        <span class="material-symbols-outlined transition-transform group-hover:scale-110">dashboard</span>
        <span class="hidden md:block font-label-md font-semibold">Dashboard</span>
      </a>
      <a href="../civiclens_ai_explore_community_issues/index.html" class="nav-item group relative flex items-center justify-center md:justify-start gap-md px-md py-md rounded-full text-on-surface-variant hover:bg-secondary-container/50 hover:text-on-surface transition-all">
        <span class="material-symbols-outlined transition-transform group-hover:scale-110">public</span>
        <span class="hidden md:block font-label-md font-semibold">Explore Issues</span>
      </a>
      <a href="../civiclens_ai_my_active_reports_with_sidebar/index.html" class="nav-item group relative flex items-center justify-center md:justify-start gap-md px-md py-md rounded-full text-on-surface-variant hover:bg-secondary-container/50 hover:text-on-surface transition-all">
        <span class="material-symbols-outlined transition-transform group-hover:scale-110">list_alt</span>
        <span class="hidden md:block font-label-md font-semibold">My Reports</span>
      </a>
      <a href="../civiclens_ai_leaderboard_annotated_updates/index.html" class="nav-item group relative flex items-center justify-center md:justify-start gap-md px-md py-md rounded-full text-on-surface-variant hover:bg-secondary-container/50 hover:text-on-surface transition-all">
        <span class="material-symbols-outlined transition-transform group-hover:scale-110">trophy</span>
        <span class="hidden md:block font-label-md font-semibold">Leaderboard</span>
      </a>
      <a href="../civiclens_ai_municipality_operations_dashboard_demo/index.html" class="nav-item group relative flex items-center justify-center md:justify-start gap-md px-md py-md rounded-full text-on-surface-variant hover:bg-secondary-container/50 hover:text-on-surface transition-all">
        <span class="material-symbols-outlined transition-transform group-hover:scale-110">admin_panel_settings</span>
        <span class="hidden md:block font-label-md font-semibold">Municipality</span>
      </a>
    </nav>
    <div class="p-md border-t border-outline-variant/30 flex flex-col gap-md">
      <a href="../civiclens_ai_report_issue/index.html" class="nav-item group relative flex items-center justify-center md:justify-start gap-md px-md py-md rounded-full bg-primary text-on-primary hover:bg-primary/90 transition-all shadow-sm">
        <span class="material-symbols-outlined transition-transform group-hover:rotate-12">add_circle</span>
        <span class="hidden md:block font-label-md font-bold">Report Issue</span>
      </a>
      <button onclick="window.CivicDB.logout().then(() => window.location.href=\'../civiclens_ai_login/index.html\')" class="nav-item group relative flex items-center justify-center md:justify-start gap-md px-md py-md rounded-full text-error hover:bg-error-container hover:text-on-error-container transition-all">
        <span class="material-symbols-outlined transition-transform group-hover:-translate-x-1">logout</span>
        <span class="hidden md:block font-label-md font-semibold">Log Out</span>
      </button>
    </div>
  </aside>
`;

if (topNavStart !== -1 && topNavEnd !== -1) {
  html = html.substring(0, topNavStart) + sidebarHTML + html.substring(topNavEnd);
}

// 2. Add ml-64 to main
html = html.replace('<main class="flex-grow w-full max-w-7xl mx-auto px-md md:px-lg py-lg">', '<main class="flex-grow w-full max-w-7xl mx-auto px-md md:px-lg py-lg md:ml-64">');

// 3. Ensure app.js is included in head
if (!html.includes('app.js')) {
    html = html.replace('<script src="../frontend_config.js"></script>', '<script src="../frontend_config.js"></script>\n<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n<script src="../app.js"></script>');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Report issue html updated with sidebar and scripts.');
