"use client";

import React, { useState } from "react";
import MaskedInput from "@/app/components/InputMask"; // Certifique-se que o caminho está correto

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: any) => void; // Ajustado para 'any' para simplificar, idealmente teria um tipo de usuário de resposta
}

// Ícone para o botão de fechar
const XMarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UserModal = ({ isOpen, onClose, onSave }: UserModalProps) => {
  const [userData, setUserData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    senha: "",
    tipoDeUsuario: "CLIENTE", // Valor padrão
  });
  const [isLoading, setIsLoading] = useState(false); // Estado para feedback de carregamento

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMaskedInputChange = (name: string, value: string) => {
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validação básica (exemplo)
    if (!userData.nome || !userData.email || !userData.cpf || !userData.senha) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        setIsLoading(false);
        return;
    }
    if (!/\S+@\S+\.\S+/.test(userData.email)) {
        alert("Por favor, insira um email válido.");
        setIsLoading(false);
        return;
    }
    if (userData.senha.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        setIsLoading(false);
        return;
    }


    let endpoint = "http://localhost:8080/api/usuarios/cadastrar-cliente";
    if (userData.tipoDeUsuario === "FUNCIONARIO") {
      endpoint = "http://localhost:8080/api/usuarios/cadastrar-funcionario";
    } else if (userData.tipoDeUsuario === "ADMINISTRADOR") {
      endpoint = "http://localhost:8080/api/usuarios/cadastrar-administrador";
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Removido Authorization daqui, pois o token do admin que cadastra já deve estar na API
          // Se o token for do próprio usuário sendo cadastrado, não faria sentido aqui.
          // Se for um token de admin para autorizar o cadastro, ele deve ser pego de forma segura.
          // Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userData),
      });

      const responseText = await response.text(); // Ler como texto primeiro

      if (response.ok) {
        alert("Usuário cadastrado com sucesso!");
        try {
          const jsonData = JSON.parse(responseText); // Tentar parsear se for JSON
          onSave(jsonData);
        } catch (jsonError) {
          console.warn("Resposta de sucesso não era JSON ou era JSON inválido, mas a operação foi OK:", responseText);
          onSave(userData); // Chama onSave com os dados enviados se a resposta não for JSON
        }
        onClose(); // Fecha o modal
         // Limpa o formulário para o próximo uso
        setUserData({
            nome: "", email: "", cpf: "", telefone: "", senha: "", tipoDeUsuario: "CLIENTE",
        });
      } else {
        // Tenta pegar uma mensagem de erro do backend se for JSON
        let errorMessage = `Erro ${response.status}: ${response.statusText}`;
        try {
          const errorJson = JSON.parse(responseText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (e) {
          // Se não for JSON, usa o texto da resposta se houver, ou o statusText
          if (responseText) errorMessage = responseText;
        }
        alert(`Falha ao cadastrar usuário: ${errorMessage}`);
        console.error("Erro ao cadastrar usuário:", responseText);
      }
    } catch (error) {
      alert("Ocorreu um erro de rede ou inesperado ao tentar cadastrar o usuário. Verifique o console.");
      console.error("Erro de rede/inesperado ao cadastrar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm text-black">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Cadastrar Novo Usuário
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar modal"
          >
            <XMarkIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nome"
              id="nome"
              value={userData.nome}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
              placeholder="João da Silva"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
              placeholder="exemplo@dominio.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                CPF <span className="text-red-500">*</span>
              </label>
              <MaskedInput
                type="CPF" // Seu tipo de máscara
                id="cpf"
                name="cpf"
                value={userData.cpf}
                onChange={(value) => handleMaskedInputChange("cpf", value)}
                className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="000.000.000-00"
                required
              />
            </div>
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <MaskedInput
                type="Telefone" // Seu tipo de máscara
                id="telefone"
                name="telefone"
                value={userData.telefone}
                onChange={(value) => handleMaskedInputChange("telefone", value)}
                className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
              Senha <span className="text-red-500">*</span> (mín. 6 caracteres)
            </label>
            <input
              type="password"
              name="senha"
              id="senha"
              value={userData.senha}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="tipoDeUsuario" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Usuário <span className="text-red-500">*</span>
            </label>
            <select
              name="tipoDeUsuario"
              id="tipoDeUsuario"
              value={userData.tipoDeUsuario}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
            >
              <option value="CLIENTE">Cliente</option>
              <option value="FUNCIONARIO">Funcionário</option>
              <option value="ADMINISTRADOR">Administrador</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto justify-center flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                "Salvar Usuário"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out disabled:opacity-70"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;