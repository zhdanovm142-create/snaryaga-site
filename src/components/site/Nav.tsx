"use client";

import { useEffect, useRef, useState } from "react";
import { useNavScrolled } from "./use-scroll";
import { useFavorites } from "@/hooks/use-favorites";
import { useCart } from "@/hooks/use-cart";
import MiniCartPreview from "./MiniCartPreview";

const NAV_LINKS = [
  { href: "#categories", label: "Направления" },
  { href: "#products", label: "Продукция" },
  { href: "#suits", label: "Костюмы" },
  { href: "#poncho", label: "Накидки" },
  { href: "#tech", label: "Технологии" },
  { href: "#about", label: "О компании" },
  { href: "#contact", label: "Контакты" },
];

const VK_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.189 1.365 1.26 2.179 1.818.616.42 1.084.328 1.084.328l2.178-.03s1.14-.07.6-.964c-.044-.073-.314-.661-1.618-1.869-1.366-1.265-1.183-1.06.462-3.246.998-1.328 1.398-2.14 1.273-2.487-.12-.332-.856-.244-.856-.244l-2.45.015s-.182-.025-.316.056c-.132.079-.216.263-.216.263s-.388 1.032-.904 1.91c-1.092 1.856-1.528 1.954-1.708 1.838-.416-.268-.312-1.075-.312-1.65 0-1.793.272-2.54-.53-2.733-.266-.064-.462-.106-1.142-.113-.872-.009-1.608.003-2.024.207-.278.136-.492.44-.362.457.161.022.524.098.718.362.25.34.24 1.104.24 1.104s.144 2.11-.335 2.372c-.328.18-.778-.187-1.744-1.865-.494-.859-.868-1.81-.868-1.81s-.072-.176-.2-.27c-.155-.114-.372-.15-.372-.15l-2.328.015s-.35.01-.478.162c-.114.135-.009.414-.009.414s1.826 4.272 3.892 6.418c1.894 1.968 4.044 1.84 4.044 1.84h.974z" />
  </svg>
);

const TG_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21.94 4.5 18.6 20.06c-.25 1.1-.92 1.37-1.86.85l-5.14-3.79-2.48 2.39c-.27.27-.5.5-1.03.5l.37-5.2 9.5-8.58c.41-.37-.09-.57-.64-.2L5.07 13.1.97 11.82c-.89-.28-.91-.89.19-1.32l16.05-6.18c.74-.27 1.39.18 1.15 1.32z" />
  </svg>
);

const PHONE_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
  </svg>
);

interface Props {
  onOpenFavorites: () => void;
  onOpenCart: () => void;
}

function IconButton({
  onClick,
  ariaLabel,
  filled,
  children,
  badge,
  badgeColor,
}: {
  onClick: () => void;
  ariaLabel: string;
  filled?: boolean;
  children: React.ReactNode;
  badge?: number | null;
  badgeColor?: string;
}) {
  const [bouncing, setBouncing] = useState(false);
  const prevBadge = useRef(badge ?? 0);

  // Анимация «jump» при увеличении badge (товар добавлен).
  // setState в effect оправдан — это разовая реакция на изменение prop badge
  // (внешнего состояния корзины), не подписка на меняющийся стор.
  useEffect(() => {
    const current = badge ?? 0;
    if (current > prevBadge.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBouncing(true);
      const t = setTimeout(() => setBouncing(false), 600);
      prevBadge.current = current;
      return () => clearTimeout(t);
    }
    prevBadge.current = current;
  }, [badge]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="relative w-10 h-10 flex items-center justify-center bg-[var(--bg2)] border border-[var(--border-brand)] text-[var(--text2)] cursor-pointer transition-all duration-300 hover:border-[var(--olive)] hover:text-[var(--olive-light)]"
    >
      {children}
      {badge !== undefined && badge !== null && badge > 0 && (
        <span
          className={`absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 text-white text-[0.6rem] font-bold flex items-center justify-center rounded-full font-mono-brand ${bouncing ? "sn-badge-bounce" : ""}`}
          style={{ background: badgeColor ?? "var(--olive)" }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

const FavSvg = ({ filled }: { filled?: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const CartSvg = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export default function Nav({ onOpenFavorites, onOpenCart }: Props) {
  useNavScrolled();
  const [open, setOpen] = useState(false);
  const { count: favCount, hydrated: favHydrated } = useFavorites();
  const { count: cartCount, hydrated: cartHydrated } = useCart();

  const favBadge = favHydrated ? favCount : 0;
  const cartBadge = cartHydrated ? cartCount : 0;

  return (
    <nav
      id="sn-nav"
      className="fixed top-0 left-0 right-0 z-[1000] h-[72px] flex items-center justify-between px-4 sm:px-12 bg-[rgba(13,13,13,0.92)] backdrop-blur-2xl border-b border-[var(--border-brand)]"
    >
      <a href="#" className="flex items-center gap-3 no-underline text-[var(--text)]" aria-label="Снаряга36 — на главную">
        <div className="w-[38px] h-[38px] bg-[var(--olive)] flex items-center justify-center font-display font-bold text-[15px] tracking-[1px]">
          С36
        </div>
        <div className="flex flex-col">
          <span className="font-display font-bold text-[1.15rem] tracking-[3px] uppercase leading-none">
            Снаряга36
          </span>
          <span className="text-[0.6rem] text-[var(--text3)] tracking-[2px] uppercase mt-[2px] hidden sm:block">
            Маскировка от тепловизоров
          </span>
        </div>
      </a>

      {/* Desktop links */}
      <ul className="hidden lg:flex gap-10 list-none m-0 p-0">
        {NAV_LINKS.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="relative text-[var(--text2)] no-underline text-[0.72rem] font-semibold tracking-[2px] uppercase transition-colors duration-300 hover:text-[var(--text)] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-px after:bg-[var(--olive)] after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Desktop actions */}
      <div className="hidden lg:flex items-center gap-2">
        <IconButton
          onClick={onOpenFavorites}
          ariaLabel={`Избранное${favBadge > 0 ? `, ${favBadge} товаров` : ""}`}
          filled={favBadge > 0}
          badge={favBadge}
          badgeColor="var(--olive)"
        >
          <FavSvg filled={favBadge > 0} />
        </IconButton>
        <MiniCartPreview onOpenCart={onOpenCart} />
        <a
          href="https://t.me/snaryaga36"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram: Макс"
          title="Telegram: Макс"
          className="flex items-center gap-1.5 py-[0.45rem] px-[0.9rem] bg-[rgba(42,171,238,0.08)] border border-[rgba(42,171,238,0.25)] rounded-[3px] text-[#5bc8f5] no-underline text-[0.68rem] font-semibold tracking-[1px] uppercase transition-all duration-300 hover:bg-[rgba(42,171,238,0.15)] hover:border-[rgba(42,171,238,0.45)]"
        >
          <span className="w-3.5 h-3.5 fill-current">{TG_ICON}</span>
          Макс · TG
        </a>
        <a
          href="https://vk.ru/club240233552"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 py-[0.45rem] px-[0.9rem] bg-[rgba(0,119,255,0.08)] border border-[rgba(0,119,255,0.2)] rounded-[3px] text-[#5ba3ff] no-underline text-[0.68rem] font-semibold tracking-[1px] uppercase transition-all duration-300 hover:bg-[rgba(0,119,255,0.15)] hover:border-[rgba(0,119,255,0.4)]"
        >
          <span className="w-3.5 h-3.5 fill-current">{VK_ICON}</span>
          VK
        </a>
        <a
          href="#contact"
          className="inline-flex items-center gap-1.5 py-[0.55rem] px-[1.4rem] bg-[var(--olive)] text-white border-none rounded-[2px] text-[0.7rem] font-bold tracking-[2px] uppercase cursor-pointer no-underline transition-all duration-300 hover:bg-[var(--olive-light)]"
        >
          <span className="w-3.5 h-3.5 fill-white">{PHONE_ICON}</span>
          Связаться
        </a>
      </div>

      {/* Mobile actions */}
      <div className="flex lg:hidden items-center gap-2">
        <IconButton
          onClick={onOpenFavorites}
          ariaLabel={`Избранное${favBadge > 0 ? `, ${favBadge} товаров` : ""}`}
          filled={favBadge > 0}
          badge={favBadge}
          badgeColor="var(--olive)"
        >
          <FavSvg filled={favBadge > 0} />
        </IconButton>
        <IconButton
          onClick={onOpenCart}
          ariaLabel={`Корзина${cartBadge > 0 ? `, ${cartBadge} товаров` : ""}`}
          badge={cartBadge}
          badgeColor="var(--coyote)"
        >
          <CartSvg />
        </IconButton>
        <button
          type="button"
          aria-label="Меню"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden flex flex-col gap-[5px] p-1 bg-transparent border-none cursor-pointer"
        >
          <span
            className={`block w-[22px] h-[2px] bg-[var(--text)] transition-all duration-300 ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-[22px] h-[2px] bg-[var(--text)] transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-[22px] h-[2px] bg-[var(--text)] transition-all duration-300 ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden absolute top-[72px] left-0 right-0 bg-[rgba(13,13,13,0.98)] border-b border-[var(--border-brand)] px-6 py-5 flex flex-col gap-5">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[var(--text2)] no-underline text-sm font-semibold tracking-[2px] uppercase transition-colors hover:text-[var(--olive-light)]"
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2 border-t border-[var(--border-brand)]">
            <a
              href="https://t.me/snaryaga36"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 px-3 bg-[rgba(42,171,238,0.08)] border border-[rgba(42,171,238,0.25)] rounded-[3px] text-[#5bc8f5] no-underline text-[0.68rem] font-semibold tracking-[1px] uppercase"
            >
              Макс · TG
            </a>
            <a
              href="https://vk.ru/club240233552"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 px-3 bg-[rgba(0,119,255,0.08)] border border-[rgba(0,119,255,0.2)] rounded-[3px] text-[#5ba3ff] no-underline text-[0.68rem] font-semibold tracking-[1px] uppercase"
            >
              VK
            </a>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="flex-1 text-center py-2 px-3 bg-[var(--olive)] text-white rounded-[2px] text-[0.7rem] font-bold tracking-[2px] uppercase no-underline"
            >
              Связаться
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
