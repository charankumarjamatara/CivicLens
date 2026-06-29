const fs = require('fs');
const files = [
  'civiclens_ai_explore_community_issues/index.html',
  'civiclens_ai_leaderboard_annotated_updates/index.html'
];
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\\\`/g, '`');
  content = content.replace(/\\\$/g, '$');
  content = content.replace(/\\\'/g, "'");
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}
