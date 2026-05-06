<template>
  <div>
    <HeaderBar />
    <div class="page-wrapper" style="align-items:flex-start; padding-top:2rem;">
      <div class="central-layout">

        <!-- ── Catálogo ── -->
        <div class="catalog-col">
          <div class="col-header">
            <div class="col-header__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
            </div>
            <div>
              <h1 class="page-title" style="text-align:left; margin:0; font-size:1.25rem;">Central de Compras</h1>
              <p class="page-subtitle" style="text-align:left; margin:0.1rem 0 0; font-size:0.82rem;">Preços de mercado CEMPRE/FIESP · 2024</p>
            </div>
          </div>

          <!-- Filtros -->
          <div class="filter-row">
            <button
              v-for="op in filtros"
              :key="op"
              :class="['filter-btn', { 'filter-btn--active': filtro === op }]"
              @click="filtro = op"
            >{{ op }}</button>
          </div>

          <!-- Loading inicial -->
          <LoadingSpinner v-if="carregando" label="Carregando estoque..." :full="true" />

          <!-- Lista -->
          <div v-else class="residuo-list">
            <div
              v-for="r in residuosFiltrados"
              :key="r.id"
              class="residuo-card"
              :class="{ 'residuo-card--esgotado': r.quantidade === 0 }"
            >
              <div class="residuo-card__left">
                <span class="residuo-card__emoji">{{ r.emoji }}</span>
                <div>
                  <p class="residuo-card__nome">{{ r.tipo }}</p>
                  <p class="residuo-card__descricao">{{ r.descricao }}</p>
                  <div class="residuo-card__meta">
                    <span :class="['disponivel-badge', r.quantidade > 100 ? 'disponivel-badge--ok' : r.quantidade > 0 ? 'disponivel-badge--low' : 'disponivel-badge--zero']">
                      {{ r.quantidade > 0 ? `${r.quantidade} kg` : 'Esgotado' }}
                    </span>
                    <span class="preco-ton">{{ formatarMoeda(r.precoPorTon) }}/ton</span>
                  </div>
                </div>
              </div>
              <div class="residuo-card__right">
                <p class="residuo-card__preco">{{ formatarMoeda(r.precoPorKg) }}<span>/kg</span></p>
                <div class="qty-control">
                  <input
                    type="number"
                    v-model.number="r.quantidadeDesejada"
                    min="1"
                    :max="r.quantidade"
                    class="qty-input"
                    placeholder="kg"
                    :disabled="r.quantidade === 0"
                    aria-label="Quantidade em kg"
                  />
                  <button
                    class="qty-add-btn"
                    :disabled="!r.quantidadeDesejada || r.quantidade === 0"
                    @click="adicionar(r)"
                    aria-label="Adicionar ao pedido"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Carrinho ── -->
        <div class="cart-col">
          <div class="page-card cart-card">
            <h2 class="section-title">Seu Pedido</h2>

            <EmptyState
              v-if="!carrinho.length"
              title="Pedido vazio"
              description="Adicione itens do catálogo."
            >
              <template #icon>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.97-1.67L23 6H6"/>
                </svg>
              </template>
            </EmptyState>

            <template v-else>
              <div v-for="(item, i) in carrinho" :key="i" class="cart-item">
                <div class="cart-item__info">
                  <span class="cart-item__emoji">{{ item.emoji }}</span>
                  <div>
                    <p class="cart-item__nome">{{ item.tipo }}</p>
                    <p class="cart-item__qty">{{ item.quantidade }} kg · {{ formatarMoeda(item.precoPorKg) }}/kg</p>
                  </div>
                </div>
                <div class="cart-item__right">
                  <span class="cart-item__preco">{{ formatarMoeda(item.precoPorKg * item.quantidade) }}</span>
                  <button class="cart-item__remove" @click="remover(item)" aria-label="Remover">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="cart-divider"></div>

              <div class="cart-total">
                <div>
                  <p class="cart-total__label">Total do Pedido</p>
                  <p class="cart-total__value">{{ formatarMoeda(totalCarrinho) }}</p>
                </div>
                <div class="cart-total__peso">
                  <p class="cart-total__label">Peso total</p>
                  <p class="cart-total__value--sm">{{ totalPeso }} kg</p>
                </div>
              </div>

              <AppButton :full="true" :loading="loading" @click="finalizar">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                Gerar Boleto
              </AppButton>
            </template>
          </div>
        </div>

      </div>
    </div>

    <AppModal v-model="showModal" :title="modal.title" size="sm">
      <div class="modal-center">
        <div :class="['modal-icon', `modal-icon--${modal.type}`]">{{ modal.type === 'success' ? '✓' : '!' }}</div>
        <p>{{ modal.message }}</p>
      </div>
      <template #footer>
        <AppButton :full="true" @click="showModal = false">Fechar</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import HeaderBar from '../components/HeaderBar.vue';
import AppButton from '../components/AppButton.vue';
import AppModal from '../components/AppModal.vue';
import EmptyState from '../components/EmptyState.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import { useFormatters } from '../composables/useFormatters.js';
import { centralService } from '../services/api.js';

const { formatarMoeda } = useFormatters();

const residuosDisponiveis = ref([]);
const carregando = ref(true);
const filtro = ref('Todos');
const carrinho = ref([]);
const loading = ref(false);
const showModal = ref(false);
const modal = ref({ title: '', message: '', type: 'success' });

const filtros = computed(() => ['Todos', ...residuosDisponiveis.value.map((r) => r.tipo)]);

const residuosFiltrados = computed(() =>
  filtro.value === 'Todos'
    ? residuosDisponiveis.value
    : residuosDisponiveis.value.filter((r) => r.tipo === filtro.value),
);

const totalCarrinho = computed(() =>
  carrinho.value.reduce((t, i) => t + i.precoPorKg * i.quantidade, 0),
);

const totalPeso = computed(() =>
  carrinho.value.reduce((t, i) => t + i.quantidade, 0),
);

onMounted(async () => {
  try {
    const { data } = await centralService.getResiduos();
    residuosDisponiveis.value = data.map((r) => ({ ...r, quantidadeDesejada: null }));
  } finally {
    carregando.value = false;
  }
});

const adicionar = (residuo) => {
  const qty = residuo.quantidadeDesejada;
  if (!qty || qty <= 0) return;
  if (qty > residuo.quantidade) {
    modal.value = { title: 'Estoque insuficiente', message: `Disponível: ${residuo.quantidade} kg de ${residuo.tipo}.`, type: 'error' };
    showModal.value = true;
    return;
  }
  const existente = carrinho.value.find((i) => i.id === residuo.id);
  if (existente) existente.quantidade += qty;
  else carrinho.value.push({ id: residuo.id, tipo: residuo.tipo, precoPorKg: residuo.precoPorKg, quantidade: qty, emoji: residuo.emoji });
  residuo.quantidade -= qty;
  residuo.quantidadeDesejada = null;
};

const remover = (item) => {
  const idx = carrinho.value.findIndex((i) => i.id === item.id);
  if (idx === -1) return;
  const r = residuosDisponiveis.value.find((r) => r.id === item.id);
  if (r) r.quantidade += item.quantidade;
  carrinho.value.splice(idx, 1);
};

const finalizar = async () => {
  loading.value = true;
  try {
    await centralService.comprar(carrinho.value);
  } finally {
    loading.value = false;
    modal.value = {
      title: 'Boleto Gerado!',
      message: `Boleto de ${formatarMoeda(totalCarrinho.value)} (${totalPeso.value} kg) enviado ao seu e-mail.`,
      type: 'success',
    };
    carrinho.value = [];
    showModal.value = true;
  }
};
</script>

<style scoped>
.central-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.25rem;
  width: 100%;
  max-width: 1020px;
  align-items: start;
}

.col-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }

.col-header__icon {
  width: 42px; height: 42px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* Filtros */
.filter-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }

.filter-btn {
  padding: 0.38rem 0.85rem;
  border: 1.5px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  font-family: inherit; font-size: 0.82rem; font-weight: 500;
  cursor: pointer; transition: all 0.15s;
}

.filter-btn--active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: #fff;
}

/* Lista de resíduos */
.residuo-list { display: flex; flex-direction: column; gap: 0.75rem; }

.residuo-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1rem 1.15rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-sm);
  transition: border-color var(--transition);
}

.residuo-card:hover { border-color: var(--color-primary); }
.residuo-card--esgotado { opacity: 0.55; }

.residuo-card__left { display: flex; align-items: flex-start; gap: 0.75rem; flex: 1; min-width: 0; }
.residuo-card__emoji { font-size: 1.5rem; flex-shrink: 0; }
.residuo-card__nome { font-weight: 700; font-size: 0.9rem; margin: 0; }
.residuo-card__descricao { font-size: 0.75rem; color: var(--color-text-secondary); margin: 0.15rem 0 0.4rem; }

.residuo-card__meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }

.disponivel-badge {
  font-size: 0.72rem; font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}

.disponivel-badge--ok   { background: #dcfce7; color: #166534; }
.disponivel-badge--low  { background: #fef9c3; color: #854d0e; }
.disponivel-badge--zero { background: #fee2e2; color: #991b1b; }

.preco-ton { font-size: 0.72rem; color: var(--color-text-secondary); }

.residuo-card__right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; flex-shrink: 0; }
.residuo-card__preco { font-size: 1.05rem; font-weight: 700; color: var(--color-primary); margin: 0; }
.residuo-card__preco span { font-size: 0.75rem; font-weight: 500; color: var(--color-text-secondary); }

.qty-control { display: flex; gap: 0.4rem; align-items: center; }

.qty-input {
  width: 60px; padding: 0.42rem 0.4rem;
  border: 1.5px solid var(--color-border);
  border-radius: 8px; font-size: 0.9rem;
  font-family: inherit; text-align: center; outline: none;
}
.qty-input:focus { border-color: var(--color-primary); }

.qty-add-btn {
  width: 32px; height: 32px;
  background: var(--color-primary);
  border: none; border-radius: 8px; color: #fff;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background var(--transition);
}
.qty-add-btn:hover:not(:disabled) { background: var(--color-primary-dark); }
.qty-add-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Carrinho */
.cart-card { position: sticky; top: 80px; }

.cart-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.6rem 0; gap: 0.5rem;
}

.cart-item__info { display: flex; align-items: center; gap: 0.6rem; }
.cart-item__emoji { font-size: 1.1rem; }
.cart-item__nome { font-weight: 600; font-size: 0.85rem; margin: 0; }
.cart-item__qty { font-size: 0.72rem; color: var(--color-text-secondary); margin: 0.1rem 0 0; }
.cart-item__right { display: flex; align-items: center; gap: 0.5rem; }
.cart-item__preco { font-weight: 700; font-size: 0.85rem; white-space: nowrap; }

.cart-item__remove {
  width: 24px; height: 24px;
  background: #fee2e2; border: none; border-radius: 5px;
  color: #dc2626; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background var(--transition);
}
.cart-item__remove:hover { background: #fecaca; }

.cart-divider { height: 1px; background: var(--color-border); margin: 0.75rem 0; }

.cart-total {
  display: flex; justify-content: space-between; align-items: flex-end;
  margin-bottom: 1.25rem;
}

.cart-total__label { font-size: 0.75rem; color: var(--color-text-secondary); margin: 0; }
.cart-total__value { font-size: 1.25rem; font-weight: 700; color: var(--color-primary); margin: 0.15rem 0 0; }
.cart-total__peso { text-align: right; }
.cart-total__value--sm { font-size: 0.95rem; font-weight: 700; color: var(--color-text); margin: 0.15rem 0 0; }

/* Modal */
.modal-center { text-align: center; padding: 0.5rem 0; }

.modal-icon {
  width: 50px; height: 50px; border-radius: 50%;
  font-size: 1.3rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1rem;
}
.modal-icon--success { background: #dcfce7; color: var(--color-success); }
.modal-icon--error   { background: #fee2e2; color: var(--color-error); }

@media (max-width: 720px) {
  .central-layout { grid-template-columns: 1fr; }
  .cart-card { position: static; }
}
</style>
