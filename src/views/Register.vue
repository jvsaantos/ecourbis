<template>
  <div class="page-wrapper" style="align-items:center; min-height:100vh;">
    <div class="page-card page-card--sm">
      <RouterLink to="/" class="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Voltar ao login
      </RouterLink>

      <img src="/logo_grafismo_preciso_transparente.png" alt="EcoUrbis" class="page-logo" />
      <h2 class="page-title">Criar conta</h2>
      <p class="page-subtitle">Preencha os dados para se cadastrar</p>

      <form @submit.prevent="handleRegister" class="form-group">
        <AppInput v-model="form.nome" label="Nome completo" placeholder="Seu nome" required />
        <AppInput
          v-model="form.cpf"
          label="CPF"
          placeholder="Somente números"
          :maxlength="11"
          @input="form.cpf = form.cpf.replace(/\D/g, '').slice(0, 11)"
          required
        />
        <AppInput v-model="form.email" type="email" label="E-mail" placeholder="seu@email.com" required />
        <AppInput v-model="form.senha" type="password" label="Senha" placeholder="Mínimo 6 caracteres" :minlength="6" required />

        <div v-if="erro" class="alert alert--error" role="alert">{{ erro }}</div>
        <div v-if="sucesso" class="alert alert--success" role="status">{{ sucesso }}</div>

        <AppButton type="submit" :loading="loading" :full="true">
          Cadastrar
        </AppButton>
      </form>

      <p class="auth-footer">
        Já tem conta?
        <RouterLink to="/" class="auth-link--highlight">Entrar</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import AppInput from '../components/AppInput.vue';
import AppButton from '../components/AppButton.vue';
import { authService } from '../services/api';

const router = useRouter();

const form = reactive({ nome: '', cpf: '', email: '', senha: '' });
const erro = ref('');
const sucesso = ref('');
const loading = ref(false);

const handleRegister = async () => {
  erro.value = '';
  sucesso.value = '';
  loading.value = true;
  try {
    await authService.register(form);
    sucesso.value = 'Conta criada com sucesso! Redirecionando...';
    setTimeout(() => router.push('/'), 1800);
  } catch (err) {
    erro.value = err.response?.data?.erro || 'Erro ao criar conta. Tente novamente.';
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
