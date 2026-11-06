import React from 'react';

export function GatewayStatus({ status = 'checking', onClick, modelsCount }) {
  const map = {
    ok: { cls: 'bg-[var(--accent)]', label: 'Gateway siap' },
    down: { cls: 'bg-[var(--danger)]', label: 'Gateway mati' },
    checking: { cls: 'bg-[var(--muted)]', label: 'Memeriksa gateway' },
  };
  const s = map[status] || map.checking;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[var(--bg-elev2)] transition-colors text-[12px] text-[var(--muted)] cursor-pointer tabular-nums"
      aria-label={`Status gateway: ${s.label}`}
    >
      <span className={`w-2 h-2 rounded-full ${s.cls}`} aria-hidden="true" />
      <span>
        {s.label}
        {status === 'ok' && modelsCount > 0 && ` - ${modelsCount} model`}
      </span>
    </button>
  );
}

export default GatewayStatus;
