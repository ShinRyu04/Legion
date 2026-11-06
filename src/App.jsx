import React from 'react';
import { StoreProvider, useStore, useDispatch } from './store.jsx';
import { ThemeProvider, useTheme } from './theme.jsx';
import Sidebar from './components/Sidebar.jsx';
import ChatHeader from './components/ChatHeader.jsx';
import ChatArea from './components/ChatArea.jsx';
import Composer from './components/Composer.jsx';

function Shell() {
  const state = useStore();
  const dispatch = useDispatch();
  const { theme, toggle } = useTheme();
  return (
    <div className="h-screen flex overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      {state.sidebarOpen && <Sidebar />}
      <main className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          onToggleSidebar={() => dispatch({ type: 'toggleSidebar' })}
          theme={theme}
          onToggleTheme={toggle}
        />
        <ChatArea />
        <Composer />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <Shell />
      </StoreProvider>
    </ThemeProvider>
  );
}
