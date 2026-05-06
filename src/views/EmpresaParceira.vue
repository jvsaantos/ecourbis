<template>
  <div>
    <HeaderBar />
    <div class="page-wrapper" style="align-items:flex-start; padding-top:2rem;">
      <div class="empresa-inner">

        <!-- Header -->
        <div class="section-header">
          <div class="section-header__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
          </div>
          <div>
            <h1 class="page-title" style="text-align:left; margin:0;">Empresa Parceira</h1>
            <p class="page-subtitle" style="text-align:left; margin:0.2rem 0 0;">Configure seus créditos verdes e acompanhe os benefícios fiscais</p>
          </div>
        </div>

        <!-- Configuração -->
        <div class="page-card">
          <h2 class="section-title">Configuração de Créditos Verdes</h2>
          <div class="form-group">

            <AppInput
              label="Valor a disponibilizar (R$)"
              :model-value="valorCreditoFormatado"
              placeholder="R$ 0,00"
              :error="valorCredito > 0 && valorCredito < 100 ? 'Valor mínimo: R$ 100,00' : ''"
              :hint="valorCredito === 0 || valorCredito >= 100 ? 'Mínimo R$ 100,00 · Máximo sem limite' : ''"
              @update:model-value="handleValorInput"
            >
              <template #icon>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
              </template>
            </AppInput>

            <div>
              <label class="field-label">Validade dos créditos</label>
              <div class="validade-options">
                <button
                  v-for="op in validadeOpcoes"
                  :key="op.value"
                  type="button"
                  :class="['validade-btn', { 'validade-btn--active': validadeCredito === op.value }]"
                  @click="validadeCredito = op.value"
                >{{ op.label }}</button>
              </div>
            </div>

            <!-- Veterano toggle -->
            <label class="toggle-row">
              <div class="toggle-wrap">
                <input type="checkbox" v-model="veterano" class="toggle-input" />
                <div class="toggle-slider"></div>
              </div>
              <div>
                <span class="toggle-label">Empresa veterana no programa</span>
                <span class="toggle-hint">+2pp de isenção adicional para CNPJs com mais de 1 ano</span>
              </div>
            </label>

            <AppButton
              :full="true"
              :loading="loading"
              :disabled="valorCredito < 100"
              @click="salvar"
            >
              Salvar Configurações
            </AppButton>
          </div>
        </div>

        <!-- Simulador fiscal -->
        <div class="page-card" v-if="valorCredito >= 100">
          <h2 class="section-title">Simulação de Benefício Fiscal</h2>
          <p class="simulador-ref">
            Base legal: Decreto Municipal 58.811/2019 · Programa Créditos Verdes SP
          </p>

          <div class="isencao-display">
            <div class="isencao-main">
              <p class="isencao-main__label">Isenção estimada sobre ISS/IPTU</p>
              <p class="isencao-main__valor">{{ formatarMoeda(isencao.valorIsencao) }}</p>
              <p class="isencao-main__pct">{{ isencao.percentual }}% de isenção</p>
            </div>
            <div class="isencao-barra-wrap">
              <div class="isencao-barra">
                <div
                  class="isencao-barra__fill"
                  :style="{ width: Math.min(isencao.percentual / 30 * 100, 100) + '%' }"
                ></div>
              </div>
              <div class="isencao-barra__labels">
                <span>0%</span>
                <span>Teto: 30%</span>
              </div>
            </div>
          </div>

          <div v-if="isencao.atingiuTeto" class="alert alert--success" style="margin-top:1rem;">
            Parabéns! Você atingiu o teto máximo de 30% de isenção.
          </div>
          <div v-else class="teto-hint">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Invista mais {{ formatarMoeda(isencao.valorParaTeto) }} para atingir o teto de 30%.
          </div>

          <!-- Regras resumidas -->
          <div class="regras-grid">
            <div class="regra-item">
              <span class="regra-item__num">3%</span>
              <span class="regra-item__label">por cada R$ 1.000 investidos</span>
            </div>
            <div class="regra-item">
              <span class="regra-item__num">30%</span>
              <span class="regra-item__label">teto máximo de isenção</span>
            </div>
            <div class="regra-item" :class="{ 'regra-item--destaque': veterano }">
              <span class="regra-item__num">+2pp</span>
              <span class="regra-item__label">bônus para empresas veteranas</span>
            </div>
          </div>
        </div>

        <!-- Benefícios adicionais -->
        <div class="page-card">
          <h2 class="section-title">Outros Benefícios</h2>
          <div class="benefits-list">
            <div class="benefit-item">
              <div class="benefit-item__icon" style="background:#dbeafe; color:#1e40af;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
              </div>
              <div>
                <h3 class="benefit-item__title">Selo Parceiro Sustentável</h3>
                <p class="benefit-item__desc">Destaque no aplicativo com selo ESG verificado pela plataforma.</p>
              </div>
            </div>
            <div class="benefit-item">
              <div class="benefit-item__icon" style="background:#f3e5f5; color:#7b1fa2;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <h3 class="benefit-item__title">Base de Clientes Verdes</h3>
                <p class="benefit-item__desc">Acesso preferencial a beneficiários que usam créditos no seu estabelecimento.</p>
              </div>
            </div>
            <div class="benefit-item">
              <div class="benefit-item__icon" style="background:#e8f5e9; color:#2e7d32;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div>
                <h3 class="benefit-item__title">Relatório de Impacto ESG</h3>
                <p class="benefit-item__desc">Relatório mensal com toneladas recicladas e créditos de carbono evitados.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <AppModal v-model="showModal" title="Configurações Salvas!" size="sm">
      <div class="success-modal">
        <div class="success-check">✓</div>
        <p>
          <strong>{{ formatarMoeda(valorCredito) }}</strong> em créditos com validade de
          <strong>{{ validadeLegivel }}</strong>.
        </p>
        <div class="success-isencao">
          Isenção fiscal estimada:
          <strong>{{ formatarMoeda(isencao.valorIsencao) }} ({{ isencao.percentual }}%)</strong>
        </div>
      </div>
      <template #footer>
        <AppButton :full="true" @click="showModal = false">Fechar</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import HeaderBar from '../components/HeaderBar.vue';
import AppButton from '../components/AppButton.vue';
import AppModal from '../components/AppModal.vue';
import AppInput from '../components/AppInput.vue';
import { useFormatters } from '../composables/useFormatters.js';
import { calcularIsencaoFiscal } from '../services/mocks.js';
import { empresaService } from '../services/api.js';

const { formatarMoeda } = useFormatters();

const validadeOpcoes = [
  { value: '3',  label: '3 meses' },
  { value: '6',  label: '6 meses' },
  { value: '12', label: '1 ano'   },
];

const valorCredito = ref(1000);
const valorCreditoFormatado = ref(formatarMoeda(1000));
const validadeCredito = ref('6');
const veterano = ref(false);
const loading = ref(false);
const showModal = ref(false);

const isencao = computed(() => calcularIsencaoFiscal(valorCredito.value, veterano.value));

const validadeLegivel = computed(
  () => validadeOpcoes.find((o) => o.value === validadeCredito.value)?.label ?? '',
);

const handleValorInput = (val) => {
  const raw = typeof val === 'string' ? val : val.target.value;
  const nums = raw.replace(/\D/g, '');
  valorCredito.value = parseFloat(nums) / 100 || 0;
  valorCreditoFormatado.value = formatarMoeda(valorCredito.value);
};

const salvar = async () => {
  loading.value = true;
  try {
    await empresaService.configurarCreditos({
      valor: valorCredito.value,
      validade: validadeCredito.value,
      veterano: veterano.value,
    });
  } finally {
    loading.value = false;
    showModal.value = true;
  }
};
</script>

<style scoped>
.empresa-inner {
  width: 100%;
  max-width: 620px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-header { display: flex; align-items: center; gap: 1rem; }

.section-header__icon {
  width: 48px; height: 48px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.field-label {
  display: block;
  font-size: 0.875rem; font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.6rem;
}

.validade-options { display: flex; gap: 0.6rem; }

.validade-btn {
  flex: 1; padding: 0.6rem 0.5rem;
  border: 1.5px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  font-family: inherit; font-size: 0.9rem; font-weight: 500;
  cursor: pointer; transition: all 0.18s; text-align: center;
}
.validade-btn:hover { border-color: var(--color-primary); }
.validade-btn--active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  font-weight: 700;
}

/* Toggle veterano */
.toggle-row {
  display: flex; align-items: flex-start; gap: 0.75rem;
  cursor: pointer; padding: 0.75rem; border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  transition: background var(--transition);
}
.toggle-row:hover { background: var(--color-surface-alt); }

.toggle-wrap { position: relative; flex-shrink: 0; margin-top: 0.1rem; }
.toggle-input { opacity: 0; width: 0; height: 0; position: absolute; }

.toggle-slider {
  width: 40px; height: 22px;
  background: var(--color-border);
  border-radius: 999px;
  display: block;
  transition: background 0.2s;
  position: relative;
}
.toggle-slider::after {
  content: '';
  position: absolute;
  width: 16px; height: 16px;
  background: #fff;
  border-radius: 50%;
  top: 3px; left: 3px;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.toggle-input:checked ~ .toggle-slider { background: var(--color-primary); }
.toggle-input:checked ~ .toggle-slider::after { transform: translateX(18px); }

.toggle-label { display: block; font-size: 0.875rem; font-weight: 600; }
.toggle-hint { display: block; font-size: 0.77rem; color: var(--color-text-secondary); margin-top: 0.15rem; }

/* Simulador */
.simulador-ref {
  font-size: 0.75rem; color: var(--color-text-secondary);
  margin: -0.5rem 0 1rem; font-style: italic;
}

.isencao-display {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  color: #fff;
  margin-bottom: 1rem;
}

.isencao-main { margin-bottom: 1.25rem; }
.isencao-main__label { font-size: 0.8rem; opacity: 0.8; margin: 0; }
.isencao-main__valor { font-size: 2rem; font-weight: 700; margin: 0.25rem 0; line-height: 1; }
.isencao-main__pct { font-size: 0.95rem; opacity: 0.9; margin: 0; }

.isencao-barra {
  height: 8px; background: rgba(255,255,255,0.25);
  border-radius: 999px; overflow: hidden; margin-bottom: 0.35rem;
}
.isencao-barra__fill {
  height: 100%; background: #fff;
  border-radius: 999px;
  transition: width 0.5s ease;
}
.isencao-barra__labels {
  display: flex; justify-content: space-between;
  font-size: 0.72rem; opacity: 0.75;
}

.teto-hint {
  display: flex; align-items: center; gap: 0.4rem;
  font-size: 0.8rem; color: var(--color-text-secondary);
  padding: 0.5rem 0.75rem;
  background: var(--color-surface-alt);
  border-radius: var(--radius-sm);
  margin-top: 0.75rem;
}

.regras-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem; margin-top: 1.25rem;
}

.regra-item {
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  text-align: center;
  display: flex; flex-direction: column; gap: 0.25rem;
  transition: border-color var(--transition);
}

.regra-item--destaque { border-color: var(--color-primary); background: var(--color-primary-light); }

.regra-item__num { font-size: 1.25rem; font-weight: 700; color: var(--color-primary); }
.regra-item__label { font-size: 0.72rem; color: var(--color-text-secondary); line-height: 1.3; }

/* Benefits */
.benefits-list { display: flex; flex-direction: column; gap: 0.9rem; }

.benefit-item {
  display: flex; gap: 0.9rem; padding: 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-alt);
}

.benefit-item__icon {
  width: 42px; height: 42px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.benefit-item__title { font-size: 0.9rem; font-weight: 700; margin: 0 0 0.25rem; }
.benefit-item__desc { font-size: 0.82rem; color: var(--color-text-secondary); margin: 0; line-height: 1.5; }

/* Modal */
.success-modal { text-align: center; padding: 0.25rem 0; }

.success-check {
  width: 50px; height: 50px;
  background: #dcfce7; color: var(--color-success);
  border-radius: 50%;
  font-size: 1.3rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 0.75rem;
}

.success-isencao {
  font-size: 0.85rem; color: var(--color-text-secondary);
  background: var(--color-primary-light);
  padding: 0.6rem 0.9rem;
  border-radius: var(--radius-sm);
  margin-top: 0.75rem;
}

@media (max-width: 480px) {
  .regras-grid { grid-template-columns: 1fr 1fr; }
}
</style>
