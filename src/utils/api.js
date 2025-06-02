import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const login = async (cpf, senha) => {
  return axios.post(`${API_URL}/login`, {
    cpf,
    senha
  });
};

export const registrarColeta = async (cpf, tipo, peso) => {
  return axios.post(`${API_URL}/coletas`, {
    cpf,
    tipo,
    peso
  });
};

export const getResumoMateriais = async (cpf) => {
  return axios.get(`${API_URL}/resumo-materiais/${cpf}`);
};
