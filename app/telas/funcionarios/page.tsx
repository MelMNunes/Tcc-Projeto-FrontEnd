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

const FuncionariosPage: React.FC = () => {
  // Tipagens
  interface Consulta {
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
  const [users, setUsers] = useState<Usuario[]>([]); // Estado para armazenar usuários
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

  // Estado para controle mensagem do WhatsApp
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userDataString = localStorage.getItem("user");

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setNome(userData.nome || "Usuário");

        const userId = Number(localStorage.getItem("id"));
        fetchFuncionarioData(userId);
        fetchAgendamentos(userId);
        fetchUsers(); // Chama a função para buscar usuários
      } catch (error) {
        console.error("Erro ao recuperar dados do funcionário:", error);
      }
    }
  }, []);

  useEffect(() => {
    const userDataString = localStorage.getItem("user");

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setNome(userData.nome || "Usuário");

        const userId = Number(localStorage.getItem("id"));
        fetchFuncionarioData(userId);
        fetchAgendamentos(userId);
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

      data.forEach((c) => {
        const dia = new Date(c.dataHora).toLocaleDateString();
        if (!agByDia[dia]) agByDia[dia] = [];
        agByDia[dia].push(c);
      });

      const diasOrdenados = Object.keys(agByDia).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );

      setAgendamentos(
        diasOrdenados.map((dia) => ({
          dia,
          consultas: agByDia[dia].sort(
            (a, b) =>
              new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
          ),
        }))
      );
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
  };

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

  const handleSendMessage = async () => {
    setSending(true);
    setError(null);
    try {
      const response = await fetch("https://api.wali.chat/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Token:
            "0f2d95328f00d15bfadf10c0a45637cc44887b111f9af7fe2f9004ebd5b3c7d8f2c4359adf72b609", // Substitua pela sua chave de API
        },
        body: JSON.stringify({ phone, message }),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar mensagem: " + response.statusText);
      }

      const data = await response.json();
      alert("Mensagem enviada com sucesso: " + data);
      setMessage(""); // Limpa o campo de mensagem após o envio
    } catch (err: Error) {
      setError("Erro ao enviar mensagem: " + err.message);
    } finally {
      setSending(false);
    }
  };

  // Filtra os usuários com base no termo de pesquisa
  const filteredUsers = users.filter(
    (user) =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cpf.includes(searchTerm) ||
      user.telefone.includes(searchTerm)
  );

  

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <nav className="w-64 bg-white p-4 shadow h-screen fixed flex flex-col justify-between">
        <ul className="space-y-2">
          {[
            "agendamento",
            "consultas",
            "historico",
            "perfil",
            "enviarMensagem",
            "pesquisarUsuarios",
          ].map((tab) => (
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
                  historico: "Histórico",
                  perfil: "Perfil",
                  enviarMensagem: "Enviar Mensagem",
                  pesquisarUsuarios: "Pesquisar Clientes",
                }[tab]
              }
            </li>
          ))}
        </ul>
        <button
          className="bg-red-500 text-white p-2 rounded mt-4 hover:bg-red-600"
          onClick={() => {
            localStorage.clear();
            router.push("/");
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

              {/* Aba Próximas Consultas */}
              {selectedTab === "consultas" && (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agendamentos
                    .flatMap((g) => g.consultas)
                    .map((c) => (
                      <div key={c.id} className="border p-4 rounded shadow">
                        <p className="font-medium">
                          {new Date(c.dataHora).toLocaleDateString()} –{" "}
                          {new Date(c.dataHora).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p>
                          <strong>Cliente:</strong> {c.clienteNome}
                        </p>
                        <p>
                          <strong>Serviço:</strong> {c.servicoNome}
                        </p>
                        <div className="mt-2 space-x-2">
                          {c.status === "PENDENTE" && (
                            <>
                              <button
                                onClick={() => handleConfirmar(c.id)}
                                className="px-2 py-1 bg-green-500 text-white rounded"
                              >
                                Confirmar
                              </button>
                              <button
                                onClick={() => handleFinalizar(c.id)}
                                className="px-2 py-1 bg-blue-500 text-white rounded"
                              >
                                Finalizar
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => openAnamnese(c.id)}
                            className="px-2 py-1 bg-purple-500 text-white rounded"
                          >
                            Anamnese
                          </button>
                        </div>
                      </div>
                    ))}
                </section>
              )}

              {/* Aba Histórico */}
              {selectedTab === "historico" && (
                <section>
                  <h3 className="text-xl font-semibold mb-4">Histórico</h3>
                  <p className="text-gray-600">
                    Histórico de consultas ainda não implementado.
                  </p>
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

              {/* Seção para enviar mensagem */}
              {selectedTab === "enviarMensagem" && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">
                    Enviar Mensagem
                  </h2>
                  <input
                    type="text"
                    placeholder="Número de telefone (ex: +551196777071)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border p-2 rounded mb-2"
                  />
                  <textarea
                    placeholder="Digite sua mensagem"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border p-2 rounded mb-2"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sending}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    {sending ? "Enviando..." : "Enviar Mensagem"}
                  </button>
                  {error && <p className="text-red-500">{error}</p>}
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
      </div>
    </div>
  );
};

export default FuncionariosPage;
