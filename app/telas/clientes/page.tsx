"use client";

import React, { useEffect, useState } from "react";
import AgendamentoPage from "../agendamento/page"; // Certifique-se de que o caminho está correto
import { getUsuarioById, getAgendamentosByClienteId } from "@/app/services/api"; // Função para buscar dados do cliente e agendamentos

const ClientesPage = () => {
  interface Consulta {
    id: number;
    dataHora: string; // Alterado para dataHora
    servicoId: number; // ID do serviço
    funcionarioId: number; // ID do funcionário
  }

  interface ClienteData {
    id: number; // Adicione o ID aqui
    nome: string;
    email: string;
    telefone: string;
    proximasConsultas: Consulta[];
    historico: Consulta[];
  }

  const [nome, setNome] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState("agendamento");
  const [clienteData, setClienteData] = useState<ClienteData | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento
  const [agendamentos, setAgendamentos] = useState<Consulta[]>([]); // Estado para armazenar agendamentos
  const [funcionarios, setFuncionarios] = useState<
    { id: number; nome: string }[]
  >([]);
  const [servicos, setServicos] = useState<{ id: number; nome: string }[]>([]);

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    console.log("Dados do localStorage:", userDataString);

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        console.log("Usuário recuperado:", userData);
        setNome(userData.nome || "Usuário");

        const userId = Number(localStorage.getItem("id")); // Converte o ID para número
        fetchClienteData(userId); // Passando o id do cliente para buscar os dados
        fetchAgendamentos(userId); // Passando o id do cliente para buscar os dados
        fetchFuncionarios(); // Busca os funcionários
        fetchServicos(); // Busca os serviços
      } catch (error) {
        console.error("Erro ao recuperar dados do usuário:", error);
      }
    }
  }, []);

  const fetchClienteData = async (userId: number) => {
    setLoading(true);
    try {
      const data = await getUsuarioById(userId); // Passando userId para a função getUsuarioById
      setClienteData(data);
      console.log("Dados do cliente recuperados com sucesso:", data);
      localStorage.setItem("userId", data.id.toString()); // Armazena o ID do cliente
    } catch (error) {
      console.error("Erro ao buscar dados do cliente:", error);
    } finally {
      setLoading(false); // Alterando o estado de carregamento
    }
  };

  const fetchAgendamentos = async (userId: number) => {
    try {
      const data = await getAgendamentosByClienteId(userId);
      setAgendamentos(data);
      console.log("Agendamentos recuperados com sucesso:", data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      if (error instanceof Error) {
        console.error("Mensagem de erro:", error.message);
      }
    }
  };

  const fetchFuncionarios = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/usuarios/agendamento/funcionarios"
      );
      const data = await response.json();
      setFuncionarios(data);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
    }
  };

  const fetchServicos = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/servicos/listarServicos"
      );
      const data = await response.json();
      setServicos(data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  };

  useEffect(() => {
    if (selectedTab === "sair") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }, [selectedTab]);

  return (
    <div className="flex flex-col min-h-screen text-black bg-gray-100">
      <header className="fixed top-0 left-0 w-full bg-white p-4 shadow-md flex items-center justify-between z-10">
        <h1 className="text-xl font-semibold">Olá, {nome}!</h1>
        <button
          className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
          onClick={() => setSelectedTab("sair")}
        >
          Sair
        </button>
      </header>

      <div className="flex flex-grow w-full max-w-5xl mx-auto mt-16">
        <nav className="w-1/4 bg-white p-4 shadow-md h-screen fixed left-0 top-16 flex flex-col justify-between pb-4">
          <ul className="space-y-2 flex-grow">
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "agendamento"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("agendamento")}
            >
              Agendar uma Consulta
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "consultas"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("consultas")}
            >
              Próximas Consultas
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "historico"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("historico")}
            >
              Histórico
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "perfil"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("perfil")}
            >
              Perfil
            </li>
          </ul>
        </nav>

        <main className="w-3/4 bg-white p-6 rounded-lg shadow-md ml-auto mt-16">
          {loading ? (
            <p className="text-gray-600">Carregando informações...</p>
          ) : (
            <>
              {selectedTab === "agendamento" && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Agendar uma Consulta
                  </h2>
                  {clienteData ? (
                    <AgendamentoPage clienteId={clienteData.id} />
                  ) : (
                    <p>Carregando dados do cliente...</p>
                  )}
                </div>
              )}
              {selectedTab === "consultas" && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Próximas Consultas
                  </h2>
                  {agendamentos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {" "}
                      {/* Mudança aqui */}
                      {agendamentos.map((consulta) => {
                        const funcionario = funcionarios.find(
                          (f) => f.id === consulta.funcionarioId
                        );
                        const servico = servicos.find(
                          (s) => s.id === consulta.servicoId
                        );
                        return (
                          <div
                            key={consulta.id}
                            className="p-6 border rounded-lg shadow-lg max-w-lg mx-auto" // Mudança no max-w para travar a largura
                          >
                            <p>
                              <strong>Funcionário:</strong>{" "}
                              {funcionario
                                ? funcionario.nome
                                : "Nome não disponível"}
                            </p>
                            <p>
                              <strong>Dia:</strong>
                              {consulta.dataHora
                                ? new Date(
                                    consulta.dataHora
                                  ).toLocaleDateString()
                                : "Data inválida"}
                            </p>
                            <p>
                              <strong>Horário:</strong>
                              {consulta.dataHora
                                ? new Date(
                                    consulta.dataHora
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Horário inválido"}
                            </p>
                            <p>
                              <strong>Serviço:</strong>{" "}
                              {servico
                                ? servico.nome
                                : "Serviço não disponível"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      Você não tem próximas consultas agendadas.
                    </p>
                  )}
                </div>
              )}
              {selectedTab === "historico" && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Histórico</h2>
                  {clienteData?.historico &&
                  clienteData.historico.length > 0 ? (
                    <ul>
                      {clienteData.historico.map((consulta) => (
                        <li key={consulta.id}>
                          {/* Removido o acesso a propriedades inexistentes */}
                          {consulta.dataHora
                            ? new Date(consulta.dataHora).toLocaleDateString()
                            : "Data inválida"}{" "}
                          - Serviço não disponível
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">
                      Você ainda não tem histórico de consultas.
                    </p>
                  )}
                </div>
              )}
              {selectedTab === "perfil" && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Perfil</h2>
                  {clienteData ? (
                    <div>
                      <p>
                        <strong>Nome:</strong> {clienteData.nome}
                      </p>
                      <p>
                        <strong>Email:</strong> {clienteData.email}
                      </p>
                      <p>
                        <strong>Telefone:</strong> {clienteData.telefone}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      Carregando informações do perfil...
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClientesPage;
