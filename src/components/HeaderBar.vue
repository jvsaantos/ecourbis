<!-- src/components/HeaderBar.vue -->
<template>
  <header class="header">
    <div class="header-content">
      <span class="welcome">Bem-vindo, {{ nomeUsuario }}</span>
      <button class="logout-button" @click="logout">Sair</button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const nomeUsuario = localStorage.getItem('nome') || 'Usuário';

const logout = () => {
  localStorage.clear();
  router.push('/');
};
</script>

<style scoped>
.header {
  background-color: #388E3C;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome {
  font-size: 1rem;
  font-weight: 500;
}

.logout-button {
  background-color: white;
  color: #388E3C;
  border: none;
  border-radius: 8px;
  padding: 0.4rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.logout-button:hover {
  background-color: #e0f2f1;
}
</style>
