<script setup>
import { computed } from 'vue';
const props = defineProps({ priority: { type: String, required: true } });
const options = {
 low: { text: 'Низький', className: 'tf3-priority--low' },
 medium: { text: 'Середній', className: 'tf3-priority--medium' },
 high: { text: 'Високий', className: 'tf3-priority--high' },
};
const current = computed(() => options[props.priority] || { text: 'Не визначено', className: 'tf3-priority--unknown' });
</script>
<template><span class="tf3-badge" :class="current.className">{{ current.text }}</span></template>
