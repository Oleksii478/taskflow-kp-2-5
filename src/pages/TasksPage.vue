<script setup>
import { computed, nextTick, ref } from 'vue'
import { storeToRefs } from 'pinia'
import AppTabbar from '../components/AppTabbar.vue'
import TaskCard from '../components/TaskCard.vue'
import TaskForm from '../components/TaskForm.vue'
import TaskListControls from '../components/TaskListControls.vue'
import { useTasksStore } from '../store/tasks.js'
import { useProjectsStore } from '../store/projects.js'
import '../css/task-components.css'
import '../css/task-form.css'
import '../css/task-list.css'

const taskStore = useTasksStore()
const projectStore = useProjectsStore()
const { tasks, visibleTasks, searchText, selectedStatus, selectedPriority, selectedProject, sortOrder, unfinishedOnly, completedPercent } = storeToRefs(taskStore)
const { projects } = storeToRefs(projectStore)
const formVisible = ref(false)
const editingId = ref(null)
const formAnchor = ref(null)
const feedback = ref('')
const newProjectTitle = ref('')
const newProjectError = ref('')
const editingTask = computed(() => tasks.value.find(t => t.id === editingId.value) ?? null)
const projectStats = computed(() => projects.value.map(project => ({
  ...project, taskCount: tasks.value.filter(t => t.projectId === project.id).length,
})))
async function scrollToForm() {
  await nextTick()
  formAnchor.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
async function startCreate() { editingId.value = null; formVisible.value = true; feedback.value = ''; await scrollToForm() }
async function startEdit(id) { editingId.value = id; formVisible.value = true; feedback.value = ''; await scrollToForm() }
function cancelForm() { formVisible.value = false; editingId.value = null }
function saveTask(data) {
  const isEditing = editingId.value !== null
  const saved = isEditing ? taskStore.updateTask({ id: editingId.value, ...data }) : taskStore.addTask(data)
  if (!saved) { feedback.value = 'Не вдалося зберегти завдання. Перевірте дані форми.'; return }
  feedback.value = isEditing ? `Завдання «${saved.title}» оновлено.` : `Завдання «${saved.title}» створено.`
  cancelForm()
  taskStore.resetFilters()
}
function handleDelete(id) {
  const task = tasks.value.find(t => t.id === id)
  if (!task || !window.confirm(`Видалити завдання «${task.title}»?`)) return
  if (taskStore.deleteTask(id)) {
    if (editingId.value === id) cancelForm()
    feedback.value = `Завдання «${task.title}» видалено.`
  }
}
function createProject() {
  const project = projectStore.addProject(newProjectTitle.value)
  if (!project) { newProjectError.value = 'Назва має містити 3–40 символів і не повторювати інші проєкти.'; return }
  feedback.value = `Проєкт «${project.title}» створено.`
  newProjectTitle.value = ''
  newProjectError.value = ''
  selectedProject.value = project.id
}
</script>
<template>
  <f7-page name="tasks" class="tf3-page">
    <f7-navbar title="Мої завдання" />
    <div class="tf3-container">
      <section class="tf3-hero">
        <div class="tf3-eyebrow">TASKFLOW / TASK MANAGER</div>
        <h1>Керування завданнями і проєктами</h1>
        <p>Pinia синхронізує завдання та проєкти між сторінками.</p>
        <button type="button" class="tf4-new-task" @click="startCreate">+ Додати завдання</button>
      </section>
      <section class="tf5-panel tf6-project-panel" aria-label="Мої проєкти">
        <h2>Мої проєкти</h2>
        <div class="tf6-project-list">
          <span v-for="project in projectStats" :key="project.id" class="tf6-project-pill">{{ project.title }} <strong>{{ project.taskCount }}</strong></span>
        </div>
        <form class="tf6-project-form" @submit.prevent="createProject">
          <label>Назва нового проєкту
            <input v-model="newProjectTitle" type="text" maxlength="40" placeholder="Наприклад: Лабораторні" @input="newProjectError = ''" />
          </label>
          <button type="submit" class="tf5-btn tf6-create-btn">Створити проєкт</button>
        </form>
        <p v-if="newProjectError" class="tf5-error" role="alert">{{ newProjectError }}</p>
      </section>
      <p v-if="feedback" class="tf4-feedback" role="status">{{ feedback }}</p>
      <section v-if="formVisible" ref="formAnchor" class="tf4-form-section">
        <TaskForm :key="editingId ?? 'new'" :task="editingTask" :projects="projects" @save="saveTask" @cancel="cancelForm" />
      </section>
      <TaskListControls
        v-model:search="searchText" v-model:status="selectedStatus"
        v-model:priority="selectedPriority" v-model:sort="sortOrder"
        v-model:unfinished="unfinishedOnly" v-model:project="selectedProject" :projects="projects" @reset="taskStore.resetFilters" />
      <section class="tf3-section">
        <div class="tf3-section-heading">
          <div><div class="tf3-eyebrow">TASK LIST</div><h2>Список завдань</h2></div>
          <div class="tf3-counter">Показано: {{ visibleTasks.length }} із {{ tasks.length }} · Виконано: {{ completedPercent }}%</div>
        </div>
        <div v-if="visibleTasks.length" class="tf3-task-grid">
          <TaskCard v-for="task in visibleTasks" :key="task.id" :task="task" :editable="true" :project-title="projectStore.projectTitle(task.projectId)"
            @status-change="taskStore.setTaskStatus" @priority-change="taskStore.setTaskPriority"
            @edit="startEdit" @delete="handleDelete" />
        </div>
        <div v-else class="tf5-empty">
          <p>{{ tasks.length ? 'За поточними умовами завдань не знайдено.' : 'Список завдань порожній. Створіть перше завдання.' }}</p>
          <button v-if="tasks.length" type="button" class="tf5-btn" @click="taskStore.resetFilters">Показати всі завдання</button>
          <button v-else type="button" class="tf5-btn" @click="startCreate">Додати завдання</button>
        </div>
      </section>
    </div>
    <AppTabbar active="tasks" />
  </f7-page>
</template>
