const API_VERSION = '2022-11-28';

function encodeUtf8Base64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

async function githubRequest(url, token, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': API_VERSION,
      ...(init.headers || {}),
    },
  });
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || `GitHub respondeu com HTTP ${response.status}.`);
  }
  return payload;
}

export async function verifyGithubAccess({ token, owner, repo }) {
  return githubRequest(`https://api.github.com/repos/${owner}/${repo}`, token);
}

export async function publishSiteJson({ token, owner, repo, branch = 'main', path = 'public/content/site.json', site }) {
  const endpoint = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  let sha;
  try {
    const current = await githubRequest(`${endpoint}?ref=${encodeURIComponent(branch)}`, token);
    sha = current.sha;
  } catch (error) {
    if (!String(error.message).includes('Not Found')) throw error;
  }

  const body = {
    message: `content: atualizar site via painel administrativo`,
    content: encodeUtf8Base64(`${JSON.stringify(site, null, 2)}\n`),
    branch,
    ...(sha ? { sha } : {}),
  };
  return githubRequest(endpoint, token, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
