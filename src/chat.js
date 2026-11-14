// Ventura Mall assistant. Talks to /api/chat (Claude, grounded on src/data.js).
// If the API is unavailable (no key configured, offline), it answers from the
// same verified data locally and always offers the WhatsApp funnel.
import gsap from 'gsap';
import { mall, stores as brands, restaurants as boulevard, events } from './data.js';

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const SUGGESTIONS = ['¿Qué horario tienen hoy?', '¿Dónde queda BOSS?', 'Quiero reservar en el Boulevard', '¿Qué eventos hay esta semana?'];

function localAnswer(q) {
  const t = norm(q);
  const store = brands.find((b) => t.includes(norm(b.name).replace(/’/g, "'")) || t.includes(norm(b.name)));
  if (store) {
    return `${store.name} está en Ventura Mall${store.where ? `, ${store.where}` : ''}.${store.whatsapp ? ` Podés escribirles por WhatsApp al +${store.whatsapp}.` : ''} Mirá su página: ${location.origin}/tiendas/${store.slug}`;
  }
  const rest = boulevard.find((r) => t.includes(norm(r.name)));
  if (rest) return `${rest.name} (${rest.cuisine}) está en el Boulevard de Ventura Mall.${rest.wa ? ' Podés reservar por WhatsApp desde su página:' : ' Más info:'} ${location.origin}/boulevard/${rest.slug}`;
  if (/horari|hora|abre|abier|cierra/.test(t)) return mall.hours.map((h) => `• ${h.label}: ${h.value}`).join('\n');
  if (/donde|direcc|ubica|llegar|mapa/.test(t)) return `Estamos en ${mall.address}, ${mall.city}. En la sección "Visítanos" tenés el mapa y el botón "Cómo llegar".`;
  if (/reserv|boulevard|restaur|comer|cena|almuerzo/.test(t)) return `En el Boulevard tenés ${boulevard.map((r) => r.name).join(', ')}. Abrí el botón verde de WhatsApp → "Reservar en el Boulevard" y elegí el restaurante.`;
  if (/event|musica|show|concierto|fin de semana|viernes|sabado/.test(t)) return `Ruta Boulevard trae música en vivo: ${events.map((e) => `${e.title} (${e.when}, ${e.where})`).join('; ')}. Seguí @venturamalloficial para la agenda de cada semana.`;
  if (/cine|pelicula|imax/.test(t)) return 'Ventura Mall tiene 13 salas de cine, entre ellas una sala IMAX de 16 × 21 metros y cuatro salas VIP.';
  if (/telefono|contact|llamar|email|correo/.test(t)) return `Llamanos al ${mall.phone} o escribí a ${mall.email}. Para el Boulevard, WhatsApp +${mall.whatsapp.number}.`;
  if (/sur/.test(t)) return 'Ventura Sur ya está abierto al público. La gran inauguración oficial es el 28 de noviembre.';
  return `Puedo ayudarte con horarios, tiendas, el Boulevard, eventos y cómo llegar. Para algo más específico, escribinos por WhatsApp (botón verde) o llamá al ${mall.phone}.`;
}

export function initChat({ closePanels }) {
  const panel = $('[data-chat]');
  const log = $('[data-chat-log]');
  const form = $('[data-chat-form]');
  const input = $('[data-chat-input]');
  const chips = $('[data-chat-chips]');
  const history = [];
  let busy = false;
  let apiDown = false;

  const add = (role, text) => {
    const el = document.createElement('div');
    el.className = `msg msg--${role}`;
    el.innerHTML = esc(text).replace(/\n/g, '<br />');
    log.appendChild(el);
    gsap.fromTo(el, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
    log.scrollTop = log.scrollHeight;
    return el;
  };

  chips.innerHTML = SUGGESTIONS.map((s) => `<button type="button">${esc(s)}</button>`).join('');
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) ask(b.textContent);
  });

  async function ask(text) {
    text = text.trim();
    if (!text || busy) return;
    busy = true;
    chips.hidden = true;
    add('user', text);
    history.push({ role: 'user', content: text });
    const typing = add('bot', '…');
    typing.classList.add('is-typing');
    let reply = '';
    if (!apiDown) {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ messages: history.slice(-12) }),
        });
        if (!res.ok) throw new Error(String(res.status));
        reply = (await res.json()).reply || '';
      } catch {
        apiDown = true;
      }
    }
    if (!reply) reply = localAnswer(text);
    typing.remove();
    add('bot', reply);
    history.push({ role: 'assistant', content: reply });
    busy = false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = '';
    ask(v);
  });

  document.querySelectorAll('[data-open-chat]').forEach((b) =>
    b.addEventListener('click', () => {
      closePanels();
      panel.hidden = false;
      if (!log.children.length) add('bot', `¡Hola! Soy el asistente de ${mall.name}. ¿En qué te ayudo?`);
      gsap.fromTo(panel, { y: 30, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
      setTimeout(() => input.focus(), 50);
    })
  );
}
