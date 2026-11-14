// Vercel serverless function: Ventura Mall assistant powered by Claude.
// Requires the ANTHROPIC_API_KEY environment variable in the Vercel project.
// Answers only from the verified mall data in src/data.js.
import Anthropic from '@anthropic-ai/sdk';
import { mall, brands, boulevard, events, categories } from '../src/data.js';

const client = new Anthropic();

const catName = Object.fromEntries(categories.map((c) => [c.id, c.name]));
const KNOWLEDGE = [
  `Nombre: ${mall.name} (Ventura Norte). Lema: "${mall.tagline}" ${mall.hashtag}.`,
  `Dirección: ${mall.address}, ${mall.city}. Teléfono: ${mall.phone}. Email: ${mall.email}.`,
  `Horarios: ${mall.hours.map((h) => `${h.label}: ${h.value}`).join(' | ')}.`,
  `Datos: 110.000 m² construidos; 13 salas de cine con una sala IMAX de 16×21 m y cuatro salas VIP; 4 plantas y un subsuelo; inaugurado el 30 de enero de 2014; estaciones de carga para autos eléctricos.`,
  `Redes: Instagram ${mall.socials.instagram.handle}, TikTok ${mall.socials.tiktok.handle}, Facebook ${mall.socials.facebook.handle}.`,
  `WhatsApp del Boulevard: +${mall.whatsapp.number}.`,
  `Tiendas: ${brands.map((b) => `${b.name} (${catName[b.cat]}${b.where ? `, ${b.where}` : ''}${b.whatsapp ? `, WhatsApp +${b.whatsapp}` : ''})`).join('; ')}.`,
  `Boulevard (restaurantes y bares): ${boulevard.map((r) => `${r.name} (${r.cuisine})`).join('; ')}. Las reservas se hacen por WhatsApp desde la sección Boulevard del sitio.`,
  `Ruta Boulevard (música en vivo, ejemplos recientes): ${events.map((e) => `${e.title} — ${e.when}, ${e.where}`).join('; ')}.`,
  `Ventura Sur es el nuevo mall del grupo: ya abrió al público y su inauguración oficial es el 28 de noviembre.`,
].join('\n');

const SYSTEM = `Sos el asistente virtual del sitio web de Ventura Mall en Santa Cruz de la Sierra, Bolivia.
Respondé en español rioplatense-boliviano (voseo: "podés", "vení"), con calidez y en 1 a 4 frases cortas, sin markdown.
Usá SOLO la información de la base de conocimiento. Si algo no está ahí (precios, stock, promociones específicas, cartelera del cine, tiendas no listadas), decí con honestidad que no tenés ese dato y sugerí escribir por WhatsApp (botón verde del sitio) o llamar al ${mall.phone}. Nunca inventes tiendas, horarios ni números.
Cuando la persona quiera reservar o comprar, guiala al botón verde de WhatsApp.

<base_de_conocimiento>
${KNOWLEDGE}
</base_de_conocimiento>`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'not_configured' });

  const raw = Array.isArray(req.body?.messages) ? req.body.messages.slice(-12) : [];
  const messages = raw
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));
  if (!messages.length || messages[0].role !== 'user') return res.status(400).json({ error: 'bad_request' });

  try {
    const response = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 1024,
      output_config: { effort: 'low' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
      messages,
    });
    if (response.stop_reason === 'refusal') {
      return res.status(200).json({ reply: `No puedo ayudarte con eso. Para cualquier consulta sobre el mall escribinos por WhatsApp o llamá al ${mall.phone}.` });
    }
    const reply = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();
    return res.status(200).json({ reply });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return res.status(429).json({ error: 'rate_limited' });
    if (error instanceof Anthropic.APIError) {
      console.error('Claude API error', error.status, error.message);
      return res.status(502).json({ error: 'upstream' });
    }
    console.error(error);
    return res.status(500).json({ error: 'internal' });
  }
}
