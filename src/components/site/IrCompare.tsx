"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Интерактивный слайдер «Камера / Тепловизор» — живая видеосъёмка одной сцены.
 *
 * Два синхронных видео одной локации: нижний слой — тепловизионный канал
 * (виден справа от разделителя), верхний слой — обычная камера, обрезается
 * слева по разделителю через clip-path. Перетаскивая разделитель, посетитель
 * переключается между «глазами» двух приборов.
 *
 * Управление: pointer-drag по дорожке, клик по дорожке, клавиши ←/→ когда
 * слайдер в зоне видимости, тач-жесты на мобильных.
 *
 * Видео стартуют при появлении блока в зоне видимости (IntersectionObserver
 * вместо autoPlay — страховка от гонки гидратации), синхронизируются по
 * timeupdate мастера: мастер — тепловизор, дрейф камеры > 0.25с подтягивается.
 *
 * Медиа: /public/products/ir-camera.mp4 + ir-camera-poster.jpg (обычная
 * камера), /public/products/ir-thermal.mp4 + ir-thermal-poster.jpg
 * (тепловизор). Если один источник недоступен — второй показывается
 * на весь кадр без разделителя.
 */
export default function IrCompare() {
  const [pos, setPos] = useState(50); // 0..100 — позиция разделителя
  const wrapRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const thRef = useRef<HTMLVideoElement>(null);
  const camRef = useRef<HTMLVideoElement>(null);
  // Отказ одного из источников → одиночный режим: второе видео на весь кадр
  const [fail, setFail] = useState({ cam: false, th: false });
  const single = fail.cam || fail.th;

  const setFromClientX = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  // Pointer events (мышь + тач в одном API)
  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    setFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    draggingRef.current = false;
  };

  // Клавиатура: ←/→ сдвигают на 5%
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPos((p) => Math.max(0, p - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPos((p) => Math.min(100, p + 5));
    }
  };

  // Сброс drag при уходе указателя за пределы окна
  useEffect(() => {
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("pointerup", onUp);
    return () => window.removeEventListener("pointerup", onUp);
  }, []);

  // Глобальный listener ←/→ — работает, когда слайдер в зоне видимости.
  // Не срабатывает, если фокус в input/textarea/select (как и шорткаты «?»).
  useEffect(() => {
    let inView = false;
    const el = wrapRef.current;
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((e) => {
                inView = e.isIntersecting;
              });
            },
            { threshold: 0.4 }
          )
        : null;
    if (el && observer) observer.observe(el);

    const onKey = (e: KeyboardEvent) => {
      if (!inView) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      e.preventDefault();
      setPos((p) =>
        e.key === "ArrowLeft" ? Math.max(0, p - 5) : Math.min(100, p + 5)
      );
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (el && observer) observer.unobserve(el);
    };
  }, []);

  // Видео: старт/пауза по видимости + синхронный playback
  // (мастер — тепловизор, камера подтягивается при дрейфе > 0.25с)
  useEffect(() => {
    const th = thRef.current;
    const cam = camRef.current;
    if (!th || !cam) return;

    const tryPlay = (v: HTMLVideoElement) => {
      if (v.paused) v.play().catch(() => {});
    };
    const sync = () => {
      if (
        cam.readyState >= 2 &&
        Math.abs(cam.currentTime - th.currentTime) > 0.25
      ) {
        cam.currentTime = th.currentTime;
      }
    };
    const onMasterTick = () => sync();
    const onMasterPlaying = () => {
      sync();
      tryPlay(cam);
    };

    th.addEventListener("timeupdate", onMasterTick);
    th.addEventListener("playing", onMasterPlaying);
    th.addEventListener("seeked", onMasterPlaying);

    const mediaObserver =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((e) => {
                if (e.isIntersecting) {
                  tryPlay(th);
                  tryPlay(cam);
                } else {
                  th.pause();
                  cam.pause();
                }
              });
            },
            { threshold: 0.4 }
          )
        : null;
    if (wrapRef.current && mediaObserver)
      mediaObserver.observe(wrapRef.current);

    return () => {
      th.removeEventListener("timeupdate", onMasterTick);
      th.removeEventListener("playing", onMasterPlaying);
      th.removeEventListener("seeked", onMasterPlaying);
      if (wrapRef.current && mediaObserver)
        mediaObserver.unobserve(wrapRef.current);
    };
  }, [fail.cam, fail.th]);

  return (
    <section id="ir-compare" className="sn-section !pt-0">
      <header className="reveal mb-10">
        <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-4 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
          Демонстрация
        </div>
        <div className="flex justify-between items-end flex-wrap gap-8">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold uppercase tracking-[-1px] leading-[1.05]">
            Живая сцена:
            <br />
            камера / тепловизор
          </h2>
          <p className="text-base text-[var(--text2)] max-w-[560px] leading-[1.8]">
            Перетащите разделитель, чтобы переключиться между тем, что видит
            обычная камера, и тем, что видит тепловизор, — сцена снята вживую
            с одной точки. Слева — обычная оптика: человек в маскировочном
            костюме «Бугор» сливается с травой и кустарником. Справа —
            тепловизионный канал: экранирующий костюм подавляет тепловую
            сигнатуру, и силуэт не проявляется на фоне местности.
          </p>
        </div>
      </header>

      <div
        ref={wrapRef}
        className="reveal relative w-full aspect-[16/9] overflow-hidden border border-[var(--border-brand)] bg-black select-none cursor-ew-resize touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
        tabIndex={0}
        aria-label="Сравнение живой съёмки: обычная камера и тепловизор"
        {...(single
          ? {}
          : {
              role: "slider",
              "aria-valuemin": 0,
              "aria-valuemax": 100,
              "aria-valuenow": Math.round(pos),
              "aria-valuetext": `${Math.round(pos)}% — виден ${pos > 50 ? "левый край (обычная камера)" : "правый край (тепловизор)"}`,
            })}
      >
        {/* Тепловизор — нижний слой, виден справа от разделителя */}
        {!fail.th && (
          <video
            ref={thRef}
            src="/products/ir-thermal.mp4"
            poster="/products/ir-thermal-poster.jpg"
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Тепловизор: объект в ИК-костюме Бугор — тёплый силуэт подавлен, сливается с фоном"
            onError={() => setFail((f) => ({ ...f, th: true }))}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        )}
        {/* HUD-подпись справа */}
        {!fail.th && (
          <div className="absolute top-4 right-4 z-[2] px-2.5 py-1 bg-[rgba(13,13,13,0.7)] backdrop-blur-sm border border-[var(--olive-dark)] font-mono-brand text-[0.58rem] text-[var(--olive-light)] tracking-[1.5px] uppercase pointer-events-none">
            Тепловизор
          </div>
        )}

        {/* Обычная камера — верхний слой, обрезается слева по разделителю */}
        {!fail.cam && (
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={
              single ? undefined : { clipPath: `inset(0 ${100 - pos}% 0 0)` }
            }
          >
            <video
              ref={camRef}
              src="/products/ir-camera.mp4"
              poster="/products/ir-camera-poster.jpg"
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Обычная камера: человек в маскировочном костюме Бугор сливается с растительностью"
              onError={() => setFail((f) => ({ ...f, cam: true }))}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute top-4 left-4 px-2.5 py-1 bg-[rgba(13,13,13,0.7)] backdrop-blur-sm border border-[#a85a3c] font-mono-brand text-[0.58rem] text-[#e8a07a] tracking-[1.5px] uppercase">
              Обычная камера
            </div>
          </div>
        )}

        {/* Разделитель */}
        {!single && (
          <div
            className="absolute top-0 bottom-0 z-[3] pointer-events-none"
            style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
          >
            {/* Линия */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-[var(--olive-light)] shadow-[0_0_12px_var(--olive)]" />
            {/* Рукоятка */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-[rgba(13,13,13,0.85)] border-2 border-[var(--olive-light)] rounded-full backdrop-blur-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--olive-light)]">
                <path d="M15 18l-6-6 6-6" />
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </div>
        )}

        {/* Подсказка снизу */}
        {!single && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[3] pointer-events-none px-3 py-1 bg-[rgba(13,13,13,0.7)] backdrop-blur-sm border border-[var(--border-brand)] font-mono-brand text-[0.55rem] text-[var(--text3)] tracking-[1.5px] uppercase whitespace-nowrap">
            ← перетащите →
          </div>
        )}
      </div>

      {/* Метрики под слайдером */}
      <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border-brand)] border border-[var(--border-brand)] mt-6">
        {[
          { v: "−97%", l: "Сигнатура тела" },
          { v: "3–14 мкм", l: "Диапазон блокировки" },
          { v: "0%", l: "Заметность на тепловизоре" },
          { v: "∞", l: "Время эффекта" },
        ].map((m) => (
          <div key={m.l} className="bg-[var(--bg2)] p-4 text-center">
            <div className="font-display text-[1.5rem] font-bold text-[var(--olive-light)] leading-none mb-1">
              {m.v}
            </div>
            <div className="font-mono-brand text-[0.58rem] uppercase tracking-[1.5px] text-[var(--text3)]">
              {m.l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
