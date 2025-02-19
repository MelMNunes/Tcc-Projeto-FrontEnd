"use client";

import React, { useEffect, useState } from "react";
import AgendamentoPage from "../agendamento/page";
import { getAgendamentosByFuncionarioId } from "@/app/services/api";

interface Consulta {
  id: number;
  funcionario: {
    nome: string;
  };
  dataHora: string;
  servico: {
    nome: string;
  };
}

const FuncionariosPage = () => {
  const [selectedTab, setSelectedTab] = useState("agendamento");
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [proximasConsultas, setProximasConsultas] = useState<Consulta[]>([]);
  const [clienteId, setClienteId] = useState<number | null>(null);

  useEffect(() => {
    const userId = Number(localStorage.getItem("id"));
    fetchConsultas(userId);
    fetchProximasConsultas(userId);
    setClienteId(userId); // Altere isso para a lógica correta que define o clienteId
  }, []);
  useEffect(() => {
    const userId = Number(localStorage.getItem("id"));
    fetchConsultas(userId);
    fetchProximasConsultas(userId);
  }, []);

  const fetchConsultas = async (funcionarioId: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/agendamentos/funcionarios/${funcionarioId}`
      );
      const data = await response.json();
      setConsultas(data);
    } catch (error) {
      console.error("Erro ao buscar consultas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProximasConsultas = async (userId: number) => {
    setLoading(true);
    try {
      const data = await getAgendamentosByFuncionarioId(userId);
      console.log("Dados das próximas consultas:", data); // Adicione este log
      setProximasConsultas(data.proximasConsultas || []); // Use um fallback para evitar undefined
    } catch (error) {
      console.error("Erro ao buscar próximas consultas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-black bg-gray-100">
      <header className="fixed top-0 left-0 w-full bg-white p-4 shadow-md flex items-center justify-between z-10">
        <h1 className="text-xl font-semibold">Painel do Funcionário</h1>
        <button
          className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Sair
        </button>
      </header>

      {/* Layout Principal */}
      <div className="flex flex-grow w-full max-w-5xl mx-auto mt-16">
        {/* Menu Lateral Fixo */}
        <nav className="w-1/4 bg-white p-4 shadow-md h-screen fixed left-0 top-16">
          <ul className="space-y-2">
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "agendamento"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("agendamento")}
            >
              Agendamento
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "consultas"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("consultas")}
            >
              Consultas
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "anamnese"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("anamnese")}
            >
              Upload de Anamnese
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "notas"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("notas")}
            >
              Notas Internas
            </li>
          </ul>
        </nav>

        {/* Área de Conteúdo */}
        <main className="w-3/4 bg-white p-6 rounded-lg shadow-md ml-auto mt-16">
          {selectedTab === "agendamento" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Agendamento</h2>
              {clienteId !== null ? (
                <AgendamentoPage clienteId={clienteId} />
              ) : (
                <p className="text-gray-600">Carregando dados do cliente...</p>
              )}
            </div>
          )}
          {consultas.map((consulta) => (
            <div key={consulta.id} className="p-6 border rounded-lg shadow-lg">
              <p>
                <strong>Funcionário:</strong>{" "}
                {consulta.funcionario
                  ? consulta.funcionario.nome
                  : "Funcionário não disponível"}
              </p>
              <p>
                <strong>Dia:</strong>{" "}
                {new Date(consulta.dataHora).toLocaleDateString()}
              </p>
              <p>
                <strong>Horário:</strong>{" "}
                {new Date(consulta.dataHora).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <strong>Serviço:</strong>{" "}
                {consulta.servico
                  ? consulta.servico.nome
                  : "Serviço não disponível"}
              </p>
            </div>
          ))}
          {selectedTab === "anamnese" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Upload de Anamnese</h2>
              <p className="text-gray-600">
                Espaço para upload de imagens relacionadas à anamnese do
                paciente.
              </p>
            </div>
          )}
          {selectedTab === "notas" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Notas Internas</h2>
              <p className="text-gray-600">
                Área para adicionar e visualizar notas sobre os pacientes.
              </p>
            </div>
          )}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Próximas Consultas</h2>
            {loading ? (
              <p className="text-gray-600">Carregando próximas consultas...</p>
            ) : proximasConsultas.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {proximasConsultas.map((consulta) => (
                  <div
                    key={consulta.id}
                    className="p-6 border rounded-lg shadow-lg"
                  >
                    <p>
                      <strong>Funcionário:</strong> {consulta.funcionario.nome}
                    </p>
                    <p>
                      <strong>Dia:</strong>{" "}
                      {new Date(consulta.dataHora).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Horário:</strong>{" "}
                      {new Date(consulta.dataHora).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p>
                      <strong>Serviço:</strong> {consulta.servico.nome}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                Você não tem próximas consultas registradas.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FuncionariosPage;
