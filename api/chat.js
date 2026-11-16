// Vercel serverless function: Marvin, the AI receptionist of Ventura Mall.
// Requires the ANTHROPIC_API_KEY environment variable in the Vercel project
// (Settings → Environment Variables). Without it the endpoint returns 503 and
// the site falls back to local answers.
//
// Marvin answers only from api/_knowledge.js, generated at build time by
// scripts/build-knowledge.mjs from the site's verified data and the real posts
// of every store and restaurant (dishes, prices, promos, hours).
import Anthropic from '@anthropic-ai/sdk';
import { KNOWLEDGE } from './_knowledge.js';

const client = new Anthropic();

// Stable prefix (cached): persona + rules + knowledge. Nothing time-dependent here.
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
- Para saber si algo está abierto ahora, usá la fecha y hora actual de Santa Cruz que te paso aparte y los horarios de la base.
- Si algo no está en la base (cartelera del cine, stock, tiendas no listadas, estacionamiento, objetos perdidos, etc.), decilo con honestidad y ofrecé el contacto: teléfono +591 3 3432121, info@venturamall.bo, o el botón verde de WhatsApp del sitio.
- Para reservar en un restaurante, dales su WhatsApp o teléfono de la base o el botón verde "Reservar".
- Solo hablás de Ventura Mall y lo que hay en él. Si te piden otra cosa, redirigí con amabilidad.
- No pidas ni guardes datos personales (documentos, tarjetas, contraseñas). Si alguien los comparte, decile que no hace falta.

<base_de_conocimiento>
${KNOWLEDGE}
</base_de_conocimiento>`;

const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
function santaCruzNow() {
  const bo = new Date(Date.now() - 4 * 3600 * 1000); // Bolivia: UTC-4, no DST
  const date = bo.toISOString().slice(0, 10);
  const time = bo.toISOString().slice(11, 16);
  return `Ahora en Santa Cruz de la Sierra es ${DAYS[bo.getUTCDay()]} ${date}, ${time} hs.`;
}

const MAX_TURNS = 16;
const MAX_CHARS = 1200;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'not_configured' });

  const raw = Array.isArray(req.body?.messages) ? req.body.messages.slice(-MAX_TURNS) : [];
  const messages = raw
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  while (messages.length && messages[0].role !== 'user') messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== 'user') return res.status(400).json({ error: 'bad_request' });

  try {
    const response = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 4000,
      output_config: { effort: 'low' }, // quick, conversational answers
      // If the model declines for a safety reason, retry on a fallback model in the same call.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [
        { type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } },
        // volatile: after the cache breakpoint so the knowledge base stays cached
        { type: 'text', text: santaCruzNow() },
      ],
      messages,
    });

    if (response.stop_reason === 'refusal') {
      return res.status(200).json({ reply: 'Disculpá, con eso no te puedo ayudar. Si es algo del mall, escribinos por WhatsApp (botón verde) o llamá al +591 3 3432121.' });
    }
    const reply = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .trim();
    return res.status(200).json({ reply: reply || 'Perdón, no te entendí bien. ¿Me lo preguntás de otra forma?' });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return res.status(429).json({ error: 'rate_limited' });
    if (error instanceof Anthropic.AuthenticationError) {
      console.error('Marvin: invalid ANTHROPIC_API_KEY');
      return res.status(503).json({ error: 'not_configured' });
    }
    if (error instanceof Anthropic.APIError) {
      console.error('Marvin: Claude API error', error.status, error.message);
      return res.status(502).json({ error: 'upstream' });
    }
    console.error('Marvin:', error);
    return res.status(500).json({ error: 'internal' });
  }
}
