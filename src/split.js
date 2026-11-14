// Text splitting helpers for GSAP reveals.
export function splitChars(el) {
  if (!el) return [];
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  const chars = [];
  words.forEach((word, wi) => {
    const w = document.createElement('span');
    w.style.cssText = 'display:inline-block;white-space:nowrap';
    for (const ch of word) {
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = ch;
      w.appendChild(s);
      chars.push(s);
    }
    el.appendChild(w);
    if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
  });
  return chars;
}
export function splitWords(el) {
  if (!el) return [];
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ');
  return [...el.querySelectorAll('.w')];
}
