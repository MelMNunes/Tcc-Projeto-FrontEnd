"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import FormularioAdmin from "../agendamento/formularioAdmin/FormularioAdmin";

const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.5 0H9M12.75 12H20.25M12.75 15H19.5M12.75 18H18.75M4.5 4.5v15a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.5m-15 0h15M4.5 4.5a2.25 2.25 0 0 1 2.25-2.25h10.5a2.25 2.25 0 0 1 2.25 2.25m0 0V2.25m0 2.25H4.5" />
  </svg>
);

const ListBulletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
  </svg>
);

const CalendarPlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 3.75H6.75A2.25 2.25 0 0 0 4.5 6v1.5m15-.75V6a2.25 2.25 0 0 0-2.25-2.25H15M4.5 12v6.75A2.25 2.25 0 0 0 6.75 21h10.5A2.25 2.25 0 0 0 19.5 18.75V12" />
    </svg>
);

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
);

interface ClienteParaAbaClientes {
  id: number;
  nome: string;
  tipoDeUsuario?: string;
}

interface AgendamentoDetalhado {
  id: number;
  dataHora: string;
  clienteNome: string;
  clienteId?: number;
  funcionarioNome: string;
  funcionarioId?: number;
  servicoNome: string;
  servicoId?: number;
  precoServico?: number;
  descricao?: string;
  status: "PENDENTE" | "FINALIZADO" | "CANCELADO" | "PAGO" | string;
}

interface AgendamentoAgrupadoNaFila {
  dia: string;
  _diaOriginal: string;
  consultas: AgendamentoDetalhado[];
}

interface AgendamentoParaFormulario {
    id: number;
    clienteId: number;
    funcionarioId: number;
    servicoId: number;
    dataHora: string;
    descricao: string;
    status: string;
}

const RecepcaoPage: React.FC = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<
    "fila" | "agendamentos" | "pagamentos" | "clientes"
  >("fila");

  const [agendamentosFila, setAgendamentosFila] = useState<AgendamentoAgrupadoNaFila[]>([]);
  const [clientes, setClientes] = useState<ClienteParaAbaClientes[]>([]);

  const [loadingAgendamentosFila, setLoadingAgendamentosFila] = useState<boolean>(true);
  const [loadingClientes, setLoadingClientes] = useState<boolean>(false);
  const [searchClientes, setSearchClientes] = useState("");
  const [filterClientes, setFilterClientes] = useState<string>("todos");

  const [agendamentoParaEdicao, setAgendamentoParaEdicao] =
    useState<AgendamentoParaFormulario | undefined>(undefined);

  const [agendamentosParaPagamento, setAgendamentosParaPagamento] = useState<AgendamentoDetalhado[]>([]);
  const [loadingPagamentos, setLoadingPagamentos] = useState<boolean>(false);
  const [pagamentoModalOpen, setPagamentoModalOpen] = useState<boolean>(false);
  const [agendamentoSelecionadoParaPagamento, setAgendamentoSelecionadoParaPagamento] = useState<AgendamentoDetalhado | null>(null);
  const [formaPagamento, setFormaPagamento] = useState<string>("");
  const formasDePagamento = ["Dinheiro", "Crédito À Vista", "Crédito 2X", "Crédito 3X", "Crédito 4X", "Crédito 5X", "Crédito 6X", "Cartão de Débito", "Pix"];

  const API_BASE_URL = "http://localhost:8080/api";

  const buscarAgendamentosFila = useCallback(async () => {
    setLoadingAgendamentosFila(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/agendamentos/status/PENDENTE`,
        { method: "GET", headers: { "Content-Type": "application/json" }, cache: "no-cache" }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status} ao buscar agendamentos pendentes: ${errorText}`);
       }
      const agendamentosVindosDaAPI_RAW = await response.json();
      const agendamentosVindosDaAPI: any[] = Array.isArray(agendamentosVindosDaAPI_RAW) ? agendamentosVindosDaAPI_RAW : [];

      const agendamentosProcessados: AgendamentoDetalhado[] = agendamentosVindosDaAPI.map((ag: any) => {
        if (ag.id === undefined || ag.clienteId === undefined || ag.funcionarioId === undefined || ag.servicoId === undefined) {
            console.warn("RecepcaoPage (Fila) - Agendamento da API com IDs faltando:", ag);
        }
        return {
          id: ag.id,
          dataHora: ag.dataHora,
          clienteNome: ag.clienteNome ?? "Cliente não informado",
          clienteId: ag.clienteId,
          funcionarioNome: ag.funcionarioNome ?? "Profissional não informado",
          funcionarioId: ag.funcionarioId,
          servicoNome: ag.servicoNome ?? "Serviço não informado",
          servicoId: ag.servicoId,
          precoServico: ag.precoServico,
          descricao: ag.descricao ?? "",
          status: ag.status?.toUpperCase() ?? "PENDENTE",
        };
      });

      const agendamentosPorDia: { [key: string]: AgendamentoDetalhado[] } = {};
      agendamentosProcessados.forEach((ag) => {
        try {
            const dataObj = new Date(ag.dataHora);
            if (isNaN(dataObj.getTime())) {
                console.error("RecepcaoPage - Data inválida para o agendamento ID:", ag.id, "Data recebida:", ag.dataHora);
                return;
            }
            const diaKey = `${dataObj.getFullYear()}-${String(dataObj.getMonth() + 1).padStart(2, '0')}-${String(dataObj.getDate()).padStart(2, '0')}`;
            if (!agendamentosPorDia[diaKey]) agendamentosPorDia[diaKey] = [];
            agendamentosPorDia[diaKey].push(ag);
        } catch (e) {
            console.error("RecepcaoPage - Erro ao processar dataHora:", ag.dataHora, "Agendamento:", ag, e);
        }
      });

      const diasOrdenados = Object.keys(agendamentosPorDia).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );

      const agendamentosEstruturados: AgendamentoAgrupadoNaFila[] = diasOrdenados.map((diaKey) => ({
        dia: new Date(diaKey + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: 'long', year: 'numeric' }),
        _diaOriginal: diaKey,
        consultas: agendamentosPorDia[diaKey].sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()),
      }));
      setAgendamentosFila(agendamentosEstruturados);

    } catch (error) {
      console.error("RecepcaoPage - Erro ao buscar agendamentos para fila:", error);
      setAgendamentosFila([]);
    } finally {
      setLoadingAgendamentosFila(false);
    }
  }, []);

  const buscarClientes = useCallback(async (currentFilter: string) => {
    setLoadingClientes(true);
    try {
      let url = `${API_BASE_URL}/usuarios/listar/todos`;
      if (currentFilter !== "todos") {
        url = `${API_BASE_URL}/usuarios/listar/${currentFilter.toUpperCase()}`;
      }
      const response = await fetch(url, {
        method: "GET", headers: { "Content-Type": "application/json" }, cache: "no-cache",
      });
      if (!response.ok) throw new Error(`Erro ao buscar clientes: ${response.status}`);
      const data: ClienteParaAbaClientes[] = await response.json();
      setClientes(data);
    } catch (error) {
      console.error("RecepcaoPage - Erro ao buscar clientes:", error);
      setClientes([]);
    } finally {
      setLoadingClientes(false);
    }
  }, []);

  const fetchAgendamentosFinalizados = useCallback(async () => {
    setLoadingPagamentos(true);
    try {
      const response = await fetch(`${API_BASE_URL}/agendamentos/status/FINALIZADO`, { cache: "no-cache" });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao buscar agendamentos finalizados: ${errorText}`);
      }
      const dataAPI: any[] = await response.json();
      const dataProcessada: AgendamentoDetalhado[] = dataAPI.map(ag => ({
        id: ag.id,
        dataHora: ag.dataHora,
        clienteNome: ag.clienteNome ?? "Cliente não informado",
        clienteId: ag.clienteId,
        funcionarioNome: ag.funcionarioNome ?? "Profissional não informado",
        funcionarioId: ag.funcionarioId,
        servicoNome: ag.servicoNome ?? "Serviço não informado",
        servicoId: ag.servicoId,
        precoServico: ag.precoServico,
        descricao: ag.descricao ?? "",
        status: ag.status?.toUpperCase() ?? "FINALIZADO",
      }));
      dataProcessada.sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
      setAgendamentosParaPagamento(dataProcessada);
    } catch (error) {
      console.error("Erro ao buscar agendamentos finalizados:", error);
      setAgendamentosParaPagamento([]);
      alert(`Falha ao carregar agendamentos para pagamento: ${(error as Error).message}`);
    } finally {
      setLoadingPagamentos(false);
    }
  }, []);

  useEffect(() => {
    if (selectedTab === "fila") {
      buscarAgendamentosFila();
    } else if (selectedTab === "clientes") {
      buscarClientes(filterClientes);
    } else if (selectedTab === "pagamentos") {
      fetchAgendamentosFinalizados();
    }

    if (selectedTab !== "agendamentos" && agendamentoParaEdicao) {
        setAgendamentoParaEdicao(undefined);
    }
  }, [selectedTab, filterClientes, buscarAgendamentosFila, buscarClientes, fetchAgendamentosFinalizados, agendamentoParaEdicao]);

  const handleAtualizarStatusAgendamento = async (agendamentoId: number, novoStatus: AgendamentoDetalhado["status"]) => {
    const confirmAction = novoStatus === "CANCELADO"
      ? confirm("Tem certeza que deseja cancelar este agendamento?")
      : true;

    if (!confirmAction) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/agendamentos/atualizar-status/${agendamentoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novoStatus.toUpperCase())
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Erro ao atualizar status para ${novoStatus}.`);
      }
      alert(`Agendamento ${novoStatus.toLowerCase().replace('_', ' ')} com sucesso!`);
      if (selectedTab === 'fila') buscarAgendamentosFila();
      if (selectedTab === 'pagamentos' && novoStatus === 'PAGO') { // Se marcou como pago, atualiza a lista de pagamentos
        fetchAgendamentosFinalizados(); // Rebusca finalizados, pois o "PAGO" não deve mais aparecer aqui
      }

    } catch (err) {
      console.error(err);
      alert(`Não foi possível atualizar o status do agendamento: ${(err as Error).message}`);
    }
  };

  const handleReagendar = (consulta: AgendamentoDetalhado) => {
    if (consulta.id === undefined || consulta.clienteId === undefined || consulta.funcionarioId === undefined || consulta.servicoId === undefined) {
        alert("Dados incompletos na consulta para reagendamento. Verifique o console.");
        console.error("RecepcaoPage - Dados da consulta para reagendar (COM IDs AUSENTES):", consulta);
        return;
    }
    const agendamentoParaForm: AgendamentoParaFormulario = {
      id: consulta.id,
      clienteId: consulta.clienteId,
      funcionarioId: consulta.funcionarioId,
      servicoId: consulta.servicoId,
      dataHora: consulta.dataHora,
      descricao: consulta.descricao || "",
      status: consulta.status || "PENDENTE",
    };
    setAgendamentoParaEdicao(agendamentoParaForm);
    setSelectedTab("agendamentos");
  };

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
        localStorage.removeItem("user");
        localStorage.removeItem("id");
        localStorage.removeItem("token");
        router.push("/");
    }
  };

  const handleAbrirModalPagamento = (agendamento: AgendamentoDetalhado) => {
    setAgendamentoSelecionadoParaPagamento(agendamento);
    setFormaPagamento("");
    setPagamentoModalOpen(true);
  };

  const handleFecharModalPagamento = () => {
    setPagamentoModalOpen(false);
    setAgendamentoSelecionadoParaPagamento(null);
  };

  const handleConfirmarPagamento = async () => {
    if (!agendamentoSelecionadoParaPagamento || !agendamentoSelecionadoParaPagamento.id) return;
    if (!formaPagamento) {
      alert("Por favor, selecione uma forma de pagamento.");
      return;
    }

    console.log(
      `Pagamento simulado para agendamento ID: ${agendamentoSelecionadoParaPagamento.id}, Forma: ${formaPagamento}`
    );
    setAgendamentosParaPagamento(prev =>
      prev.filter(ag => ag.id !== agendamentoSelecionadoParaPagamento!.id)
    );
    alert("Pagamento (simulado) registrado com sucesso!");
    handleFecharModalPagamento();
  };

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchClientes.toLowerCase())
  );

  const TabButton: React.FC<{tabKey: string, label: string, icon: JSX.Element}> = ({tabKey, label, icon}) => (
    <li
      className={`p-3 rounded-lg cursor-pointer transition-all duration-150 ease-in-out flex items-center space-x-3 ${
        selectedTab === tabKey
          ? "bg-blue-600 text-white shadow-md font-medium"
          : "hover:bg-gray-100 text-gray-700"
      }`}
      onClick={() => {
          setSelectedTab(tabKey as any);
          if (tabKey !== "agendamentos") {
              setAgendamentoParaEdicao(undefined);
          }
      }}
    >
      {icon}
      <span>{label}</span>
    </li>
  );

  return (
    <div className="flex min-h-screen text-black bg-gray-50">
      <header className="fixed top-0 left-0 w-full bg-white p-4 shadow-md flex justify-between items-center z-30">
        <h1 className="text-xl font-semibold text-gray-700">Painel da Recepção</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Sair
        </button>
      </header>

      <div className="flex w-full max-w-full mx-auto pt-16">
        <nav className="w-64 bg-white p-4 shadow-lg h-[calc(100vh-4rem)] sticky top-16 flex flex-col justify-between mr-6 z-20">
          <ul className="space-y-2">
            <TabButton tabKey="fila" label="Fila de Atendimento" icon={<ListBulletIcon />} />
            <TabButton tabKey="agendamentos" label={agendamentoParaEdicao ? "Editar Agendamento" : "Novo Agendamento"} icon={<CalendarPlusIcon />} />
            <TabButton tabKey="pagamentos" label="Pagamentos" icon={<CreditCardIcon />} />
            <TabButton tabKey="clientes" label="Clientes" icon={<UsersIcon />} />
          </ul>
        </nav>

        <main className="flex-1 bg-slate-100 p-6 rounded-lg shadow-inner overflow-y-auto h-[calc(100vh-4rem)] z-10">
          {selectedTab === "fila" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
                Fila de Atendimento (Pendentes)
              </h2>
              {loadingAgendamentosFila ? (
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Carregando fila...</p>
                </div>
              ) : agendamentosFila.length > 0 ? (
                agendamentosFila.map((grupo) => (
                  <div key={grupo._diaOriginal} className="mb-8 bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-blue-700 mb-4 border-b pb-2">{grupo.dia}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {grupo.consultas.map((consulta) => (
                        <div
                          key={consulta.id}
                          className="p-4 rounded-lg shadow-lg border border-blue-200 bg-blue-50 hover:shadow-xl transition-shadow flex flex-col justify-between min-h-[250px]" // Aumentei min-h
                        >
                          <div>
                            <p className="text-base text-gray-800 font-semibold mb-1">
                              Cliente: <span className="font-normal text-gray-700">{consulta.clienteNome}</span>
                            </p>
                            <p className="text-sm text-gray-700">
                              Profissional: <span className="font-normal">{consulta.funcionarioNome}</span>
                            </p>
                            <p className="text-sm text-gray-700">
                              Serviço: <span className="font-normal">{consulta.servicoNome}</span>
                            </p>
                             {consulta.precoServico !== undefined && typeof consulta.precoServico === 'number' && (
                                <p className="text-sm text-gray-700">
                                Preço: <span className="font-semibold">R$ {consulta.precoServico.toFixed(2)}</span>
                                </p>
                            )}
                            <p className="text-sm text-gray-600 mt-1">
                              Horário:{" "}
                              <span className="font-semibold text-blue-600">
                                {new Date(consulta.dataHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </p>
                             {consulta.descricao && <p className="text-xs text-gray-500 mt-2 italic bg-gray-100 p-1.5 rounded">Obs: {consulta.descricao}</p>}
                             <p className={`text-xs font-bold mt-2 py-1 px-2 inline-block rounded-full ${consulta.status === 'PENDENTE' ? 'bg-yellow-400 text-yellow-800' : 'bg-gray-400 text-gray-800'}`}>
                               {consulta.status}
                             </p>
                          </div>
                          <div className="mt-auto pt-3 border-t border-blue-100 space-y-2">
                            <button
                              onClick={() => handleAtualizarStatusAgendamento(consulta.id, "FINALIZADO")}
                              className="w-full px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-xs font-medium shadow"
                            >
                              Finalizar
                            </button>
                            <button
                              onClick={() => handleReagendar(consulta)}
                              className="w-full px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-xs font-medium shadow"
                            >
                              Reagendar
                            </button>
                            <button
                              onClick={() => handleAtualizarStatusAgendamento(consulta.id, "CANCELADO")}
                              className="w-full px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs font-medium shadow"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-500 text-lg">Nenhum agendamento pendente encontrado.</p>
                </div>
              )}
            </div>
          )}

          {selectedTab === "clientes" && (
              <section>
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">Lista de Usuários</h2>
                <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center bg-white p-4 rounded-lg shadow">
                  <select
                    className="border border-gray-300 px-4 py-2.5 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto bg-white shadow-sm text-gray-700"
                    value={filterClientes}
                    onChange={(e) => setFilterClientes(e.target.value)}
                  >
                    <option value="todos">Todos os Tipos</option>
                    <option value="CLIENTE">Clientes</option>
                    <option value="FUNCIONARIO">Funcionários</option>
                    <option value="ADMINISTRADOR">Administradores</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Buscar por nome..."
                    className="border border-gray-300 px-4 py-2.5 rounded-md focus:ring-blue-500 focus:border-blue-500 flex-grow bg-white shadow-sm text-gray-700"
                    value={searchClientes}
                    onChange={(e) => setSearchClientes(e.target.value)}
                  />
                </div>
                {loadingClientes ? (
                  <div className="text-center py-10">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="text-gray-500 mt-3">Carregando usuários...</p>
                  </div>
                ) : clientesFiltrados.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {clientesFiltrados.map((cliente) => (
                      <div
                        key={cliente.id}
                        className="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                      >
                        <p className="font-semibold text-gray-800 text-lg">
                            {cliente.nome}
                        </p>
                        {cliente.tipoDeUsuario && (
                          <p className="text-sm text-blue-600 capitalize mt-1">{cliente.tipoDeUsuario.toLowerCase().replace("_", " ")}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                    <div className="text-center py-10 bg-white p-6 rounded-lg shadow">
                      <p className="text-gray-500 text-lg">Nenhum usuário encontrado com os filtros aplicados.</p>
                  </div>
                )}
              </section>
          )}

          {selectedTab === "agendamentos" && (
            <section className="bg-white p-6 rounded-xl shadow-xl border">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
                    {agendamentoParaEdicao ? "Reagendar Consulta" : "Novo Agendamento"}
                </h2>
                <FormularioAdmin
                  key={agendamentoParaEdicao ? `edit-${agendamentoParaEdicao.id}` : 'new-agendamento-recepcao'}
                  agendamento={agendamentoParaEdicao}
                  onFormSubmitSuccess={() => {
                      console.log("RecepcaoPage: onFormSubmitSuccess chamado do FormularioAdmin.");
                      setAgendamentoParaEdicao(undefined);
                      buscarAgendamentosFila();
                      setSelectedTab("fila");
                  }}
                />
            </section>
          )}

          {selectedTab === "pagamentos" && (
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
                Registrar Pagamentos (Agendamentos Finalizados)
              </h2>
              {loadingPagamentos ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-500 mt-3">Carregando agendamentos finalizados...</p>
                </div>
              ) : agendamentosParaPagamento.length > 0 ? (
                <div className="space-y-4">
                  {agendamentosParaPagamento.map((ag) => (
                    <div key={ag.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-700 text-lg">{ag.clienteNome}</p>
                        <p className="text-sm text-gray-600">{ag.servicoNome}</p>
                        <p className="text-xs text-gray-500">
                            {new Date(ag.dataHora).toLocaleString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-xs text-gray-500">Profissional: {ag.funcionarioNome}</p>
                        {typeof ag.precoServico === 'number' && (
                            <p className="text-xl font-bold text-green-600 mt-2">R$ {ag.precoServico.toFixed(2)}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleAbrirModalPagamento(ag)}
                        className="bg-blue-500 text-white px-5 py-2.5 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm whitespace-nowrap w-full sm:w-auto mt-3 sm:mt-0"
                      >
                        Registrar Pagamento
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white p-6 rounded-lg shadow">
                  <p className="text-gray-500 text-lg">Nenhum agendamento finalizado aguardando pagamento.</p>
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {pagamentoModalOpen && agendamentoSelecionadoParaPagamento && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Registrar Pagamento</h3>
            <div className="mb-4 border-b pb-3">
                <p><strong>Cliente:</strong> {agendamentoSelecionadoParaPagamento.clienteNome}</p>
                <p><strong>Serviço:</strong> {agendamentoSelecionadoParaPagamento.servicoNome}</p>
                <p><strong>Data:</strong> {new Date(agendamentoSelecionadoParaPagamento.dataHora).toLocaleDateString('pt-BR')}</p>
                {typeof agendamentoSelecionadoParaPagamento.precoServico === 'number' && (
                    <p className="text-lg font-bold text-green-700">Valor: R$ {agendamentoSelecionadoParaPagamento.precoServico.toFixed(2)}</p>
                )}
            </div>
            <div className="mb-5">
              <label htmlFor="formaPagamento" className="block text-sm font-medium text-gray-700 mb-1">
                Forma de Pagamento:
              </label>
              <select
                id="formaPagamento"
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm text-gray-700"
              >
                <option value="" disabled>Selecione...</option>
                {formasDePagamento.map(forma => (
                  <option key={forma} value={forma}>{forma}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleFecharModalPagamento}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarPagamento}
                disabled={!formaPagamento}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium disabled:bg-gray-400"
              >
                Confirmar Pagamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecepcaoPage;