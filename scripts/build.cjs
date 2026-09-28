const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
// dist is generated exclusively by this script; source assets are never removed.
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
for (const entry of ['index.html', '.nojekyll', 'assets']) {
  fs.cpSync(path.join(root, entry), path.join(output, entry), { recursive: true, filter: source => path.basename(source) !== '.DS_Store' });
}
console.log('Site built in dist/');
// Optional local export: every successful build refreshes the upload-ready folder.
// The machine-specific path is deliberately excluded from Git.
const exportConfig = path.join(root, '.pages-export-path');
const exportPath = process.env.DEMIAND_EXPORT_DIR || (fs.existsSync(exportConfig) ? fs.readFileSync(exportConfig, 'utf8').trim() : '');
if (exportPath) {
  const destination = path.resolve(root, exportPath);
  if (destination === root || root.startsWith(destination + path.sep) || destination === output) {
    throw Error('Choose a separate Pages export folder, not the source or dist directory.');
  }
  fs.mkdirSync(destination, { recursive:true });
  fs.cpSync(output, destination, { recursive:true });
  fs.copyFileSync(path.join(root, 'PUBLISHING.md'), path.join(destination, 'README.md'));
  console.log('GitHub Pages ready: ' + destination);
}
