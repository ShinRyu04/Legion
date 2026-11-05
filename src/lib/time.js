// Relative time in Indonesian. Timestamp-based so it stays correct across midnight.
export function relTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'baru saja';
  if (m < 60) return `${m} mnt`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jm`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'kemarin';
  return `${d} hr`;
}

export function clockTime(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
