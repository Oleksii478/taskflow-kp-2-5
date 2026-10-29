import { reactive } from 'vue';
import initialTasks from '../data/tasks.js';
const statuses = ['todo', 'progress', 'done'];
const priorities = ['low', 'medium', 'high'];
export const taskState = reactive({ tasks: initialTasks.map(t => ({ ...t })) });
export function setTaskStatus({ id, status }) {
 if (!statuses.includes(status)) return;
 const task = taskState.tasks.find(t => t.id === id);
 if (task) task.status = status;
}
export function setTaskPriority({ id, priority }) {
 if (!priorities.includes(priority)) return;
 const task = taskState.tasks.find(t => t.id === id);
 if (task) task.priority = priority;
}
