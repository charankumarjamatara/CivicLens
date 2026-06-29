const fs = require('fs');
let content = fs.readFileSync('C:/develpment_charan/Community Hero/stitch_civiclens_ai_landing_page/app.js', 'utf8');
content = content.replace('async signUp(email, password, name) {', "async signUp(email, password, name, address = '', locationGranted = false) {");
content = content.replace("name,\n            civic_score: 0,", "name,\n            address,\n            civic_score: 0,");
content = content.replace("name,\n        civic_score: 0,", "name,\n        address,\n        civic_score: 0,");
content = content.replace("LS.set('current_user', newUser);\n      return newUser;", "LS.set('current_user', newUser);\n      if (locationGranted) LS.set('location_granted', true);\n      return newUser;");
fs.writeFileSync('C:/develpment_charan/Community Hero/stitch_civiclens_ai_landing_page/app.js', content, 'utf8');
console.log('updated app.js');
