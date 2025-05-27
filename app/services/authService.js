import api from "./api";

export const login = async (loginData) => {
  try {
    const response = await api.post("/auth/login", loginData);
    return response.data; 
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data || "Erro ao fazer login");
    } else {
      throw new Error("Erro ao fazer login");
    }
  }
};

export const register = async (registerData) => {
  try {
    const response = await api.post("/auth/cadastrar", registerData);
    return response.data; 
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data || "Erro ao realizar cadastro");
    } else {
      throw new Error("Erro ao realizar cadastro");
    }
  }
};