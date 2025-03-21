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
    proximasConsultas: Consulta[];
    historico: Consulta[];
  }

  const [nome, setNome] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState("agendamento");
  const [clienteData, setClienteData] = useState<ClienteData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [agendamentos, setAgendamentos] = useState<Consulta[]>([]);

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
            <li
              className={`p-2 rounded cursor-pointer ${selectedTab === "historico" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => setSelectedTab("historico")}
            >
              Histórico
            </li>
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
                  {clienteData ? (
                    <div className="space-y-4">
                      <div><strong>Nome:</strong> {clienteData.nome}</div>
                      <div><strong>CPF:</strong> {clienteData.cpf}</div>
                      <div><strong>Email:</strong> {clienteData.email}</div>
                      <div><strong>Telefone:</strong> {clienteData.telefone}</div>
                      <div><strong>Senha:</strong> <span>••••••••</span></div>
                    </div>
                  ) : (
                    <p className="text-gray-600">Carregando dados do cliente...</p>
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