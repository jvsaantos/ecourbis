import api from './api';

export async function buscarResumoMateriais(cpf) {
  const response = await api.get(`/resumo-materiais/${cpf}`);
  return response.data;
}
