/**
 * Таблица размеров для костюмов «Бугор».
 *
 * Серверный компонент (без стейта) — рендерится перед FAQ, на него
 * ссылается ProductDetailModal якорем #size-guide.
 *
 * Размерный ряд: S–XXL. Замеры в сантиметрах. Если показатель между
 * размерами — берём больший (костюм носится поверх разгрузки/белья).
 *
 * Внутрь встраивается интерактивный калькулятор размера (SizeCalculator,
 * клиентский) — пользователь вводит рост/грудь, получает рекомендацию.
 */
import SizeCalculator from "./SizeCalculator";

const ROWS = [
  { size: "S", height: "164–170", chest: "84–90", waist: "72–78", hip: "90–96" },
  { size: "M", height: "170–176", chest: "90–96", waist: "78–84", hip: "96–102" },
  { size: "L", height: "176–182", chest: "96–104", waist: "84–92", hip: "102–108" },
  { size: "XL", height: "182–188", chest: "104–112", waist: "92–100", hip: "108–114" },
  { size: "XXL", height: "188–196", chest: "112–120", waist: "100–108", hip: "114–120" },
] as const;

const COLS = [
  { key: "size", label: "Размер" },
  { key: "height", label: "Рост, см" },
  { key: "chest", label: "Грудь, см" },
  { key: "waist", label: "Талия, см" },
  { key: "hip", label: "Бёдра, см" },
] as const;

export default function SizeGuide() {
  return (
    <section id="size-guide" className="sn-section !pt-0">
      <header className="reveal mb-10">
        <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-4 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
          Размерная сетка
        </div>
        <div className="flex justify-between items-end flex-wrap gap-8">
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold uppercase tracking-[-1px] leading-[1.05]">
            Подбор размера
            <br />
            костюмов «Бугор»
          </h2>
          <p className="text-base text-[var(--text2)] max-w-[520px] leading-[1.8]">
            Замеры даны по телу. Костюм надевается поверх белья и разгрузки —
            если показатель между размерами, берите больший. Для нестандартных
            фигур возможен индивидуальный пошив.
          </p>
        </div>
      </header>

      {/* Интерактивный калькулятор размера */}
      <SizeCalculator />

      <div className="reveal overflow-x-auto border border-[var(--border-brand)] bg-[var(--bg2)]">
        <table className="w-full border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-[var(--border-brand)]">
              {COLS.map((c) => (
                <th
                  key={c.key}
                  className="text-left p-4 font-mono-brand text-[0.62rem] uppercase tracking-[2px] text-[var(--text3)] first:text-[var(--olive-light)]"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr
                key={r.size}
                className={`border-b border-[var(--border-brand)] last:border-b-0 transition-colors hover:bg-[var(--bg3)] ${
                  i % 2 === 1 ? "bg-[rgba(255,255,255,0.015)]" : ""
                }`}
              >
                <td className="p-4 font-mono-brand text-[1rem] font-bold text-[var(--olive-light)] tracking-[1px]">
                  {r.size}
                </td>
                <td className="p-4 text-[0.85rem] font-mono-brand">{r.height}</td>
                <td className="p-4 text-[0.85rem] font-mono-brand">{r.chest}</td>
                <td className="p-4 text-[0.85rem] font-mono-brand">{r.waist}</td>
                <td className="p-4 text-[0.85rem] font-mono-brand">{r.hip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="reveal mt-4 text-[0.78rem] text-[var(--text3)]">
        * Все костюмы имеют регулировки (капюшон, манжеты, штрипки), что
        компенсирует небольшие отклонения от размерной сетки.
      </p>
    </section>
  );
}
