<template>
  <HeaderBar />
  <div class="login-wrapper">
    <div class="login-card">
      <img src="/logo_grafismo_preciso_transparente.png" alt="ECOURBIS Logo" class="login-logo" />
      <h2 class="login-title">Painel da Empresa Parceira</h2>

      <!-- Seção de Créditos -->
      <div class="form-section">
        <h3 class="section-title">Configuração de Créditos</h3>
        <div class="form-group">
          <label class="label-text">Valor total a disponibilizar (R$)</label>
          <input 
            type="text" 
            v-model="valorCreditoFormatado" 
            @input="handleValorCreditoInput"
            class="input-box"
            placeholder="Mínimo R$ 100,00"
          />
        </div>

        <div class="form-group">
          <label class="label-text">Validade dos créditos</label>
          <select v-model="validadeCredito" class="input-box">
            <option value="3">3 meses</option>
            <option value="6">6 meses</option>
            <option value="12">1 ano</option>
          </select>
        </div>
      </div>

      <!-- Seção de Benefícios Fiscais -->
      <div class="form-section">
        <h3 class="section-title">Vantagens Fiscais</h3>

        <div class="benefit-card">
          <h4>Isenção de Impostos</h4>
          <p>
            Para cada R$ 1.000,00 em créditos disponibilizados, você recebe 
            <strong>5% de isenção</strong> no ISS e IPTU.
          </p>
          <div class="calculation-example" v-if="valorCredito >= 1000">
            <p>
              Com {{ formatarNumero(valorCredito) }}, sua isenção estimada é de 
              <strong>{{ formatarNumero(valorCredito * 0.05) }}</strong>.
            </p>
          </div>
        </div>

        <div class="benefit-card">
          <h4>Marketing Verde</h4>
          <p>
            Seu estabelecimento será destacado no aplicativo como 
            <strong>parceiro sustentável</strong>, com selo de reconhecimento.
          </p>
        </div>
      </div>

      <button class="button-primary" @click="salvarConfiguracoes">
        Salvar Configurações
      </button>
    </div>
  </div>

  <!-- Popup de Confirmação -->
  <div class="popup-overlay" v-if="showPopup">
    <div class="popup-content">
      <h3>✅ Configurações Salvas!</h3>
      <p>
        Você disponibilizou <strong>{{ formatarNumero(valorCredito) }}</strong> 
        em créditos com validade de 
        <strong>{{ validadeCredito }} {{ validadeCredito == 12 ? 'meses' : 'meses' }}</strong>.
      </p>
      <button class="popup-button" @click="showPopup = false">Fechar</button>
    </div>
  </div>
</template>

<script setup>
import HeaderBar from '../components/HeaderBar.vue';
import { ref } from 'vue';

const valorCredito = ref(1000);
const valorCreditoFormatado = ref(formatarNumero(valorCredito.value));
const validadeCredito = ref("6");
const showPopup = ref(false);

// Função para formatar em moeda brasileira
function formatarNumero(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// Input formatado
function handleValorCreditoInput(event) {
  const valorLimpo = event.target.value.replace(/\D/g, '');
  valorCredito.value = parseFloat(valorLimpo) / 100 || 0;
  valorCreditoFormatado.value = formatarNumero(valorCredito.value);
}

// Salvar e abrir popup
function salvarConfiguracoes() {
  showPopup.value = true;
}
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
  max-width: 520px;
  box-sizing: border-box;
}

.login-logo {
  width: 110px;
  margin: 0 auto 1.5rem;
  display: block;
}

.login-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  color: #388E3C;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #E8F5E9;
  padding-bottom: 0.5rem;
}

.benefit-card {
  background: #F1F8E9;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.benefit-card h4 {
  color: #1B5E20;
  margin-top: 0;
}

.calculation-example {
  background: white;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.label-text {
  display: block;
  text-align: left;
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
  margin-bottom: 1.25rem;
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

/* Estilo do popup */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-content {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.popup-content h3 {
  color: #2E7D32;
  margin-bottom: 0.75rem;
}

.popup-content p {
  margin-bottom: 1.5rem;
}

.popup-button {
  background-color: #388E3C;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.popup-button:hover {
  background-color: #1B5E20;
}
</style>
