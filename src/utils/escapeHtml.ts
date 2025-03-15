export function escapeHtml(str: string) {
  return str.replace(/[&<>"']/g, function (match) {
    const escapeChars: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return escapeChars[match];
  });
}
