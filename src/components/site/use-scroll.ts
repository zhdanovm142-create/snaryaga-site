"use client";

import { useEffect } from "react";

/**
 * Наблюдает за всеми элементами с классом `.reveal` и добавляет `.is-visible`,
 * когда они попадают в зону видимости.
 *
 * Особенности:
 * 1. Элементы выше первого экрана сразу получают `is-visible` без анимации.
 * 2. Используем IntersectionObserver с большим нижним rootMargin, чтобы
 *    контент ниже текущего экрана раскрывался заранее (полезно для скриншотов
 *    всей страницы и при быстрой прокрутке).
 * 3. Fallback: через 1.2с после загрузки все ещё скрытые элементы принудительно
 *    раскрываются (защита от случаев, когда observer не сработал).
 */
export function useScrollReveal() {
  useEffect(() => {
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (reveals.length === 0) return;

    const reveal = (el: HTMLElement) => {
      el.classList.add("is-visible");
    };

    // 1. Сразу раскрываем то, что уже в зоне видимости или чуть ниже.
    const vh = window.innerHeight;
    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh * 1.2) reveal(el);
    });

    // 2. IntersectionObserver для оставшихся.
    if (!("IntersectionObserver" in window)) {
      reveals.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -50px 0px", threshold: 0.05 }
    );

    reveals
      .filter((el) => !el.classList.contains("is-visible"))
      .forEach((el) => observer.observe(el));

    // 3. Fallback-таймер: через 1.2с всё ещё скрытые элементы раскрываются.
    const fallback = setTimeout(() => {
      reveals.forEach((el) => {
        if (!el.classList.contains("is-visible")) reveal(el);
      });
    }, 1200);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);
}

/**
 * Добавляет/снимает класс `.scrolled` на фиксированной навигации при прокрутке.
 */
export function useNavScrolled(selector = "#sn-nav") {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(selector);
    if (!nav) return;

    const onScroll = () => {
      if (window.scrollY > 50) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [selector]);
}
