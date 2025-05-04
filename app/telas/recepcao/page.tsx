"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormularioAdmin from "../agendamento/formularioAdmin/page";

interface Cliente {
  id: number;
  nome: string;
  tipoDeUsuario?: string; // Adicionando tipo de usuário
}

interface Funcionario {
  id: number;
  nome: string;
}

interface Servico {
  id: number;
  nome: string;
  preco: number;
}

interface Agendamento {
  id: number;
  cliente: Cliente;
  dataHora: string;
  funcionario: Funcionario;
  servico: Servico;
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
  const [selectedTab, setSelectedTab] = useState<
    "fila" | "agendamentos" | "pagamentos" | "clientes"
  >("fila");
  const [agendamentos, setAgendamentos] = useState<AgendamentoCompleto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (selectedTab === "fila") {
      buscarAgendamentos();
    } else if (selectedTab === "clientes") {
      buscarClientes();
    }
  }, [selectedTab]);

  const buscarAgendamentos = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8080/api/agendamentos/buscar/todos",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-cache",
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar agendamentos: ${response.status}`);
      }

      const data: Agendamento[] = await response.json();
      const agendamentosCompletos = data.map((agendamento) => {
        const clienteNome = agendamento.cliente?.nome ?? "Cliente desconhecido";
        const funcionarioNome =
          agendamento.funcionario?.nome ?? "Funcionário não encontrado";
        const servicoNome =
          agendamento.servico?.nome ?? "Serviço não encontrado";

        return {
          id: agendamento.id,
          dataHora: agendamento.dataHora,
          clienteNome,
          funcionarioNome,
          servicoNome,
        };
      });

      // Agrupar os agendamentos por dia
      const agendamentosPorDia: { [key: string]: AgendamentoCompleto[] } = {};
      agendamentosCompletos.forEach((agendamento) => {
        const dataDia = new Date(agendamento.dataHora).toLocaleDateString();
        if (!agendamentosPorDia[dataDia]) {
          agendamentosPorDia[dataDia] = [];
        }
        agendamentosPorDia[dataDia].push(agendamento);
      });

      // Ordenar os dias
      const diasOrdenados = Object.keys(agendamentosPorDia).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );

      // Ordenar os agendamentos por hora dentro de cada dia
      const agendamentosOrdenados = diasOrdenados.map((dia) => {
        return {
          dia,
          consultas: agendamentosPorDia[dia].sort(
            (a, b) =>
              new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
          ),
        };
      });

      // Ordenar os agendamentos por dia e hora
      const sortedAgendamentos = agendamentosOrdenados.sort(
        (a, b) => new Date(a.dia).getTime() - new Date(b.dia).getTime()
      );

      setAgendamentos(sortedAgendamentos);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const buscarClientes = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/usuarios/listar/todos",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar clientes: ${response.status}`);
      }

      const data: Cliente[] = await response.json();
      setClientes(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  return (
    <div className="flex min-h-screen text-black bg-gray-100">
      <header className="fixed top-0 left-0 w-full bg-white p-4 shadow-md flex justify-between items-center z-10">
        <h1 className="text-xl font-semibold">Painel da Recepção</h1>
        <button
          onClick={() => {
            const confirmar = confirm("Tem certeza que deseja sair?");
            if (confirmar) {
              window.location.href = "/";
            }
          }}
          className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
        >
          Sair
        </button>
      </header>

      <div className="flex flex-grow w-full max-w-6xl mx-auto mt-16">
        <nav className="w-1/4 bg-white p-4 shadow-md h-screen fixed left-0 top-16 flex flex-col justify-between">
          <ul className="space-y-2">
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "fila"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("fila")}
            >
              Fila de Atendimento
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "agendamentos"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("agendamentos")}
            >
              Agendamentos
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "pagamentos"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("pagamentos")}
            >
              Pagamentos
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "clientes"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("clientes")}
            >
              Clientes
            </li>
          </ul>
        </nav>

        <main className="w-3/4 bg-white p-6 rounded-lg shadow-md ml-auto mt-16">
          {selectedTab === "fila" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Fila de Atendimento
              </h2>
              {loading ? (
                <p>Carregando agendamentos...</p>
              ) : agendamentos.length > 0 ? (
                agendamentos
                  .sort(
                    (a, b) =>
                      new Date(a.dia).getTime() - new Date(b.dia).getTime()
                  )
                  .map((grupo) => (
                    <div key={grupo.dia} className="mb-4">
                      <h3 className="text-lg font-semibold">{grupo.dia}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {grupo.consultas.map((consulta) => (
                          <div
                            key={consulta.id}
                            className="p-4 bg-gray-100 rounded shadow"
                          >
                            <p>
                              <strong>Cliente:</strong> {consulta.clienteNome}
                            </p>
                            <p>
                              <strong>Funcionário:</strong>{" "}
                              {consulta.funcionarioNome}
                            </p>
                            <p>
                              <strong>Serviço:</strong> {consulta.servicoNome}
                            </p>
                            <p>
                              <strong>Data:</strong>{" "}
                              {new Date(consulta.dataHora).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Horário:</strong>{" "}
                              {new Date(consulta.dataHora).toLocaleTimeString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-600">Nenhum agendamento encontrado.</p>
              )}
            </div>
          )}

          {selectedTab === "clientes" && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Lista de Clientes</h2>
              <select
                className="border px-4 py-2 rounded mb-4"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="CLIENTE">Clientes</option>
                <option value="FUNCIONARIO">Funcionários</option>
                <option value="ADMINISTRADOR">Administradores</option>
              </select>
              <input
                type="text"
                placeholder="Buscar cliente por nome"
                className="border px-4 py-2 rounded mb-4 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {clientes
                  .filter((cliente) => {
                    // Filtra os clientes com base no tipo selecionado e na pesquisa
                    const matchesType =
                      filter === "todos" || cliente.tipoDeUsuario === filter;
                    const matchesSearch = cliente.nome
                      .toLowerCase()
                      .includes(search.toLowerCase());
                    return matchesType && matchesSearch;
                  })
                  .map((cliente) => (
                    <div
                      key={cliente.id}
                      className="p-4 bg-gray-100 rounded shadow"
                    >
                      <p>
                        <strong>Nome:</strong> {cliente.nome}
                      </p>
                    </div>
                  ))}
              </div>
              {clientes.length === 0 && (
                <p className="text-gray-600">Nenhum cliente encontrado.</p>
              )}
            </section>
          )}

          {selectedTab === "agendamentos" && <FormularioAdmin />}
        </main>
      </div>
    </div>
  );
};

export default RecepcaoPage;
