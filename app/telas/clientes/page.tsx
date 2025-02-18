"use client";

import React, { useEffect, useState } from "react";
import AgendamentoPage from "../agendamento/page";
import { getUsuarioById } from "@/app/services/api"; // Função para buscar dados do cliente

const ClientesPage = () => {
  interface Consulta {
    id: number;
    data: string;
    servico: string;
  }

  interface ClienteData {
    nome: string;
    email: string;
    telefone: string;
    proximasConsultas: Consulta[];
    historico: Consulta[];
  }

  const [nome, setNome] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState("agendamento");
  const [clienteData, setClienteData] = useState<ClienteData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);  // Estado de carregamento

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
      } catch (error) {
        console.error("Erro ao recuperar dados do usuário:", error);
      }
    }
  }, []);

  const fetchClienteData = async (userId: number) => {  // Aqui estamos usando o parâmetro userId
    setLoading(true);
    try {
      const data = await getUsuarioById(userId); // Passando userId para a função getUsuarioById
      setClienteData(data);
      console.log("Dados do cliente recuperados com sucesso:", data);
    } catch (error) {
      console.error("Erro ao buscar dados do cliente:", error);
    } finally {
      setLoading(false); // Alterando o estado de carregamento
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
                  <h2 className="text-xl font-semibold mb-2">Agendar uma Consulta</h2>
                  <AgendamentoPage />
                </div>
              )}
              {selectedTab === "consultas" && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Próximas Consultas</h2>
                  {clienteData?.proximasConsultas && clienteData.proximasConsultas.length > 0 ? (
                    <ul>
                      {clienteData.proximasConsultas.map((consulta) => (
                        <li key={consulta.id}>
                          {consulta.data} - {consulta.servico}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">Você não tem próximas consultas agendadas.</p>
                  )}
                </div>
              )}
              {selectedTab === "historico" && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Histórico</h2>
                  {clienteData?.historico && clienteData.historico.length > 0 ? (
                    <ul>
                      {clienteData.historico.map((consulta) => (
                        <li key={consulta.id}>
                          {consulta.data} - {consulta.servico}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">Você ainda não tem histórico de consultas.</p>
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
                    <p className="text-gray-600">Carregando informações do perfil...</p>
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