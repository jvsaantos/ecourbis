import api from './api';

export async function registrarColeta(cpf, tipo, peso) {
  return await api.post('/coletas', {
    cpf,
    tipo,
    peso
  });
}
