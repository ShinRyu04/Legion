import React, { useRef, useState } from 'react';
import { useStore } from '../store.jsx';
import { DEMO_BOTS } from '../lib/demoData.js';

const MAX_HEIGHT = 180;

export default function Composer() {
  const state = useStore();
  const [text, setText] = useState('');
  const ref = useRef(null);
  const bot = DEMO_BOTS.find((b) => b.id === state.activeBotId);

  function autoGrow() {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT ? 'auto' : 'hidden';
  }

  function onChange(e) {
    setText(e.target.value);
    autoGrow();
  }

  return (
    <div className="shrink-0 px-6 pb-4 pt-1 bg-[var(--bg)]">
      <div className="max-w-[820px] mx-auto">
        <div className="flex items-end gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-2 focus-within:ring-1 focus-within:ring-[var(--accent)]">
          <textarea
            ref={ref}
            rows={1}
            value={text}
            onChange={onChange}
            placeholder={bot ? `Tulis pesan ke ${bot.name}...` : 'Pilih bot dulu di sidebar'}
            disabled={!bot}
            aria-label="Pesan"
            className="flex-1 resize-none bg-transparent outline-none text-[14px] leading-relaxed text-[var(--text)] placeholder:text-[var(--muted)] disabled:opacity-40 min-h-[24px] max-h-[180px]"
          />
          <button
            type="button"
            disabled={!text.trim()}
            aria-label="Kirim pesan"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--accent)] text-[var(--accent-text)] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ↑
          </button>
        </div>
        <p className="text-[11px] text-[var(--muted)] mt-1.5 px-1">Enter kirim · Shift+Enter baris baru</p>
      </div>
    </div>
  );
}
