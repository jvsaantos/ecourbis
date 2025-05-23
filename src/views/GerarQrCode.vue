<template>
  <HeaderBar />

  <div class="login-wrapper">
    <div class="login-card">
      <img src="/logo_grafismo_preciso_transparente.png" alt="ECOURBIS Logo" class="login-logo" />
      <h2 class="login-title">Gerar QR Code</h2>
      <p class="login-subtitle">Utilize seus créditos em estabelecimentos parceiros</p>

      <!-- Valor do Voucher -->
      <div class="form-group">
        <label class="label-text">Valor do Voucher (R$)</label>
        <input 
          type="number" 
          v-model="valorVoucher" 
          class="input-box" 
          placeholder="Ex: 10.50" 
          step="0.01" 
          min="0.10" 
          :max="saldoDisponivel"
          required
        />
        <p class="saldo-info">Saldo disponível: {{ formatarMoeda(saldoDisponivel) }}</p>
      </div>

      <!-- Ações -->
      <button 
        class="button-primary" 
        @click="gerarQrCode"
        :disabled="!valorVoucher || valorVoucher > saldoDisponivel"
      >
        Gerar QR Code
      </button>
    </div>

    <!-- Popup -->
    <div v-if="popup.show" class="popup-overlay">
      <div class="popup">
        <h3 class="success">QR Code Gerado!</h3>
        <p>Seu QR Code no valor de {{ formatarMoeda(valorVoucher) }} foi enviado para seu e-mail cadastrado.</p>
        <button class="button-primary" @click="fecharPopup">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeaderBar from '../components/HeaderBar.vue';
import { ref } from 'vue';

const saldoDisponivel = ref(85.30);
const valorVoucher = ref('');
const popup = ref({
  show: false
});

const gerarQrCode = () => {
  if (valorVoucher.value > saldoDisponivel.value) {
    alert('Saldo insuficiente!');
    return;
  }
  popup.value.show = true;
  console.log('QR Code gerado para valor:', valorVoucher.value);
};

const fecharPopup = () => {
  popup.value.show = false;
  valorVoucher.value = '';
};

// Função para formatar valores em reais
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(valor);
};
</script>

<style scoped>
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
  max-width: 480px;
  text-align: center;
  box-sizing: border-box;
}

.login-logo {
  width: 110px;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.login-subtitle {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.form-group {
  text-align: left;
  margin-bottom: 1.25rem;
}

.label-text {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
}

.input-box {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.saldo-info {
  font-size: 0.85rem;
  color: #388E3C;
  margin-top: 0.3rem;
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

.button-primary:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.button-primary:hover:not(:disabled) {
  background-color: #1B5E20;
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
  z-index: 999;
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

.popup p {
  margin-bottom: 1.5rem;
}
</style>
