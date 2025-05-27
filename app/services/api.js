import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/", 
  headers: {
    "Content-Type": "application/json", 
  },
});

export const getUsuarioById = async (userId) => {

  try {
    if (!userId) {
      throw new Error("ID do usuário não encontrado.");
    }


    const response = await fetch(
      `http://localhost:8080/api/usuarios/${userId}`
    ); 
    if (!response.ok) {
      throw new Error("Falha ao obter os dados do usuário");
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Erro ao buscar usuario:", error);
    throw error;
  }
};

export const getAgendamentosByClienteId = async (clienteId) => {
  try {
    console.log("Chamando API:", `/agendamentos/clientes/${clienteId}`);
    const response = await api.get(`/agendamentos/clientes/${clienteId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    throw error;
  }
};


export const getAgendamentosByFuncionarioId = async (funcionarioId) => {
  const response = await fetch(`http://localhost:8080/api/agendamentos/funcionarios/${funcionarioId}`);
  console.log("API Response:", response); 

  if (!response.ok) {
    throw new Error('Failed to fetch appointments');
  }
  return await response.json();
};

export default api;