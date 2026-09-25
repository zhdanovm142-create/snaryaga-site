# Блок: секция «Размерная сетка» (#size-guide)

Статус: archived
Дата архивации: 2026-09-25
Причина удаления: костюмы — унисекс, подбор идёт по размеру напрямую при
выборе товара; отдельный блок с сеткой и калькулятором для выбора не нужен.

## Где находился блок

Исходные файлы:
- `src/components/site/SizeGuide.tsx` — серверная секция
  `<section id="size-guide" class="sn-section !pt-0">`: заголовок
  «Размерная сетка», «Подбор размера костюмов "Бугор"», таблица размеров
  S–XXL, сноска про регулировки. Сохранил как
  `legacy/blocks/size-guide-section/original-component.tsx`.
- `src/components/site/SizeCalculator.tsx` — клиентский калькулятор
  («Калькулятор размера»: рост + обхват груди → рекомендуемый размер,
  кнопка «Сбросить»). Сохранил как
  `legacy/blocks/size-guide-section/SizeCalculator.tsx`.
- Подключение: `src/app/page.tsx` — между `<Guarantees />` и `<Faq />`
  (после SectionDivider «Вопросы»).

Селектор / id / тексты для поиска:
- `section#size-guide`;
- «Размерная сетка», «Подбор размера», «Калькулятор размера»,
  «Рост, см», «Обхват груди, см», «Рекомендуем: размер», «Сбросить»,
  «Бугор».

## Что было удалено

1. Файл `src/components/site/SizeGuide.tsx` (секция целиком: заголовок,
   описание, таблица размеров S/M/L/XL/XXL, сноска).
2. Файл `src/components/site/SizeCalculator.tsx` (калькулятор: поля
   роста/груди, блок результата, кнопка «Сбросить»).
3. `src/app/page.tsx`: import SizeGuide + `<SizeGuide />` из разметки.
4. `src/components/site/Footer.tsx`: пункт футера
   `<li><a href="#size-guide">Размерная сетка</a></li>`.
5. `src/components/site/SectionIndex.tsx`: пункт боковой навигации
   `{ id: "size-guide", label: "Размеры" }`.
6. `src/components/site/ProductDetailModal.tsx`: ссылка
   `<a href="#size-guide">Таблица размеров →</a>` рядом с лейблом «Размер»
   (лейбл и селектор размеров товара оставлены).

## Что осталось в публичной версии

- Селектор размеров S–XXL внутри карточки товара / модалки заказа
  (`ProductDetailModal`) — без ссылки на внешнюю таблицу;
- порядок секций на странице: Гарантии → Вопросы (Faq) → О компании —
  без «дыры» на месте size-guide;
- все прочие якоря футера и навигации работают.

## Зависимости

- CSS-классы: только локальные tailwind-утилиты внутри компонентов, общая
  тема не затронута; `sn-section` используется и другими секциями;
- JS-логика: калькулятор был самодостаточным клиентским компонентом
  (`useMemo`/`useState`), внешних обработчиков не имел;
- Данные: таблица размеров сохранена в `size-table-data.json` (табличные
  диапазоны + числовые границы для калькулятора);
- Ссылки / якоря: `#size-guide` — все 4 вхождения удалены (футер,
  SectionIndex, ProductDetailModal, сама секция). Проверка
  `rg "size-guide" src/` — пусто.

## Как вернуть блок

1. Скопировать `original-component.tsx` → `src/components/site/SizeGuide.tsx`,
   `SizeCalculator.tsx` → `src/components/site/SizeCalculator.tsx`.
2. В `src/app/page.tsx` вернуть import `SizeGuide` и `<SizeGuide />` между
   `<Guarantees />` (плюс SectionDivider «Вопросы») и `<Faq />`.
3. В `src/components/site/Footer.tsx` вернуть `<li>` со ссылкой
   `#size-guide` «Размерная сетка» (перед «Индивидуальный пошив»).
4. В `src/components/site/SectionIndex.tsx` вернуть пункт
   `{ id: "size-guide", label: "Размеры" }` (перед faq).
5. В `src/components/site/ProductDetailModal.tsx` вернуть ссылку
   «Таблица размеров →» (`href="#size-guide"`) рядом с лейблом «Размер».
6. При изменении сетки — синхронизировать данные в `SizeGuide.tsx`,
   `SizeCalculator.tsx` и `size-table-data.json`.
7. Пересобрать статику: `bun run build`.
8. Проверить адаптив (таблица с горизонтальным скроллом `overflow-x-auto`,
   калькулятор 2 колонки на sm+) и консоль браузера.
