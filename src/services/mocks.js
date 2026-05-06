/**
 * Dados mockados para DEV_MODE.
 * Substitua por chamadas reais ao backend quando disponível.
 */

import { MATERIAIS } from '../composables/useMateriais.js';

export const BENEFICIARIOS_MOCK = [
  {
    cpf: '11144477735',
    nome: 'Maria da Silva',
    email: 'maria.silva@email.com',
    bairro: 'Vila Madalena',
    coletas: [
      { material: 3, peso: 4.5 },  // Plástico PET
      { material: 5, peso: 12.0 }, // Papel
      { material: 6, peso: 8.0 },  // Vidro
    ],
  },
  {
    cpf: '52998224725',
    nome: 'João Pereira',
    email: 'joao.pereira@email.com',
    bairro: 'Santana',
    coletas: [
      { material: 1, peso: 2.2 },  // Alumínio
      { material: 3, peso: 6.0 },  // Plástico PET
    ],
  },
  {
    cpf: '00000000000',
    nome: 'Usuário Teste',
    email: 'teste@ecourbis.com',
    bairro: 'Centro',
    coletas: [
      { material: 1, peso: 1.5 },
      { material: 3, peso: 3.0 },
      { material: 5, peso: 5.0 },
    ],
  },
];

/** Calcula saldo total de um beneficiário a partir das coletas mockadas */
function calcularSaldoBeneficiario(coletas) {
  return coletas.reduce((total, c) => {
    const mat = MATERIAIS.find((m) => m.id === c.material);
    if (!mat) return total;
    const mult = mat.dificuldade === 'alta' ? 1.3 : mat.dificuldade === 'media' ? 1.1 : 1.0;
    return total + c.peso * mat.creditoPorKg * mult;
  }, 0);
}

/** Simula GET /beneficiario/:cpf */
export function mockBuscarBeneficiario(cpf) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const b = BENEFICIARIOS_MOCK.find((b) => b.cpf === cpf);
      if (!b) return reject({ response: { data: { erro: 'CPF não encontrado na base.' } } });

      const saldo = calcularSaldoBeneficiario(b.coletas);
      const materiais = b.coletas.map((c) => {
        const mat = MATERIAIS.find((m) => m.id === c.material);
        const mult = mat.dificuldade === 'alta' ? 1.3 : mat.dificuldade === 'media' ? 1.1 : 1.0;
        return {
          materialId: mat.id,
          tipo: mat.nome,
          emoji: mat.emoji,
          peso: c.peso,
          credito: parseFloat((c.peso * mat.creditoPorKg * mult).toFixed(2)),
        };
      });

      resolve({
        data: {
          cpf: b.cpf,
          nome: b.nome,
          email: b.email,
          bairro: b.bairro,
          saldo: parseFloat(saldo.toFixed(2)),
          materiais,
        },
      });
    }, 600);
  });
}

/** Simula POST /coletas */
export function mockRegistrarColeta(cpfBeneficiario, materialId, pesoKg, creditoGerado) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const b = BENEFICIARIOS_MOCK.find((b) => b.cpf === cpfBeneficiario);
      if (b) b.coletas.push({ material: materialId, peso: pesoKg });
      resolve({ data: { sucesso: true, credito_gerado: creditoGerado } });
    }, 800);
  });
}

/** Simula GET /resumo-materiais/:cpf (formato compatível com BeneficiarioProfile) */
export function mockGetResumo(cpf) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const b = BENEFICIARIOS_MOCK.find((b) => b.cpf === cpf);
      if (!b) return reject({ response: { data: { erro: 'CPF não encontrado.' } } });

      const agrupado = {};
      b.coletas.forEach((c) => {
        const mat = MATERIAIS.find((m) => m.id === c.material);
        if (!mat) return;
        if (!agrupado[mat.nome]) agrupado[mat.nome] = { tipo: mat.nome, emoji: mat.emoji, total_peso: 0 };
        agrupado[mat.nome].total_peso += c.peso;
      });

      resolve({
        data: {
          beneficiario: b.nome,
          materiais: Object.values(agrupado),
        },
      });
    }, 700);
  });
}

/** Estoque mockado da Central de Tratamento com preços de mercado */
export const RESIDUOS_CENTRAL_MOCK = MATERIAIS.map((m, i) => ({
  id: m.id,
  tipo: m.nome,
  emoji: m.emoji,
  quantidade: [320, 85, 540, 210, 180, 750, 430, 60][i] ?? 100,
  precoPorKg: m.precoCentral,
  precoPorTon: parseFloat((m.precoCentral * 1000).toFixed(0)),
  descricao: m.descricao,
}));

/** Simula GET /residuos */
export function mockGetResiduos() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: RESIDUOS_CENTRAL_MOCK }), 500);
  });
}

/**
 * Cálculo de isenção fiscal — compatível com programas municipais reais.
 *
 * Regras:
 *  - 3% de isenção sobre ISS/IPTU por R$ 1.000 investidos em créditos
 *  - Teto máximo de 30% de isenção (equivalente a R$ 10.000 investidos)
 *  - Benefício adicional de 2pp para CNPJ com >1 ano no programa
 *
 * Referência: Programa de Créditos Verdes SP (Decreto Municipal 58.811/2019)
 */
export function calcularIsencaoFiscal(valorCreditos, veterano = false) {
  const BASE_PERCENTUAL = 0.03;   // 3% por cada R$ 1.000
  const TETO_PERCENTUAL = 0.30;   // máximo 30%
  const BONUS_VETERANO  = 0.02;   // 2pp extra para empresas veteranas

  const percentual = Math.min(
    (valorCreditos / 1000) * BASE_PERCENTUAL + (veterano ? BONUS_VETERANO : 0),
    TETO_PERCENTUAL,
  );

  return {
    percentual: parseFloat((percentual * 100).toFixed(1)),
    valorIsencao: parseFloat((valorCreditos * percentual).toFixed(2)),
    atingiuTeto: percentual >= TETO_PERCENTUAL,
    valorParaTeto: Math.max(0, ((TETO_PERCENTUAL - (veterano ? BONUS_VETERANO : 0)) / BASE_PERCENTUAL) * 1000 - valorCreditos),
  };
}
