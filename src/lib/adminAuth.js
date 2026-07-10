const SESSION_KEY = 'fael-records-admin-session';

function bytesFromBase64(value) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) result |= left[index] ^ right[index];
  return result === 0;
}

export async function authenticateAdmin(username, password) {
  const response = await fetch('/admin-config.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('Configuração administrativa não encontrada.');
  const config = await response.json();
  if (username !== config.username) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: bytesFromBase64(config.salt),
      iterations: config.iterations,
      hash: 'SHA-256',
    },
    key,
    256,
  );
  return constantTimeEqual(new Uint8Array(derived), bytesFromBase64(config.hash));
}

export function startAdminSession() {
  sessionStorage.setItem(SESSION_KEY, String(Date.now()));
}

export function hasAdminSession() {
  return Boolean(sessionStorage.getItem(SESSION_KEY));
}

export function endAdminSession() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem('fael-records-github-token');
}
