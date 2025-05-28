"use client";

import React, { useEffect, useState } from "react";
import FormularioCliente from "../agendamento/formularioCliente/FormularioCliente";
import { getUsuarioById } from "@/app/services/api";

const ClientesPage = () => {
  interface Consulta {
    id: number;
    dataHora: string;
    servicoId: number;
    servicoNome: string;
    funcionarioId: number;
    funcionarioNome: string;
    descricao?: string;
    status: "PENDENTE" | "FINALIZADO" | "CANCELADO" | string;
  }

  interface ClienteData {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
    senha?: string;
    tipoDeUsuario: string;
  }

  const [nome, setNome] = useState<string>("");
  const [passoAtualFormulario, setPassoAtualFormulario] = useState(0);
  const [selectedTab, setSelectedTab] = useState("consultas");
  const [clienteData, setClienteData] = useState<ClienteData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [agendamentos, setAgendamentos] = useState<Consulta[]>([]);
  const [editingProfile, setEditingProfile] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>("");
  const [newTelefone, setNewTelefone] = useState<string>("");
  const [newSenha, setNewSenha] = useState<string>("");

  const [dadosFormularioAgendamento, setDadosFormularioAgendamento] = useState({
    funcionarioId: null as number | null,
    funcionarioNome: "",
    servicoId: null as number | null,
    servicoNome: "",
    data: "",
    horario: "",
    descricao: "",
  });
  const [agendamentoParaEditarId, setAgendamentoParaEditarId] = useState<
    number | null
  >(null);

  const CalendarDaysIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5M12 12.75h.008v.008H12v-.008Zm0 2.25h.008v.008H12v-.008ZM9.75 12.75h.008v.008H9.75v-.008Zm0 2.25h.008v.008H9.75v-.008ZM7.5 12.75h.008v.008H7.5V12.75Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V12.75Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V12.75Z"
      />
    </svg>
  );

  const ListBulletIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
      />
    </svg>
  );

  const UserCircleIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );

  const ArrowLeftOnRectangleIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
      />
    </svg>
  );

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    const userIdString = localStorage.getItem("id");

    if (userDataString && userIdString) {
      try {
        const userData = JSON.parse(userDataString);
        setNome(userData.nome || "Usuário");
        const userId = Number(userIdString);

        if (!isNaN(userId)) {
          fetchClienteData(userId);
          fetchAgendamentos(userId);
        } else {
          console.error("ID do usuário inválido no localStorage.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Erro ao recuperar dados do usuário:", error);
        setLoading(false);
      }
    } else {
      console.warn(
        "Dados do usuário não encontrados no localStorage. Redirecionando..."
      );
      setLoading(false);
    }
  }, []);

  const fetchClienteData = async (userId: number) => {
    try {
      const data = await getUsuarioById(userId);
      setClienteData(data);
      setNewEmail(data.email);
      setNewTelefone(data.telefone || "");
    } catch (error) {
      console.error("Erro ao buscar dados do cliente:", error);
      setClienteData(null);
    }
  };

  const fetchAgendamentos = async (userId: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/agendamentos/clientes/${userId}`
      );
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data: Consulta[] = await response.json();
      const sortedAgendamentos = data.sort((a, b) => {
        const dateA = new Date(a.dataHora).getTime();
        const dateB = new Date(b.dataHora).getTime();
        if (dateA !== dateB) {
          return dateB - dateA;
        }
        if (a.status === "PENDENTE" && b.status !== "PENDENTE") return -1;
        if (a.status !== "PENDENTE" && b.status === "PENDENTE") return 1;
        return 0;
      });
      setAgendamentos(sortedAgendamentos);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      setAgendamentos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!clienteData?.id) return;
    const userId = clienteData.id;

    const payload: Partial<ClienteData> & { senha?: string } = {
      nome: clienteData.nome,
      email: newEmail,
      telefone: newTelefone,
      tipoDeUsuario: clienteData.tipoDeUsuario,
    };

    if (newSenha.trim() !== "") {
      if (newSenha.length < 6) {
        alert("A nova senha deve ter pelo menos 6 caracteres.");
        return;
      }
      payload.senha = newSenha;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/usuarios/editar/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", 
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("Perfil atualizado com sucesso!");
        await response.text();

        if (clienteData) {
          setClienteData({
            ...clienteData,
            email: newEmail,
            telefone: newTelefone, 
          });
          const userFromStorage = JSON.parse(
            localStorage.getItem("user") || "{}"
          );
          userFromStorage.email = newEmail;
          userFromStorage.nome = clienteData.nome;
          localStorage.setItem("user", JSON.stringify(userFromStorage));
        }
        setEditingProfile(false);
        setNewSenha("");
      } else {
        const errorText = await response.text();
        alert(
          `Erro ao atualizar perfil: ${
            errorText || response.statusText || "Erro desconhecido"
          }`
        );
      }
    } catch (error) {
      console.error(
        "Erro na requisição de atualizar perfil (bloco catch):",
        error
      );
      alert("Ocorreu um erro de comunicação ao tentar atualizar o perfil.");
    }
  };

  const iniciarReagendamento = (consulta: Consulta) => {
    setDadosFormularioAgendamento({
      funcionarioId: consulta.funcionarioId,
      funcionarioNome: consulta.funcionarioNome,
      servicoId: consulta.servicoId,
      servicoNome: consulta.servicoNome,
      data: consulta.dataHora.split("T")[0],
      horario: consulta.dataHora.split("T")[1]?.slice(0, 5) || "",
      descricao: consulta.descricao || "",
    });
    setAgendamentoParaEditarId(consulta.id);
    setPassoAtualFormulario(0);
    setSelectedTab("agendamento");
  };

  const prepararNovoAgendamento = () => {
    setDadosFormularioAgendamento({
      funcionarioId: null,
      funcionarioNome: "",
      servicoId: null,
      servicoNome: "",
      data: "",
      horario: "",
      descricao: "",
    });
    setAgendamentoParaEditarId(null);
    setPassoAtualFormulario(0);
    setSelectedTab("agendamento");
  };

  const handleLogout = () => {
    const confirmar = confirm("Tem certeza que deseja sair?");
    if (confirmar) {
      localStorage.removeItem("user");
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      window.location.href = "/telas/login";
    }
  };

  const getStatusClassNames = (status: Consulta["status"]) => {
    switch (status.toUpperCase()) {
      case "PENDENTE":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-400",
          text: "text-yellow-700",
          badge: "bg-yellow-500 text-white",
        };
      case "FINALIZADO":
        return {
          bg: "bg-green-50",
          border: "border-green-400",
          text: "text-green-700",
          badge: "bg-green-600 text-white",
        };
      case "CANCELADO":
        return {
          bg: "bg-red-50",
          border: "border-red-300",
          text: "text-red-600",
          badge: "bg-red-500 text-white",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-300",
          text: "text-gray-700",
          badge: "bg-gray-500 text-white",
        };
    }
  };

  const renderAgendamentosPorStatus = (
    titulo: string,
    listaAgendamentos: Consulta[],
    statusAtual: Consulta["status"]
  ) => {
    const statusClasses = getStatusClassNames(statusAtual);
    return (
      <section className="mb-12">
        <h3
          className={`text-2xl font-semibold mb-6 pb-2 ${statusClasses.text} border-b-2 ${statusClasses.border}`}
        >
          {titulo}
        </h3>
        {listaAgendamentos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listaAgendamentos.map((consulta) => {
              const cardStatusClasses = getStatusClassNames(consulta.status);
              return (
                <div
                  key={consulta.id}
                  className={`p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 ${cardStatusClasses.border} ${cardStatusClasses.bg}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4
                      className={`text-xl font-semibold ${cardStatusClasses.text}`}
                    >
                      {consulta.servicoNome || "Serviço não informado"}
                    </h4>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${cardStatusClasses.badge}`}
                    >
                      {consulta.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Profissional:</strong>{" "}
                    {consulta.funcionarioNome || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Data:</strong>{" "}
                    {new Date(consulta.dataHora).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Horário:</strong>{" "}
                    {new Date(consulta.dataHora).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {consulta.descricao && (
                    <p className="text-xs text-gray-500 italic mt-2 p-2 bg-white rounded border border-gray-200">
                      <strong>Observações:</strong> {consulta.descricao}
                    </p>
                  )}
                  {consulta.status.toUpperCase() === "PENDENTE" && (
                    <button
                      onClick={() => iniciarReagendamento(consulta)}
                      className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium text-sm shadow-sm"
                    >
                      Reagendar
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-md">
            Nenhuma consulta {titulo.toLowerCase().split(" ")[0]}.
          </p>
        )}
      </section>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600 text-xl">Carregando...</p>
      </div>
    );
  }

  if (!clienteData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 text-center bg-gray-100">
        <p className="text-red-500 text-xl mb-4">
          Não foi possível carregar os dados do cliente.
        </p>
        <p className="text-gray-600 mb-6">
          Por favor, tente fazer login novamente.
        </p>
        <button
          onClick={() => (window.location.href = "/telas/login")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          Ir para Login
        </button>
      </div>
    );
  }

  const agendamentosPendentes = agendamentos.filter(
    (a) => a.status.toUpperCase() === "PENDENTE"
  );
  const agendamentosFinalizados = agendamentos.filter(
    (a) => a.status.toUpperCase() === "FINALIZADO"
  );
  const agendamentosCancelados = agendamentos.filter(
    (a) => a.status.toUpperCase() === "CANCELADO"
  );

  return (
    <div className="flex min-h-screen text-black bg-gray-50">
      <nav className="w-64 bg-white p-5 shadow-xl h-screen fixed top-0 left-0 flex flex-col justify-between print:hidden">
        <div>
          <div className="text-center mb-10 pt-2">
            <h1 className="text-2xl font-bold text-blue-700">Meu Painel</h1>
            <p className="text-sm text-gray-500 mt-1">Cliente</p>
          </div>
          <ul className="space-y-3">
            <li
              className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center space-x-3 ${
                selectedTab === "agendamento"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
              }`}
              onClick={prepararNovoAgendamento}
            >
              <CalendarDaysIcon /> {}
              <span>
                {agendamentoParaEditarId ? "Reagendar" : "Novo Agendamento"}
              </span>
            </li>
            <li
              className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center space-x-3 ${
                selectedTab === "consultas"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
              }`}
              onClick={() => setSelectedTab("consultas")}
            >
              <ListBulletIcon /> {}
              <span>Minhas Consultas</span>
            </li>
            <li
              className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center space-x-3 ${
                selectedTab === "perfil"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
              }`}
              onClick={() => setSelectedTab("perfil")}
            >
              <UserCircleIcon /> {}
              <span>Meu Perfil</span>
            </li>
          </ul>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-8 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center justify-center space-x-2 shadow-md"
        >
          <ArrowLeftOnRectangleIcon /> {}
          <span>Sair</span>
        </button>
      </nav>

      <div className="flex flex-col flex-grow ml-64">
        <header className="w-full bg-white shadow-md p-6 sticky top-0 z-30 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              {selectedTab === "agendamento" &&
                (agendamentoParaEditarId
                  ? "Reagendar Consulta"
                  : "Novo Agendamento")}
              {selectedTab === "consultas" && "Minhas Consultas"}
              {selectedTab === "perfil" && "Meu Perfil"}
            </h2>
            <p className="text-gray-600 text-md sm:text-lg">
              Bem-vindo(a),{" "}
              <span className="font-semibold text-blue-700">
                {nome.split(" ")[0] || "Cliente"}
              </span>
            </p>
          </div>
        </header>

        <main className="flex-grow p-6 sm:p-8 overflow-y-auto bg-slate-50">
          {selectedTab === "agendamento" && (
            <section className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200">
              <FormularioCliente
                passoAtual={passoAtualFormulario}
                setPassoAtual={setPassoAtualFormulario}
                clienteId={clienteData.id}
                agendamentoIdParaEditar={agendamentoParaEditarId}
                dadosIniciaisAgendamento={dadosFormularioAgendamento}
                onAgendamentoConcluido={() => {
                  if (clienteData?.id) fetchAgendamentos(clienteData.id);
                  setSelectedTab("consultas");
                  setAgendamentoParaEditarId(null);
                  setDadosFormularioAgendamento({
                    funcionarioId: null,
                    funcionarioNome: "",
                    servicoId: null,
                    servicoNome: "",
                    data: "",
                    horario: "",
                    descricao: "",
                  });
                }}
              />
            </section>
          )}

          {selectedTab === "consultas" && (
            <>
              {loading && agendamentos.length === 0 ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
                  <p className="text-gray-500 text-lg">
                    Carregando suas consultas...
                  </p>
                </div>
              ) : !loading && agendamentos.length === 0 ? (
                <div className="text-center py-12 bg-white p-8 rounded-xl shadow-md">
                  <p className="text-gray-500 text-xl mb-6">
                    Você ainda não possui nenhuma consulta agendada.
                  </p>
                  <button
                    onClick={prepararNovoAgendamento}
                    className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-base shadow-sm"
                  >
                    Fazer Novo Agendamento
                  </button>
                </div>
              ) : (
                <>
                  {renderAgendamentosPorStatus(
                    "Pendentes",
                    agendamentosPendentes,
                    "PENDENTE"
                  )}
                  {renderAgendamentosPorStatus(
                    "Finalizadas",
                    agendamentosFinalizados,
                    "FINALIZADO"
                  )}
                  {renderAgendamentosPorStatus(
                    "Canceladas",
                    agendamentosCancelados,
                    "CANCELADO"
                  )}
                </>
              )}
            </>
          )}

          {selectedTab === "perfil" && (
            <section className="bg-white p-6 sm:p-8 rounded-xl shadow-xl max-w-lg mx-auto border border-gray-200">
              <h2 className="text-2xl font-semibold mb-8 text-center text-gray-700">
                Meu Perfil
              </h2>
              {editingProfile ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateProfile();
                  }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome:
                    </label>
                    <p className="text-lg text-gray-800 p-3 border rounded-md bg-gray-100">
                      {clienteData.nome}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CPF:
                    </label>
                    <p className="text-lg text-gray-800 p-3 border rounded-md bg-gray-100">
                      {clienteData.cpf}
                    </p>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="emailCliente"
                    >
                      Email:
                    </label>
                    <input
                      id="emailCliente"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                      className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="telCliente"
                    >
                      Telefone:
                    </label>
                    <input
                      id="telCliente"
                      type="tel"
                      value={newTelefone}
                      onChange={(e) => setNewTelefone(e.target.value)}
                      className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(XX) XXXXX-XXXX"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="senhaCliente"
                    >
                      Nova Senha (mín. 6 caracteres):
                    </label>
                    <input
                      id="senhaCliente"
                      type="password"
                      value={newSenha}
                      onChange={(e) => setNewSenha(e.target.value)}
                      className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Deixe em branco para não alterar"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-3 hover:bg-blue-700 transition-colors font-medium shadow-sm"
                    >
                      Salvar Alterações
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProfile(false);
                        setNewEmail(clienteData.email);
                        setNewTelefone(clienteData.telefone || "");
                        setNewSenha("");
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 rounded-lg px-4 py-3 hover:bg-gray-300 transition-colors font-medium shadow-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-5">
                  <div className="py-3 border-b border-gray-200">
                    <strong className="text-gray-600 font-medium w-28 inline-block">
                      Nome:
                    </strong>
                    <span className="text-gray-800">{clienteData.nome}</span>
                  </div>
                  <div className="py-3 border-b border-gray-200">
                    <strong className="text-gray-600 font-medium w-28 inline-block">
                      CPF:
                    </strong>
                    <span className="text-gray-800">{clienteData.cpf}</span>
                  </div>
                  <div className="py-3 border-b border-gray-200">
                    <strong className="text-gray-600 font-medium w-28 inline-block">
                      Email:
                    </strong>
                    <span className="text-gray-800">{clienteData.email}</span>
                  </div>
                  <div className="py-3 border-b border-gray-200">
                    <strong className="text-gray-600 font-medium w-28 inline-block">
                      Telefone:
                    </strong>
                    <span className="text-gray-800">
                      {clienteData.telefone || "Não informado"}
                    </span>
                  </div>
                  <div className="py-3">
                    <strong className="text-gray-600 font-medium w-28 inline-block">
                      Senha:
                    </strong>
                    <span className="text-gray-800">••••••••</span>
                  </div>
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="w-full mt-8 bg-green-500 text-white rounded-lg px-4 py-3 hover:bg-green-600 transition-colors font-medium shadow-md"
                  >
                    Editar Perfil
                  </button>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClientesPage;
