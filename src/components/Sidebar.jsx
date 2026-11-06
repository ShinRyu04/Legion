import React from 'react';
import { useStore, useDispatch } from '../store.jsx';
import { DEMO_BOTS, DEMO_THREADS } from '../lib/demoData.js';
import { relTime } from '../lib/time.js';
import { IconPlus } from './icons.jsx';
import { useTheme } from '../theme.jsx';
import { accentInk, SURFACES } from '../lib/color.js';

function BotAvatar({ bot, size = 32 }) {
  const { theme } = useTheme();
  return (
    <span
      className="flex items-center justify-center rounded-md shrink-0 font-medium"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        backgroundColor: `${bot.accent_color}1f`,
        color: accentInk(bot.accent_color, SURFACES[theme] || SURFACES.dark),
      }}
      aria-hidden="true"
    >
      {bot.name.charAt(0)}
    </span>
  );
}

export { BotAvatar };

export default function Sidebar() {
  const state = useStore();
  const dispatch = useDispatch();
  const threads = DEMO_THREADS.filter((t) => t.bot_id === state.activeBotId);

  return (
    <aside className="w-[280px] shrink-0 h-full flex flex-col bg-[var(--bg-elev)] border-r border-[var(--border)]">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[15px] font-medium text-[var(--text)]">Legion</span>
          <span className="text-[11px] text-[var(--muted)] tabular-nums">v0.1.0</span>
        </div>
        <button
          type="button"
          className="mt-3 w-full h-8 px-3 rounded-md border border-[var(--border)] bg-[var(--bg-elev2)] text-[var(--text)] text-[13px] font-medium cursor-pointer hover:border-[var(--muted)] transition-colors flex items-center justify-center gap-1.5"
          aria-label="Tambah bot baru"
        >
          <IconPlus size={14} />
          Bot
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-3" aria-label="Bot dan thread">
        <div className="px-2 pt-2 pb-1.5 text-[12px] text-[var(--muted)]">Bot</div>
        {DEMO_BOTS.map((bot) => {
          const active = bot.id === state.activeBotId;
          return (
            <button
              key={bot.id}
              type="button"
              onClick={() => dispatch({ type: 'selectBot', id: bot.id })}
              className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md mb-0.5 text-left cursor-pointer transition-colors ${
                active ? 'bg-[var(--bg-elev2)]' : 'hover:bg-[var(--bg-elev2)]'
              }`}
              style={active ? { boxShadow: `inset 2px 0 0 0 ${bot.accent_color}` } : undefined}
              aria-current={active ? 'true' : undefined}
            >
              <BotAvatar bot={bot} />
              <span className="min-w-0">
                <span className="block text-[13px] text-[var(--text)] truncate leading-tight">{bot.name}</span>
                <span className="block text-[11px] text-[var(--muted)] truncate leading-tight">{bot.model_id}</span>
              </span>
            </button>
          );
        })}

        <div className="px-2 pt-4 pb-1.5 text-[12px] text-[var(--muted)]">
          Thread{state.activeBotId ? '' : ' - pilih bot'}
        </div>
        {threads.map((t) => {
          const active = t.id === state.activeThreadId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => dispatch({ type: 'selectThread', id: t.id })}
              className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md mb-0.5 text-left cursor-pointer transition-colors ${
                active ? 'bg-[var(--bg-elev2)]' : 'hover:bg-[var(--bg-elev2)]'
              }`}
              aria-current={active ? 'true' : undefined}
            >
              <span className="text-[13px] text-[var(--text)] truncate">{t.title}</span>
              <span className="text-[11px] text-[var(--muted)] shrink-0 tabular-nums">{relTime(t.updated_at)}</span>
            </button>
          );
        })}
        {state.activeBotId && threads.length === 0 && (
          <p className="px-2 py-1.5 text-[12px] text-[var(--muted)]">Belum ada thread</p>
        )}
      </nav>
    </aside>
  );
}
