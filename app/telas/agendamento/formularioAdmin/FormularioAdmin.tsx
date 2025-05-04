import { Dispatch, SetStateAction, useState, useEffect } from "react";
import ModalConfirmacao from "../components/ModalConfirmacao";

interface Agendamento {
  id: number;
  clienteId: number;
  funcionarioId: number;
  servicoId: number;
  dataHora: string;
  descricao: string;
  status: string;
}

interface Funcionario {
  id: number;
  nome: string;
}

interface Cliente {
  id: number;
  nome: string;
}

interface Servico {
  id: number;
  nome: string;
  preco: number;
}

interface FormularioAdminProps {
  passoAtual: number;
  setPassoAtual: Dispatch<SetStateAction<number>>;
  usuarioId: number;
  agendamento?: Agendamento;
}

const FormularioAdmin: React.FC<FormularioAdminProps> = ({
  passoAtual,
  setPassoAtual,
  agendamento,
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
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
    fetch("http://localhost:8080/api/usuarios/listar/CLIENTE") // Chame o endpoint para listar clientes
      .then((res) => res.json())
      .then(setClientes)
      .catch((err) => console.error("Erro ao carregar clientes:", err));

    // Carregar funcionários
    fetch("http://localhost:8080/api/usuarios/listar/FUNCIONARIO") // Chame o endpoint para listar funcionários
      .then((res) => res.json())
      .then(setFuncionarios)
      .catch((err) => console.error("Erro ao carregar funcionários:", err));

    // Carregar serviços
    fetch("http://localhost:8080/api/servicos/listarServicos")
      .then((res) => res.json())
      .then(setServicos)
      .catch((err) => console.error("Erro ao carregar serviços:", err));
  }, []);

  const avancarPasso = () => {
    if (passoAtual === 0 && detalhesAgendamento.servicoId === null) {
      alert("Por favor, selecione um serviço antes de continuar.");
      return;
    }
    if (passoAtual === 1 && detalhesAgendamento.clienteId === null) {
      alert("Por favor, selecione um cliente antes de continuar.");
      return;
    }
    if (passoAtual === 2 && detalhesAgendamento.funcionarioId === null) {
      alert("Por favor, selecione um funcionário antes de continuar.");
      return;
    }
    if (passoAtual === 3 && !detalhesAgendamento.data) {
      alert("Por favor, escolha uma data antes de continuar.");
      return;
    }
    if (passoAtual === 4 && !detalhesAgendamento.horario) {
      alert("Por favor, escolha um horário antes de continuar.");
      return;
    }
    if (passoAtual === 5 && !detalhesAgendamento.horario) {
      alert("Por favor, relate seus sintomas antes de continuar.");
      return;
    }
    setPassoAtual((prev) => Math.min(prev + 1, 5));
  };

  const voltarPasso = () => setPassoAtual((prev) => Math.max(prev - 1, 0));

  const handleServicoChange = (servicoId: number) => {
    setDetalhesAgendamento((prev) => ({
      ...prev,
      servicoId,
    }));
  };

  const handleClienteChange = (clienteId: number) => {
    setDetalhesAgendamento((prev) => ({
      ...prev,
      clienteId,
    }));
  };

  const handleFuncionarioChange = (funcionarioId: number) => {
    setDetalhesAgendamento((prev) => ({
      ...prev,
      funcionarioId,
    }));
  };

  const handleSubmit = async () => {
    const { data, horario, descricao, servicoId, clienteId, funcionarioId } =
      detalhesAgendamento;

    if (!data || !horario || !servicoId || !clienteId || !funcionarioId) {
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

      alert("Agendamento confirmado com sucesso!");

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
    <div className="flex flex-col w-full max-w-2xl p-6 bg-white rounded-2xl shadow-lg border">
      {passoAtual === 0 && (
        <div>
          <h2 className="text-xl font-semibold">Escolha o Serviço</h2>
          <div className="space-y-2">
            {servicos.length > 0 ? (
              servicos.map((servico) => (
                <label key={servico.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="servico"
                    value={servico.id}
                    checked={detalhesAgendamento.servicoId === servico.id}
                    onChange={() => handleServicoChange(servico.id)}
                    className="w-5 h-5"
                  />
                  <span>
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
          <h2 className="text-xl font-semibold">Escolha o Cliente</h2>
          <select
            className="w-full p-2 border rounded-lg"
            value={detalhesAgendamento.clienteId ?? ""}
            onChange={(e) => handleClienteChange(Number(e.target.value))}
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      {passoAtual === 2 && (
        <div>
          <h2 className="text-xl font-semibold">Escolha o Funcionário</h2>
          <select
            className="w-full p-2 border rounded-lg"
            value={detalhesAgendamento.funcionarioId ?? ""}
            onChange={(e) => handleFuncionarioChange(Number(e.target.value))}
          >
            <option value="">Selecione um funcionário</option>
            {funcionarios.map((funcionario) => (
              <option key={funcionario.id} value={funcionario.id}>
                {funcionario.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      {passoAtual === 3 && (
        <div>
          <h2 className="text-xl font-semibold">Escolha a Data</h2>
          <input
            type="date"
            className="w-full p-2 border rounded-lg"
            value={detalhesAgendamento.data}
            onChange={(e) =>
              setDetalhesAgendamento((prev) => ({
                ...prev,
                data: e.target.value,
              }))
            }
          />
        </div>
      )}

      {passoAtual === 4 && (
        <div>
          <h2 className="text-xl font-semibold">Escolha o Horário</h2>
          <input
            type="time"
            className="w-full p-2 border rounded-lg"
            value={detalhesAgendamento.horario}
            onChange={(e) =>
              setDetalhesAgendamento((prev) => ({
                ...prev,
                horario: e.target.value,
              }))
            }
          />
        </div>
      )}

      {passoAtual === 5 && (
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
            className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            onClick={voltarPasso}
          >
            Voltar
          </button>
        )}
        {passoAtual === 5 ? (
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            onClick={() => setMostrarModal(true)}
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
              funcionarios.find(
                (func) => func.id === detalhesAgendamento.funcionarioId
              )?.nome || "",
            cliente:
              clientes.find((cli) => cli.id === detalhesAgendamento.clienteId)
                ?.nome || "",
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

export default FormularioAdmin;
