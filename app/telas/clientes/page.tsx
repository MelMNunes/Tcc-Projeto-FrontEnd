"use client";

import React, { useEffect, useState } from "react";
import FormularioCliente from "../agendamento/formularioCliente/FormularioCliente"; // Importa o formulário de cliente
import { getUsuarioById } from "@/app/services/api";

const ClientesPage = () => {
  interface Consulta {
    id: number;
    dataHora: string;
    servicoNome: string;
    funcionarioNome: string;
  }

  interface ClienteData {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
    senha: string;
    tipoDeUsuario: string; // Adicionando o tipo de usuário
    proximasConsultas: Consulta[];
    // historico: Consulta[];
  }

  const [nome, setNome] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState("agendamento");
  const [clienteData, setClienteData] = useState<ClienteData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [agendamentos, setAgendamentos] = useState<Consulta[]>([]);
  const [editing, setEditing] = useState<boolean>(false); // Estado para controle de edição
  const [newEmail, setNewEmail] = useState<string>("");
  const [newTelefone, setNewTelefone] = useState<string>("");
  const [newSenha, setNewSenha] = useState<string>("");

  useEffect(() => {
    const userDataString = localStorage.getItem("user");

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setNome(userData.nome || "Usuário");

        const userId = Number(localStorage.getItem("id"));
        fetchClienteData(userId);
        fetchAgendamentos(userId);
      } catch (error) {
        console.error("Erro ao recuperar dados do usuário:", error);
      }
    }
  }, []);

  const fetchClienteData = async (userId: number) => {
    setLoading(true);
    try {
      const data = await getUsuarioById(userId);
      setClienteData(data);
      setNewEmail(data.email); // Preenche o novo email com o atual
      setNewTelefone(data.telefone); // Preenche o novo telefone com o atual
    } catch (error) {
      console.error("Erro ao buscar dados do cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgendamentos = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/agendamentos/clientes/${userId}`);
      const data = await response.json();
      setAgendamentos(data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
  };

  const handleUpdateProfile = async () => {
    const userId = clienteData?.id;
    if (!userId) return;

    const response = await fetch(`http://localhost:8080/api/usuarios/editar/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: clienteData.nome,
        email: newEmail,
        telefone: newTelefone,
        senha: newSenha, // Enviar nova senha se fornecida
        tipoDeUsuario: clienteData.tipoDeUsuario, // Enviar o tipo de usuário
      }),
    });

    if (response.ok) {
      alert("Perfil atualizado com sucesso!");
      fetchClienteData(userId); // Recarrega os dados do cliente
      setEditing(false); // Fecha o modo de edição
    } else {
      const errorMessage = await response.text();
      alert("Erro ao atualizar perfil: " + errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen text-black bg-gray-100">
      <nav className="w-64 bg-white p-4 shadow-md h-screen fixed top-0 left-0 flex flex-col justify-between">
        <div>
          <h1 className="text-lg font-semibold mb-6 text-center">Painel</h1>
          <ul className="space-y-2">
            <li
              className={`p-2 rounded cursor-pointer ${selectedTab === "agendamento" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => setSelectedTab("agendamento")}
            >
              Agendamento
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${selectedTab === "consultas" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => setSelectedTab("consultas")}
            >
              Próximas Consultas
            </li>
            {/* <li
              className={`p-2 rounded cursor-pointer ${selectedTab === "historico" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => setSelectedTab("historico")}
            >
              Histórico
            </li> */}
            <li
              className={`p-2 rounded cursor-pointer ${selectedTab === "perfil" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => setSelectedTab("perfil")}
            >
              Perfil
            </li>
          </ul>
        </div>
        <button
          className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 w-full"
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Sair
        </button>
      </nav>

      <div className="flex flex-col flex-grow ml-64 min-h-screen">
        <header className="w-full bg-white shadow-md p-4">
          <h2 className="text-2xl font-semibold">Tela do Cliente</h2>
          <p className="text-gray-600">Bem-vindo, {nome}</p>
        </header>

        <main className="flex-grow p-8">
          {loading ? (
            <p className="text-gray-600">Carregando informações...</p>
          ) : (
            <>
              {selectedTab === "agendamento" && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Agendamento</h2>
                  {clienteData ? (
                    <FormularioCliente 
                      passoAtual={0} 
                      setPassoAtual={() => {}} 
                      clienteId={clienteData.id} // Passa o ID do cliente para o FormularioCliente
                    />
                  ) : (
                    <p className="text-gray-600">Carregando dados do cliente...</p>
                  )}
                </section>
              )}

              {selectedTab === "consultas" && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Próximas Consultas</h2>
                  {agendamentos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {agendamentos.map((consulta) => (
                        <div key={consulta.id} className="p-4 border rounded-lg shadow">
                          <p><strong>Funcionário:</strong> {consulta.funcionarioNome || "Desconhecido"}</p>
                          <p><strong>Data:</strong> {new Date(consulta.dataHora).toLocaleDateString()}</p>
                          <p><strong>Horário:</strong> {new Date(consulta.dataHora).toLocaleTimeString()}</p>
                          <p><strong>Serviço:</strong> {consulta.servicoNome || "Não informado"}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Nenhuma consulta encontrada.</p>
                  )}
                </section>
              )}

              {selectedTab === "perfil" && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Perfil</h2>
                  {editing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block"><strong>Nome:</strong> {clienteData.nome}</label>
                      </div>
                      <div>
                        <label className="block"><strong>Email:</strong>
                          <input 
                            type="email" 
                            value={newEmail} 
                            onChange={(e) => setNewEmail(e.target.value)} 
                            className="border rounded p-1 w-full"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block"><strong>Telefone:</strong>
                          <input 
                            type="text" 
                            value={newTelefone} 
                            onChange={(e) => setNewTelefone(e.target.value)} 
                            className="border rounded p-1 w-full"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block"><strong>Senha:</strong>
                          <input 
                            type="password" 
                            value={newSenha} 
                            onChange={(e) => setNewSenha(e.target.value)} 
                            className="border rounded p-1 w-full"
                          />
                        </label>
                      </div>
                      <button 
                        onClick={handleUpdateProfile} 
                        className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                      >
                        Atualizar Perfil
                      </button>
                      <button 
                        onClick={() => setEditing(false)} 
                        className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div><strong>Nome:</strong> {clienteData.nome}</div>
                      <div><strong>CPF:</strong> {clienteData.cpf}</div>
                      <div><strong>Email:</strong> {clienteData.email}</div>
                      <div><strong>Telefone:</strong> {clienteData.telefone}</div>
                      <div><strong>Senha:</strong> <span>••••••••</span></div>
                      <button 
                        onClick={() => setEditing(true)} 
                        className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600"
                      >
                        Editar Perfil
                      </button>
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClientesPage;