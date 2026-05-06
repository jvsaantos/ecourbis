<template>
  <button
    :class="['app-btn', `app-btn--${variant}`, { 'app-btn--loading': loading, 'app-btn--full': full }]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="app-btn__spinner" aria-hidden="true"></span>
    <span :class="{ 'app-btn__label--hidden': loading }">
      <slot />
    </span>
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  full: { type: Boolean, default: false },
});
</script>

<style scoped>
.app-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;
}

.app-btn--full { width: 100%; }

.app-btn--primary {
  background-color: var(--color-primary);
  color: #fff;
}
.app-btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(56,142,60,0.35);
}

.app-btn--secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}
.app-btn--secondary:hover:not(:disabled) {
  background-color: var(--color-primary-light);
}

.app-btn--ghost {
  background-color: transparent;
  color: var(--color-text-secondary);
}
.app-btn--ghost:hover:not(:disabled) {
  background-color: var(--color-surface-alt);
}

.app-btn--danger {
  background-color: #ef4444;
  color: #fff;
}
.app-btn--danger:hover:not(:disabled) {
  background-color: #dc2626;
}

.app-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.app-btn__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  position: absolute;
}

.app-btn__label--hidden { opacity: 0; }

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
