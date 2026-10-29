<script setup>
import { computed } from 'vue';
const props = defineProps({ status: { type: String, required: true } });
const options = {
 todo: { text: 'Заплановано', className: 'tf3-status--todo' },
 progress: { text: 'У роботі', className: 'tf3-status--progress' },
 done: { text: 'Виконано', className: 'tf3-status--done' },
};
const current = computed(() => options[props.status] || { text: 'Невідомо', className: 'tf3-status--unknown' });
</script>
<template><span class="tf3-badge" :class="current.className">{{ current.text }}</span></template>
