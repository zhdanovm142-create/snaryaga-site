interface Props {
  /** Вариант разделителя */
  variant?: "dots" | "line" | "diamond" | "tag";
  /** Подпись по центру (опционально) */
  label?: string;
  /** Цвет акцента */
  color?: "olive" | "coyote";
}

/**
 * Декоративный разделитель между секциями.
 * Варианты:
 * - dots: ряд точек
 * - line: тонкая линия с подписью по центру
 * - diamond: ромб-метка
 * - tag: бейдж с текстом
 */
export default function SectionDivider({
  variant = "diamond",
  label,
  color = "olive",
}: Props) {
  const accent = color === "olive" ? "var(--olive-light)" : "var(--coyote-light)";
  const accentDim =
    color === "olive" ? "var(--olive-dark)" : "rgba(139,115,85,0.3)";

  if (variant === "dots") {
    return (
      <div
        className="flex items-center justify-center gap-1.5 py-6"
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: accent,
              opacity: 0.3 + i * 0.15,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "line" && label) {
    return (
      <div
        className="flex items-center gap-4 py-8 max-w-[1440px] mx-auto px-6 sm:px-12"
        aria-hidden="true"
      >
        <div
          className="flex-1 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${accentDim})`,
          }}
        />
        <span className="font-mono-brand text-[0.62rem] uppercase tracking-[3px] text-[var(--text3)]">
          {label}
        </span>
        <div
          className="flex-1 h-px"
          style={{
            background: `linear-gradient(to left, transparent, ${accentDim})`,
          }}
        />
      </div>
    );
  }

  if (variant === "tag" && label) {
    return (
      <div className="flex justify-center py-8" aria-hidden="true">
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 border font-mono-brand text-[0.62rem] uppercase tracking-[3px]"
          style={{
            borderColor: accentDim,
            color: accent,
            backgroundColor: "rgba(13,13,13,0.4)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
          {label}
        </span>
      </div>
    );
  }

  // diamond (default)
  return (
    <div
      className="flex items-center justify-center gap-3 py-6"
      aria-hidden="true"
    >
      <div
        className="h-px w-16"
        style={{
          background: `linear-gradient(to right, transparent, ${accent})`,
        }}
      />
      <div
        className="w-2 h-2 rotate-45"
        style={{ backgroundColor: accent }}
      />
      <div
        className="w-1 h-1 rotate-45 opacity-60"
        style={{ backgroundColor: accent }}
      />
      <div
        className="h-px w-16"
        style={{
          background: `linear-gradient(to left, transparent, ${accent})`,
        }}
      />
    </div>
  );
}
