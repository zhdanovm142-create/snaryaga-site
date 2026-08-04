"use client";

import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  /** Дополнительный inline-стиль для img */
  style?: React.CSSProperties;
}

/**
 * Изображение с blur-up эффектом:
 * 1. До загрузки показывается размытая низкокачественная заглушка (через CSS blur).
 * 2. При загрузке src — blur плавно убирается.
 *
 * Не использует Next.js Image, чтобы не менять конфиг next.config.ts и сохранить
 * существующие CDN-ссылки. Чистый <img> + onLoad + CSS transition.
 *
 * Используем callback-ref, чтобы проверить `complete` синхронно при монтировании
 * (без setState-in-effect) — актуально для изображений из кэша браузера.
 */
export default function BlurImage({
  src,
  alt,
  className = "",
  loading = "lazy",
  style,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const setRef = (el: HTMLImageElement | null) => {
    if (el && el.complete) {
      setLoaded(true);
    }
  };

  return (
    <img
      ref={setRef}
      src={src}
      alt={alt}
      loading={loading}
      onLoad={() => setLoaded(true)}
      className={`${className} transition-[filter,opacity] duration-700 ease-out ${
        loaded ? "blur-0 opacity-100" : "blur-md opacity-40"
      }`}
      style={style}
      decoding="async"
    />
  );
}
