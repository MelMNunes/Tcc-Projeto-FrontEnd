"use client";

import React, { useEffect, useState } from "react";
import FormularioAgendamentoFuncionario from "../agendamento/formularioFuncionario/FormularioFuncionario";
import {
  getUsuarioById,
  getAgendamentosByFuncionarioId,
} from "@/app/services/api";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";

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
  const [expandedConsultaId, setExpandedConsultaId] = useState<number | null>(
    null
  );
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const filteredUsers = users.filter(
    (user) =>
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
                            dia: grupo.dia,
                          }))
                        )
                        .sort(
                          (a, b) =>
                            new Date(a.dataHora as string) -
                            new Date(b.dataHora as string)
                        )
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

                            {/* Botão "Ver Mais" */}
                            <button
                              onClick={() =>
                                setExpandedConsultaId(
                                  expandedConsultaId === consulta.id
                                    ? null
                                    : consulta.id
                                )
                              }
                              className="mt-2 bg-blue-500 text-white rounded px-2 py-1"
                            >
                              {expandedConsultaId === consulta.id
                                ? "Ver Menos"
                                : "Ver Mais"}
                            </button>

                            {/* Se a consulta está expandida, mostrar os botões adicionais */}
                            {expandedConsultaId === consulta.id && (
                              <div className="mt-2">
                                <button
                                  onClick={() => setIsModalOpen(true)} // Abre o modal ao clicar
                                  className="bg-green-500 text-white rounded px-2 py-1 mr-2"
                                >
                                  Fazer Anamnese
                                </button>
                                <button className="bg-yellow-500 text-white rounded px-2 py-1">
                                  Consulta Realizada
                                </button>
                              </div>
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
                        {/* Modal para o formulário de anamnese */}
                        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-2xl font-semibold mb-4 text-center">Formulário de Anamnese</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dados do Cliente */}
                  <div>
                    <label className="block mb-2">Data de Registro:</label>
                    <input
                      type="date"
                      value={dataRegistro}
                      onChange={(e) => setDataRegistro(e.target.value)}
                      className="border rounded p-2 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Idade:</label>
                    <input
                      type="number"
                      value={idade}
                      onChange={(e) => setIdade(e.target.value)}
                      className="border rounded p-2 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Gênero:</label>
                    <select
                      value={genero}
                      onChange={(e) => setGenero(e.target.value)}
                      className="border rounded p-2 w-full"
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  {/* Informações do Cliente */}
                  <h3 className="text-xl font-semibold mt-6">Informações do Cliente</h3>
                  <div>
                    <label className="block mb-2">Queixa Principal:</label>
                    <input
                      type="text"
                      value={queixaPrincipal}
                      onChange={(e) => setQueixaPrincipal(e.target.value)}
                      className="border rounded p-2 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Há quanto tempo está com esse problema?</label>
                    <input
                      type="text"
                      value={tempoProblema}
                      onChange={(e) => setTempoProblema(e.target.value)}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Já fez algum tratamento antes? Qual?</label>
                    <input
                      type="text"
                      value={tratamentoAnterior}
                      onChange={(e) => setTratamentoAnterior(e.target.value)}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">História:</label>
                    <textarea
                      value={historia}
                      onChange={(e) => setHistoria(e.target.value)}
                      className="border rounded p-2 w-full h-32"
                      required
                    />
                  </div>

                  {/* Doenças */}
                  <div>
                    <label className="block mb-2">Possui alguma doença diagnosticada?</label>
                    <select
                      multiple
                      value={doencas}
                      onChange={(e) => {
                        const options = e.target.options;
                        const selected = [];
                        for (let i = 0; i < options.length; i++) {
                          if (options[i].selected) {
                            selected.push(options[i].value);
                          }
                        }
                        setDoencas(selected);
                      }}
                      className="border rounded p-2 w-full"
                    >
                      <option value="diabetes">Diabetes</option>
                      <option value="hipertensao">Hipertensão</option>
                      <option value="doenca_vascular">Doença Vascular</option>
                      <option value="outra">Outra</option>
                    </select>
                    {doencas.includes('outra') && (
                      <input
                        type="text"
                        placeholder="Especifique"
                        value={outraDoenca}
                        onChange={(e) => setOutraDoenca(e.target.value)}
                        className="border rounded p-2 w-full mt-2"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block mb-2">Já passou por cirurgias?</label>
                    <select
                      value={cirurgiaRecente}
                      onChange={(e) => setCirurgiaRecente(e.target.value)}
                      className="border rounded p-2 w-full"
                    >
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                    {cirurgiaRecente === 'sim' && (
                      <input
                        type="text"
                        placeholder="Especifique"
                        className="border rounded p-2 w-full mt-2"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block mb-2">Possui alergias?</label>
                    <select
                      value={alergia}
                      onChange={(e) => setAlergia(e.target.value)}
                      className="border rounded p-2 w-full"
                    >
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                    {alergia === 'sim' && (
                      <div className="space-y-2 mt-2">
                        <input
                          type="text"
                          placeholder="Medicamentos"
                          value={medicamentos}
                          onChange={(e) => setMedicamentos(e.target.value)}
                          className="border rounded p-2 w-full"
                        />
                        <input
                          type="text"
                          placeholder="Produtos"
                          value={produtos}
                          onChange={(e) => setProdutos(e.target.value)}
                          className="border rounded p-2 w-full"
                        />
                        <input
                          type="text"
                          placeholder="Materiais"
                          value={materiais}
                          onChange={(e) => setMateriais(e.target.value)}
                          className="border rounded p-2 w-full"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2">Histórico familiar de doenças?</label>
                    <select
                      value={historicoFamiliar}
                      onChange={(e) => setHistoricoFamiliar(e.target.value)}
                      className="border rounded p-2 w-full"
                    >
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                    {historicoFamiliar === 'sim' && (
                      <input
                        type="text"
                        placeholder="Especifique"
                        value={historicoFamiliarEspecificar}
                        onChange={(e) => setHistoricoFamiliarEspecificar(e.target.value)}
                        className="border rounded p-2 w-full mt-2"
                      />
                    )}
                  </div>

                  {/* Hábitos do Cliente */}
                  <h3 className="text-xl font-semibold mt-6">Hábitos do Cliente</h3>
                  <div>
                    <label className="block mb-2">Pratica atividades físicas?</label>
                    <select
                      value={habitos.atividadeFisica}
                      onChange={(e) => setHabitos({ ...habitos, atividadeFisica: e.target.value })}
                      className="border rounded p-2 w-full"
                    >
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                    {habitos.atividadeFisica === 'sim' && (
                      <input
                        type="text"
                        placeholder="Quais?"
                        className="border rounded p-2 w-full mt-2"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block mb-2">Consome álcool?</label>
                    <select
                      value={habitos.consomeAlcool}
                      onChange={(e) => setHabitos({ ...habitos, consomeAlcool: e.target.value })}
                      className="border rounded p-2 w-full"
                    >
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                    <div>
                    <label className="block mb-2">Fuma?</label>
                    <select
                      value={habitos.fuma}
                      onChange={(e) => setHabitos({ ...habitos, fuma: e.target.value })}
                      className="border rounded p-2 w-full"
                    >
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2">Nível de estresse:</label>
                    <select
                      value={habitos.nivelEstresse}
                      onChange={(e) => setHabitos({ ...habitos, nivelEstresse: e.target.value })}
                      className="border rounded p-2 w-full"
                    >
                      <option value="">Selecione</option>
                      <option value="baixo">Baixo</option>
                      <option value="medio">Médio</option>
                      <option value="alto">Alto</option>
                    </select>
                  </div>

                  {/* Saúde dos Pés */}
                  <h3 className="text-xl font-semibold mt-6">Saúde dos Pés</h3>
                  <div>
                    <label className="block mb-2">Sente dor nos pés? Em qual região?</label>
                    <input
                      type="text"
                      value={saudePes.dorPes}
                      onChange={(e) => setSaudePes({ ...saudePes, dorPes: e.target.value })}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Já teve calos, rachaduras, micoses ou verrugas plantares?</label>
                    <select
                      value={saudePes.calos}
                      onChange={(e) => setSaudePes({ ...saudePes, calos: e.target.value })}
                      className="border rounded p-2 w-full"
                    >
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2">Possui unhas encravadas ou deformadas?</label>
                    <select
                      value={saudePes.unhasEncravadas}
                      onChange={(e) => setSaudePes({ ...saudePes, unhasEncravadas: e.target.value })}
                      className="border rounded p-2 w-full"
                    >
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2">Sente formigamento, dormência ou queimação nos pés?</label>
                    <select
                      value={saudePes.formigamento}
                      onChange={(e) => setSaudePes({ ...saudePes, formigamento: e.target.value })}
                      className="border rounded p-2 w-full"
                    >
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2">Há alteração na coloração ou temperatura dos pés?</label>
                    <select
                      value={saudePes.alteracaoCor}
                      onChange={(e) => setSaudePes({ ...saudePes, alteracaoCor: e.target.value })}
                      className="border rounded p-2 w-full"
                    >
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>

                  {/* Avaliação Visual */}
                  <h3 className="text-xl font-semibold mt-6">Avaliação Visual (preenchida pelo profissional)</h3>
                  <div>
                    <label className="block mb-2">Pele:</label>
                    <input
                      type="text"
                      value={avaliacao.pele}
                      onChange={(e) => setAvaliacao({ ...avaliacao, pele: e.target.value })}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Unhas:</label>
                    <input
                      type="text"
                      value={avaliacao.unhas}
                      onChange={(e) => setAvaliacao({ ...avaliacao, unhas: e.target.value })}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Presença de calosidades, fissuras ou micoses?</label>
                    <input
                      type="text"
                      value={avaliacao.calosidades}
                      onChange={(e) => setAvaliacao({ ...avaliacao, calosidades: e.target.value })}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Tipo de pisada:</label>
                    <input
                      type="text"
                      value={avaliacao.tipoPisada}
                      onChange={(e) => setAvaliacao({ ...avaliacao, tipoPisada: e.target.value })}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Edemas (inchaços):</label>
                    <input
                      type="text"
                      value={avaliacao.edemas}
                      onChange={(e) => setAvaliacao({ ...avaliacao, edemas: e.target.value })}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Hidratação e sensibilidade da pele:</label>
                    <input
                      type="text"
                      value={avaliacao.hidratacao}
                      onChange={(e) => setAvaliacao({ ...avaliacao, hidratacao: e.target.value })}
                      className="border rounded p-2 w-full"
                    />
                  </div>

                  {/* Anexar Arquivos */}
                  <div>
                    <label className="block mb-2">Anexar Arquivos (fotos, PDFs):</label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="border rounded p-2 w-full"
                    />
                    <div className="mt-2">
                      {anexos.map((file, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{file.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-500 hover:underline"
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botões de Salvar e Cancelar */}
                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600"
                      onClick={() => {
                        // Lógica para cancelar (por exemplo, limpar campos ou redirecionar)
                        setIsModalOpen(false); // Fecha o modal
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </Modal>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default FuncionariosPage;