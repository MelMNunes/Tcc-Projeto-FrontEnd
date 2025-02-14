import axios from "axios";

// Configuração do Axios com a URL base do backend
const api = axios.create({
  baseURL: "http://localhost:8080/api/", //Base URL do backend
  headers: {
    "Content-Type": "application/json", // Tipo de conteúdo (JSON)
  },
});

export default api;