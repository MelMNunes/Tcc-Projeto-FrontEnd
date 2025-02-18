"use client";

import React, { useEffect, useState } from "react";
import AgendamentoPage from "../agendamento/page"; // Certifique-se de que o caminho está correto
import { getUsuarioById, getAgendamentosByClienteId } from "@/app/services/api"; // Função para buscar dados do cliente e agendamentos

const ClientesPage = () => {
  interface Consulta {
    id: number;
    data: string;
    servico: string;
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

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    console.log("Dados do localStorage:", userDataString);

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        console.log("Usuário recuperado:", userData);
        setNome(userData.nome || "Usuário");

        // Aqui, você deve garantir que o ID seja um número
        const userId = Number(localStorage.getItem("id")); // Converte o ID para número
        fetchClienteData(userId); // Passando o id do cliente para buscar os dados
        fetchAgendamentos(userId); // Passando o id do cliente para buscar os dados
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

      // Armazenar o ID do cliente no local storage
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

  useEffect(() => {
    if (selectedTab === "sair") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }, [selectedTab]);

  return (
    <div className="flex flex-col min-h-screen text-black bg-gray-100">
      <header className="fixed top-0 left-0 w-full bg-white p-4 shadow-md flex items-center z-10">
        <h1 className="text-xl font-semibold">Olá, {nome}!</h1>
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
            <li
              className={`p-2 rounded cursor-pointer hover:bg-gray-400`}
              onClick={() => setSelectedTab("sair")}
            >
              Sair
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
                  {/* Verifica se clienteData não é null antes de passar o clienteId */}
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
                    <ul>
                      {agendamentos.map((consulta) => (
                        <li key={consulta.id} className="mb-2">
                          {/* Formatação da data e hora */}
                          <p>
                            <strong>Consulta com Funcionário:</strong>{" "}
                            {consulta.funcionarioId}{" "}
                            {/* Aqui você pode substituir pelo nome do funcionário, se disponível */}
                          </p>
                          <p>
                            <strong>Dia:</strong>{" "}
                            {new Date(consulta.dataHora).toLocaleDateString()}{" "}
                            {/* Formata a data */}
                          </p>
                          <p>
                            <strong>Horário:</strong>{" "}
                            {new Date(consulta.dataHora).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}{" "}
                            {/* Formata a hora */}
                          </p>
                          <p>
                            <strong>Serviço:</strong> {consulta.servicoId}{" "}
                            {/* Aqui você pode substituir pelo nome do serviço, se disponível */}
                          </p>
                        </li>
                      ))}
                    </ul>
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
                          {consulta.data} - {consulta.servico}
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
