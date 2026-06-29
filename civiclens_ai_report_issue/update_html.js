const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Add file input
html = html.replace('<!-- Upload Section -->', `
<!-- Upload Section -->
<input type="file" id="image-upload" accept="image/*" class="hidden">
`);

// Add ID to upload button
html = html.replace('<button class="bg-surface-container-highest text-on-surface px-md py-sm rounded-full font-label-md text-label-md hover:bg-surface-variant transition-colors flex items-center gap-sm">', '<button id="browse-btn" class="bg-surface-container-highest text-on-surface px-md py-sm rounded-full font-label-md text-label-md hover:bg-surface-variant transition-colors flex items-center gap-sm">');

// Replace AI panel with one that has an ID
html = html.replace('<!-- AI Analysis Panel (Empty State) -->', '<!-- AI Analysis Panel (Empty State) -->\n<div id="ai-panel-container">');

const panelHTML = `<div class="glass-card rounded-xl p-md bg-gradient-to-br from-surface-container-lowest/80 to-surface-container/50 border border-primary/20 shadow-sm shadow-primary/5 h-full min-h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden ai-pulse" id="ai-panel">
<div class="absolute -top-24 -right-24 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl"></div>
<div class="absolute -bottom-24 -left-24 w-48 h-48 bg-tertiary-container/20 rounded-full blur-3xl"></div>
<span class="material-symbols-outlined text-6xl text-primary mb-md opacity-50" style="font-variation-settings: 'FILL' 1;">psychiatry</span>
<h3 class="font-headline-md text-2xl text-on-surface mb-sm">AI Analysis Pending</h3>
<p class="font-body-md text-on-surface-variant max-w-xs mb-lg">Upload an image to let our Eco-Sophisticate AI automatically classify and route this issue.</p>
<!-- Skeleton loaders to hint at future content -->
<div class="w-full flex flex-col gap-sm opacity-30 px-lg">
<div class="h-12 bg-surface-variant rounded-xl w-full"></div>
<div class="h-20 bg-surface-variant rounded-xl w-full"></div>
<div class="h-12 bg-surface-variant rounded-xl w-3/4 mx-auto"></div>
</div>
</div>
</div>`;

html = html.replace(/<div class="glass-card rounded-xl p-md bg-gradient-to-br from-surface-container-lowest\/80 to-surface-container\/50 border border-primary\/20 shadow-sm shadow-primary\/5 h-full min-h-\[400px\] flex flex-col items-center justify-center text-center relative overflow-hidden ai-pulse">[\s\S]*?<\/div>\s*<\/div>/, panelHTML);

// Add script to head
if (!html.includes('frontend_config.js')) {
    html = html.replace('</head>', '<script src="../frontend_config.js"></script>\n</head>');
}

// Add app logic at the bottom
const script = `
<script>
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('image-upload');
    const browseBtn = document.getElementById('browse-btn');
    const aiPanelContainer = document.getElementById('ai-panel-container');

    if(browseBtn) {
        browseBtn.addEventListener('click', () => {
            fileInput.click();
        });
    }

    if(fileInput) {
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if(!file) return;

            // Loading state
            aiPanelContainer.innerHTML = \`
                <div class="glass-card rounded-xl p-md bg-gradient-to-br from-surface-container-lowest/80 to-surface-container/50 border border-primary/50 shadow-sm h-full min-h-[400px] flex flex-col items-center justify-center text-center">
                    <span class="material-symbols-outlined text-6xl text-primary animate-spin mb-md">progress_activity</span>
                    <h3 class="font-headline-md text-2xl text-on-surface mb-sm">AI Analyzing Image...</h3>
                    <p class="font-body-md text-on-surface-variant max-w-xs mb-lg">Please wait while our models classify the issue.</p>
                </div>
            \`;

            try {
                const formData = new FormData();
                formData.append('image', file);

                const backendUrl = window.BACKEND_URL || 'http://localhost:3000';
                const res = await fetch(backendUrl + '/api/analyze', {
                    method: 'POST',
                    body: formData
                });

                if(!res.ok) throw new Error('Analysis failed');

                const data = await res.json();

                // Results State
                aiPanelContainer.innerHTML = \`
                    <div class="glass-card rounded-xl p-lg bg-surface text-left h-full flex flex-col gap-md border border-primary/30">
                        <h3 class="font-headline-md text-xl text-primary">AI Insights</h3>
                        <div class="flex items-center gap-2">
                            <span class="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold uppercase">\${data.category || 'Unknown'}</span>
                            <span class="px-3 py-1 \${data.severity === 'Critical' ? 'bg-error-container text-on-error-container' : 'bg-surface-variant text-on-surface-variant'} rounded-full text-xs font-bold uppercase">\${data.severity || 'Low'} Severity</span>
                            <span class="px-3 py-1 bg-primary text-white rounded-full text-xs font-bold">\${data.confidence || 0}% Match</span>
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Generated Title</label>
                            <input type="text" class="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-sm text-on-surface font-body-md" value="\${data.title || ''}" />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Description</label>
                            <textarea class="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2 text-sm text-on-surface font-body-md h-24" rows="4">\${data.description || ''}</textarea>
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Reasoning</label>
                            <p class="text-sm text-on-surface-variant italic">\${data.reason || 'No reasoning provided'}</p>
                        </div>
                        <div class="mt-auto">
                            <button class="w-full bg-primary text-white py-3 rounded-full font-bold hover:bg-primary/90 flex justify-center items-center gap-2">
                                <span class="material-symbols-outlined">send</span> Submit Report
                            </button>
                        </div>
                    </div>
                \`;

            } catch (err) {
                console.error(err);
                aiPanelContainer.innerHTML = \`
                    <div class="glass-card rounded-xl p-md bg-error-container text-on-error-container border border-error/50 shadow-sm h-full min-h-[400px] flex flex-col items-center justify-center text-center">
                        <span class="material-symbols-outlined text-6xl mb-md">error</span>
                        <h3 class="font-headline-md text-2xl mb-sm">Analysis Failed</h3>
                        <p class="font-body-md max-w-xs mb-lg">\${err.message}</p>
                        <button class="bg-surface text-error px-6 py-2 rounded-full font-bold" onclick="location.reload()">Try Again</button>
                    </div>
                \`;
            }
        });
    }
});
</script>
</body>
`;

html = html.replace('</body>', script);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Update Complete');
