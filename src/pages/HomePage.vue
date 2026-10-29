<script setup>
import { computed } from 'vue';
import AppTabbar from '../components/AppTabbar.vue';
import TaskCard from '../components/TaskCard.vue';
import { taskState, setTaskStatus, setTaskPriority } from '../store/tasks.js';
import '../css/task-components.css';
const totalTasks = computed(() => taskState.tasks.length);
const completedTasks = computed(() => taskState.tasks.filter(t => t.status === 'done').length);
const progressTasks = computed(() => taskState.tasks.filter(t => t.status === 'progress').length);
const plannedTasks = computed(() => taskState.tasks.filter(t => t.status === 'todo').length);
const percentDone = computed(() => totalTasks.value ? Math.round(completedTasks.value / totalTasks.value * 100) : 0);
const activeTasks = computed(() => {
 const order = { high: 0, medium: 1, low: 2 };
 return taskState.tasks.filter(t => t.status !== 'done').sort((a,b) => order[a.priority] - order[b.priority]).slice(0,3);
});
</script>
<template>
<f7-page name="home" class="tf3-page">
 <f7-navbar title="TaskFlow"><f7-nav-right><f7-link href="/about/">Про застосунок</f7-link></f7-nav-right></f7-navbar>
 <div class="tf3-container">
  <section class="tf3-hero"><div class="tf3-eyebrow">TASKFLOW / DASHBOARD</div><h1>Панель керування</h1><p>Контролюйте виконання завдань та їхні пріоритети.</p></section>
  <section class="tf3-stat-grid"><div class="tf3-stat"><span class="tf3-stat-label">Усього завдань</span><strong>{{ totalTasks }}</strong></div><div class="tf3-stat"><span class="tf3-stat-label">У роботі</span><strong>{{ progressTasks }}</strong></div><div class="tf3-stat"><span class="tf3-stat-label">Виконано</span><strong>{{ completedTasks }}</strong></div><div class="tf3-stat"><span class="tf3-stat-label">Заплановано</span><strong>{{ plannedTasks }}</strong></div></section>
  <div class="tf3-progress"><div class="tf3-progress-top"><span>Прогрес виконання</span><b>{{ percentDone }}%</b></div><div class="tf3-progress-bar"><div :style="{width: percentDone + '%'}"></div></div></div>
  <section class="tf3-section"><div class="tf3-section-heading"><div><div class="tf3-eyebrow">PRIORITY TASKS</div><h2>Актуальні завдання</h2></div><f7-button href="/tasks/" outline small>Переглянути всі</f7-button></div>
   <div v-if="activeTasks.length" class="tf3-task-grid"><TaskCard v-for="task in activeTasks" :key="task.id" :task="task" @status-change="setTaskStatus" @priority-change="setTaskPriority" /></div><div v-else class="tf3-empty">Наразі всі завдання виконані.</div>
  </section>
 </div><AppTabbar active="home" />
</f7-page>
</template>
