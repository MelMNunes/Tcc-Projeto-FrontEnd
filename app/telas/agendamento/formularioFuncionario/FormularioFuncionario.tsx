import { Dispatch, SetStateAction, useState, useEffect } from "react";
import ModalConfirmacao from "../components/ModalConfirmacao";
// import CalendarioFuncionario from "./CalendarioFuncionario";

interface Agendamento {
  id: number;
  clienteId: number;
  funcionarioId: number;
  servicoId: number;
  dataHora: string;
  descricao: string;
  status: string;
}

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  tipoDeUsuario: string;
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

interface FormularioAgendamentoFuncionarioProps {
  passoAtual: number;
  setPassoAtual: Dispatch<SetStateAction<number>>;
  funcionarioId: number;
  agendamento?: Agendamento;
}

const FormularioAgendamentoFuncionario: React.FC<FormularioAgendamentoFuncionarioProps> = ({ 
  funcionarioId, agendamento }) => {
  const [passoAtual, setPassoAtual] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null);
  const [detalhesAgendamento, setDetalhesAgendamento] = useState({
    servicoId: agendamento?.servicoId ?? null,
    clienteId: agendamento?.clienteId ?? null,
    funcionarioId: agendamento?.funcionarioId ?? null,
    data: agendamento ? agendamento.dataHora.split("T")[0] : "",
    horario: agendamento
      ? new Date(agendamento.dataHora).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    descricao: agendamento?.descricao ?? "",
  });

  useEffect(() => {
    // Carregar clientes
    fetch("http://localhost:8080/api/usuarios/listar/CLIENTE")
      .then((res) => res.json())
      .then(setClientes)
      .catch((err) => console.error("Erro ao carregar clientes:", err));

    // Carregar funcionarios
    fetch("http://localhost:8080/api/usuarios/listar/FUNCIONARIO")
      .then((res) => res.json())
      .then(setFuncionarios)
      .catch((err) => console.error("Erro ao carregar funcionarios:", err));

    // Carregar serviços
    fetch("http://localhost:8080/api/servicos/listarServicos")
      .then((res) => res.json())
      .then(setServicos)
      .catch((err) => console.error("Erro ao carregar serviços:", err));
  }, []);

  useEffect(() => {
    // Carregar clientes
    fetch("http://localhost:8080/api/usuarios/listar/CLIENTE")
      .then((res) => res.json())
      .then(setClientes)
      .catch((err) => console.error("Erro ao carregar clientes:", err));
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredClientes(clientes);
    } else {
      setFilteredClientes(
        clientes.filter((cliente) =>
          cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, clientes]);

  const avancarPasso = () => {
    if (passoAtual === 0 && !detalhesAgendamento.servicoId) {
      alert("Por favor, selecione um serviço antes de continuar.");
      return;
    }
    if (passoAtual === 1 && !detalhesAgendamento.clienteId) {
      alert("Por favor, selecione um cliente antes de continuar.");
      return;
    }
    if (passoAtual === 2 && !detalhesAgendamento.data) {
      alert("Por favor, selecione uma data antes de continuar.");
      return;
    }
    if (passoAtual === 3 && !detalhesAgendamento.horario) {
      alert("Por favor, selecione um horário antes de continuar.");
      return;
    }

    setPassoAtual((prev) => Math.min(prev + 1, 4));
  };

  const voltarPasso = () => setPassoAtual((prev) => Math.max(prev - 1, 0));

  const handleServicoChange = (servicoId: number) => {
    setDetalhesAgendamento((prev) => ({
      ...prev,
      servicoId,
    }));
  };

  const handleClienteChange = (clienteId: number) => {
    setSelectedClienteId(clienteId); 
    setDetalhesAgendamento((prev) => ({
      ...prev,
      clienteId,
    }));
  };

  const handleSubmit = async () => {
    const { data, horario, descricao, servicoId, clienteId } =
      detalhesAgendamento;

    if (!data || !horario || !servicoId || !clienteId) {
      alert("Preencha todos os campos antes de continuar.");
      return;
    }

    const dataHoraCombinada = `${data}T${horario}:00`;

    const agendamentoData = {
      clienteId,
      funcionarioId,
      servicoId,
      dataHora: dataHoraCombinada,
      descricao,
      status: "PENDENTE",
    };

    console.log("Dados do agendamento:", agendamentoData);

    try {
      const url = agendamento
        ? `http://localhost:8080/api/agendamentos/${agendamento.id}`
        : "http://localhost:8080/api/agendamentos/criar";
      const metodo = agendamento ? "PUT" : "POST";

      const response = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agendamentoData),
      });

      const responseData = await response.json();
      console.log("Agendamento salvo com sucesso:", responseData);
      setMostrarModal(true);
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
    }
  };

  const handleConfirmarAgendamento = async () => {
    await handleSubmit();
    setMostrarModal(false);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl p-6 bg-white rounded-2xl shadow-lg border text-black">
      {passoAtual === 0 && (
        <div className="text-black">
          <h2 className="text-2xl font-semibold mb-4">Escolha o Serviço</h2>
          <div className="space-y-2 ">
            {servicos.length > 0 ? (
              servicos.map((servico) => (
                <label key={servico.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="servico"
                    value={servico.id}
                    checked={detalhesAgendamento.servicoId === servico.id}
                    onChange={() => handleServicoChange(servico.id)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-black">
                    {servico.nome} - R$ {servico.preco.toFixed(2)}
                  </span>
                </label>
              ))
            ) : (
              <p>Carregando serviços...</p>
            )}
          </div>
        </div>
      )}

      {passoAtual === 1 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Escolha o Cliente</h2>

          {/* Barra de pesquisa */}
          <input
            type="text"
            placeholder="Pesquisar pelo nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded mb-4 w-full"
          />

          {/* Lista de clientes filtrados */}
          {filteredClientes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClientes.map((cliente) => (
                <div
                  key={cliente.id}
                  className={`p-4 border rounded-lg shadow cursor-pointer ${
                    selectedClienteId === cliente.id
                      ? "bg-blue-200" // Cliente selecionado
                      : "hover:bg-blue-100"
                  }`}
                  onClick={() => handleClienteChange(cliente.id)} // Seleção do cliente
                >
                  <h3 className="text-xl font-semibold">{cliente.nome}</h3>
                  <p>
                    <strong>Email:</strong> {cliente.email}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {cliente.telefone}
                  </p>
                  <p>
                    <strong>CPF:</strong> {cliente.cpf}
                  </p>
                  <p>
                    <strong>Tipo de Usuário:</strong> {cliente.tipoDeUsuario}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Nenhum cliente encontrado.</p>
          )}

          {/* Exibição do nome do cliente selecionado */}
          {selectedClienteId && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Cliente Selecionado:</h3>
              <p>
                {
                  clientes.find((cliente) => cliente.id === selectedClienteId)
                    ?.nome
                }
              </p>
            </div>
          )}
        </div>
      )}

      {passoAtual === 2 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Escolha a Data</h2>
          <input
            type="date"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={detalhesAgendamento.data}
            onChange={(e) =>
              setDetalhesAgendamento((prev) => ({
                ...prev,
                data: e.target.value,
                horario: "", // Resetar horário ao mudar a data
              }))
            }
          />
        </div>
      )}

      {passoAtual === 3 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Escolha o Horário</h2>

          <div className="grid grid-cols-3 gap-2">
            {[
              "09:00",
              "09:50",
              "10:40",
              "13:00",
              "13:50",
              "14:40",
              "15:30",
              "16:20",
            ].map((hora) => (
              <button
                key={hora}
                className={`p-2 rounded-lg border text-center ${
                  detalhesAgendamento.horario === hora
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-blue-100"
                }`}
                onClick={() =>
                  setDetalhesAgendamento((prev) => ({ ...prev, horario: hora }))
                }
              >
                {hora}
              </button>
            ))}
          </div>
        </div>
      )}

      {passoAtual === 4 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Detalhes do Agendamento
          </h2>
          <textarea
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Detalhes adicionais..."
            value={detalhesAgendamento.descricao}
            onChange={(e) =>
              setDetalhesAgendamento((prev) => ({
                ...prev,
                descricao: e.target.value,
              }))
            }
          />
        </div>
      )}

      <div className="flex justify-between border-t pt-4">
        {passoAtual > 0 && (
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            onClick={voltarPasso}
          >
            Voltar
          </button>
        )}
        {passoAtual === 4 ? (
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            onClick={() => setMostrarModal(true)} // Abre o modal ao confirmar
          >
            Confirmar Agendamento
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            onClick={avancarPasso}
          >
            Próximo
          </button>
        )}
      </div>

      {mostrarModal && (
        <ModalConfirmacao
          isOpen={mostrarModal}
          onClose={() => setMostrarModal(false)}
          onConfirm={handleConfirmarAgendamento}
          detalhes={{
            servicoId: detalhesAgendamento.servicoId,
            funcionario:
              funcionarios.find((func) => func.id === funcionarioId)?.nome ||
              "Funcionário Não Encontrado",
            cliente:
              clientes.find((cli) => cli.id === detalhesAgendamento.clienteId)
                ?.nome || "Cliente Não Encontrado",
            data: detalhesAgendamento.data,
            horario: detalhesAgendamento.horario,
            outros: detalhesAgendamento.descricao,
          }}
          
          servicosList={servicos}
          
        />
      )}
    </div>
  );
};

export default FormularioAgendamentoFuncionario;
