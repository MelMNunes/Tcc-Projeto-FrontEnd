"use client";

import React, { useEffect, useState } from "react";
import FormularioAgendamentoFuncionario from "../agendamento/formularioFuncionario/FormularioFuncionario";
import {
  getUsuarioById,
  getAgendamentosByFuncionarioId,
} from "@/app/services/api";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/Modal/Modal";
import FormularioAnamnesePage from "@/app/telas/anamnese/page";
// import ModalReagendamento from "@/app/components/ModalReagendamento";

const FuncionariosPage: React.FC = () => {
  // Tipagens
  interface Consulta {
    clienteId: number;
    id: number;
    dataHora: string;
    servicoNome: string;
    clienteNome: string;
    descricao?: string;
    status: string;
  }

  interface FuncionarioData {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
    senha: string;
    tipoDeUsuario: string;
  }

  interface Usuario {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    tipoDeUsuario: string;
  }

  // Estados principais
  const [passoAtual, setPassoAtual] = useState(0);
  const [statusFiltro, setStatusFiltro] = useState("PENDENTE"); // ✔️ CORRETO
  const [users, setUsers] = useState<Usuario[]>([]); // Estado para armazenar usuários
  // const [novaDataHora, setNovaDataHora] = useState<string>("");
  const [loadingFinalizarId, setLoadingFinalizarId] = useState<number | null>(
    null
  );
  const [historicoAgendamentos, setHistoricoAgendamentos] = useState<
    Consulta[]
  >([]);
  const [nome, setNome] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("agendamento");
  const [funcionarioData, setFuncionarioData] =
    useState<FuncionarioData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [agendamentos, setAgendamentos] = useState<
    { dia: string; consultas: Consulta[] }[]
  >([]);
  const [expandedConsultaId, setExpandedConsultaId] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConsultaId, setSelectedConsultaId] = useState<number | null>(
    null
  );
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>(""); // Estado para armazenar o termo de pesquisa
  const [filter] = useState("CLIENTE");

  // Estado para controle de edição de perfil
  const [editing, setEditing] = useState<boolean>(false);
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
        fetchFuncionarioData(userId);
        fetchUsers(); // Chama a função para buscar usuários
      } catch (error) {
        console.error("Erro ao recuperar dados do funcionário:", error);
      }
    }
  }, []);

  // Função para carregar dados do funcionário
  const fetchFuncionarioData = async (userId: number) => {
    setLoading(true);
    try {
      const data = await getUsuarioById(userId);
      setFuncionarioData(data);
      setNewEmail(data.email); // Preenche o novo email com o atual
      setNewTelefone(data.telefone); // Preenche o novo telefone com o atual
    } catch (error) {
      console.error("Erro ao buscar dados do funcionário:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setNome(userData.nome || "Usuário");
      const userId = Number(localStorage.getItem("id"));
      fetchFuncionarioData(userId);
      fetchAgendamentos(userId);
    }
  }, []);

  // Função para carregar agendamentos
  const fetchAgendamentos = async (userId: number) => {
    try {
      const data: Consulta[] = await getAgendamentosByFuncionarioId(userId);
      const agByDia: Record<string, Consulta[]> = {};
      const historico: Consulta[] = [];

      data.forEach((c) => {
        if (c.status === "FINALIZADO" || c.status === "CANCELADO") {
          historico.push(c);
        } else {
          const dia = new Date(c.dataHora).toLocaleDateString();
          if (!agByDia[dia]) agByDia[dia] = [];
          agByDia[dia].push(c);
        }
      });

      const diasOrdenados = Object.keys(agByDia).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );

      const agendamentosList = diasOrdenados.map((dia) => ({
        dia,
        consultas: agByDia[dia].sort(
          (a, b) =>
            new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
        ),
      }));

      setAgendamentos(agendamentosList);
      setHistoricoAgendamentos(historico);

      // Armazenar agendamentos no Local Storage
      localStorage.setItem("agendamentos", JSON.stringify(agendamentosList));
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
  };

  useEffect(() => {
    const storedHist = localStorage.getItem("historicoAgendamentos");
    if (storedHist) {
      setHistoricoAgendamentos(JSON.parse(storedHist));
    } else {
      // Caso não tenha histórico armazenado, você pode buscar da API ou inicializar com uma lista vazia
      setHistoricoAgendamentos([]);
    }

    const storedAgendamentos = localStorage.getItem("agendamentos");
    if (storedAgendamentos) {
      setAgendamentos(JSON.parse(storedAgendamentos));
    } else {
      const userId = Number(localStorage.getItem("id"));
    }
  }, []);

  //aqui
  useEffect(() => {
    const fetchPorStatus = async () => {
      try {
        const funcionarioId = Number(localStorage.getItem("id"));
        const response = await fetch(
          `http://localhost:8080/api/agendamentos/funcionarios/${funcionarioId}/status/${statusFiltro}`
        );
        if (!response.ok)
          throw new Error("Erro ao buscar agendamentos por status");

        const data = await response.json();

        // Agora sempre que o filtro mudar, ele vai preencher corretamente os agendamentos
        setAgendamentos([
          {
            dia: "Agendamentos",
            consultas: data,
          },
        ]);
      } catch (error) {
        console.error("Erro ao buscar agendamentos por status:", error);
      }
    };

    fetchPorStatus();
  }, [statusFiltro]);

  useEffect(() => {
    if (selectedTab === "consultas") {
      // Quando a aba de consultas for aberta, forçamos o filtro PENDENTE
      setStatusFiltro("PENDENTE");
    }
  }, [selectedTab]);

  useEffect(() => {
    const fetchPorStatus = async () => {
      try {
        const funcionarioId = Number(localStorage.getItem("id"));
        const response = await fetch(
          `http://localhost:8080/api/agendamentos/funcionarios/${funcionarioId}/status/${statusFiltro}`
        );
        if (!response.ok)
          throw new Error("Erro ao buscar agendamentos por status");

        const data = await response.json();

        setAgendamentos([
          {
            dia: "Agendamentos",
            consultas: data,
          },
        ]);
      } catch (error) {
        console.error("Erro ao buscar agendamentos por status:", error);
      }
    };

    fetchPorStatus();
  }, [statusFiltro]);

  // Função para abrir o modal de anamnese
  const openAnamnese = (consultaId: number) => {
    setSelectedConsultaId(consultaId);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedConsultaId(null);
  };

  const fetchUsers = async () => {
    try {
      let endpoint = "http://localhost:8080/api/usuarios/listar/todos";
      if (filter !== "todos") {
        endpoint = `http://localhost:8080/api/usuarios/listar/${filter}`;
      }

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar usuários: ${response.status}`);
      }

      const data: Usuario[] = await response.json();
      console.log("Usuários recebidos:", data);
      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const handleUpdateProfile = async () => {
    const userId = funcionarioData?.id;
    if (!userId) return;

    const response = await fetch(
      `http://localhost:8080/api/usuarios/editar/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: funcionarioData.nome,
          email: newEmail,
          telefone: newTelefone,
          senha: newSenha, // Enviar nova senha se fornecida
          tipoDeUsuario: funcionarioData.tipoDeUsuario, // Enviar o tipo de usuário
        }),
      }
    );

    if (response.ok) {
      alert("Perfil atualizado com sucesso!");
      fetchFuncionarioData(userId); // Recarrega os dados do cliente
      setEditing(false); // Fecha o modo de edição
    } else {
      const errorMessage = await response.text();
      alert("Erro ao atualizar perfil: " + errorMessage);
    }
  };

  // // Função para abrir o modal de reagendamento
  // const openReagendarModal = (consulta: Consulta) => {
  //   setSelectedConsultaId(consulta.id);
  //   setIsReagendarModalOpen(true);
  // };

  // Filtra os usuários com base no termo de pesquisa
  const filteredUsers = users.filter(
    (user) =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cpf.includes(searchTerm) ||
      user.telefone.includes(searchTerm)
  );

  const handleFinalizar = async (agendamentoId: number) => {
    setLoadingFinalizarId(agendamentoId);
    try {
      // 1) Chama a API e obtém o objeto atualizado
      const response = await fetch(
        `http://localhost:8080/api/agendamentos/atualizar-status/${agendamentoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify("FINALIZADO"),
        }
      );
      if (!response.ok) throw new Error("Erro ao finalizar");

      // 2) O servidor já retorna o AgendamentoDTO atualizado
      const updated: Consulta = await response.json();

      // 3) Remove dos próximos agendamentos
      setAgendamentos((prev) =>
        prev
          .map(({ dia, consultas }) => ({
            dia,
            consultas: consultas.filter((c) => c.id !== agendamentoId),
          }))
          .filter((g) => g.consultas.length > 0)
      );

      // 4) Adiciona ao histórico
      setHistoricoAgendamentos((prev) => {
        const updatedHistorico = [...prev, updated];
        // 5) Salva o histórico no localStorage
        localStorage.setItem(
          "historicoAgendamentos",
          JSON.stringify(updatedHistorico)
        );
        return updatedHistorico;
      });

      // 6) Vai para a aba Histórico
      setSelectedTab("historico");
    } catch (err) {
      console.error(err);
      alert("Não foi possível finalizar.");
    } finally {
      setLoadingFinalizarId(null);
    }
  };

  // Função para cancelar um agendamento
  const handleCancelar = async (agendamentoId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/agendamentos/atualizar-status/${agendamentoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify("CANCELADO"),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao cancelar agendamento");
      }

      // Atualiza a lista de agendamentos após o cancelamento
      fetchAgendamentos(funcionarioData!.id);

      // Adiciona o agendamento ao histórico
      const canceledAgendamento = agendamentos
        .flatMap((a) => a.consultas)
        .find((c) => c.id === agendamentoId);

      if (canceledAgendamento) {
        setHistoricoAgendamentos((prev) => [
          ...prev,
          { ...canceledAgendamento, status: "CANCELADO" },
        ]);
      }

      // Muda para a aba de histórico
      setSelectedTab("historico");
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      alert("Erro ao cancelar agendamento.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <nav className="w-64 bg-white p-4 shadow h-screen fixed flex flex-col justify-between">
        <ul className="space-y-3">
          {["agendamento", "consultas", "pesquisarUsuarios", "perfil"].map(
            (tab) => (
              <li
                key={tab}
                className={`p-2 rounded cursor-pointer ${
                  selectedTab === tab
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {
                  {
                    agendamento: "Agendamento",
                    consultas: "Próximas Consultas",
                    perfil: "Perfil",
                    pesquisarUsuarios: "Pesquisar Clientes",
                  }[tab]
                }
              </li>
            )
          )}
        </ul>
        <button
          className="bg-red-500 text-white p-2 rounded mt-4 hover:bg-red-600"
          onClick={() => {
            if (confirm("Tem certeza que deseja sair?")) {
              localStorage.clear();
              router.push("/");
            }
          }}
        >
          Sair
        </button>
      </nav>

      {/* Main content */}
      <div className="ml-64 flex flex-col flex-grow">
        <header className="bg-white p-4 shadow">
          <h2 className="text-2xl font-semibold">Tela do Funcionário</h2>
          <p className="text-gray-600">{nome}</p>
        </header>

        <main className="p-8 flex-grow">
          {loading ? (
            <p className="text-gray-600">Carregando...</p>
          ) : (
            <>
              {/* Aba Agendamento */}
              {selectedTab === "agendamento" && (
                <section>
                  <h3 className="text-xl font-semibold mb-4">Agendamento</h3>
                  <FormularioAgendamentoFuncionario
                    passoAtual={passoAtual}
                    setPassoAtual={setPassoAtual}
                    funcionarioId={funcionarioData!.id}
                  />
                </section>
              )}

              {/* Aba Consultas */}
              {selectedTab === "consultas" && (
                <section className="grid grid-cols-1 gap-4">
                  {/* Filtro de status */}
                  <div className="mb-4">
                    <label className="font-semibold mr-2 text-lg">
                      Filtrar por status:
                    </label>
                    <select
                      className="px-4 py-2 rounded-2xl border border-gray-300 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={statusFiltro}
                      onChange={(e) => setStatusFiltro(e.target.value)}
                    >
                      <option value="PENDENTE">🟡 Pendentes</option>
                      <option value="FINALIZADO">✅ Finalizados</option>
                      <option value="CANCELADO">❌ Cancelados</option>
                    </select>
                  </div>

                  {agendamentos
                    .flatMap((g) => g.consultas)
                    .map((c) => (
                      <div
                        key={c.id}
                        className={`border p-4 rounded shadow ${
                          c.status === "FINALIZADO"
                            ? "bg-green-100"
                            : c.status === "CANCELADO"
                            ? "bg-red-100"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-bold text-xl mb-2">
                              {new Date(c.dataHora).toLocaleDateString()} –{" "}
                              {new Date(c.dataHora).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            <p
                              className={`${
                                c.status !== "PENDENTE" ? "line-through" : ""
                              }`}
                            >
                              <strong>Cliente:</strong> {c.clienteNome}
                            </p>
                            <p
                              className={`${
                                c.status !== "PENDENTE" ? "line-through" : ""
                              }`}
                            >
                              <strong>Serviço:</strong> {c.servicoNome}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          {c.status === "PENDENTE" && (
                            <>
                              <button
                                onClick={() => openAnamnese(c.id)}
                                className={`px-2 py-1 bg-purple-700 text-white rounded`}
                              >
                                Anamnese
                              </button>

                              <div className="space-x-2">
                                <button
                                  onClick={() => handleFinalizar(c.id)}
                                  className={`px-2 py-1 text-white rounded ${
                                    loadingFinalizarId === c.id
                                      ? "bg-green-300 cursor-not-allowed"
                                      : "bg-green-500 hover:bg-green-600"
                                  }`}
                                  disabled={loadingFinalizarId === c.id}
                                >
                                  {loadingFinalizarId === c.id
                                    ? "Finalizando..."
                                    : "Finalizar"}
                                </button>

                                <button
                                  onClick={() => handleCancelar(c.id)}
                                  className="px-2 py-1 bg-red-500 text-white rounded"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </>
                          )}

                          {c.status === "FINALIZADO" && (
                            <>
                              <button
                                onClick={() => openAnamnese(c.id)}
                                className={`px-2 py-1 bg-purple-700 text-white rounded`}
                              >
                                Anamnese
                              </button>

                              <div className="space-x-2">
                                <button
                                  onClick={() => handleCancelar(c.id)}
                                  className="px-2 py-1 bg-red-500 text-white rounded"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </>
                          )}

                          {c.status === "CANCELADO" && (
                            <>
                              <button
                                onClick={() => openAnamnese(c.id)}
                                className={`px-2 py-1 bg-purple-700 text-white rounded`}
                              >
                                Anamnese
                              </button>

                              <div className="space-x-2">
                              <button
                                onClick={() => handleFinalizar(c.id)}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                Restaurar
                              </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                </section>
              )}

              {/* Aba Perfil */}
              {selectedTab === "perfil" && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Perfil</h2>
                  {editing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block">
                          <strong>Nome:</strong> {funcionarioData.nome}
                        </label>
                      </div>
                      <div>
                        <label className="block">
                          <strong>Email:</strong>
                          <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="border rounded p-1 w-full"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block">
                          <strong>Telefone:</strong>
                          <input
                            type="text"
                            value={newTelefone}
                            onChange={(e) => setNewTelefone(e.target.value)}
                            className="border rounded p-1 w-full"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block">
                          <strong>Senha:</strong>
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
                      <div>
                        <strong>Nome:</strong> {funcionarioData.nome}
                      </div>
                      <div>
                        <strong>CPF:</strong> {funcionarioData.cpf}
                      </div>
                      <div>
                        <strong>Email:</strong> {funcionarioData.email}
                      </div>
                      <div>
                        <strong>Telefone:</strong> {funcionarioData.telefone}
                      </div>
                      <div>
                        <strong>Senha:</strong> <span>••••••••</span>
                      </div>
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

              {/* Seção para pesquisar clientes */}
              {selectedTab === "pesquisarUsuarios" && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">
                    Pesquisar Clientes
                  </h2>
                  <input
                    type="text"
                    placeholder="Pesquisar pelo nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded mb-4 w-full"
                  />
                  {filteredUsers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="p-4 border rounded-lg shadow"
                        >
                          <h3 className="text-xl font-semibold">{user.nome}</h3>
                          <p>
                            <strong>Email:</strong> {user.email}
                          </p>
                          <p>
                            <strong>Telefone:</strong> {user.telefone}
                          </p>
                          <p>
                            <strong>CPF:</strong> {user.cpf}
                          </p>
                          <p>
                            <strong>Tipo de Usuário:</strong>{" "}
                            {user.tipoDeUsuario}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Nenhum cliente encontrado.</p>
                  )}
                </section>
              )}
            </>
          )}
        </main>

        {/* Modal de Anamnese */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {selectedConsultaId ? (
            <FormularioAnamnesePage
              agendamentoId={selectedConsultaId}
              onClose={handleCloseModal}
            />
          ) : (
            <p>Carregando...</p> // Exibir um texto caso o ID não esteja correto
          )}
        </Modal>

        {/* Modal de Reagendamento
        <ModalReagendamento
          isOpen={isReagendarModalOpen}
          onClose={() => setIsReagendarModalOpen(false)}
          onConfirm={handleReagendar}
        /> */}
      </div>
    </div>
  );
};

export default FuncionariosPage;