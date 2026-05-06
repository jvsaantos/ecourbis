<template>
  <div class="page-wrapper" style="align-items:center; min-height:100vh;">
    <div class="page-card page-card--sm">
      <div class="icon-circle">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      </div>

      <h2 class="page-title">Nova senha</h2>
      <p class="page-subtitle">Escolha uma senha segura com pelo menos 6 caracteres</p>

      <form @submit.prevent="handleReset" class="form-group">
        <AppInput
          v-model="novaSenha"
          type="password"
          label="Nova senha"
          placeholder="Mínimo 6 caracteres"
          :minlength="6"
          required
        />
        <AppInput
          v-model="confirmSenha"
          type="password"
          label="Confirmar nova senha"
          placeholder="Repita a senha"
          :error="senhasErro"
          required
        />

        <div v-if="erro" class="alert alert--error">{{ erro }}</div>
        <div v-if="sucesso" class="alert alert--success">{{ sucesso }}</div>

        <AppButton type="submit" :loading="loading" :full="true">
          Salvar nova senha
        </AppButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AppInput from '../components/AppInput.vue';
import AppButton from '../components/AppButton.vue';
import { authService } from '../services/api';

const router = useRouter();
const novaSenha = ref('');
const confirmSenha = ref('');
const erro = ref('');
const sucesso = ref('');
const loading = ref(false);

const senhasErro = computed(() =>
  confirmSenha.value && novaSenha.value !== confirmSenha.value ? 'As senhas não coincidem' : ''
);

const handleReset = async () => {
  if (senhasErro.value) return;
  erro.value = '';
  loading.value = true;
  try {
    const token = new URLSearchParams(window.location.search).get('token') || '';
    await authService.resetPassword(token, novaSenha.value);
    sucesso.value = 'Senha redefinida! Redirecionando...';
    setTimeout(() => router.push('/'), 1800);
  } catch (err) {
    erro.value = err.response?.data?.erro || 'Erro ao redefinir senha.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
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
</style>
