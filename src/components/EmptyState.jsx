import React from 'react';

export default function EmptyState({ icon = null, title, hint, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center px-6">
      {icon && (
        <div className="text-[var(--muted)] mb-1" aria-hidden="true">
          {icon}
        </div>
      )}
      <h2 className="text-[16px] font-medium text-[var(--text)]">{title}</h2>
      {hint && <p className="text-[13px] text-[var(--muted)] max-w-[380px]">{hint}</p>}
      {action}
    </div>
  );
}
