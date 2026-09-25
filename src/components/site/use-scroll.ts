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
 * 4. MutationObserver: динамически добавленные `.reveal` (фильтр каталога,
 *    «Недавно просмотренные», табы, дровер) подхватываются автоматически —
 *    иначе они остаются с opacity:0 навсегда (баг «карточки не возвращаются
 *    после сброса фильтра категорий»).
 */
export function useScrollReveal() {
  useEffect(() => {
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (reveals.length === 0) return;

    const reveal = (el: HTMLElement) => {
      el.classList.add("is-visible");
    };

    /** В зоне видимости (с запасом 1.2 экрана вниз)? */
    const inRevealZone = (el: HTMLElement): boolean => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight * 1.2;
    };

    /** Раскрыть сразу, если элемент во вьюпорте; иначе вернуть true, если нужен observer. */
    const revealOrObserve = (el: HTMLElement, observer: IntersectionObserver): void => {
      if (el.classList.contains("is-visible")) return;
      if (inRevealZone(el)) reveal(el);
      else observer.observe(el);
    };

    // 1. Сразу раскрываем то, что уже в зоне видимости или чуть ниже.
    reveals.forEach((el) => {
      if (inRevealZone(el)) reveal(el);
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

    // 4. Динамически добавленные `.reveal` — подхватываем на лету.
    //    Без этого карточки, перемонтированные при переключении категорий
    //    каталога, остаются невидимыми (opacity:0) до конца сессии.
    let mutationObserver: MutationObserver | null = null;
    if ("MutationObserver" in window) {
      mutationObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
          m.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;
            const targets: HTMLElement[] = [];
            if (node.classList.contains("reveal")) targets.push(node);
            targets.push(
              ...Array.from(node.querySelectorAll<HTMLElement>(".reveal"))
            );
            for (const el of targets) {
              revealOrObserve(el, observer);
            }
          });
        }
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
      mutationObserver?.disconnect();
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
