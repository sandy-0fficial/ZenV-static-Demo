import { readdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root = dirname(fileURLToPath(import.meta.url));
const pages = (await readdir(root)).filter(f => f.endsWith('.html'));
// All deployable paths are explicit: no original project files or development dependencies.
execFileSync('python3', ['-c', `import os, zipfile\nroot=${JSON.stringify(root)}\nwith zipfile.ZipFile(os.path.join(root,'zenv-static-website.zip'),'w',zipfile.ZIP_DEFLATED) as z:\n for name in ${JSON.stringify([...pages, 'settings.js', 'README.md'])}:\n  z.write(os.path.join(root,name), name)\n for directory in ['products','assets','images','licenses']:\n  for folder, dirs, files in os.walk(os.path.join(root,directory)):\n   for name in files:\n    path=os.path.join(folder,name)\n    z.write(path,os.path.relpath(path,root))\n`], { stdio: 'inherit' });
console.log('Packaged static-site/zenv-static-website.zip — extract and open index.html.');
