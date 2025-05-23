<template>
  <div>
    <HeaderBar />
    <div class="login-wrapper">
      <div class="login-card">
        <img src="/public/logo_grafismo_preciso_transparente.png" alt="ECOURBIS Logo" class="login-logo" />
        <h2 class="ms-0 login-title">Selecione seu perfil</h2>
        <p class="login-subtitle">Escolha como deseja acessar o sistema</p>
        <div class="profile-options">
          <div class="profile-card" @click="select('beneficiario')">
            <span>Beneficiário</span>
          </div>
          <div class="profile-card" @click="select('empresa')">
            <span>Empresa Parceira</span>
          </div>
          <div class="profile-card" @click="select('coleta')">
            <span>Funcionário de Coleta</span>
          </div>
          <div class="profile-card" @click="select('central')">
            <span>Central de Tratamento</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeaderBar from '../components/HeaderBar.vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const select = (perfil) => {
  console.log("Perfil selecionado:", perfil);
  router.push(`/perfil/${perfil}`);
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  padding: 3rem 1rem 2rem;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  text-align: center;
  box-sizing: border-box;
}

.login-logo {
  width: 110px;

}

.login-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.login-subtitle {
  font-size: 0.95rem;
  margin-bottom: 2rem;
  color: #666;
}

.profile-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-top: 1rem;
}

.profile-card {
  background: #f1f1f1;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.profile-card:hover {
  background: #e0f2f1;
  transform: translateY(-3px);
}

.profile-card img {
  width: 50px;
  height: 50px;
  margin-bottom: 0.5rem;
}
</style>
