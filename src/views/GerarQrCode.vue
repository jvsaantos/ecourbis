<template>
  <div>
    <HeaderBar />
    <div class="page-wrapper" style="align-items:flex-start; padding-top:2rem;">
      <div style="width:100%; max-width:480px;">

        <RouterLink to="/perfil/beneficiario" class="back-link">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Voltar ao painel
        </RouterLink>

        <div class="page-card" style="margin-top:1rem;">
          <div class="qr-header">
            <div class="qr-header__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
                <rect x="14" y="14" width="3" height="3"/>
                <rect x="18" y="14" width="3" height="3"/>
                <rect x="14" y="18" width="3" height="3"/>
                <rect x="18" y="18" width="3" height="3"/>
              </svg>
            </div>
            <div>
              <h2 class="page-title" style="text-align:left; margin:0;">Gerar QR Code</h2>
              <p class="page-subtitle" style="text-align:left; margin:0.2rem 0 0;">
                Use seus créditos em estabelecimentos parceiros
              </p>
            </div>
          </div>

          <!-- Saldo -->
          <div class="saldo-banner">
            <div>
              <p class="saldo-banner__label">Saldo disponível</p>
              <p class="saldo-banner__value">{{ formatarMoeda(saldoDisponivel) }}</p>
            </div>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" opacity="0.6">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          </div>

          <!-- Valores rápidos -->
          <div>
            <p class="field-label">Valor do voucher</p>
            <div class="quick-values">
              <button
                v-for="v in quickValues"
                :key="v"
                type="button"
                :class="['quick-btn', { 'quick-btn--active': valorVoucher === v, 'quick-btn--disabled': v > saldoDisponivel }]"
                :disabled="v > saldoDisponivel"
                @click="valorVoucher = v"
              >
                {{ formatarMoeda(v) }}
              </button>
            </div>

            <AppInput
              v-model.number="valorVoucher"
              type="number"
              label="Ou informe outro valor"
              placeholder="0.00"
              :step="0.01"
              :min="0.1"
              :max="saldoDisponivel"
              :hint="`Máximo: ${formatarMoeda(saldoDisponivel)}`"
              :error="valorVoucher > saldoDisponivel ? 'Valor excede o saldo disponível.' : ''"
              style="margin-top:1rem;"
            />
          </div>

          <div v-if="erro" class="alert alert--error" style="margin-top:0.75rem;">{{ erro }}</div>

          <AppButton
            :full="true"
            :loading="loading"
            :disabled="!valorVoucher || valorVoucher <= 0 || valorVoucher > saldoDisponivel"
            style="margin-top:1.25rem;"
            @click="gerarQrCode"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Gerar QR Code
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Modal sucesso -->
    <AppModal v-model="showModal" title="QR Code Gerado!" size="sm">
      <div class="success-modal">
        <div class="qr-mock">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
            <rect x="5" y="5" width="3" height="3" fill="var(--color-primary)"/>
            <rect x="16" y="5" width="3" height="3" fill="var(--color-primary)"/>
            <rect x="5" y="16" width="3" height="3" fill="var(--color-primary)"/>
            <rect x="14" y="14" width="3" height="3" fill="var(--color-primary)"/>
            <rect x="18" y="14" width="3" height="3" fill="var(--color-primary)"/>
            <rect x="14" y="18" width="3" height="3" fill="var(--color-primary)"/>
            <rect x="18" y="18" width="3" height="3" fill="var(--color-primary)"/>
          </svg>
        </div>
        <p>
          Voucher de <strong>{{ formatarMoeda(valorUsado) }}</strong> gerado com sucesso!
        </p>
        <p class="success-modal__sub">
          Apresente este QR Code no estabelecimento parceiro.
        </p>
      </div>
      <template #footer>
        <AppButton variant="secondary" @click="showModal = false">Fechar</AppButton>
        <AppButton @click="showModal = false; router.push('/perfil/beneficiario')">Ir ao Painel</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import HeaderBar from '../components/HeaderBar.vue';
import AppInput from '../components/AppInput.vue';
import AppButton from '../components/AppButton.vue';
import AppModal from '../components/AppModal.vue';
import { useFormatters } from '../composables/useFormatters';
import { voucherService } from '../services/api';

const router = useRouter();
const { formatarMoeda } = useFormatters();

const saldoDisponivel = ref(85.30);
const valorVoucher = ref('');
const valorUsado = ref(0);
const loading = ref(false);
const showModal = ref(false);
const erro = ref('');

const quickValues = [10, 20, 50];

const gerarQrCode = async () => {
  erro.value = '';
  loading.value = true;
  try {
    const cpf = localStorage.getItem('cpf');
    await voucherService.gerar(cpf, valorVoucher.value);
  } catch {
    // mock — funciona sem backend
  } finally {
    loading.value = false;
    valorUsado.value = parseFloat(valorVoucher.value);
    saldoDisponivel.value -= valorUsado.value;
    valorVoucher.value = '';
    showModal.value = true;
  }
};
</script>

<style scoped>
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  transition: color var(--transition);
}
.back-link:hover { color: var(--color-primary); text-decoration: none; }

.qr-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.qr-header__icon {
  width: 52px;
  height: 52px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.saldo-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: #fff;
  padding: 1.1rem 1.25rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
}

.saldo-banner__label { font-size: 0.78rem; opacity: 0.8; margin: 0; }
.saldo-banner__value { font-size: 1.6rem; font-weight: 700; margin: 0.15rem 0 0; }

.field-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.6rem;
}

.quick-values {
  display: flex;
  gap: 0.6rem;
}

.quick-btn {
  flex: 1;
  padding: 0.55rem 0.5rem;
  border: 1.5px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.quick-btn:hover:not(.quick-btn--disabled) { border-color: var(--color-primary); }

.quick-btn--active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.quick-btn--disabled { opacity: 0.4; cursor: not-allowed; }

.success-modal { text-align: center; }
.qr-mock {
  width: 120px;
  height: 120px;
  background: var(--color-surface-alt);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.success-modal__sub {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}
</style>
