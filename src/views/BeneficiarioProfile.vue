<template>
  <HeaderBar />

  <div class="login-wrapper">
    <div class="login-card">
      <img src="/logo_grafismo_preciso_transparente.png" alt="ECOURBIS Logo" class="login-logo" />
      <h2 class="login-title">Olá, {{ usuario.nome }}!</h2>
      <p class="login-subtitle">Seu saldo atual de créditos</p>

      <!-- Card de Saldo -->
      <div class="saldo-card">
        R$ {{ usuario.saldo.toFixed(2) }}
      </div>

      <!-- Ações Rápidas -->
      <div class="dashboard-actions">
        <button class="button-primary" @click="irPara('GerarQrCode.vue')">
          Gerar QRCode
        </button>
      </div>

      <!-- Histórico Completo -->
      <div class="historico-section" v-if="coletas.length">
        <h3 class="historico-title">Histórico de Coletas</h3>
        <ul class="historico-list">
          <li v-for="(coleta, index) in coletas" :key="index">
            {{ coleta.tipo }} - {{ coleta.peso }}kg (R$ {{ (coleta.peso * 2).toFixed(2) }})
          </li>
        </ul>
      </div>

      <div v-else class="historico-section">
        <h3 class="historico-title">Nenhuma coleta registrada ainda.</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeaderBar from '../components/HeaderBar.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const usuario = ref({
  nome: localStorage.getItem('nome') || 'Usuário',
  saldo: 0,
});

const coletas = ref([]);
const cpf = localStorage.getItem('cpf');

if (!cpf) {
  router.push('/');
}

const buscarDados = async () => {
  try {
    const { data } = await axios.get(`http://127.0.0.1:8000/api/resumo-materiais/${cpf}`);

    usuario.value.nome = data.beneficiario || 'Usuário';

    // Soma dos créditos
    const totalPeso = data.materiais.reduce((acc, item) => acc + parseFloat(item.total_peso), 0);
    usuario.value.saldo = totalPeso * 2;

    // Se quiser exibir o histórico também:
    coletas.value = data.materiais.map((item) => ({
      tipo: item.tipo,
      peso: parseFloat(item.total_peso),
    }));
  } catch (error) {
    console.error('Erro ao buscar dados do beneficiário:', error);
  }
};

onMounted(async () => {
  buscarDados();
  //  usuario.value.nome = localStorage.getItem('nome') || 'Usuário';
  // const cpf = localStorage.getItem('cpf');

  // try {
  //   const resposta = await getResumoMateriais(cpf);
  //   usuario.value.saldo = resposta.total_creditos ?? 0;
  //   materiais.value = resposta.coletas ?? [];
  // } catch (error) {
  //   console.error('Erro ao buscar dados:', error);
  // }
});
</script>

<style scoped>
.saldo-card {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 1rem 0;
}

.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /* muda de center para flex-start */
  min-height: calc(100vh - 64px);
  /* compensa o header fixo */
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  padding: 3rem 1rem 2rem;
  /* aumenta o padding-top para suavizar */
  overflow-x: hidden;
  overflow-y: hidden;
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
}

.login-logo {
  width: 110px;
  display: block;
  margin: 0 auto 1rem;
}

.login-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.login-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 1.5rem;
}

/* Extensões específicas do Dashboard */
.saldo-card {
  background-color: #E8F5E9;
  color: #1B5E20;
  font-size: 1.8rem;
  font-weight: bold;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
}

.dashboard-actions {
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
}


.historico-section {
  margin-top: 2rem;
  text-align: left;
}

.historico-title {
  font-size: 1.1rem;
  color: #388E3C;
  margin-bottom: 0.5rem;
  text-align: center;
}

.historico-list {
  list-style: none;
  padding: 0;
}

.historico-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #E8F5E9;
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
</style>
