<template>
  <div class="login-wrapper">
    <div class="login-card">
      <img src="/logo_grafismo_preciso_transparente.png" alt="ECOURBIS Logo" class="login-logo" />
      <h2 class="login-title">Bem-vindo ao <span class="highlight">ECOURBIS</span></h2>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="cpf" class="label-text">CPF ou CNPJ</label>
          <input
            type="text"
            id="cpf"
            v-model="cpfCnpj"
            class="input-box"
            maxlength="14"
            @input="formatCpfCnpj"
            placeholder="Somente números"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="label-text">Senha</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="input-box"
            required
          />
        </div>

        <button type="submit" class="button-primary">Entrar</button>

        <p v-if="erro" class="login-error">{{ erro }}</p>
      </form>

      <div class="login-links">
        <a href="/forgot" class="login-link">Esqueci minha senha</a>
        <a href="/register" class="login-link">Criar conta</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginBeneficiario } from '../apis/auth'; // função da API

const router = useRouter();
const cpfCnpj = ref('');
const password = ref('');
const erro = ref('');

const formatCpfCnpj = () => {
  cpfCnpj.value = cpfCnpj.value.replace(/\D/g, '').slice(0, 14); // Apenas números
};

const handleLogin = async () => {
  erro.value = '';

  try {
    const response = await loginBeneficiario(cpfCnpj.value, password.value);
    
    // Armazena localmente os dados (pode usar store depois)
    localStorage.setItem('cpf', response.beneficiario.cpf);
    localStorage.setItem('nome', response.beneficiario.nome);

    // Redireciona
    router.push('/select-profile');
  } catch (err) {
    erro.value = err.response?.data?.erro || 'Erro ao fazer login.';
  }
};
</script>

<style scoped>
.login-error {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}
</style>


<style scoped>
.login-error {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}
</style>


<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  padding: 1rem;
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-sizing: border-box;
}

.login-logo {
  width: 110px;
  margin-bottom: 0.3rem;
}

.login-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.highlight {
  color: #388E3C;
}

.login-subtitle {
  font-size: 0.95rem;
  margin-bottom: 2rem;
  color: #666;
}

.form-group {
  text-align: left;
  margin-bottom: 1.25rem;
  margin-top: 1rem;
}

.input-box {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.button-primary {
  background-color: #388E3C;
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button-primary:hover {
  background-color: #1B5E20;
}

.login-links {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.login-link {
  color: #388E3C;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}
</style>
