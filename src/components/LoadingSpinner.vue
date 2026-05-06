<template>
  <div :class="['spinner-wrap', { 'spinner-wrap--full': full }]">
    <div :class="['spinner', `spinner--${size}`]"></div>
    <p v-if="label" class="spinner-label">{{ label }}</p>
  </div>
</template>

<script setup>
defineProps({
  size: { type: String, default: 'md' },
  label: { type: String, default: '' },
  full: { type: Boolean, default: false },
});
</script>

<style scoped>
.spinner-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
}

.spinner-wrap--full {
  min-height: 200px;
}

.spinner {
  border-radius: 50%;
  border-style: solid;
  border-color: var(--color-primary-light);
  border-top-color: var(--color-primary);
  animation: spin 0.8s linear infinite;
}

.spinner--sm { width: 20px; height: 20px; border-width: 2px; }
.spinner--md { width: 36px; height: 36px; border-width: 3px; }
.spinner--lg { width: 52px; height: 52px; border-width: 4px; }

.spinner-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
