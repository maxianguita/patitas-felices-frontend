const KEY = 'patitas-actividad';
const validToken = /^[a-f0-9]{64}$/;
const MAX = 50;
export function activityLink(kind, token) {
  return kind === 'aviso' ? '/avisos/gestion/' + token : '/mi-solicitud/' + token;
}
export function parseActivityLink(value) {
  try {
    const url = new URL(String(value).trim(), window.location.origin);
    if (url.origin !== window.location.origin) return null;
    const notice = url.pathname.match(/^\/avisos\/gestion\/([a-f0-9]{64})\/?$/),
      request = url.pathname.match(/^\/mi-solicitud\/([a-f0-9]{64})\/?$/);
    if (!notice && !request) return null;
    return {
      kind: notice ? 'aviso' : 'solicitud',
      token: (notice || request)[1]
    };
  } catch {
    return null;
  }
}
export function readActivity() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(data)) return [];
    const seen = new Set();
    return data.filter(item => {
      if (!item || !['aviso', 'solicitud'].includes(item.kind) || typeof item.token !== 'string' || !validToken.test(item.token)) return false;
      const id = item.kind + ':' + item.token;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    }).slice(0, MAX).map(item => ({
      kind: item.kind,
      token: item.token,
      title: typeof item.title === 'string' ? item.title.slice(0, 150) : '',
      addedAt: typeof item.addedAt === 'string' ? item.addedAt : ''
    }));
  } catch {
    return [];
  }
}
function save(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('patitas-activity'));
}
export function rememberActivity(url, title = '') {
  const parsed = parseActivityLink(url);
  if (!parsed) return false;
  try {
    const current = readActivity(),
      index = current.findIndex(item => item.kind === parsed.kind && item.token === parsed.token);
    if (index < 0 && current.length >= MAX) return false;
    if (index >= 0) {
      if (title && current[index].title !== title) {
        current[index].title = title;
        save(current);
      }
      return true;
    }
    save([{
      ...parsed,
      title,
      addedAt: new Date().toISOString()
    }, ...current]);
    return true;
  } catch {
    return false;
  }
}
export function forgetActivity(kind, token) {
  try {
    save(readActivity().filter(item => item.kind !== kind || item.token !== token));
    return true;
  } catch {
    return false;
  }
}
