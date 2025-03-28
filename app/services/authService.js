import api from "./api";

// Função para realizar login
export const login = async (loginData) => {
  try {
    const response = await api.post("/auth/login", loginData);
    return response.data; // Retorna o token JWT ou outros dados
  } catch (error) {
    // Verifica se o erro tem uma resposta do servidor
    if (error.response) {
      // Retorna a mensagem de erro específica do backend
      throw new Error(error.response.data || "Erro ao fazer login");
    } else {
      // Se não houver resposta, retorna um erro genérico
      throw new Error("Erro ao fazer login");
    }
  }
};

// Função para realizar cadastro
export const register = async (registerData) => {
  try {
    const response = await api.post("/auth/cadastrar", registerData);
    return response.data; // Retorna mensagem de sucesso ou outros dados
  } catch (error) {
    // Verifica se o erro tem uma resposta do servidor
    if (error.response) {
      // Retorna a mensagem de erro específica do backend
      throw new Error(error.response.data || "Erro ao realizar cadastro");
    } else {
      // Se não houver resposta, retorna um erro genérico
      throw new Error("Erro ao realizar cadastro");
    }
  }
};