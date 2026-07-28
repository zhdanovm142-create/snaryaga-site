"use client";

import { useSyncExternalStore, useState, useEffect } from "react";

const STORAGE_KEY = "sn36-cookie-consent";

interface ConsentData {
  necessary: boolean; // всегда true, нельзя отключить
  analytics: boolean;
  marketing: boolean;
  date: string;
}

const DEFAULT_CONSENT: ConsentData = {
  necessary: true,
  analytics: false,
  marketing: false,
  date: "",
};

const CATEGORIES = [
  {
    id: "necessary" as const,
    label: "Необходимые",
    desc: "Обеспечивают базовую работу сайта (корзина, избранное). Всегда включены.",
    locked: true,
  },
  {
    id: "analytics" as const,
    label: "Аналитика",
    desc: "Помогают понять, как используется сайт, чтобы улучшать его.",
    locked: false,
  },
  {
    id: "marketing" as const,
    label: "Маркетинг",
    desc: "Используются для показа релевантной рекламы и предложений.",
    locked: false,
  },
];

const subscribe = (cb: () => void) => {
  const onStorage = () => {
    cachedConsent = undefined; // инвалидируем кеш при cross-tab storage-событии
    cb();
  };
  window.addEventListener("sn36-consent-change", cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("sn36-consent-change", cb);
    window.removeEventListener("storage", onStorage);
  };
};

/**
 * Кешируем snapshot в module-scope. Иначе getConsentClient возвращал бы НОВЫЙ
 * объект на каждый вызов → useSyncExternalStore думал бы, что стор изменился
 * (Object.is(prev,next) === false) → re-render → getSnapshot снова → ∞ цикл.
 * Кеш инвалидируется в saveConsent (и при storage-событии).
 */
let cachedConsent: ConsentData | null | undefined = undefined;

function readConsentFresh(): ConsentData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "necessary" in parsed) {
      return { ...DEFAULT_CONSENT, ...parsed, necessary: true };
    }
    // Старый формат (accepted/rejected) — мигрируем
    if (parsed === "accepted" || (parsed && parsed.choice === "accepted")) {
      return { ...DEFAULT_CONSENT, analytics: true, marketing: true, date: parsed.date ?? "" };
    }
    return { ...DEFAULT_CONSENT, date: parsed.date ?? "" };
  } catch {
    return null;
  }
}

function getConsentClient(): ConsentData | null {
  if (cachedConsent === undefined) cachedConsent = readConsentFresh();
  return cachedConsent;
}

function getConsentServer(): ConsentData | null {
  return null;
}

function getMountedClient(): boolean {
  return true;
}
function getMountedServer(): boolean {
  return false;
}

function saveConsent(data: ConsentData) {
  cachedConsent = data; // обновляем кеш тем же объектом, что сохраняем
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* noop */
  }
  window.dispatchEvent(new Event("sn36-consent-change"));
}

/**
 * Повторно открыть окно согласия (GDPR-требование: пользователь может
 * изменить свой выбор в любой момент). Вызывается из кнопки в футере.
 *
 * Сбрасывает сохранённый consent → useSyncExternalStore видит null →
 * баннер появляется снова. При этом ранее выбранные категории
 * предзаполняются (пользователь видит свой прошлый выбор).
 */
export function reopenConsent() {
  // Предзаполним локальные тогглы текущими значениями, если они есть.
  // Для этого используем специальное событие, которое читает компонент.
  const current = cachedConsent ?? readConsentFresh();
  cachedConsent = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
  window.dispatchEvent(
    new CustomEvent("sn36-consent-reopen", { detail: current })
  );
  window.dispatchEvent(new Event("sn36-consent-change"));
}

/**
 * GDPR-совместимый баннер согласия на cookies.
 *
 * Три категории: Необходимые (всегда вкл), Аналитика, Маркетинг.
 * Кнопка «Настроить» раскрывает панель с тогглами.
 * Сохранение: { necessary: true, analytics: bool, marketing: bool, date }.
 * SSR-безопасен через useSyncExternalStore.
 */
export default function CookieConsent() {
  const mounted = useSyncExternalStore(subscribe, getMountedClient, getMountedServer);
  const existing = useSyncExternalStore(subscribe, getConsentClient, getConsentServer);

  const [expanded, setExpanded] = useState(false);
  // Локальные тогглы до сохранения. Инициализируются значениями по умолчанию
  // (только необходимые) — никаких pre-ticked optional cookies (GDPR).
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // При повторном открытии (через reopenConsent из футера) предзаполняем
  // тогглы прошлым выбором пользователя и раскрываем настройки.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ConsentData | null>).detail;
      if (detail) {
        setAnalytics(detail.analytics);
        setMarketing(detail.marketing);
        setExpanded(true);
      }
    };
    window.addEventListener("sn36-consent-reopen", handler);
    return () => window.removeEventListener("sn36-consent-reopen", handler);
  }, []);

  // Keyboard shortcut: Esc — отклонить все (быстрое закрытие без мыши).
  // Доступность: пользователи клавиатуры могут быстро отказаться от cookie.
  // Логика rejectAll inline (не зависит от переменной, объявленной ниже).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      saveConsent({
        necessary: true,
        analytics: false,
        marketing: false,
        date: new Date().toISOString(),
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!mounted || existing) return null;

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      date: new Date().toISOString(),
    });
  };

  const rejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      date: new Date().toISOString(),
    });
  };

  const saveCustom = () => {
    saveConsent({
      necessary: true,
      analytics,
      marketing,
      date: new Date().toISOString(),
    });
  };

  const toggleState = (id: "analytics" | "marketing"): boolean => {
    if (id === "analytics") return analytics;
    return marketing;
  };
  const toggleSet = (id: "analytics" | "marketing", val: boolean) => {
    if (id === "analytics") setAnalytics(val);
    else setMarketing(val);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Уведомление об использовании файлов cookie"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-[440px] z-[1700] bg-[var(--bg2)] border border-[var(--olive-dark)] shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden"
      style={{ animation: "sn-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-[rgba(92,107,60,0.15)] border border-[var(--olive-dark)] text-base">
            🍪
          </div>
          <div>
            <div className="font-display text-[0.95rem] font-bold uppercase tracking-[0.5px] mb-1">
              Файлы cookie
            </div>
            <p className="text-[0.78rem] text-[var(--text2)] leading-[1.6]">
              Мы используем cookie-файлы для работы сайта, аналитики и
              сохранения избранного. Выберите категории, на которые согласны.
            </p>
          </div>
        </div>

        {/* Раскрывающаяся панель настроек категорий */}
        {expanded && (
          <div className="mb-4 space-y-2" style={{ animation: "sn-slide-down 0.25s ease-out" }}>
            {CATEGORIES.map((cat) => {
              const isOn = cat.locked ? true : toggleState(cat.id);
              return (
                <div
                  key={cat.id}
                  className={`flex items-start gap-3 p-3 border ${
                    isOn
                      ? "border-[var(--olive-dark)] bg-[rgba(92,107,60,0.06)]"
                      : "border-[var(--border-brand)] bg-[var(--bg3)]"
                  }`}
                >
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isOn}
                    aria-label={`Категория: ${cat.label}`}
                    disabled={cat.locked}
                    onClick={() => !cat.locked && toggleSet(cat.id, !isOn)}
                    className={`relative flex-shrink-0 w-10 h-6 rounded-full transition-colors duration-300 cursor-pointer border-none ${
                      isOn
                        ? "bg-[var(--olive)]"
                        : cat.locked
                          ? "bg-[var(--olive)] cursor-not-allowed"
                          : "bg-[var(--border-brand)]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                        isOn ? "translate-x-[18px]" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-[0.78rem] font-bold uppercase tracking-[0.5px]">
                        {cat.label}
                      </span>
                      {cat.locked && (
                        <span className="px-1.5 py-0.5 bg-[rgba(92,107,60,0.15)] border border-[var(--olive-dark)] font-mono-brand text-[0.5rem] text-[var(--olive-light)] tracking-[1px] uppercase">
                          всегда
                        </span>
                      )}
                    </div>
                    <p className="text-[0.68rem] text-[var(--text3)] leading-[1.5] mt-0.5">
                      {cat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mb-2">
          {!expanded ? (
            <>
              <button
                type="button"
                onClick={acceptAll}
                className="flex-1 py-2.5 px-3 bg-[var(--olive)] text-white border-none text-[0.65rem] font-bold tracking-[1px] uppercase cursor-pointer transition-all duration-300 hover:bg-[var(--olive-light)]"
              >
                Принять все
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="flex-1 py-2.5 px-3 bg-transparent border border-[var(--border-brand)] text-[var(--text2)] text-[0.65rem] font-bold tracking-[1px] uppercase cursor-pointer transition-all duration-300 hover:border-[var(--text3)] hover:text-[var(--text)]"
              >
                Отклонить
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={saveCustom}
              className="flex-1 py-2.5 px-3 bg-[var(--olive)] text-white border-none text-[0.65rem] font-bold tracking-[1px] uppercase cursor-pointer transition-all duration-300 hover:bg-[var(--olive-light)]"
            >
              Сохранить выбор
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-[0.62rem] text-[var(--olive-light)] hover:text-[var(--text)] transition-colors bg-transparent border-none cursor-pointer tracking-[0.5px] uppercase flex items-center gap-1"
          >
            {expanded ? "Скрыть настройки" : "Настроить"}
            <svg
              width="9"
              height="9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <a
            href="#"
            className="text-[0.62rem] text-[var(--text3)] no-underline hover:text-[var(--olive-light)] transition-colors tracking-[0.5px] uppercase"
          >
            Политика конфиденциальности
          </a>
        </div>

        {/* Подсказка про Esc — keyboard shortcut для быстрого отказа */}
        <div className="mt-3 flex items-center justify-end gap-1.5 text-[0.55rem] text-[var(--text3)] uppercase tracking-[1px]">
          <span>или нажмите</span>
          <kbd className="px-1.5 py-0.5 bg-[var(--bg3)] border border-[var(--border-brand)] font-mono-brand text-[0.55rem] text-[var(--text2)] rounded-[2px]">
            Esc
          </kbd>
          <span>для отказа</span>
        </div>
      </div>
    </div>
  );
}
