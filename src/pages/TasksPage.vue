<script setup>
import { computed, nextTick, ref } from 'vue'
import AppTabbar from '../components/AppTabbar.vue'
import TaskCard from '../components/TaskCard.vue'
import TaskForm from '../components/TaskForm.vue'
import TaskListControls from '../components/TaskListControls.vue'
import { taskState, addTask, updateTask, deleteTask, setTaskStatus, setTaskPriority } from '../store/tasks.js'
import '../css/task-components.css'
import '../css/task-form.css'
import '../css/task-list.css'

const searchText = ref('')
const selectedStatus = ref('all')
const selectedPriority = ref('all')
const sortOrder = ref('newest')
const unfinishedOnly = ref(false)
const formVisible = ref(false)
const editingId = ref(null)
const formAnchor = ref(null)
const feedback = ref('')
const editingTask = computed(() => taskState.tasks.find(task => task.id === editingId.value) ?? null)
const priorityWeight = { high: 3, medium: 2, low: 1 }
const statusWeight = { progress: 0, todo: 1, done: 2 }

const visibleTasks = computed(() => {
  const term = searchText.value.trim().toLocaleLowerCase('uk-UA')
  // filter() returns a new array: sort() never mutates the original reactive store.
  const result = taskState.tasks.filter(task => {
    const text = `${task.title} ${task.description ?? ''}`.toLocaleLowerCase('uk-UA')
    return (!term || text.includes(term)) &&
      (selectedStatus.value === 'all' || task.status === selectedStatus.value) &&
      (selectedPriority.value === 'all' || task.priority === selectedPriority.value) &&
      (!unfinishedOnly.value || task.status !== 'done')
  })
  return result.sort((a, b) => {
    if (sortOrder.value === 'title') return a.title.localeCompare(b.title, 'uk-UA') || a.id - b.id
    if (sortOrder.value === 'priority') return priorityWeight[b.priority] - priorityWeight[a.priority] || b.id - a.id
    if (sortOrder.value === 'status') return statusWeight[a.status] - statusWeight[b.status] || b.id - a.id
    if (sortOrder.value === 'dueDate' || sortOrder.value === 'dueDateDesc') {
      if (!a.dueDate) return b.dueDate ? 1 : b.id - a.id
      if (!b.dueDate) return -1
      const comparison = a.dueDate.localeCompare(b.dueDate)
      return (sortOrder.value === 'dueDate' ? comparison : -comparison) || b.id - a.id
    }
    return b.id - a.id
  })
})
const completedPercent = computed(() => !taskState.tasks.length ? 0 : Math.round(100 * taskState.tasks.filter(t => t.status === 'done').length / taskState.tasks.length))

function resetFilters() {
  searchText.value = ''
  selectedStatus.value = 'all'
  selectedPriority.value = 'all'
  sortOrder.value = 'newest'
  unfinishedOnly.value = false
}
async function scrollToForm() {
  await nextTick()
  formAnchor.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
async function startCreate() {
  editingId.value = null
  formVisible.value = true
  feedback.value = ''
  await scrollToForm()
}
async function startEdit(id) {
  editingId.value = id
  formVisible.value = true
  feedback.value = ''
  await scrollToForm()
}
function cancelForm() { formVisible.value = false; editingId.value = null }
function saveTask(data) {
  const isEditing = editingId.value !== null
  const saved = isEditing ? updateTask({ id: editingId.value, ...data }) : addTask(data)
  if (!saved) { feedback.value = 'Не вдалося зберегти завдання. Перевірте дані форми.'; return }
  feedback.value = isEditing ? `Завдання «${saved.title}» оновлено.` : `Завдання «${saved.title}» створено.`
  cancelForm()
  resetFilters()
}
function handleDelete(id) {
  const task = taskState.tasks.find(item => item.id === id)
  if (!task) return
  if (!window.confirm(`Видалити завдання «${task.title}»?`)) return
  if (deleteTask(id)) {
    if (editingId.value === id) cancelForm()
    feedback.value = `Завдання «${task.title}» видалено.`
  }
}
</script>
<template>
  <f7-page name="tasks" class="tf3-page">
    <f7-navbar title="Мої завдання" />
    <div class="tf3-container">
      <section class="tf3-hero">
        <div class="tf3-eyebrow">TASKFLOW / TASK MANAGER</div>
        <h1>Керування завданнями</h1>
        <p>Створюйте, редагуйте, шукайте, сортуйте та видаляйте завдання.</p>
        <button type="button" class="tf4-new-task" @click="startCreate">+ Додати завдання</button>
      </section>
      <p v-if="feedback" class="tf4-feedback" role="status">{{ feedback }}</p>
      <section v-if="formVisible" ref="formAnchor" class="tf4-form-section">
        <TaskForm :key="editingId ?? 'new'" :task="editingTask" @save="saveTask" @cancel="cancelForm" />
      </section>
      <TaskListControls
        v-model:search="searchText" v-model:status="selectedStatus"
        v-model:priority="selectedPriority" v-model:sort="sortOrder"
        v-model:unfinished="unfinishedOnly" @reset="resetFilters" />
      <section class="tf3-section">
        <div class="tf3-section-heading">
          <div><div class="tf3-eyebrow">TASK LIST</div><h2>Список завдань</h2></div>
          <div class="tf3-counter">Показано: {{ visibleTasks.length }} із {{ taskState.tasks.length }} · Виконано: {{ completedPercent }}%</div>
        </div>
        <div v-if="visibleTasks.length" class="tf3-task-grid">
          <TaskCard v-for="task in visibleTasks" :key="task.id" :task="task" :editable="true"
            @status-change="setTaskStatus" @priority-change="setTaskPriority"
            @edit="startEdit" @delete="handleDelete" />
        </div>
        <div v-else class="tf5-empty">
          <p>{{ taskState.tasks.length ? 'За поточними умовами завдань не знайдено.' : 'Список завдань порожній. Створіть перше завдання.' }}</p>
          <button v-if="taskState.tasks.length" type="button" class="tf5-btn" @click="resetFilters">Показати всі завдання</button>
          <button v-else type="button" class="tf5-btn" @click="startCreate">Додати завдання</button>
        </div>
      </section>
    </div>
    <AppTabbar active="tasks" />
  </f7-page>
</template>
