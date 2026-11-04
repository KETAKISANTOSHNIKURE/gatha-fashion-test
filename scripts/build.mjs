import fs from 'node:fs/promises';
import path from 'node:path';
// Netlify runs the build command from the configured base directory. Using
// cwd also avoids resolving the workspace parent's real path in sandboxed runs.
const root=process.cwd();
const output=path.join(root,'public');
const files=['index.html','app.js','inventory.js','styles.css','inventory.css','theme.css','fashion-illustration.svg','fashion-reference-cutout.png','gatha-emblem.png'];
await fs.rm(output,{recursive:true,force:true});
await fs.mkdir(output,{recursive:true});
for(const file of files)await fs.copyFile(path.join(root,file),path.join(output,file));
const apiBase=process.env.GATHA_API_BASE||'';
await fs.writeFile(path.join(output,'gatha-config.js'),`window.GATHA_API_BASE=${JSON.stringify(apiBase)};\n`);
console.log(`Prepared ${files.length} public app files.`);
