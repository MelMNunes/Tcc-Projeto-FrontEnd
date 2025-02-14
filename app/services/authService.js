import api from "./api";

// Função para realizar login
export const login = async (loginData) => {
  try {
    const response = await api.post("/auth/login", loginData);
    return response.data; // Retorna o token JWT ou outros dados
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erro ao fazer login");
  }
};

// Função para realizar cadastro
export const register = async (registerData) => {
  try {
    const response = await api.post("/auth/cadastrar", registerData);
    return response.data; // Retorna mensagem de sucesso ou outros dados
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erro ao realizar cadastro");
  }
};