# TaskFlow — КП 2.10 (IndexedDB)

Продовження КП 2.9: Vue 3, Framework7, Vite, PWA, Pinia та idb.

## Запуск

```bash
npm install
npm run dev
```

## Перевірка збірки

```bash
npm run build
```

## Реалізовано

- Pinia-сховища `tasks` і `projects` (state, getters, actions)
- Каталог проєктів: Загальні, Навчання, Особисті; створення нового
- Проєкт в картці та формі завдання, фільтрація за проєктом
- CRUD, пошук, фільтрація, сортування, швидкий фільтр «Тільки невиконані»
- Спільні статистика й дані між головною сторінкою та сторінкою завдань
- PWA-збірка через Vite

Завдання й проєкти відновлюються з IndexedDB після F5. Дані прив’язані до адреси сайту та профілю браузера. Пошук і фільтри скидаються після F5. Після першого онлайн-запуску Service Worker дозволяє відкрити PWA без мережі.

GitHub: https://github.com/Oleksii478/taskflow-kp-2-5
Cloudflare: https://taskflow-kp-2-5.minkevicoleksij-7ec.workers.dev
