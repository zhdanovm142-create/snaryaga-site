const ITEMS = [
  "ИК-защита нового поколения",
  "Снижение тепловой сигнатуры",
  "Тактическая экипировка",
  "Сделано в России",
  "Проверено в поле",
];

export default function Marquee() {
  // Дублируем массив для бесшовной прокрутки
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div
      className="bg-[var(--olive-dark)] py-[0.9rem] overflow-hidden border-t border-[var(--olive)] border-b border-[var(--olive)]"
      aria-label="Преимущества"
    >
      <div
        className="flex gap-16 whitespace-nowrap"
        style={{ animation: "sn-marquee 30s linear infinite" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-display text-[0.85rem] font-semibold tracking-[3px] uppercase text-[rgba(255,255,255,0.7)] flex items-center gap-4 after:content-['◆'] after:text-[0.5rem] after:text-[var(--olive-light)]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
