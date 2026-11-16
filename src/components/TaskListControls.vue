<script setup>
defineProps({
  search: { type: String, default: '' },
  status: { type: String, default: 'all' },
  priority: { type: String, default: 'all' },
  sort: { type: String, default: 'newest' },
  project: { type: String, default: 'all' },
  projects: { type: Array, required: true },
  unfinished: { type: Boolean, default: false },
})
const emit = defineEmits(['update:search', 'update:status', 'update:priority', 'update:sort', 'update:project', 'update:unfinished', 'reset'])
</script>
<template>
  <section class="tf5-panel" aria-label="Пошук і фільтри">
    <div class="tf5-controls-header">
      <h2>Пошук і впорядкування</h2>
      <button type="button" class="tf5-btn" @click="emit('reset')">Скинути фільтри</button>
    </div>
    <div class="tf5-controls-grid">
      <label class="tf5-search">Пошук за назвою та описом
        <span class="tf5-search-row">
          <input type="search" :value="search" placeholder="Наприклад: інтерфейс" @input="emit('update:search', $event.target.value)" />
          <button v-if="search" type="button" class="tf5-btn" @click="emit('update:search', '')">Очистити пошук</button>
        </span>
      </label>
      <label>Статус
        <select :value="status" @change="emit('update:status', $event.target.value)">
          <option value="all">Усі статуси</option>
          <option value="todo">Заплановано</option>
          <option value="progress">У роботі</option>
          <option value="done">Виконано</option>
        </select>
      </label>
      <label>Пріоритет
        <select :value="priority" @change="emit('update:priority', $event.target.value)">
          <option value="all">Усі пріоритети</option>
          <option value="low">Низький</option>
          <option value="medium">Середній</option>
          <option value="high">Високий</option>
        </select>
      </label>
      <label>Проєкт
        <select :value="project" @change="emit('update:project', $event.target.value)">
          <option value="all">Усі проєкти</option>
          <option v-for="item in projects" :key="item.id" :value="item.id">{{ item.title }}</option>
        </select>
      </label>
      <label>Сортування
        <select :value="sort" @change="emit('update:sort', $event.target.value)">
          <option value="newest">Спочатку нові</option>
          <option value="title">За назвою (А–Я)</option>
          <option value="priority">За пріоритетом (високий перший)</option>
          <option value="dueDate">За терміном (найближчий перший)</option>
          <option value="status">За статусом (у роботі першими)</option>
          <option value="dueDateDesc">За терміном (найдальший перший)</option>
        </select>
      </label>
    </div>
    <label class="tf5-quick-filter">
      <input type="checkbox" :checked="unfinished" @change="emit('update:unfinished', $event.target.checked)" />
      Тільки невиконані
    </label>
  </section>
</template>
