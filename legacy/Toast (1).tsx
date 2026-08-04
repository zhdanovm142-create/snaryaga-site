"use client";

import { useEffect } from "react";

interface Props {
  message: string | null;
  durationMs?: number;
  onDismiss: () => void;
}

/**
 * Тост: появляется через CSS-анимацию `sn-slide-in`, живёт `durationMs`
 * и пропадает. Каждый новое сообщение перемонтирует элемент (через key),
 * поэтому анимация входа проигрывается заново.
 */
export default function Toast({ message, durationMs = 3000, onDismiss }: Props) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(t);
  }, [message, durationMs, onDismiss]);

  if (!message) return null;

  return (
    <div
      key={message}
      className="fixed bottom-[6.5rem] right-8 bg-[var(--bg2)] border border-[var(--olive)] rounded-[4px] px-6 py-4 z-[3000] flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
      style={{ animation: "sn-slide-in 0.4s ease" }}
      role="status"
      aria-live="polite"
    >
      <div className="text-[var(--olive-light)] text-[1.2rem]">✓</div>
      <div className="text-[0.85rem]">{message}</div>
    </div>
  );
}
