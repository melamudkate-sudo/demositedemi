const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
if (new Set(ids).size !== ids.length) throw Error('Duplicate HTML IDs');
for (const [, target] of html.matchAll(/(?:src|href|poster)="([^"]+)"/g)) {
  if (target.startsWith('#')) {
    if (!ids.includes(target.slice(1))) throw Error(`Missing anchor: ${target}`);
    continue;
  }
  if (/^(https?:|mailto:)/.test(target)) continue;
  if (!fs.existsSync(path.join(root, target.split(/[?#]/)[0]))) throw Error(`Missing file: ${target}`);
}
for (const [, references] of html.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g)) {
  for (const id of references.split(/\s+/)) {
    if (!ids.includes(id)) throw Error(`Missing interaction target: ${id}`);
  }
}
for (const file of fs.readdirSync(path.join(root, 'assets/css'))) {
  const directory = path.join(root, 'assets/css');
  const css = fs.readFileSync(path.join(directory, file), 'utf8');
  for (const match of css.matchAll(/url\(\s*(?:"([^"]+)"|'([^']+)'|([^\s)]+))\s*\)/g)) {
    const target = match[1] || match[2] || match[3];
    if (/^(data:|https?:|#)/.test(target)) continue;
    if (!fs.existsSync(path.resolve(directory, target.split(/[?#]/)[0]))) throw Error(`Missing CSS asset in ${file}: ${target}`);
  }
}
for (const file of fs.readdirSync(path.join(root, 'assets/js'))) {
  const script = fs.readFileSync(path.join(root, 'assets/js', file), 'utf8');
  new vm.Script(script, { filename: file });
  for (const [, target] of script.matchAll(/['"](assets\/[^'"\s]+)['"]/g)) {
    if (!fs.existsSync(path.join(root, target.split(/[?#]/)[0]))) throw Error(`Missing JavaScript asset in ${file}: ${target}`);
  }
}
console.log('PASS: local assets, navigation anchors, interaction targets, unique IDs and JavaScript syntax');

const sections = [...html.matchAll(/<(?:section|footer)\b[^>]*data-section="(\d+)"/g)].map(m => m[1]);
if (sections.join(',') !== Array.from({length:13},(_,i)=>String(i+1).padStart(2,'0')).join(',')) throw Error('Section sequence must be 01–13');
if ((html.match(/data-app-slide="/g)||[]).length !== 9) throw Error('Expected nine app slides');
if ((html.match(/class="app-mockup"/g)||[]).length !== 7) throw Error('Expected seven final mockup compositions');
if (/class="app-device|Close ×|app-story-chapter-copy/.test(html)) throw Error('Obsolete app or menu markup');
for (const [,target] of html.matchAll(/(?:src|href|poster)="([^"#]+)"/g)) {
  if (target.startsWith('/') || target.includes('file:')) throw Error('Use repository-relative assets: ' + target);
}
console.log('PASS: 13 sections, nine app slides, seven final mockups and Pages-relative paths');

const sectionTargets = [...html.matchAll(/<(?:section|footer)\b[^>]*id="([^"]+)"[^>]*data-section="(\d+)"/g)].map(m => [m[1], m[2]]);
const menu = html.match(/<div class="section-menu-grid">(.*?)<\/div>/s)[1];
const menuTargets = [...menu.matchAll(/<a href="#([^"]+)"><b>(\d+)<\/b>/g)].map(m => [m[1], m[2]]);
if (JSON.stringify(sectionTargets) !== JSON.stringify(menuTargets)) throw Error('Section navigation must match all 13 chapters');
if (/id="commercial"|href="#commercial"|COMMERCIAL MODEL/i.test(html)) throw Error('Removed commercial section remains');
