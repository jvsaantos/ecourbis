/**
 * Tabela de materiais com preços baseados no mercado brasileiro de reciclagem (2024).
 *
 * Fontes de referência:
 *  - CEMPRE (Compromisso Empresarial para Reciclagem)
 *  - Bolsa de Resíduos da FIESP
 *  - Cooperativas de reciclagem SP/RJ
 *
 * creditoPorKg: valor repassado ao beneficiário que entregou o resíduo
 * precoCentral: preço de compra pela central de tratamento (por kg)
 * precoCentralTon: preço de compra pela central por tonelada (referência)
 */
export const MATERIAIS = [
  {
    id: 1,
    nome: 'Alumínio',
    emoji: '🥫',
    creditoPorKg: 4.50,
    precoCentral: 6.80,
    cor: '#FFF8E1',
    descricao: 'Latas, embalagens e perfis',
    dificuldade: 'baixa',
  },
  {
    id: 2,
    nome: 'Cobre',
    emoji: '🔩',
    creditoPorKg: 18.00,
    precoCentral: 28.00,
    cor: '#FFF3E0',
    descricao: 'Fios, tubos e peças',
    dificuldade: 'baixa',
  },
  {
    id: 3,
    nome: 'Plástico PET',
    emoji: '🧴',
    creditoPorKg: 1.20,
    precoCentral: 2.10,
    cor: '#E3F2FD',
    descricao: 'Garrafas e embalagens transparentes',
    dificuldade: 'media',
  },
  {
    id: 4,
    nome: 'Plástico Duro (PEAD)',
    emoji: '🪣',
    creditoPorKg: 0.90,
    precoCentral: 1.60,
    cor: '#E3F2FD',
    descricao: 'Baldes, caixas e tampas',
    dificuldade: 'media',
  },
  {
    id: 5,
    nome: 'Papel / Papelão',
    emoji: '📦',
    creditoPorKg: 0.35,
    precoCentral: 0.65,
    cor: '#F3E5F5',
    descricao: 'Caixas, jornais e revistas',
    dificuldade: 'alta',
  },
  {
    id: 6,
    nome: 'Vidro',
    emoji: '🫙',
    creditoPorKg: 0.12,
    precoCentral: 0.25,
    cor: '#E8F5E9',
    descricao: 'Garrafas e potes (incolor ou colorido)',
    dificuldade: 'alta',
  },
  {
    id: 7,
    nome: 'Ferro / Aço',
    emoji: '⚙️',
    creditoPorKg: 0.55,
    precoCentral: 0.95,
    cor: '#ECEFF1',
    descricao: 'Sucata metálica e peças',
    dificuldade: 'media',
  },
  {
    id: 8,
    nome: 'Eletrônicos (e-lixo)',
    emoji: '💻',
    creditoPorKg: 2.80,
    precoCentral: 5.20,
    cor: '#FCE4EC',
    descricao: 'Celulares, placas e cabos',
    dificuldade: 'baixa',
  },
];

/**
 * Calcula o crédito gerado para um beneficiário.
 * Aplica multiplicador de incentivo para materiais de alta dificuldade.
 */
export function calcularCredito(materialId, pesoKg) {
  const material = MATERIAIS.find((m) => m.id === materialId);
  if (!material) return 0;

  const multiplicador = material.dificuldade === 'alta' ? 1.3
    : material.dificuldade === 'media' ? 1.1
    : 1.0;

  return parseFloat((pesoKg * material.creditoPorKg * multiplicador).toFixed(2));
}

/**
 * Composable para uso nas views.
 */
export function useMateriais() {
  const getMaterial = (id) => MATERIAIS.find((m) => m.id === id) ?? null;

  const labelDificuldade = (d) =>
    ({ baixa: 'Alta demanda', media: 'Demanda média', alta: 'Baixa demanda' }[d] ?? d);

  const corDificuldade = (d) =>
    ({ baixa: 'success', media: 'warning', alta: 'error' }[d] ?? 'default');

  return { MATERIAIS, getMaterial, calcularCredito, labelDificuldade, corDificuldade };
}
