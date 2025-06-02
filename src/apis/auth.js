import api from './api';

export async function loginBeneficiario(cpf, senha) {
  const response = await api.post('login', {
    cpf,
    senha,
  });

  return response.data;
}

export async function registrarColeta(cpf, residuo_id, peso) {
  return await api.post('/coletas', {
    cpf,
    residuo_id,
    peso,
  });
}

export async function getResumoMateriais(cpf) {
  const response = await api.get(`resumo-materiais/${cpf}`);
  return response.data;
}