# TaskFlow — КП 2.9 (Pinia)

Продовження КП 2.8: Vue 3, Framework7, Vite, PWA, Pinia.

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

Дані навмисно зберігаються тільки в оперативній пам'яті. Після F5 повертаються демонстраційні значення (IndexedDB — наступна робота).

GitHub: https://github.com/Oleksii478/taskflow-kp-2-5
Cloudflare: https://taskflow-kp-2-5.minkevicoleksij-7ec.workers.dev
