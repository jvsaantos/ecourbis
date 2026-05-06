import axios from 'axios';
import {
  mockBuscarBeneficiario,
  mockRegistrarColeta,
  mockGetResumo,
  mockGetResiduos,
} from './mocks.js';

const DEV_MODE = import.meta.env.VITE_DEV_MODE !== 'false';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  const cpf = localStorage.getItem('cpf');
  if (cpf) config.headers['X-User-CPF'] = cpf;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

// ── Auth ─────────────────────────────────────────────────────
export const authService = {
  login:         (cpf, senha)   => http.post('/login', { cpf, senha }),
  register:      (dados)        => http.post('/register', dados),
  forgotPassword:(email)        => http.post('/forgot-password', { email }),
  resetPassword: (token, senha) => http.post('/reset-password', { token, senha }),
};

// ── Beneficiário ──────────────────────────────────────────────
export const beneficiarioService = {
  getResumo: (cpf) =>
    DEV_MODE ? mockGetResumo(cpf) : http.get(`/resumo-materiais/${cpf}`),

  buscarPorCpf: (cpf) =>
    DEV_MODE ? mockBuscarBeneficiario(cpf) : http.get(`/beneficiario/${cpf}`),
};

// ── Coleta ────────────────────────────────────────────────────
export const coletaService = {
  registrar: (cpfBeneficiario, materialId, pesoKg, creditoGerado) =>
    DEV_MODE
      ? mockRegistrarColeta(cpfBeneficiario, materialId, pesoKg, creditoGerado)
      : http.post('/coletas', { cpf_beneficiario: cpfBeneficiario, material_id: materialId, peso: pesoKg, credito: creditoGerado }),
};

// ── Empresa ───────────────────────────────────────────────────
export const empresaService = {
  configurarCreditos: (dados) =>
    DEV_MODE ? Promise.resolve({ data: { sucesso: true } }) : http.post('/empresa/creditos', dados),
};

// ── Central ───────────────────────────────────────────────────
export const centralService = {
  getResiduos: () =>
    DEV_MODE ? mockGetResiduos() : http.get('/residuos'),

  comprar: (carrinho) =>
    DEV_MODE ? Promise.resolve({ data: { sucesso: true } }) : http.post('/central/comprar', { itens: carrinho }),
};

// ── Voucher ───────────────────────────────────────────────────
export const voucherService = {
  gerar: (cpf, valor) =>
    DEV_MODE ? Promise.resolve({ data: { sucesso: true, codigo: 'MOCK-QR-2024' } }) : http.post('/voucher', { cpf, valor }),
};

export default http;
