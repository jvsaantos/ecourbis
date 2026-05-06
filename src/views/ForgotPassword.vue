<template>
  <div class="page-wrapper" style="align-items:center; min-height:100vh;">
    <div class="page-card page-card--sm">
      <RouterLink to="/" class="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Voltar ao login
      </RouterLink>

      <div class="icon-circle">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      </div>

      <h2 class="page-title">Recuperar senha</h2>
      <p class="page-subtitle">Informe seu e-mail e enviaremos um link de redefinição</p>

      <div v-if="!enviado">
        <form @submit.prevent="handleSubmit" class="form-group">
          <AppInput v-model="email" type="email" label="E-mail cadastrado" placeholder="seu@email.com" required />
          <div v-if="erro" class="alert alert--error">{{ erro }}</div>
          <AppButton type="submit" :loading="loading" :full="true">Enviar link</AppButton>
        </form>
      </div>

      <div v-else class="success-state">
        <div class="success-icon">✓</div>
        <p class="success-text">
          Link enviado para <strong>{{ email }}</strong>.<br/>
          Verifique sua caixa de entrada.
        </p>
        <AppButton variant="secondary" :full="true" @click="enviado = false">
          Reenviar link
        </AppButton>
      </div>

      <p class="auth-footer">
        Lembrou a senha?
        <RouterLink to="/" class="auth-link--highlight">Entrar</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppInput from '../components/AppInput.vue';
import AppButton from '../components/AppButton.vue';
import { authService } from '../services/api';

const email = ref('');
const erro = ref('');
const loading = ref(false);
const enviado = ref(false);

const handleSubmit = async () => {
  erro.value = '';
  loading.value = true;
  try {
    await authService.forgotPassword(email.value);
    enviado.value = true;
  } catch (err) {
    erro.value = err.response?.data?.erro || 'Erro ao enviar e-mail. Tente novamente.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
  transition: color var(--transition);
}
.back-link:hover { color: var(--color-primary); text-decoration: none; }

.icon-circle {
  width: 64px;
  height: 64px;
  background: var(--color-primary-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  color: var(--color-primary);
}

.success-state { text-align: center; padding: 1rem 0; }

.success-icon {
  width: 56px;
  height: 56px;
  background: #dcfce7;
  color: var(--color-success);
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.success-text {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.auth-footer {
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 1.25rem;
}

.auth-link--highlight {
  color: var(--color-primary);
  font-weight: 600;
}
</style>
