"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormularioAdmin from "../agendamento/formularioAdmin/page";

// Definição dos tipos
interface Cliente {
  id: number;
  nome: string;
}

interface Agendamento {
  id: number;
  cliente: Cliente;
  dataHora: string;
  funcionarioId: number;
  servicoId: number;
}

interface AgendamentoCompleto {
  id: number;
  dataHora: string;
  clienteNome: string;
  funcionarioNome: string;
  servicoNome: string;
}

const RecepcaoPage: React.FC = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"fila" | "agendamentos" | "pagamentos">("fila");
  const [agendamentos, setAgendamentos] = useState<AgendamentoCompleto[]>([]);
  const [filtro, setFiltro] = useState<"dia" | "semana">("dia");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (selectedTab === "fila") {
      buscarAgendamentos();
    }
  }, [selectedTab, filtro]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  const buscarAgendamentos = async () => {
    try {
      setLoading(true);

      // Fazendo a requisição dos agendamentos
      const response = await fetch("http://localhost:8080/api/agendamentos/buscar/todos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar agendamentos: ${response.status}`);
      }

      const data: Agendamento[] = await response.json();

      // Buscando funcionários e serviços
      const agendamentosCompletos = await Promise.all(
        data.map(async (agendamento) => {
          const funcionarioRes = await fetch(`http://localhost:8080/api/usuarios/${agendamento.funcionarioId}`);
          const servicoRes = await fetch(`http://localhost:8080/api/servicos/${agendamento.servicoId}`);

          const funcionario = funcionarioRes.ok ? await funcionarioRes.json() : null;
          const servico = servicoRes.ok ? await servicoRes.json() : null;

          return {
            id: agendamento.id,
            dataHora: agendamento.dataHora,
            clienteNome: agendamento.cliente?.nome ?? "Desconhecido",
            funcionarioNome: funcionario?.nome ?? "Funcionário não encontrado",
            servicoNome: servico?.nome ?? "Serviço não encontrado",
          };
        })
      );

      setAgendamentos(agendamentosCompletos);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen text-black bg-gray-100">
      <header className="fixed top-0 left-0 w-full bg-white p-4 shadow-md flex justify-between items-center z-10">
        <h1 className="text-xl font-semibold">Painel da Recepção</h1>
      </header>

      <div className="flex flex-grow w-full max-w-6xl mx-auto mt-16">
        <nav className="w-1/4 bg-white p-4 shadow-md h-screen fixed left-0 top-16 flex flex-col justify-between">
          <ul className="space-y-2">
            <li
              className={`p-2 rounded cursor-pointer ${selectedTab === "fila" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => setSelectedTab("fila")}
            >
              Fila de Atendimento
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${selectedTab === "agendamentos" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => setSelectedTab("agendamentos")}
            >
              Agendamentos
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${selectedTab === "pagamentos" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => setSelectedTab("pagamentos")}
            >
              Pagamentos
            </li>
          </ul>
          <button
            className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 w-full mt-4"
            onClick={handleLogout}
          >
            Sair
          </button>
        </nav>

        <main className="w-3/4 bg-white p-6 rounded-lg shadow-md ml-auto mt-16">
          {selectedTab === "fila" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Fila de Atendimento</h2>
              <div className="flex space-x-4 mb-4">
                <button
                  className={`px-4 py-2 rounded ${filtro === "dia" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  onClick={() => setFiltro("dia")}
                >
                  Hoje
                </button>
                <button
                  className={`px-4 py-2 rounded ${filtro === "semana" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  onClick={() => setFiltro("semana")}
                >
                  Semana
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {loading ? (
                  <p>Carregando agendamentos...</p>
                ) : agendamentos.length > 0 ? (
                  agendamentos.map((agendamento) => (
                    <div key={agendamento.id} className="p-4 bg-gray-100 rounded shadow">
                      <p><strong>Cliente:</strong> {agendamento.clienteNome}</p>
                      <p><strong>Funcionário:</strong> {agendamento.funcionarioNome}</p>
                      <p><strong>Serviço:</strong> {agendamento.servicoNome}</p>
                      <p><strong>Data:</strong> {new Date(agendamento.dataHora).toLocaleDateString()}</p>
                      <p><strong>Horário:</strong> {new Date(agendamento.dataHora).toLocaleTimeString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">Nenhum agendamento encontrado.</p>
                )}
              </div>
            </div>
          )}

          {selectedTab === "agendamentos" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Agendamentos</h2>
              <FormularioAdmin/>
            </div>
          )}

          {selectedTab === "pagamentos" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Pagamentos</h2>
              <p className="text-gray-600">Confirmação de pagamentos e métodos utilizados.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RecepcaoPage;