<template>
  <HeaderBar />
  <div class="login-wrapper">
    <div class="login-card">
      <img src="/logo_grafismo_preciso_transparente.png" class="login-logo" />
      <h2 class="login-title">Registrar Coleta</h2>

      <form @submit.prevent="handleSubmit">
        <!-- Tipo -->
        <div class="form-group">
          <label class="label-text">Tipo de Resíduo</label>
          <select v-model="tipoResiduo" class="input-box" required>
            <option disabled value="">Selecione...</option>
            <option value="Plástico">Plástico</option>
            <option value="Vidro">Vidro</option>
            <option value="Papel">Papel</option>
          </select>
        </div>

        <!-- Peso -->
        <div class="form-group">
          <label class="label-text">Peso</label>
          <div class="input-group">
            <input
              type="text"
              v-model="pesoFormatado"
              class="input-box"
              @input="formatarPeso"
              placeholder="0,00"
              required
            />
            <span class="suffix">kg</span>
          </div>
        </div>

        <!-- CPF -->
        <div class="form-group">
          <label class="label-text">CPF do Beneficiário</label>
          <input
            type="text"
            v-model="cpfBeneficiario"
            class="input-box"
            placeholder="Somente números"
            @input="formatarCpf"
            maxlength="11"
            required
          />
        </div>

        <button type="submit" class="button-primary">Confirmar Coleta</button>
      </form>
    </div>
  </div>

  <!-- ✅ Popup -->
  <div v-if="mostrarPopup" class="popup-overlay">
    <div class="popup">
      <h3>Coleta Registrada!</h3>
      <p>
        Você registrou <strong>{{ pesoFormatado }} kg</strong> de <strong>{{ tipoResiduo }}</strong>.
      </p>
      <button class="button-primary" @click="fecharPopup">Fechar</button>
    </div>
  </div>
</template>

<script setup>
import HeaderBar from '../components/HeaderBar.vue';
import { ref } from 'vue';

const tipoResiduo = ref('');
const pesoFormatado = ref('');
const cpfBeneficiario = ref('');
const mostrarPopup = ref(false);

const formatarCpf = () => {
  cpfBeneficiario.value = cpfBeneficiario.value.replace(/\D/g, '').slice(0, 11);
};

const formatarPeso = () => {
  let somenteNumeros = pesoFormatado.value.replace(/\D/g, '');

  if (somenteNumeros.length === 0) {
    pesoFormatado.value = '0,00';
    return;
  }

  while (somenteNumeros.length < 3) {
    somenteNumeros = '0' + somenteNumeros;
  }

  const parteInteira = somenteNumeros.slice(0, somenteNumeros.length - 2);
  const parteDecimal = somenteNumeros.slice(-2);

  pesoFormatado.value = `${parseInt(parteInteira)}.${parteDecimal}`.replace('.', ',');
};

const handleSubmit = () => {
  const pesoNumero = parseFloat(pesoFormatado.value.replace(',', '.'));
  if (isNaN(pesoNumero) || pesoNumero <= 0) {
    alert('Digite um peso válido.');
    return;
  }
  if (cpfBeneficiario.value.length !== 11) {
    alert('CPF deve conter exatamente 11 dígitos.');
    return;
  }

  console.log('Coleta registrada:', {
    tipo: tipoResiduo.value,
    peso: pesoNumero,
    cpf: cpfBeneficiario.value
  });

  mostrarPopup.value = true;
};

const fecharPopup = () => {
  mostrarPopup.value = false;
  tipoResiduo.value = '';
  pesoFormatado.value = '';
  cpfBeneficiario.value = '';
};
</script>

<style scoped>
/* Layout */
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
  max-width: 460px;
  text-align: center;
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

.label-text {
  display: block;
  text-align: left;
  margin-bottom: 0.4rem;
  font-weight: 500;
}

/* Input group com sufixo */
.input-group {
  display: flex;
  align-items: center;
}

.input-box {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.suffix {
  background-color: #e8f5e9;
  color: #1b5e20;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  margin-left: 0.5rem;
  font-weight: 600;
}

/* Botão */
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

/* Popup */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  text-align: center;
  width: 90%;
  max-width: 400px;
}

.popup h3 {
  margin-top: 0;
  color: #388E3C;
}

.popup p {
  margin: 1rem 0;
  color: #333;
}
</style>
