import React from 'react';
import { useStore } from '../store.jsx';
import { DEMO_MESSAGES, DEMO_THREADS } from '../lib/demoData.js';
import { clockTime } from '../lib/time.js';
import EmptyState from './EmptyState.jsx';

// Placeholder bubbles from demo constants, clearly examples until phase 06 wires the DB.
export default function ChatArea() {
  const state = useStore();
  const bot = state.activeBotId;
  const thread = DEMO_THREADS.find((t) => t.id === state.activeThreadId);

  if (!bot) {
    return (
      <EmptyState
        title="Pilih bot untuk mulai chat"
        hint="Pilih salah satu bot di sidebar kiri, atau buat bot baru."
      />
    );
  }

  const messages = thread ? DEMO_MESSAGES.filter((m) => m.thread_id === thread.id) : [];
  if (!thread || messages.length === 0) {
    return (
      <EmptyState
        title="Belum ada pesan"
        hint="Tulis pesan pertama untuk thread ini. Pesan tersimpan lokal."
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      <div className="max-w-[820px] mx-auto flex flex-col gap-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-lg text-[14px] leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-[var(--bg-elev2)] text-[var(--text)]'
                  : 'bg-[var(--bg-elev)] border border-[var(--border)] text-[var(--text)]'
              }`}
            >
              {m.content}
            </div>
            <span className="text-[11px] text-[var(--muted)] mt-1 px-1 tabular-nums">
              {clockTime(m.created_at)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
