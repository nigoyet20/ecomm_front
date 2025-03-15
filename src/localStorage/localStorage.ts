export function addTokenStorage(token: string, csrfToken: string, sessionId: string) {
  localStorage.setItem('token', token);
  localStorage.setItem('csrf', csrfToken);
  localStorage.setItem('sessionId', sessionId);
}

export function deleteLocalStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('csrf');
  localStorage.removeItem('sessionId');
}