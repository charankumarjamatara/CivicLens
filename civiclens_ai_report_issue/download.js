const https = require('https');
const fs = require('fs');

const url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ6Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpZCiVodG1sXzk4NzA3Njk2ZmE0MzQwZGNiNmM3ZTkyYjZlNjI2N2UyEgsSBxDljd3SmgIYAZIBIgoKcHJvamVjdF9pZBIUQhI2NTQ1ODMyMjE0MTQ4MDcxODU&filename=&opi=89354086";
const file = fs.createWriteStream("index.html");

https.get(url, function(response) {
  response.pipe(file);
  file.on("finish", () => {
    file.close();
    console.log("Download Completed");
  });
});
