// Kopierer kun filene som skal publiseres til dist/.
// Arbeidsnotater (*.md), .git, .vercel osv. blir ikke med.
import { cpSync, mkdirSync, readdirSync, rmSync } from 'node:fs';

const OUT = 'dist';
const DIRS = ['assets', 'css', 'js'];
const FILES = ['robots.txt', 'sitemap.xml', 'site.webmanifest', '_headers', '_redirects'];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);
// assets/originals = store originalfiler (kun for oss), publiseres ikke.
for (const dir of DIRS) cpSync(dir, `${OUT}/${dir}`, {
	recursive: true,
	filter: src => !src.replaceAll('\\', '/').includes('assets/originals'),
});
for (const file of FILES) cpSync(file, `${OUT}/${file}`);
const pages = readdirSync('.').filter(name => name.endsWith('.html'));
for (const page of pages) cpSync(page, `${OUT}/${page}`);

console.log(`dist/ klar: ${pages.length} sider + ${DIRS.join(', ')}`);
