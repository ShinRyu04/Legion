import React from 'react';
import { useStore, useDispatch } from '../store.jsx';
import { DEMO_BOTS, DEMO_THREADS } from '../lib/demoData.js';
import { relTime } from '../lib/time.js';

export default function Sidebar() {
  const state = useStore();
  const dispatch = useDispatch();
  const threads = DEMO_THREADS.filter((t) => t.bot_id === state.activeBotId);

  return (
    <aside className="w-[280px] shrink-0 h-full flex flex-col bg-[var(--bg-elev)] border-r border-[var(--border)]">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[18px] font-semibold tracking-tight text-[var(--text)]">LEGION</span>
          <span className="text-[11px] text-[var(--muted)]">v0.1.0</span>
        </div>
        <button
          type="button"
          className="mt-3 w-full px-3 py-2 rounded-md bg-[var(--accent)] text-[var(--accent-text)] text-[13px] font-medium cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-40"
          aria-label="Tambah bot baru"
        >
          + Bot
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-3" aria-label="Bot dan thread">
        <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">Bots</div>
        {DEMO_BOTS.map((bot) => {
          const active = bot.id === state.activeBotId;
          return (
            <button
              key={bot.id}
              type="button"
              onClick={() => dispatch({ type: 'selectBot', id: bot.id })}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md mb-0.5 text-left cursor-pointer transition-colors ${
                active
                  ? 'bg-[var(--bg-elev2)] ring-1 ring-inset'
                  : 'hover:bg-[var(--bg-elev2)]'
              }`}
              style={active ? { boxShadow: `inset 0 0 0 1px ${bot.accent_color}55` } : undefined}
              aria-current={active ? 'true' : undefined}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-[16px] shrink-0"
                style={{ backgroundColor: `${bot.accent_color}22` }}
                aria-hidden="true"
              >
                {bot.avatar}
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] text-[var(--text)] truncate">{bot.name}</span>
                <span className="block text-[11px] text-[var(--muted)] truncate">{bot.model_id}</span>
              </span>
            </button>
          );
        })}

        <div className="px-2 pt-3 pb-1 text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
          Threads{state.activeBotId ? '' : ' (pilih bot)'}
        </div>
        {threads.map((t) => {
          const active = t.id === state.activeThreadId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => dispatch({ type: 'selectThread', id: t.id })}
              className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md mb-0.5 text-left cursor-pointer transition-colors ${
                active ? 'bg-[var(--bg-elev2)]' : 'hover:bg-[var(--bg-elev2)]'
              }`}
              aria-current={active ? 'true' : undefined}
            >
              <span className="text-[13px] text-[var(--text)] truncate">{t.title}</span>
              <span className="text-[11px] text-[var(--muted)] shrink-0">{relTime(t.updated_at)}</span>
            </button>
          );
        })}
        {state.activeBotId && threads.length === 0 && (
          <p className="px-2.5 py-1 text-[12px] text-[var(--muted)]">Belum ada thread.</p>
        )}
      </nav>
    </aside>
  );
}
