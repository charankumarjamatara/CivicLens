const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/Users/chara/.gemini/antigravity-ide/brain/0ff53d2d-0e35-4287-81d1-d0d9f4ab608c/.system_generated/steps/962/output.txt', 'utf8'));
data.screens.forEach(s => {
    console.log(s.name, s.title);
});
