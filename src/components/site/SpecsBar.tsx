import AnimatedStat from "./AnimatedStat";

const SPECS = [
  { value: "-97%", label: "Снижение ИК-сигнатуры", icon: "🛡️" },
  { value: "3-14", label: "Диапазон мкм", icon: "📡" },
  { value: "30+", label: "Циклов стирки", icon: "🔄" },
  { value: "IP67", label: "Класс защиты", icon: "💧" },
];

export default function SpecsBar() {
  return (
    <div className="bg-[var(--bg2)] border-t border-[var(--border-brand)] border-b border-[var(--border-brand)] py-16 px-6 sm:px-12 relative overflow-hidden">
      {/* Декоративный фон */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(92,107,60,1) 1px, transparent 1px), linear-gradient(90deg, rgba(92,107,60,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />
      <div className="max-w-[1440px] mx-auto relative">
        <div className="text-center mb-10">
          <div className="font-mono-brand text-[0.65rem] text-[var(--olive)] tracking-[3px] uppercase mb-2">
            Ключевые характеристики
          </div>
          <h2 className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-bold uppercase tracking-[-0.5px]">
            Почему это работает
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:divide-x lg:divide-[var(--border-brand)]">
          {SPECS.map((s) => (
            <AnimatedStat key={s.label} value={s.value} label={s.label} icon={s.icon} />
          ))}
        </div>
      </div>
    </div>
  );
}
