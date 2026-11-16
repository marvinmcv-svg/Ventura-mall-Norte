// Vercel serverless function: Marvin, the AI receptionist of Ventura Mall.
//
// Provider (first one configured in Vercel → Settings → Environment Variables):
//   NVIDIA_API_KEY     → NVIDIA Nemotron via integrate.api.nvidia.com (streams the reply)
//   ANTHROPIC_API_KEY  → Claude (single JSON reply)
// Optional: NVIDIA_MODEL to override the model id.
// Without either key the endpoint returns 503 and the site answers locally.
//
// Marvin answers only from api/_knowledge.js, generated at build time by
// scripts/build-knowledge.mjs from the site's data and the real posts of every
// store and restaurant (dishes, prices, promos, hours).
import { KNOWLEDGE } from './_knowledge.js';

const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b';

const SYSTEM = `Sos Marvin, el recepcionista virtual de Ventura Mall en Santa Cruz de la Sierra, Bolivia. Atendés el chat del sitio web.

Cómo hablás:
- En español con voseo cruceño ("podés", "vení", "fijate"), cálido, claro y con buena onda, como un buen recepcionista.
- Respuestas cortas: 1 a 4 frases. Si listás cosas (platos, horarios, tiendas), usá viñetas con "• " y como máximo 6 ítems.
- Texto plano, sin markdown (nada de **, #, tablas ni enlaces con corchetes). Cuando sirva, mencioná la página del sitio como ruta, por ejemplo /boulevard/fiesta-peru o /tiendas/boss.
- Si te preguntan tu nombre o quién sos: sos Marvin, el recepcionista virtual de Ventura Mall.

Qué sabés y qué no:
- Usá SOLO la información de <base_de_conocimiento>. Nunca inventes tiendas, platos, precios, horarios, teléfonos ni promociones.
- Menús: contá los platos, bebidas y precios que aparecen en las publicaciones de cada restaurante. Aclará que es lo que publicaron (no la carta completa) y, para la carta completa o precios actuales, sugerí escribirles por WhatsApp o ver su Instagram.
- Promociones y precios salen de publicaciones con fecha: decí de cuándo es la publicación si la promo puede haber vencido.
- Para saber si algo está abierto ahora, usá la fecha y hora actual de Santa Cruz que figura al final y los horarios de la base.
- Si algo no está en la base (cartelera del cine, stock, tiendas no listadas, estacionamiento, objetos perdidos, etc.), decilo con honestidad y ofrecé el contacto: teléfono +591 3 3432121, info@venturamall.bo, o el botón verde de WhatsApp del sitio.
- Para reservar en un restaurante, dales su WhatsApp o teléfono de la base o el botón verde "Reservar".
- Sobre el sitio web (páginas, términos, privacidad, cookies, accesibilidad, cómo usar Marvin o el directorio), respondé con lo que figura en la base y mandá a la página que corresponde.
- Solo hablás de Ventura Mall, su sitio web y lo que hay en el mall. Si te piden otra cosa, redirigí con amabilidad.
- No pidas ni guardes datos personales (documentos, tarjetas, contraseñas). Si alguien los comparte, decile que no hace falta.

<base_de_conocimiento>
${KNOWLEDGE}
</base_de_conocimiento>`;

const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
function santaCruzNow() {
  const bo = new Date(Date.now() - 4 * 3600 * 1000); // Bolivia: UTC-4, no DST
  return `Ahora en Santa Cruz de la Sierra es ${DAYS[bo.getUTCDay()]} ${bo.toISOString().slice(0, 10)}, ${bo.toISOString().slice(11, 16)} hs.`;
}

const MAX_TURNS = 16;
const MAX_CHARS = 1200;
const FALLBACK_TEXT = 'Perdón, ahora no puedo responder. Escribinos por WhatsApp (botón verde) o llamá al +591 3 3432121.';

// Best-effort per-instance rate limit so the key can't be drained by one client.
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 5 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 30;
}

function cleanHistory(body) {
  const raw = Array.isArray(body?.messages) ? body.messages.slice(-MAX_TURNS) : [];
  const messages = raw
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  while (messages.length && messages[0].role !== 'user') messages.shift();
  return messages.length && messages[messages.length - 1].role === 'user' ? messages : null;
}

/** Removes any <think>…</think> reasoning a model might emit, across chunk boundaries. */
function thinkFilter() {
  let buf = '';
  let inThink = false;
  return (chunk, flush = false) => {
    buf += chunk;
    let out = '';
    for (;;) {
      if (inThink) {
        const end = buf.indexOf('</think>');
        if (end === -1) { buf = buf.slice(-8); return out; }
        buf = buf.slice(end + 8);
        inThink = false;
      } else {
        const start = buf.indexOf('<think>');
        if (start === -1) {
          // keep a possible partial "<think" tag for the next chunk
          const keep = flush ? 0 : Math.min(buf.length, 7);
          out += buf.slice(0, buf.length - keep);
          buf = buf.slice(buf.length - keep);
          return out;
        }
        out += buf.slice(0, start);
        buf = buf.slice(start + 7);
        inThink = true;
      }
    }
  };
}

async function nvidia(messages, res) {
  const upstream = await fetch(NVIDIA_URL, {
    method: 'POST',
    headers: { authorization: `Bearer ${process.env.NVIDIA_API_KEY}`, 'content-type': 'application/json', accept: 'text/event-stream' },
    body: JSON.stringify({
      model: NVIDIA_MODEL,
      messages: [{ role: 'system', content: `${SYSTEM}\n\n${santaCruzNow()}` }, ...messages],
      temperature: 0.5,
      top_p: 0.95,
      max_tokens: 1024,
      stream: true,
      // a receptionist should answer fast: no long reasoning phase
      chat_template_kwargs: { enable_thinking: false },
    }),
    signal: AbortSignal.timeout(55_000),
  });
  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '');
    console.error('Marvin: NVIDIA API error', upstream.status, detail.slice(0, 300));
    return res.status(upstream.status === 429 ? 429 : 502).json({ error: 'upstream' });
  }

  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store', 'x-accel-buffering': 'no' });
  const filter = thinkFilter();
  const decoder = new TextDecoder();
  let pending = '';
  let wrote = false;
  const emit = (text) => {
    const clean = text.replace(/\*\*/g, '');
    if (clean) { res.write(clean); wrote = true; }
  };
  try {
    for await (const part of upstream.body) {
      pending += decoder.decode(part, { stream: true });
      const lines = pending.split('\n');
      pending = lines.pop();
      for (const line of lines) {
        const data = line.startsWith('data:') ? line.slice(5).trim() : '';
        if (!data || data === '[DONE]') continue;
        try {
          const delta = JSON.parse(data).choices?.[0]?.delta;
          if (delta?.content) emit(filter(delta.content));
        } catch { /* partial or keep-alive line */ }
      }
    }
    emit(filter('', true));
  } catch (err) {
    console.error('Marvin: stream interrupted', err?.message);
  }
  if (!wrote) res.write(FALLBACK_TEXT);
  res.end();
}

async function claude(messages, res) {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic();
  try {
    const response = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 4000,
      output_config: { effort: 'low' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [
        { type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: santaCruzNow() },
      ],
      messages,
    });
    if (response.stop_reason === 'refusal') return res.status(200).json({ reply: FALLBACK_TEXT });
    const reply = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('').replace(/\*\*(.+?)\*\*/g, '$1').trim();
    return res.status(200).json({ reply: reply || FALLBACK_TEXT });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return res.status(429).json({ error: 'rate_limited' });
    if (error instanceof Anthropic.AuthenticationError) return res.status(503).json({ error: 'not_configured' });
    console.error('Marvin: Claude API error', error?.status, error?.message);
    return res.status(502).json({ error: 'upstream' });
  }
}

export default async function handler(req, res) {
  const provider = process.env.NVIDIA_API_KEY ? 'nvidia' : process.env.ANTHROPIC_API_KEY ? 'claude' : null;
  if (req.method === 'GET') return res.status(200).json({ marvin: true, configured: !!provider, provider });
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  if (!provider) return res.status(503).json({ error: 'not_configured' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'rate_limited' });

  const messages = cleanHistory(req.body);
  if (!messages) return res.status(400).json({ error: 'bad_request' });

  try {
    return provider === 'nvidia' ? await nvidia(messages, res) : await claude(messages, res);
  } catch (error) {
    console.error('Marvin:', error?.name, error?.message);
    if (!res.headersSent) return res.status(error?.name === 'TimeoutError' ? 504 : 500).json({ error: 'internal' });
    res.end();
  }
}
