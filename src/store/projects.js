import { defineStore } from 'pinia'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [
      { id: 'general', title: 'Загальні' },
      { id: 'study', title: 'Навчання' },
      { id: 'personal', title: 'Особисті' },
    ],
    nextProjectId: 1,
  }),
  getters: {
    projectCount: state => state.projects.length,
    projectTitle: state => id => state.projects.find(p => p.id === id)?.title ?? 'Загальні',
  },
  actions: {
    addProject(rawTitle) {
      const title = String(rawTitle ?? '').trim()
      if (title.length < 3 || title.length > 40) return null
      if (this.projects.some(p => p.title.toLocaleLowerCase('uk-UA') === title.toLocaleLowerCase('uk-UA'))) return null
      const project = { id: `project-${this.nextProjectId++}`, title }
      this.projects.push(project)
      return project
    },
  },
})
