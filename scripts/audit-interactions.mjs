import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx|ts)$/.test(entry.name)) files.push(full);
  }
}
walk(root);

const routeFiles = new Set();
for (const file of files.filter(f => f.includes(`${path.sep}routes${path.sep}`))) {
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/createFileRoute\(["']([^"']+)["']\)/);
  if (match) {
    const route = match[1].replace('/_authenticated', '');
    routeFiles.add(route);
  }
}
routeFiles.add('/');

const issues = [];
const info = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const rel = path.relative(process.cwd(), file);
  const lines = text.split(/\r?\n/);

  const buttonTags = [...text.matchAll(/<Button\b[\s\S]*?>/g)];
  for (const match of buttonTags) {
    const before = text.slice(0, match.index);
    const line = before.split(/\r?\n/).length;
    const tag = match[0];
    const context = text.slice(match.index, match.index + 1200);
    const wrappedByTrigger = text.slice(Math.max(0, match.index - 180), match.index).includes('<SheetTrigger');
    if (!/onClick\s*=|type=["']submit["']|asChild/.test(context) && !wrappedByTrigger && !rel.endsWith('components/ui/calendar.tsx') && !rel.endsWith('components/ui/carousel.tsx') && !rel.endsWith('components/ui/sidebar.tsx')) {
      issues.push(`${rel}:${line}: Button has no nearby onClick, submit type, or asChild`);
    }
    if (/onClick\s*=\{\s*\(?(?:[^)]*)\)?\s*=>\s*(?:null|undefined)\s*\}/.test(tag)) {
      issues.push(`${rel}:${line}: onClick appears to be a no-op`);
    }
  }
  if (/href\s*=\s*["']#/.test(text)) {
    const line = text.slice(0, text.indexOf('#')).split(/\r?\n/).length;
    issues.push(`${rel}:${line}: placeholder href detected`);
  }

  for (const match of text.matchAll(/to=["'](\/[A-Za-z0-9_.$?=&{}-]+)["']/g)) {
    const to = match[1].replace('/_authenticated', '');
    if (to.includes('$')) continue;
    if (!routeFiles.has(to)) info.push(`${rel}: link target ${to} should be manually verified`);
  }
}

console.log(`Audited ${files.length} TypeScript/TSX files.`);
console.log(`Known route declarations: ${routeFiles.size}.`);
console.log(`Potential interaction issues: ${issues.length}`);
for (const issue of issues) console.log(`ISSUE ${issue}`);
console.log(`\nLinks requiring runtime/manual verification: ${new Set(info).size}`);
for (const item of new Set(info)) console.log(`CHECK ${item}`);
process.exitCode = issues.length ? 1 : 0;
