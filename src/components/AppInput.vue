<template>
  <div class="app-input">
    <label v-if="label" :for="inputId" class="app-input__label">{{ label }}</label>
    <div :class="['app-input__wrapper', { 'app-input__wrapper--error': error, 'app-input__wrapper--focus': focused }]">
      <span v-if="$slots.icon" class="app-input__icon">
        <slot name="icon" />
      </span>
      <component
        :is="type === 'textarea' ? 'textarea' : 'input'"
        :id="inputId"
        :type="type !== 'textarea' ? type : undefined"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        v-bind="$attrs"
        class="app-input__field"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="focused = true"
        @blur="focused = false"
      />
    </div>
    <p v-if="error" class="app-input__error">{{ error }}</p>
    <p v-else-if="hint" class="app-input__hint">{{ hint }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  id: { type: String, default: '' },
});

defineEmits(['update:modelValue']);

const focused = ref(false);
const inputId = computed(() => props.id || `input-${Math.random().toString(36).slice(2, 7)}`);
</script>

<style scoped>
.app-input { display: flex; flex-direction: column; gap: 0.35rem; }

.app-input__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.app-input__wrapper {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.app-input__wrapper--focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(56,142,60,0.15);
}

.app-input__wrapper--error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.12);
}

.app-input__icon {
  padding: 0 0.75rem;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
}

.app-input__field {
  flex: 1;
  padding: 0.75rem;
  border: none;
  outline: none;
  font-size: 0.95rem;
  font-family: inherit;
  color: var(--color-text);
  background: transparent;
  width: 100%;
}

.app-input__field:disabled { opacity: 0.55; cursor: not-allowed; }

.app-input__error { font-size: 0.8rem; color: #ef4444; margin: 0; }
.app-input__hint { font-size: 0.8rem; color: var(--color-text-secondary); margin: 0; }
</style>
