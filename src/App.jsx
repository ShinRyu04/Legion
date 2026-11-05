import React, { useEffect, useState } from 'react';

// Scaffold check screen (phase 02). Replaced by the real shell in phase 03.
export default function App() {
  const [ping, setPing] = useState({ state: 'checking', ts: null });
  const [version, setVersion] = useState('');

  useEffect(() => {
    let alive = true;
    if (!window.legion) {
      setPing({ state: 'error', ts: null });
      return () => {};
    }
    window.legion
      .ping()
      .then((r) => {
        if (alive && r && r.ok) setPing({ state: 'ok', ts: r.ts });
        else if (alive) setPing({ state: 'error', ts: null });
      })
      .catch(() => {
        if (alive) setPing({ state: 'error', ts: null });
      });
    window.legion
      .version()
      .then((v) => {
        if (alive) setVersion(v);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-2 bg-[var(--bg)] text-[var(--text)]">
      <h1 className="text-2xl font-semibold">Legion</h1>
      <p className="text-sm text-[var(--muted)]">
        {ping.state === 'ok' && 'main OK'}
        {ping.state === 'checking' && 'memeriksa main...'}
        {ping.state === 'error' && 'main tidak merespons (preload gagal?)'}
      </p>
      {version && (
        <p className="text-xs text-[var(--muted)]">v{version}</p>
      )}
    </div>
  );
}
