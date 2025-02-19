"use client";

import React, { useState } from "react";
import MaskedInput from "@/app/components/InputMask";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: {
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    senha: string;
    tipoDeUsuario: string;
  }) => void;
}

const UserModal = ({ isOpen, onClose, onSave }: UserModalProps) => {
  const [userData, setUserData] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    senha: "",
    tipoDeUsuario: "CLIENTE",
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userData),
      });
  
      // Verifica se o backend está retornando JSON ou texto
      const responseText = await response.text();
      console.log("Resposta do servidor:", responseText);
  
      try {
        const jsonData = JSON.parse(responseText); // Tenta converter para JSON
        console.log("Usuário cadastrado:", jsonData);
        onSave(jsonData);
      } catch {
        console.warn("Resposta não é JSON válido:", responseText);
      }
      
  
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  };
  
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Cadastrar Usuário</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Nome:
            <input
              type="text"
              name="nome"
              value={userData.nome}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </label>
          <label className="block mb-2">
            E-mail:
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </label>
          <label className="block mb-2">
          CPF:
            <MaskedInput
              type="CPF"
              value={userData.cpf}
              onChange={(value) => setUserData({ ...userData, cpf: value })}
              className="w-full border p-2 rounded mt-1"
            />
          </label>
          <label className="block mb-2">
          Telefone:
            <MaskedInput
              type="Telefone"
              value={userData.telefone}
              onChange={(value) =>
                setUserData({ ...userData, telefone: value })
              }
              className="w-full border p-2 rounded mt-1"
            />
          </label>
          <label className="block mb-2">
            Senha:
            <input
              type="password"
              name="senha"
              value={userData.senha}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </label>
          <label className="block mb-4">
            Tipo de Usuário:
            <select
              name="tipoDeUsuario"
              value={userData.tipoDeUsuario}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="CLIENTE">Cliente</option>
              <option value="FUNCIONARIO">Funcionário</option>
              <option value="ADMINISTRADOR">Administrador</option>
            </select>
          </label>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
