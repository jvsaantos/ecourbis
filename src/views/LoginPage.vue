<template>
  <div class="auth-layout">
    <div class="auth-panel auth-panel--brand">
      <img src="/logo_grafismo_preciso_transparente.png" alt="EcoUrbis" class="brand-logo" />
      <h1 class="brand-title">EcoUrbis</h1>
      <p class="brand-tagline">Transformando resíduos em valor para a cidade</p>
      <div class="brand-stats">
        
        <div class="brand-stat">
          <span class="brand-stat__number">♻</span>
          <span class="brand-stat__label">Economia Circular</span>
        </div>
      </div>
    </div>

    <div class="auth-panel auth-panel--form">
      <div class="auth-card">
        <img src="/logo_grafismo_preciso_transparente.png" alt="EcoUrbis" class="auth-card__logo" />
        <h2 class="auth-card__title">Bem-vindo de volta</h2>
        <p class="auth-card__subtitle">Entre com seu CPF ou CNPJ para continuar</p>

        <form @submit.prevent="handleLogin" class="auth-form">
          <AppInput
            v-model="cpfCnpj"
            label="CPF ou CNPJ"
            placeholder="Somente números"
            :maxlength="14"
            @input="cpfCnpj = cpfCnpj.replace(/\D/g, '').slice(0, 14)"
            required
            id="cpf"
          >
            <template #icon>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
              </svg>
            </template>
          </AppInput>

          <AppInput
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Senha"
            placeholder="Sua senha"
            required
            id="password"
          >
            <template #icon>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </template>
          </AppInput>

          <div v-if="erro" class="alert alert--error" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ erro }}
          </div>

          <AppButton type="submit" :loading="loading" :full="true">
            Entrar
          </AppButton>
          
          <AppButton type="button" variant="secondary" :full="true" @click="router.push('/seja-parceiro')">
            Cadastrar Empresa Parceira
          </AppButton>
        </form>

        <div class="auth-links">
          <RouterLink to="/forgot" class="auth-link">Esqueci minha senha</RouterLink>
          <RouterLink to="/register" class="auth-link auth-link--highlight">Criar conta</RouterLink>
        </div>

        <div class="parceiro-banner">
          <div class="parceiro-banner__text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            Sua empresa quer reduzir impostos?
          </div>
          <RouterLink to="/seja-parceiro" class="parceiro-banner__link">
            Seja parceiro
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppInput from '../components/AppInput.vue';
import AppButton from '../components/AppButton.vue';
import { authService } from '../services/api';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { salvarSessao } = useAuth();

const cpfCnpj = ref('');
const password = ref('');
const erro = ref('');
const loading = ref(false);
const showPassword = ref(false);

const handleLogin = async () => {
  erro.value = '';
  loading.value = true;
  try {
    const { data } = await authService.login(cpfCnpj.value, password.value);
    salvarSessao({ cpf: data.beneficiario.cpf, nome: data.beneficiario.nome });
    router.push('/select-profile');
  } catch (err) {
    erro.value = err.response?.data?.erro || 'CPF/CNPJ ou senha incorretos.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-layout {
  display: flex;
  min-height: 100vh;
}

/* Brand panel — visible only on wider screens */
.auth-panel--brand {
  display: none;
  background: linear-gradient(160deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
  color: #fff;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  gap: 1rem;
}

@media (min-width: 768px) {
  .auth-panel--brand { display: flex; }
}

.brand-logo {
  width: 80px;
  filter: brightness(0) invert(1);
  margin-bottom: 0.5rem;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -1px;
}

.brand-tagline {
  font-size: 1rem;
  opacity: 0.85;
  margin: 0;
  text-align: center;
  max-width: 260px;
  line-height: 1.5;
}

.brand-stats {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}

.brand-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: rgba(255,255,255,0.12);
  border-radius: 12px;
  padding: 1rem 1.5rem;
}

.brand-stat__number {
  font-size: 1.75rem;
  font-weight: 700;
}

.brand-stat__label {
  font-size: 0.75rem;
  opacity: 0.8;
  text-align: center;
}

/* Form panel */
.auth-panel--form {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 2rem 1rem;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.auth-card__logo {
  width: 60px;
  margin: 0 auto 0.75rem;
}

.auth-card__title {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 0.25rem;
}

.auth-card__subtitle {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-align: center;
  margin: 0 0 1.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-links {
  display: flex;
  justify-content: space-between;
  margin-top: 1.25rem;
  font-size: 0.875rem;
}

.auth-link {
  color: var(--color-text-secondary);
  transition: color var(--transition);
}

.auth-link:hover { color: var(--color-primary); text-decoration: none; }

.auth-link--highlight {
  color: var(--color-primary);
  font-weight: 600;
}

.parceiro-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding: 0.75rem 1rem;
  background: var(--color-primary-light);
  border: 1px solid #c8e6c9;
  border-radius: var(--radius-md);
  font-size: 0.82rem;
}

.parceiro-banner__text {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--color-primary-dark);
  font-weight: 500;
}

.parceiro-banner__link {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--color-primary-dark);
  font-weight: 700;
  white-space: nowrap;
  transition: gap var(--transition);
}

.parceiro-banner__link:hover {
  gap: 0.5rem;
  text-decoration: none;
}
</style>
