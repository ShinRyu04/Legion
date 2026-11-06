// Demo data for phase 03 shell layout. Real data starts in phase 06 (DB seed).
// Single source: never hardcode bot/thread rows anywhere else.
// Avatar: first letter of the name; accent pairs with textOn() contrast (lib/color.js).
export const DEMO_BOTS = [
  {
    id: 1,
    name: 'GLM',
    model_id: 'carte/zcode-bridge/glm-5.3-flash',
    accent_color: '#4ade80',
  },
  {
    id: 2,
    name: 'GPT-6',
    model_id: 'carte/agentrouter/gpt-6-astra',
    accent_color: '#fbbf24',
  },
  {
    id: 3,
    name: 'Gratis',
    model_id: 'carte/opencode2api/glm-5.3-flash-free',
    accent_color: '#60a5fa',
  },
];

export const DEMO_THREADS = [
  { id: 1, bot_id: 1, title: 'Ide nama proyek baru', updated_at: minutesAgo(2) },
  { id: 2, bot_id: 1, title: 'Rangkuman meeting kemarin', updated_at: minutesAgo(90) },
  { id: 3, bot_id: 2, title: 'Debug regex escapement', updated_at: minutesAgo(60 * 26) },
];

export const DEMO_MESSAGES = [
  { id: 1, thread_id: 1, role: 'user', content: 'Beri tiga ide nama untuk aplikasi chat lokal.', created_at: minutesAgo(3) },
  { id: 2, thread_id: 1, role: 'assistant', content: 'Tiga kandidat:\n1. Legion\n2. Batalyon\n3. Komando\nLegion paling pas: satu jendela, banyak bot.', created_at: minutesAgo(2) },
];

function minutesAgo(m) {
  return new Date(Date.now() - m * 60000).toISOString();
}
