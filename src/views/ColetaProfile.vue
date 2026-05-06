<template>
  <div>
    <HeaderBar />
    <div class="page-wrapper coleta-wrapper">
      <div class="coleta-inner">

        <!-- Stepper -->
        <div class="stepper">
          <div :class="['step', { 'step--active': etapa >= 1, 'step--done': etapa > 1 }]">
            <div class="step__dot">{{ etapa > 1 ? '✓' : '1' }}</div>
            <span>Identificar</span>
          </div>
          <div class="step__line" :class="{ 'step__line--done': etapa > 1 }"></div>
          <div :class="['step', { 'step--active': etapa >= 2 }]">
            <div class="step__dot">2</div>
            <span>Registrar</span>
          </div>
        </div>

        <!-- ══ ETAPA 1: Busca por CPF ══ -->
        <div v-if="etapa === 1" class="page-card slide-up-enter-active">
          <div class="card-header">
            <div class="card-header__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
              </svg>
            </div>
            <div>
              <h2 class="card-title">Identificar Beneficiário</h2>
              <p class="card-subtitle">Informe o CPF de quem está entregando o material</p>
            </div>
          </div>

          <div class="form-group" style="margin-top:1.5rem;">
            <AppInput
              id="cpf-beneficiario"
              label="CPF do Beneficiário"
              :model-value="cpfMascarado"
              placeholder="000.000.000-00"
              inputmode="numeric"
              maxlength="14"
              autocomplete="off"
              :error="cpfErro"
              @update:model-value="onCpfInput"
              @keydown.enter.prevent="buscarBeneficiario"
            >
              <template #icon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 9h8M8 13h5"/>
                </svg>
              </template>
            </AppInput>

            <div v-if="errosBusca" class="alert alert--error">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
              </svg>
              {{ errosBusca }}
            </div>

            <AppButton :full="true" :loading="buscando" @click="buscarBeneficiario">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Buscar Beneficiário
            </AppButton>

            <!-- Hint DEV_MODE -->
            <div class="hint-dev">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              CPFs de teste: <code>111.444.777-35</code> · <code>529.982.247-25</code> · <code>000.000.000-00</code>
            </div>
          </div>
        </div>

        <!-- ══ ETAPA 2: Registrar coleta ══ -->
        <div v-if="etapa === 2" class="etapa2-layout">

          <!-- Card beneficiário identificado -->
          <div class="beneficiario-card">
            <div class="beneficiario-card__avatar">
              {{ iniciais(beneficiario.nome) }}
            </div>
            <div class="beneficiario-card__info">
              <p class="beneficiario-card__nome">{{ beneficiario.nome }}</p>
              <p class="beneficiario-card__sub">{{ beneficiario.bairro }} · CPF {{ cpfMascarado }}</p>
            </div>
            <div class="beneficiario-card__saldo">
              <p class="beneficiario-card__saldo-label">Saldo atual</p>
              <p class="beneficiario-card__saldo-valor">{{ formatarMoeda(beneficiario.saldo) }}</p>
            </div>
            <button class="beneficiario-card__trocar" @click="trocarBeneficiario" aria-label="Trocar beneficiário">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
              </svg>
            </button>
          </div>

          <!-- Form de coleta -->
          <div class="page-card">
            <div class="card-header" style="margin-bottom:1.5rem;">
              <div class="card-header__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                </svg>
              </div>
              <div>
                <h2 class="card-title">Registrar Material</h2>
                <p class="card-subtitle">Selecione o tipo e informe o peso</p>
              </div>
            </div>

            <!-- Seleção de material -->
            <div class="field-group">
              <label class="field-label">Tipo de Material</label>
              <div class="material-grid">
                <button
                  v-for="m in MATERIAIS"
                  :key="m.id"
                  type="button"
                  :class="['material-btn', { 'material-btn--active': materialId === m.id }]"
                  :style="materialId === m.id ? { background: m.cor, borderColor: 'var(--color-primary)' } : {}"
                  @click="materialId = m.id"
                >
                  <span class="material-btn__emoji">{{ m.emoji }}</span>
                  <span class="material-btn__nome">{{ m.nome }}</span>
                  <span class="material-btn__preco">{{ formatarMoeda(m.creditoPorKg) }}/kg</span>
                </button>
              </div>
              <p v-if="erros.material" class="field-error">{{ erros.material }}</p>
            </div>

            <!-- Peso -->
            <div class="field-group">
              <AppInput
                label="Peso coletado (kg)"
                :model-value="pesoStr"
                placeholder="0,00"
                inputmode="decimal"
                :error="erros.peso"
                @update:model-value="onPesoInput"
              >
                <template #icon>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 2h12l2 7H4L6 2zM4 9h16v11a2 2 0 01-2 2H6a2 2 0 01-2-2V9z"/>
                  </svg>
                </template>
              </AppInput>
            </div>

            <!-- Preview crédito em tempo real -->
            <Transition name="fade">
              <div v-if="creditoGerado > 0" class="credito-preview">
                <div class="credito-preview__main">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                  </svg>
                  <div>
                    <p class="credito-preview__valor">{{ formatarMoeda(creditoGerado) }}</p>
                    <p class="credito-preview__label">crédito para {{ beneficiario.nome.split(' ')[0] }}</p>
                  </div>
                </div>
                <div v-if="materialSelecionado?.dificuldade === 'alta'" class="credito-preview__bonus">
                  +30% bônus dificuldade
                </div>
                <div v-if="materialSelecionado?.dificuldade === 'media'" class="credito-preview__bonus credito-preview__bonus--warning">
                  +10% bônus incentivo
                </div>
              </div>
            </Transition>

            <div v-if="erros.geral" class="alert alert--error">{{ erros.geral }}</div>

            <AppButton type="button" :loading="loading" :full="true" style="margin-top:1.25rem;" @click="confirmar">
              Confirmar Coleta
            </AppButton>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal de sucesso -->
    <AppModal v-model="showModal" title="Coleta Registrada!" size="sm">
      <div class="success-modal">
        <div class="success-modal__check">✓</div>
        <p class="success-modal__nome">{{ beneficiario?.nome }}</p>
        <div class="success-modal__detalhe">
          <span>{{ formatarPeso(pesoNumero) }} de {{ materialSelecionado?.nome }}</span>
        </div>
        <div class="success-modal__credito">
          <span class="success-modal__credito-label">Crédito adicionado</span>
          <span class="success-modal__credito-valor">{{ formatarMoeda(creditoGerado) }}</span>
        </div>
        <div class="success-modal__saldo-novo">
          Novo saldo: <strong>{{ formatarMoeda((beneficiario?.saldo ?? 0) + creditoGerado) }}</strong>
        </div>
      </div>
      <template #footer>
        <AppButton variant="secondary" @click="novaColeta">Nova Coleta</AppButton>
        <AppButton @click="router.push('/select-profile')">Concluir</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import HeaderBar from '../components/HeaderBar.vue';
import AppButton from '../components/AppButton.vue';
import AppModal from '../components/AppModal.vue';
import AppInput from '../components/AppInput.vue';
import { useFormatters } from '../composables/useFormatters.js';
import { useCpf } from '../composables/useCpf.js';
import { useMateriais, calcularCredito, MATERIAIS } from '../composables/useMateriais.js';
import { beneficiarioService, coletaService } from '../services/api.js';

const router = useRouter();
const { formatarMoeda, formatarPeso } = useFormatters();
const { cpfMascarado, cpfNums, cpfErro, onCpfInput, validarCampo, resetCpf } = useCpf();

const etapa = ref(1);
const buscando = ref(false);
const loading = ref(false);
const showModal = ref(false);
const errosBusca = ref('');
const erros = ref({ material: '', peso: '', geral: '' });

const beneficiario = ref(null);
const materialId = ref(null);
const pesoStr = ref('');

const materialSelecionado = computed(() => MATERIAIS.find((m) => m.id === materialId.value) ?? null);

const pesoNumero = computed(() => {
  const n = parseFloat(pesoStr.value.replace(',', '.'));
  return isNaN(n) ? 0 : n;
});

const creditoGerado = computed(() =>
  materialId.value && pesoNumero.value > 0
    ? calcularCredito(materialId.value, pesoNumero.value)
    : 0,
);

const iniciais = (nome) => {
  const p = (nome ?? '').trim().split(' ');
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : (p[0]?.[0] ?? 'U').toUpperCase();
};

const onPesoInput = (val) => {
  const raw = typeof val === 'string' ? val : val.target.value;
  const nums = raw.replace(/\D/g, '');
  if (!nums) { pesoStr.value = ''; return; }
  const padded = nums.padStart(3, '0');
  pesoStr.value = `${parseInt(padded.slice(0, -2))},${padded.slice(-2)}`;
  erros.value.peso = '';
};

const buscarBeneficiario = async () => {
  errosBusca.value = '';
  if (!validarCampo()) return;
  buscando.value = true;
  try {
    const { data } = await beneficiarioService.buscarPorCpf(cpfNums.value);
    beneficiario.value = data;
    etapa.value = 2;
  } catch (err) {
    errosBusca.value = err.response?.data?.erro ?? 'Erro ao buscar beneficiário.';
  } finally {
    buscando.value = false;
  }
};

const validate = () => {
  erros.value = { material: '', peso: '', geral: '' };
  let ok = true;
  if (!materialId.value) { erros.value.material = 'Selecione o tipo de material.'; ok = false; }
  if (pesoNumero.value <= 0) { erros.value.peso = 'Informe um peso válido maior que zero.'; ok = false; }
  return ok;
};

const confirmar = async () => {
  if (!validate()) return;
  loading.value = true;
  try {
    await coletaService.registrar(cpfNums.value, materialId.value, pesoNumero.value, creditoGerado.value);
    showModal.value = true;
  } catch {
    erros.value.geral = 'Erro ao registrar coleta. Tente novamente.';
  } finally {
    loading.value = false;
  }
};

const trocarBeneficiario = () => {
  etapa.value = 1;
  beneficiario.value = null;
  resetCpf();
  errosBusca.value = '';
  materialId.value = null;
  pesoStr.value = '';
};

const novaColeta = () => {
  showModal.value = false;
  if (beneficiario.value) beneficiario.value.saldo += creditoGerado.value;
  materialId.value = null;
  pesoStr.value = '';
  erros.value = { material: '', peso: '', geral: '' };
};
</script>

<style scoped>
.coleta-wrapper { align-items: flex-start; padding-top: 2rem; }

.coleta-inner {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Stepper */
.stepper {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 0.25rem;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.step--active { color: var(--color-primary); }

.step__dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-border);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  transition: all 0.2s;
  flex-shrink: 0;
}

.step--active .step__dot {
  background: var(--color-primary);
  color: #fff;
}

.step--done .step__dot {
  background: var(--color-success);
  color: #fff;
}

.step__line {
  flex: 1;
  height: 2px;
  background: var(--color-border);
  margin: 0 0.75rem;
  transition: background 0.3s;
}

.step__line--done { background: var(--color-success); }

/* Card header */
.card-header {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.card-header__icon {
  width: 44px;
  height: 44px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-title { font-size: 1.1rem; font-weight: 700; margin: 0; }
.card-subtitle { font-size: 0.82rem; color: var(--color-text-secondary); margin: 0.15rem 0 0; }

/* Hint DEV */
.hint-dev {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  background: var(--color-surface-alt);
  border: 1px dashed var(--color-border);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  flex-wrap: wrap;
}

.hint-dev code {
  background: var(--color-border);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  font-size: 0.78rem;
}

/* Etapa 2 layout */
.etapa2-layout { display: flex; flex-direction: column; gap: 1rem; }

/* Card beneficiário */
.beneficiario-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--color-surface);
  border: 1.5px solid var(--color-primary);
  border-radius: var(--radius-lg);
  padding: 1rem 1.25rem;
  box-shadow: var(--shadow-sm);
}

.beneficiario-card__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.beneficiario-card__info { flex: 1; min-width: 0; }
.beneficiario-card__nome { font-weight: 700; font-size: 0.95rem; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.beneficiario-card__sub { font-size: 0.77rem; color: var(--color-text-secondary); margin: 0.15rem 0 0; }

.beneficiario-card__saldo { text-align: right; flex-shrink: 0; }
.beneficiario-card__saldo-label { font-size: 0.72rem; color: var(--color-text-secondary); margin: 0; }
.beneficiario-card__saldo-valor { font-size: 1rem; font-weight: 700; color: var(--color-primary); margin: 0.1rem 0 0; }

.beneficiario-card__trocar {
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.4rem;
  cursor: pointer;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  transition: all var(--transition);
  flex-shrink: 0;
}
.beneficiario-card__trocar:hover { background: var(--color-primary-light); color: var(--color-primary); }

/* Material grid */
.field-group { margin-bottom: 1.25rem; }

.field-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.6rem;
}

.material-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.6rem;
}

.material-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.75rem 0.5rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s ease;
  text-align: center;
}

.material-btn:hover { border-color: var(--color-primary); transform: translateY(-1px); }
.material-btn--active { border-color: var(--color-primary); }

.material-btn__emoji { font-size: 1.4rem; }
.material-btn__nome { font-size: 0.78rem; font-weight: 600; color: var(--color-text); line-height: 1.2; }
.material-btn__preco { font-size: 0.72rem; color: var(--color-primary); font-weight: 700; margin-top: 0.1rem; }

.field-error { font-size: 0.8rem; color: var(--color-error); margin: 0.35rem 0 0; }

/* Crédito preview */
.credito-preview {
  background: #dcfce7;
  border: 1px solid #86efac;
  border-radius: var(--radius-md);
  padding: 0.85rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.credito-preview__main {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: #166534;
}

.credito-preview__valor { font-size: 1.2rem; font-weight: 700; margin: 0; color: #166534; }
.credito-preview__label { font-size: 0.75rem; color: #15803d; margin: 0.1rem 0 0; }

.credito-preview__bonus {
  font-size: 0.72rem;
  font-weight: 700;
  background: #166534;
  color: #fff;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  white-space: nowrap;
}

.credito-preview__bonus--warning { background: #ca8a04; }

/* Modal sucesso */
.success-modal { text-align: center; padding: 0.25rem 0 0.5rem; }

.success-modal__check {
  width: 52px;
  height: 52px;
  background: #dcfce7;
  color: var(--color-success);
  border-radius: 50%;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
}

.success-modal__nome { font-size: 1.1rem; font-weight: 700; margin: 0 0 0.3rem; }

.success-modal__detalhe {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.success-modal__credito {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #dcfce7;
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
}

.success-modal__credito-label { font-size: 0.85rem; color: #166534; }
.success-modal__credito-valor { font-size: 1.15rem; font-weight: 700; color: #166534; }

.success-modal__saldo-novo {
  font-size: 0.82rem;
  color: var(--color-text-secondary);
}

@media (max-width: 480px) {
  .material-grid { grid-template-columns: repeat(2, 1fr); }
  .beneficiario-card__saldo { display: none; }
}
</style>
