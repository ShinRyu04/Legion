import React from 'react';
import { useStore } from '../store.jsx';
import { DEMO_BOTS } from '../lib/demoData.js';
import GatewayStatus from './GatewayStatus.jsx';
import { BotAvatar } from './Sidebar.jsx';
import { IconMenu, IconSettings, IconSun, IconMoon } from './icons.jsx';

export default function ChatHeader({ onToggleSidebar, theme, onToggleTheme }) {
  const state = useStore();
  const bot = DEMO_BOTS.find((b) => b.id === state.activeBotId);
  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-[var(--border)] bg-[var(--bg-elev)]">
      <div className="flex items-center gap-2.5 min-w-0">
        {!state.sidebarOpen && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--muted)] hover:bg-[var(--bg-elev2)] hover:text-[var(--text)] transition-colors cursor-pointer"
            aria-label="Tampilkan sidebar"
          >
            <IconMenu />
          </button>
        )}
        {bot ? (
          <>
            <BotAvatar bot={bot} />
            <span className="min-w-0">
              <span className="block text-[14px] text-[var(--text)] truncate leading-tight">{bot.name}</span>
              <span className="block text-[11px] text-[var(--muted)] truncate leading-tight">{bot.model_id}</span>
            </span>
          </>
        ) : (
          <span className="text-[14px] text-[var(--muted)]">Tidak ada bot aktif</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <GatewayStatus status="checking" onClick={() => {}} />
        <button
          type="button"
          onClick={onToggleTheme}
          className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--muted)] hover:bg-[var(--bg-elev2)] hover:text-[var(--text)] transition-colors cursor-pointer"
          aria-label={theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
        >
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
        </button>
        <button
          type="button"
          className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--muted)] hover:bg-[var(--bg-elev2)] hover:text-[var(--text)] transition-colors cursor-pointer"
          aria-label="Buka pengaturan"
        >
          <IconSettings />
        </button>
      </div>
    </header>
  );
}
