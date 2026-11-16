<script setup>
import { storeToRefs } from 'pinia'
import AppTabbar from '../components/AppTabbar.vue'
import TaskCard from '../components/TaskCard.vue'
import { useTasksStore } from '../store/tasks.js'
import { useProjectsStore } from '../store/projects.js'
import '../css/task-components.css'
const taskStore = useTasksStore()
const projectStore = useProjectsStore()
const { totalTasks, completedTasks, progressTasks, plannedTasks, completedPercent, activeTasks } = storeToRefs(taskStore)
const { projectCount } = storeToRefs(projectStore)
</script>
<template>
<f7-page name="home" class="tf3-page">
 <f7-navbar title="TaskFlow"><f7-nav-right><f7-link href="/about/">Про застосунок</f7-link></f7-nav-right></f7-navbar>
 <div class="tf3-container">
  <section class="tf3-hero"><div class="tf3-eyebrow">TASKFLOW / DASHBOARD</div><h1>Панель керування</h1><p>Контролюйте виконання завдань та їхні пріоритети. Проєктів: {{ projectCount }}.</p></section>
  <section class="tf3-stat-grid"><div class="tf3-stat"><span class="tf3-stat-label">Усього завдань</span><strong>{{ totalTasks }}</strong></div><div class="tf3-stat"><span class="tf3-stat-label">У роботі</span><strong>{{ progressTasks }}</strong></div><div class="tf3-stat"><span class="tf3-stat-label">Виконано</span><strong>{{ completedTasks }}</strong></div><div class="tf3-stat"><span class="tf3-stat-label">Заплановано</span><strong>{{ plannedTasks }}</strong></div></section>
  <div class="tf3-progress"><div class="tf3-progress-top"><span>Прогрес виконання</span><b>{{ completedPercent }}%</b></div><div class="tf3-progress-bar"><div :style="{width: completedPercent + '%'}"></div></div></div>
  <section class="tf3-section"><div class="tf3-section-heading"><div><div class="tf3-eyebrow">PRIORITY TASKS</div><h2>Актуальні завдання</h2></div><f7-button href="/tasks/" outline small>Переглянути всі</f7-button></div>
   <div v-if="activeTasks.length" class="tf3-task-grid"><TaskCard v-for="task in activeTasks" :key="task.id" :task="task" :project-title="projectStore.projectTitle(task.projectId)" @status-change="taskStore.setTaskStatus" @priority-change="taskStore.setTaskPriority" /></div><div v-else class="tf3-empty">Наразі всі завдання виконані.</div>
  </section>
 </div><AppTabbar active="home" />
</f7-page>
</template>
