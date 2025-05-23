<template>
  <div class="login-wrapper">
    <div class="login-card">
      <img src="/logo_grafismo_preciso_transparente.png" alt="ECOURBIS Logo" class="login-logo" />
      <h2 class="login-title">Recuperar Senha</h2>
      <p class="login-subtitle">Informe seu e-mail para receber o link de redefinição</p>
      <form @submit.prevent="recover">
        <div class="form-group">
          <label class="label-text" for="email">E-mail cadastrado</label>
          <input type="email" id="email" v-model="email" class="input-box" required />
        </div>
        <button type="submit" class="button-primary">Enviar link</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const email = ref('');
const recover = () => {
  console.log("Recuperação de senha para:", );
};
</script>

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
  margin-bottom: 1.2rem;
}

.login-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.login-subtitle {
  font-size: 0.95rem;
  margin-bottom: 2rem;
  color: #666;
}

.form-group {
  text-align: left;
  margin-bottom: 1.25rem;
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
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button-primary:hover {
  background-color: #1B5E20;
}
</style>