<template>
  <HeaderBar />
  <div class="login-wrapper">
    <div class="login-card">
      <img src="/logo_grafismo_preciso_transparente.png" alt="ECOURBIS Logo" class="login-logo" />
      <h2 class="login-title">Central de Compras</h2>
      <p class="login-subtitle">Compre resíduos para reciclagem</p>

      <!-- Filtros -->
      <div class="filter-section">
        <select v-model="filtroTipo" class="input-box">
          <option value="">Todos os materiais</option>
          <option v-for="tipo in tiposResiduos" :value="tipo.id">{{ tipo.nome }}</option>
        </select>
      </div>

      <!-- Lista de Resíduos -->
      <div class="residuo-list">
        <div v-for="residuo in residuosFiltrados" :key="residuo.id" class="residuo-card">
          <div class="residuo-info">
            <h3>{{ residuo.tipo }}</h3>
            <p>Quantidade disponível: {{ residuo.quantidade }}kg</p>
            <p class="price">R$ {{ residuo.precoPorKg.toFixed(2) }}/kg</p>
          </div>

          <div class="residuo-actions">
            <input
              type="number"
              v-model.number="residuo.quantidadeDesejada"
              min="1"
              :max="residuo.quantidade"
              class="input-box small"
              placeholder="kg"
            />
            <button
              class="button-primary small"
              @click="adicionarAoCarrinho(residuo)"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <!-- Carrinho -->
      <div v-if="carrinho.length > 0" class="cart-section">
        <h3 class="section-title">Seu Pedido</h3>

        <div v-for="(item, index) in carrinho" :key="index" class="cart-item">
          <span>{{ item.tipo }} ({{ item.quantidade }}kg)</span>
          <span>R$ {{ (item.precoPorKg * item.quantidade).toFixed(2) }}</span>
          <button class="button-remove" @click="removerDoCarrinho(item)">-</button>
        </div>

        <div class="cart-total">
          <strong>Total:</strong>
          <strong>R$ {{ totalCarrinho.toFixed(2) }}</strong>
        </div>

        <button class="button-primary" @click="finalizarCompra">
          Gerar Boleto de Pagamento
        </button>
      </div>
    </div>

    <!-- Popup -->
    <div v-if="popup.show" class="popup-overlay">
      <div class="popup">
        <h3 :class="popup.type">{{ popup.title }}</h3>
        <p>{{ popup.message }}</p>
        <button @click="popup.show = false" class="button-primary">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeaderBar from '../components/HeaderBar.vue';
import { ref, computed } from 'vue';

const tiposResiduos = ref([
  { id: 1, nome: 'Plástico PET' },
  { id: 2, nome: 'Alumínio' },
  { id: 3, nome: 'Vidro Incolor' }
]);

const residuosDisponiveis = ref([
  { id: 1, tipo: 'Plástico PET', quantidade: 150, precoPorKg: 2.50 },
  { id: 2, tipo: 'Alumínio', quantidade: 80, precoPorKg: 5.20 },
  { id: 3, tipo: 'Vidro Incolor', quantidade: 200, precoPorKg: 0.80 }
]);

const filtroTipo = ref('');
const carrinho = ref([]);

const popup = ref({
  show: false,
  title: '',
  message: '',
  type: ''
});

const residuosFiltrados = computed(() => {
  return filtroTipo.value
    ? residuosDisponiveis.value.filter(r => r.id === filtroTipo.value)
    : residuosDisponiveis.value;
});

const totalCarrinho = computed(() => {
  return carrinho.value.reduce((total, item) => {
    return total + (item.precoPorKg * item.quantidade);
  }, 0);
});

const adicionarAoCarrinho = (residuo) => {
  if (!residuo.quantidadeDesejada || residuo.quantidadeDesejada <= 0) return;

  if (residuo.quantidadeDesejada > residuo.quantidade) {
    showPopup('⚠️ Atenção!', `Quantidade indisponível! Você tentou adicionar ${residuo.quantidadeDesejada}kg, só temos ${residuo.quantidade}kg disponíveis.`, 'error');
    return;
  }

  const existente = carrinho.value.find(item => item.id === residuo.id);
  if (existente) {
    existente.quantidade += residuo.quantidadeDesejada;
  } else {
    carrinho.value.push({
      id: residuo.id,
      tipo: residuo.tipo,
      precoPorKg: residuo.precoPorKg,
      quantidade: residuo.quantidadeDesejada
    });
  }

  residuo.quantidade -= residuo.quantidadeDesejada;
  residuo.quantidadeDesejada = null;
};

const removerDoCarrinho = (item) => {
  const index = carrinho.value.findIndex(i => i.id === item.id);
  if (index !== -1) {
    const residuo = residuosDisponiveis.value.find(r => r.id === item.id);
    residuo.quantidade += item.quantidade;
    carrinho.value.splice(index, 1);
  }
};

const finalizarCompra = () => {
  showPopup(
    'Boleto Gerado!',
    `Seu boleto no valor de R$ ${totalCarrinho.value.toFixed(2)} foi enviado para seu e-mail cadastrado.`,
    'success'
  );
  carrinho.value = [];
};

const showPopup = (title, message, type) => {
  popup.value = {
    show: true,
    title,
    message,
    type
  };
};
</script>

<style scoped>
/* layout básico */
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 64px);
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  padding: 3rem 1rem 2rem;
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 600px;
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
  margin-bottom: 0.5rem;
}

.login-subtitle {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #666;
}

.filter-section {
  margin-bottom: 1.5rem;
}

.residuo-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 2rem;
}

.residuo-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #E8F5E9;
}

.residuo-info h3 {
  margin: 0;
  color: #1B5E20;
}

.price {
  font-weight: bold;
  color: #388E3C;
}

.residuo-actions {
  display: flex;
  gap: 0.5rem;
}

.input-box.small {
  width: 80px;
  padding: 0.5rem;
}

.button-primary.small {
  padding: 0.5rem 1rem;
}

.cart-section {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid #388E3C;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  padding-top: 0.5rem;
  border-top: 1px solid #ccc;
}

.button-primary {
  background-color: #388E3C;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button-primary:hover {
  background-color: #1B5E20;
}

.button-remove {
  background: #e57373;
  border: none;
  color: white;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  font-weight: bold;
}

.button-remove:hover {
  background: #c62828;
}

/* Popup */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  max-width: 400px;
  text-align: center;
}

.popup h3 {
  margin-top: 0;
  background: none !important;
}

.popup h3.success {
  color: #388E3C;
}

.popup h3.error {
  color: #c62828;
}
</style>
