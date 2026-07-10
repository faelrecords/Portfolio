import { copyFile, mkdir } from 'node:fs/promises';

await mkdir('dist/home', { recursive: true });
await mkdir('dist/adm', { recursive: true });
await copyFile('dist/index.html', 'dist/404.html');
console.log('Build preparado para GitHub Pages.');
