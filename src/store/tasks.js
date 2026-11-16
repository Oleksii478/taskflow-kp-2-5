import { defineStore } from 'pinia'
import initialTasks from '../data/tasks.js'
import { useProjectsStore } from './projects.js'

const statuses = ['todo', 'progress', 'done']
const priorities = ['low', 'medium', 'high']
const priorityRank = { high: 3, medium: 2, low: 1 }
const statusRank = { progress: 0, todo: 1, done: 2 }

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T12:00:00`)
  return !Number.isNaN(date.getTime()) &&
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` === value
}
function normalize(values, projects) {
  if (!values || typeof values !== 'object') return null
  const title = String(values.title ?? '').trim()
  const description = String(values.description ?? '').trim()
  const dueDate = String(values.dueDate ?? '')
  if (title.length < 3 || title.length > 80 || description.length > 300 || !validDate(dueDate)) return null
  if (!statuses.includes(values.status) || !priorities.includes(values.priority)) return null
  const requested = String(values.projectId ?? 'general')
  const projectId = projects.some(p => p.id === requested) ? requested : 'general'
  return { title, description, dueDate, status: values.status, priority: values.priority, projectId }
}
export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: initialTasks.map(t => ({ ...t, projectId: t.projectId ?? 'general' })),
    searchText: '', selectedStatus: 'all', selectedPriority: 'all', selectedProject: 'all',
    sortOrder: 'newest', unfinishedOnly: false,
  }),
  getters: {
    totalTasks: s => s.tasks.length,
    completedTasks: s => s.tasks.filter(t => t.status === 'done').length,
    progressTasks: s => s.tasks.filter(t => t.status === 'progress').length,
    plannedTasks: s => s.tasks.filter(t => t.status === 'todo').length,
    completedPercent: s => s.tasks.length ? Math.round(s.tasks.filter(t => t.status === 'done').length / s.tasks.length * 100) : 0,
    activeTasks: s => s.tasks.filter(t => t.status !== 'done')
      .slice().sort((a,b) => priorityRank[b.priority] - priorityRank[a.priority] || b.id - a.id).slice(0,3),
    visibleTasks: s => {
      const search = s.searchText.trim().toLocaleLowerCase('uk-UA')
      const filtered = s.tasks.filter(t => {
        const text = `${t.title} ${t.description ?? ''}`.toLocaleLowerCase('uk-UA')
        return (!search || text.includes(search)) &&
          (s.selectedStatus === 'all' || t.status === s.selectedStatus) &&
          (s.selectedPriority === 'all' || t.priority === s.selectedPriority) &&
          (s.selectedProject === 'all' || t.projectId === s.selectedProject) &&
          (!s.unfinishedOnly || t.status !== 'done')
      })
      return filtered.sort((a,b) => {
        if (s.sortOrder === 'title') return a.title.localeCompare(b.title, 'uk-UA') || a.id-b.id
        if (s.sortOrder === 'priority') return priorityRank[b.priority] - priorityRank[a.priority] || b.id-a.id
        if (s.sortOrder === 'status') return statusRank[a.status] - statusRank[b.status] || b.id-a.id
        if (s.sortOrder === 'dueDate' || s.sortOrder === 'dueDateDesc') {
          if (!a.dueDate) return b.dueDate ? 1 : b.id-a.id
          if (!b.dueDate) return -1
          const diff = a.dueDate.localeCompare(b.dueDate)
          return (s.sortOrder === 'dueDate' ? diff : -diff) || b.id-a.id
        }
        return b.id-a.id
      })
    },
  },
  actions: {
    addTask(values) {
      const valuesOK = normalize(values, useProjectsStore().projects)
      if (!valuesOK) return null
      const id = Math.max(0, ...this.tasks.map(t => t.id)) + 1
      const task = { id, ...valuesOK }
      this.tasks.push(task)
      return task
    },
    updateTask({ id, ...values }) {
      const task = this.tasks.find(t => t.id === Number(id))
      if (!task) return null
      const valuesOK = normalize(values, useProjectsStore().projects)
      if (!valuesOK) return null
      Object.assign(task, valuesOK)
      return task
    },
    deleteTask(id) {
      const index = this.tasks.findIndex(t => t.id === Number(id))
      if (index < 0) return false
      this.tasks.splice(index, 1)
      return true
    },
    setTaskStatus({ id, status }) {
      if (!statuses.includes(status)) return false
      const task = this.tasks.find(t => t.id === Number(id))
      if (!task) return false
      task.status = status
      return true
    },
    setTaskPriority({ id, priority }) {
      if (!priorities.includes(priority)) return false
      const task = this.tasks.find(t => t.id === Number(id))
      if (!task) return false
      task.priority = priority
      return true
    },
    resetFilters() {
      this.searchText = ''
      this.selectedStatus = 'all'
      this.selectedPriority = 'all'
      this.selectedProject = 'all'
      this.sortOrder = 'newest'
      this.unfinishedOnly = false
    },
  },
})
