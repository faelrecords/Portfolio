import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { writeFile } from 'node:fs/promises';

const username = process.argv[2];
const password = process.argv[3];
if (!username || !password) {
  console.error('Uso: npm run admin:hash -- <usuario> <senha>');
  process.exit(1);
}
if (password.length < 10) {
  console.error('Use uma senha com pelo menos 10 caracteres.');
  process.exit(1);
}
const iterations = 310_000;
const salt = randomBytes(24);
const hash = pbkdf2Sync(password, salt, iterations, 32, 'sha256');
const config = {
  username,
  iterations,
  salt: salt.toString('base64'),
  hash: hash.toString('base64'),
  algorithm: 'PBKDF2-SHA256',
  note: 'Barreira local. A autorização de publicação depende de um token GitHub com permissão restrita.'
};
await writeFile('public/admin-config.json', JSON.stringify(config, null, 2) + '\n');
console.log('public/admin-config.json atualizado sem armazenar a senha em texto puro.');
