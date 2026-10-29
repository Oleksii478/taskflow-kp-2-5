# КП 2.5 — TaskFlow

Продовження КП 2.4: Vue 3 + Framework7 + PWA. Картки завдань, Props, Emits, реактивні статуси, пріоритети та фільтрація.

## Запуск
```cmd
npm install
npm run dev
```

## Збірка
```cmd
npm run build
```

Нові компоненти: `TaskCard.vue`, `StatusBadge.vue`, `PriorityBadge.vue`; спільний реактивний стан: `src/store/tasks.js`. Зміни зберігаються до перезавантаження сторінки (без LocalStorage за методичкою).

Додатково: четвертий статистичний показник «Заплановано» та відсоток виконання.

Для окремої публікації використовуйте репозиторій `taskflow-kp-2-5`; налаштування Cloudflare: `npm run build`, `npx wrangler deploy`.
