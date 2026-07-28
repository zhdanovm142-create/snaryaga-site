"use client";

import { reopenConsent } from "./CookieConsent";

/**
 * Кнопка «Настройки cookie» для футера.
 *
 * GDPR-требование: пользователь должен иметь возможность изменить свой
 * выбор согласия в любой момент, а не только при первом заходе.
 * Клик вызывает reopenConsent() → баннер появляется снова с
 * предзаполненными прошлыми настройками.
 *
 * Серверный футер не может использовать onClick, поэтому кнопка вынесена
 * в отдельный клиентский компонент.
 */
export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={reopenConsent}
      className="text-[0.72rem] text-[var(--text3)] no-underline transition-colors hover:text-[var(--text2)] bg-transparent border-none cursor-pointer flex items-center gap-1.5 tracking-normal"
      aria-label="Открыть настройки файлов cookie"
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15.46l-5.27-.61L12.83 21l-1.42-5.36L6 15.46l3.73-4.92L8.29 4l3.71 2.69L15.71 4l-1.44 5.54z" />
      </svg>
      Настройки cookie
    </button>
  );
}
