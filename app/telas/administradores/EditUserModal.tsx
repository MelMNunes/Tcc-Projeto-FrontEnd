"use client";

import React, { useState, useEffect } from "react";

interface User {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  tipodeusuario: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdated: () => Promise<void>
  onSave: (updatedUser: User) => void
}

const UserEditModal: React.FC<UserModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState<User | null>(user);

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/editar/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar usuário");
      }

      onSave(formData);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar usuário");
    }
  };

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Editar Usuário</h2>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
          placeholder="Nome"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
          placeholder="E-mail"
        />
        <input
          type="text"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
          placeholder="Telefone"
        />
        <input
          type="text"
          name="cpf"
          value={formData.cpf}
          disabled
          className="w-full p-2 border rounded mb-2 bg-gray-200 cursor-not-allowed"
        />
        <select
          name="tipodeusuario"
          value={formData.tipodeusuario}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="CLIENTE">Cliente</option>
          <option value="FUNCIONARIO">Funcionário</option>
          <option value="ADMINISTRADOR">Administrador</option>
        </select>
        <div className="flex justify-end">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;