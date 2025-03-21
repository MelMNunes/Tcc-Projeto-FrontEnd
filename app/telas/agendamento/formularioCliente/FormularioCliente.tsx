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

interface Servico {
  id: number;
  nome: string;
  preco: number;
}

interface FormularioAgendamentoProps {
  passoAtual: number;
  setPassoAtual: Dispatch<SetStateAction<number>>;
  clienteId: number;
  agendamento?: Agendamento;
}

const FormularioCliente: React.FC<FormularioAgendamentoProps> = ({
  passoAtual,
  setPassoAtual,
  clienteId,
  agendamento,
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  // const [agendamentoConfirmado, setAgendamentoConfirmado] = useState(false);

  const [detalhesAgendamento, setDetalhesAgendamento] = useState({
    servicoId: agendamento?.servicoId ?? null,
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
    const fetchDados = async () => {
      try {
        const [funcionariosRes, servicosRes] = await Promise.all([
          fetch("http://localhost:8080/api/usuarios/agendamento/funcionarios"),
          fetch("http://localhost:8080/api/servicos/listarServicos"),
        ]);
        setFuncionarios(await funcionariosRes.json());
        setServicos(await servicosRes.json());
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };
    fetchDados();
  }, []);

  const avancarPasso = () => {
    if (passoAtual === 0 && !detalhesAgendamento.servicoId) {
      alert("Por favor, selecione um serviço antes de continuar.");
      return;
    }
    if (passoAtual === 1 && !detalhesAgendamento.funcionarioId) {
      alert("Por favor, selecione um funcionário antes de continuar.");
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
    setDetalhesAgendamento((prev) => ({ ...prev, servicoId }));
  };

  const handleSubmit = async () => {
    const { data, horario, descricao, servicoId, funcionarioId } =
      detalhesAgendamento;

    if (!data || !horario || !servicoId || !funcionarioId) {
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

    try {
      const url = agendamento
        ? `http://localhost:8080/api/agendamentos/${agendamento.id}`
        : "http://localhost:8080/api/agendamentos/criar";
      const metodo = agendamento ? "PUT" : "POST";

      const response = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamentoData),
      });

      if (!response.ok) throw new Error("Erro ao salvar agendamento");

      console.log("Agendamento salvo com sucesso");
      setMostrarModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmarAgendamento = async () => {
    await handleSubmit();
    setMostrarModal(false);
    // setAgendamentoConfirmado(true);
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
                  <span>{servico.nome} - R$ {servico.preco.toFixed(2)}</span>
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
          <h2 className="text-xl font-semibold">Escolha o Funcionário</h2>
          <select
            className="w-full p-2 border rounded-lg"
            value={detalhesAgendamento.funcionarioId ?? ""}
            onChange={(e) =>
              setDetalhesAgendamento((prev) => ({
                ...prev,
                funcionarioId: Number(e.target.value),
              }))
            }
          >
            <option value="">Selecione um funcionário</option>
            {funcionarios.map((func) => (
              <option key={func.id} value={func.id}>
                {func.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      {passoAtual === 2 && (
        <div>
          <h2 className="text-xl font-semibold">Escolha a Data</h2>
          <input
            type="date"
            className="w-full p-2 border rounded-lg"
            value={detalhesAgendamento.data}
            onChange={(e) =>
              setDetalhesAgendamento((prev) => ({ ...prev, data: e.target.value }))
            }
          />
        </div>
      )}

      {passoAtual === 3 && (
        <div>
          <h2 className="text-xl font-semibold">Escolha o Horário</h2>
          <input
            type="time"
            className="w-full p-2 border rounded-lg"
            value={detalhesAgendamento.horario}
            onChange={(e) =>
              setDetalhesAgendamento((prev) => ({ ...prev, horario: e.target.value }))
            }
          />
        </div>
      )}

      <div className="flex justify-between border-t pt-4">
        {passoAtual > 0 && (
          <button className="px-4 py-2 bg-gray-400 text-white rounded-lg" onClick={voltarPasso}>
            Voltar
          </button>
        )}
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          onClick={passoAtual === 4 ? () => setMostrarModal(true) : avancarPasso}
        >
          {passoAtual === 4 ? "Confirmar Agendamento" : "Próximo"}
        </button>
      </div>

      {mostrarModal && (
        <ModalConfirmacao isOpen={mostrarModal} onClose={() => setMostrarModal(false)} onConfirm={handleConfirmarAgendamento} />
      )}
    </div>
  );
};

export default FormularioCliente;
