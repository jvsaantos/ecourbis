<template>
  <div>
    <HeaderBar />
    <div class="page-wrapper dash-wrapper">
      <div class="dash-inner">

        <!-- Greeting + QR action -->
        <div class="dash-header">
          <div>
            <p class="dash-greeting">Olá,</p>
            <h1 class="dash-name">{{ usuario.nome }}</h1>
          </div>
          <AppButton @click="router.push('/gerar-qrcode')" variant="primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/>
            </svg>
            Gerar QR Code
          </AppButton>
        </div>

        <!-- Stats row -->
        <div class="stats-grid">
          <div class="stat-card stat-card--primary">
            <div class="stat-card__label">Saldo em Créditos</div>
            <div class="stat-card__value">{{ formatarMoeda(saldo) }}</div>
            <div class="stat-card__sub">disponível para uso</div>
          </div>

          <div class="stat-card">
            <div class="stat-card__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </div>
            <div class="stat-card__label">Coletas</div>
            <div class="stat-card__value">{{ coletas.length }}</div>
          </div>

          <div class="stat-card">
            <div class="stat-card__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zM12 6v6l4 2"/>
              </svg>
            </div>
            <div class="stat-card__label">Peso Total</div>
            <div class="stat-card__value">{{ formatarPeso(totalPeso) }}</div>
          </div>
        </div>

        <!-- History -->
        <div class="section-card">
          <h2 class="section-title">Histórico de Coletas</h2>

          <LoadingSpinner v-if="loading" label="Carregando dados..." :full="true" />

          <div v-else-if="erro" class="alert alert--error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
            </svg>
            {{ erro }}
            <button class="retry-btn" @click="buscarDados">Tentar novamente</button>
          </div>

          <EmptyState
            v-else-if="!coletas.length"
            title="Nenhuma coleta registrada"
            description="Suas coletas de resíduos aparecerão aqui após serem registradas por um funcionário."
          >
            <template #icon>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </template>
          </EmptyState>

          <ul v-else class="coleta-list">
            <li v-for="(coleta, i) in coletas" :key="i" class="coleta-item">
              <div class="coleta-item__icon" :style="{ background: corResiduoBg(coleta.tipo) }">
                <span class="coleta-item__emoji">{{ emojiResiduo(coleta.tipo) }}</span>
              </div>
              <div class="coleta-item__info">
                <span class="coleta-item__tipo">{{ coleta.tipo }}</span>
                <span class="coleta-item__peso">{{ formatarPeso(coleta.peso) }}</span>
              </div>
              <AppBadge variant="success">
                + {{ formatarMoeda(coleta.peso * 2) }}
              </AppBadge>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import HeaderBar from '../components/HeaderBar.vue';
import AppButton from '../components/AppButton.vue';
import AppBadge from '../components/AppBadge.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import EmptyState from '../components/EmptyState.vue';
import { useAuth } from '../composables/useAuth';
import { useFormatters } from '../composables/useFormatters';
import { beneficiarioService } from '../services/api';

const router = useRouter();
const { usuario } = useAuth();
const { formatarMoeda, formatarPeso } = useFormatters();

const coletas = ref([]);
const loading = ref(false);
const erro = ref('');

const cpf = localStorage.getItem('cpf');
if (!cpf) router.push('/');

const saldo = computed(() => coletas.value.reduce((acc, c) => acc + c.peso * 2, 0));
const totalPeso = computed(() => coletas.value.reduce((acc, c) => acc + c.peso, 0));

const corResiduoBg = (tipo) => {
  const map = { plástico: '#E3F2FD', vidro: '#F3E5F5', papel: '#FFF8E1', metal: '#FAFAFA' };
  return map[tipo?.toLowerCase()] ?? '#E8F5E9';
};

const emojiResiduo = (tipo) => {
  const map = { plástico: '🧴', vidro: '🫙', papel: '📄', metal: '🔩', orgânico: '🌿' };
  return map[tipo?.toLowerCase()] ?? '♻️';
};

const buscarDados = async () => {
  loading.value = true;
  erro.value = '';
  try {
    const { data } = await beneficiarioService.getResumo(cpf);
    if (data.beneficiario) {
      localStorage.setItem('nome', data.beneficiario);
      usuario.value && (usuario.value.nome = data.beneficiario);
    }
    coletas.value = (data.materiais ?? []).map((item) => ({
      tipo: item.tipo,
      peso: parseFloat(item.total_peso),
    }));
  } catch {
    erro.value = 'Não foi possível carregar seus dados. Verifique sua conexão.';
  } finally {
    loading.value = false;
  }
};

onMounted(buscarDados);
</script>

<style scoped>
.dash-wrapper {
  align-items: flex-start;
  padding-top: 2rem;
}

.dash-inner {
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.dash-greeting {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.dash-name {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  gap: 1rem;
}

.stat-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-card--primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: #fff;
  border: none;
}

.stat-card__label {
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.75;
}

.stat-card__value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.1;
}

.stat-card--primary .stat-card__label,
.stat-card--primary .stat-card__sub { color: rgba(255,255,255,0.8); }

.stat-card__sub { font-size: 0.75rem; }

.stat-card__icon {
  color: var(--color-primary);
  margin-bottom: 0.25rem;
}

/* Section card */
.section-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
}

/* Coleta list */
.coleta-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.coleta-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  transition: background var(--transition);
}

.coleta-item:hover { background: var(--color-surface-alt); }

.coleta-item__icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.coleta-item__emoji { font-size: 1.2rem; }

.coleta-item__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.coleta-item__tipo { font-weight: 600; font-size: 0.9rem; }
.coleta-item__peso { font-size: 0.8rem; color: var(--color-text-secondary); }

.retry-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  font-family: inherit;
  text-decoration: underline;
  margin-left: 0.5rem;
}

@media (max-width: 560px) {
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .stat-card--primary { grid-column: 1 / -1; }
}
</style>
