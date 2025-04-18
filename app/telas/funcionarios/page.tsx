"use client";

import React, { useEffect, useState } from "react";
import FormularioAgendamentoFuncionario from "../agendamento/formularioFuncionario/FormularioFuncionario";
import {
  getUsuarioById,
  getAgendamentosByFuncionarioId,
} from "@/app/services/api";

const FuncionariosPage = () => {
  interface Consulta {
    id: number;
    dataHora: string;
    servicoNome: string;
    clienteNome: string;
    descricao: string;
  }

  interface FuncionarioData {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
    senha: string;
    tipoDeUsuario: string;
    proximasConsultas: Consulta[];
    historico: Consulta[];
  }

  interface Usuario {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    tipoDeUsuario: string;
  }

  const [nome, setNome] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState("agendamento");
  const [funcionarioData, setFuncionarioData] =
    useState<FuncionarioData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [agendamentos, setAgendamentos] = useState<
    { dia: string; consultas: Consulta[] }[]
  >([]);
  const [users, setUsers] = useState<Usuario[]>([]); // Estado para armazenar usuários
  const [searchTerm, setSearchTerm] = useState<string>(""); // Estado para armazenar o termo de pesquisa
  const [filter] = useState("CLIENTE");

  // Estado para controle mensagem do WhatsApp
  const [passoAtual, setPassoAtual] = useState(0);
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
        fetchAgendamentos(userId);
        fetchUsers(); // Chama a função para buscar usuários
      } catch (error) {
        console.error("Erro ao recuperar dados do funcionário:", error);
      }
    }
  }, []);

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

  const fetchAgendamentos = async (userId: number) => {
    try {
      // Buscar os agendamentos do funcionário pelo ID
      const data: Consulta[] = await getAgendamentosByFuncionarioId(userId);
      console.log("Agendamentos buscados da API:", data); // Log para debug
  
      // Verificar se os dados retornados são válidos
      if (!data || !Array.isArray(data)) {
        console.error("Erro: os dados não são uma lista válida:", data);
        return; // Encerra a função se os dados forem inválidos
      }
  
      // Organizar os agendamentos por dia
      const agendamentosPorDia: { [key: string]: Consulta[] } = {};
  
      data.forEach((consulta) => {
        const dataDia = new Date(consulta.dataHora).toLocaleDateString();
  
        if (!agendamentosPorDia[dataDia]) {
          agendamentosPorDia[dataDia] = [];
        }
  
        agendamentosPorDia[dataDia].push(consulta);
      });
  
      // Ordenar os dias em ordem crescente
      const diasOrdenados = Object.keys(agendamentosPorDia).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );
  
      // Ordenar os agendamentos dentro de cada dia
      const agendamentosOrdenados = diasOrdenados.map((dia) => {
        return {
          dia,
          consultas: agendamentosPorDia[dia].sort(
            (a, b) =>
              new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
          ),
        };
      });
  
      // Atualizar o estado com os agendamentos organizados
      setAgendamentos(agendamentosOrdenados);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
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
  const filteredUsers = users.filter(user =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cpf.includes(searchTerm) ||
    user.telefone.includes(searchTerm)
  );

  return (
    <div className="flex min-h-screen text-black bg-gray-100">
      <nav className="w-64 bg-white p-4 shadow-md h-screen fixed top-0 left-0 flex flex-col justify-between">
        <div>
          <h1 className="text-lg font-semibold mb-6 text-center">Painel</h1>
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
            {/* Nova aba para enviar mensagem */}
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "enviarMensagem"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("enviarMensagem")}
            >
              Enviar Mensagem
            </li>
            {/* Nova aba para pesquisar clientes */}
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "pesquisarUsuarios"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("pesquisarUsuarios")}
            >
              Pesquisar Clientes
            </li>
          </ul>
        </div>
        <button
          className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 w-full"
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Sair
        </button>
      </nav>

      <div className="flex flex-col flex-grow ml-64 min-h-screen">
        <header className="w-full bg-white shadow-md p-4">
          <h2 className="text-2xl font-semibold">Tela do Funcionário</h2>
          <p className="text-gray-600">Bem-vindo, {nome}</p>
        </header>

        <main className="flex-grow p-8">
          {loading ? (
            <p className="text-gray-600">Carregando informações...</p>
          ) : (
            <>
              {selectedTab === "agendamento" && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Agendamento</h2>
                  {funcionarioData ? (
                    <FormularioAgendamentoFuncionario
                      passoAtual={passoAtual} // Passa o passo atual
                      setPassoAtual={setPassoAtual} // Passa a função para mudar o passo
                      funcionarioId={funcionarioData.id} // Passa o ID do funcionário
                    />
                  ) : (
                    <p className="text-gray-600">
                      Carregando dados do funcionário...
                    </p>
                  )}
                </section>
              )}

              {selectedTab === "consultas" && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">
                    Próximas Consultas
                  </h2>
                  {agendamentos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {agendamentos
                        .flatMap((grupo) =>
                          grupo.consultas.map((consulta) => ({
                            ...consulta,
                            dia: grupo.dia, // Adiciona o dia à consulta
                          }))
                        )
                        .sort(
                          (a, b) =>
                            new Date(a.dataHora as string) -
                            new Date(b.dataHora as string)
                        ) // Ordena por data e hora
                        .map((consulta) => (
                          <div
                            key={consulta.id}
                            className="p-4 border rounded-lg shadow"
                          >
                            <h3 className="text-xl font-semibold">
                              {consulta.dia}
                            </h3>
                            <p>
                              <strong>Cliente:</strong>{" "}
                              {consulta.clienteNome || "Desconhecido"}
                            </p>
                            <p>
                              <strong>Data:</strong>{" "}
                              {new Date(consulta.dataHora).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Horário:</strong>{" "}
                              {new Date(consulta.dataHora).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </p>
                            <p>
                              <strong>Serviço:</strong>{" "}
                              {consulta.servicoNome || "Não informado"}
                            </p>
                            {consulta.descricao && (
                              <p>
                                <strong>Comentário:</strong>{" "}
                                {consulta.descricao}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      Nenhuma consulta encontrada.
                    </p>
                  )}
                </section>
              )}

              {selectedTab === "historico" && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Histórico</h2>
                  <p className="text-gray-600">
                    Histórico de consultas ainda não implementado.
                  </p>
                </section>
              )}

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
                  <h2 className="text-2xl font-semibold mb-4">Pesquisar Clientes</h2>
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
                        <div key={user.id} className="p-4 border rounded-lg shadow">
                          <h3 className="text-xl font-semibold">{user.nome}</h3>
                          <p><strong>Email:</strong> {user.email}</p>
                          <p><strong>Telefone:</strong> {user.telefone}</p>
                          <p><strong>CPF:</strong> {user.cpf}</p>
                          <p><strong>Tipo de Usuário:</strong> {user.tipoDeUsuario}</p>
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
      </div>
    </div>
  );
};

export default FuncionariosPage;