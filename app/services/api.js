import axios from "axios";

// Configuração do Axios com a URL base do backend
const api = axios.create({
  baseURL: "http://localhost:8080/api/", //Base URL do backend
  headers: {
    "Content-Type": "application/json", // Tipo de conteúdo (JSON)
  },
});

export const getUsuarioById = async (userId) => { // Adicione o parâmetro userId
  try {
    if (!userId) {
      throw new Error("ID do usuário não encontrado.");
    }

    // Realizando a requisição para obter os dados do usuário
    const response = await fetch(`http://localhost:8080/api/usuarios/${userId}`); // Use a URL correta
    if (!response.ok) {
      throw new Error("Falha ao obter os dados do usuário");
    }

    const data = await response.json();
    return data; // Retorna os dados do cliente
  } catch (error) {
    console.error("Erro ao buscar usuario:", error);
    throw error;
  }
};

export default api;
