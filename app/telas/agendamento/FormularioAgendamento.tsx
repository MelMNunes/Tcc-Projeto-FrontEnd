// FormularioAgendamento.tsx
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import ModalConfirmacao from "./components/ModalConfirmacao";

interface FormularioAgendamentoProps {
  passoAtual: number;
  setPassoAtual: Dispatch<SetStateAction<number>>;
  clienteId: number; // Receba o clienteId como prop
}

const FormularioAgendamento: React.FC<FormularioAgendamentoProps> = ({
  passoAtual,
  setPassoAtual,
  clienteId, // Receba o clienteId como prop
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [funcionarios, setFuncionarios] = useState<{ id: number; nome: string }[]>([]);
  const [servicos, setServicos] = useState<{ id: number; nome: string; preco: number }[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/usuarios/agendamento/funcionarios")
      .then((res) => res.json())
      .then(setFuncionarios)
      .catch((err) => console.error("Erro ao carregar funcionários", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/servicos/listarServicos")
      .then((res) => res.json())
      .then(setServicos)
      .catch((err) => console.error("Erro ao carregar serviços", err));
  }, []);

  const [detalhesAgendamento, setDetalhesAgendamento] = useState({
    servicoId: null as number | null, // Armazena o ID do serviço selecionado
    funcionario: "",
    data: "",
    horario: "",
    outros: "",
  });

  const handleServicoChange = (servicoId: number) => {
    setDetalhesAgendamento((prev) => ({
      ...prev,
      servicoId, // Atualiza o ID do serviço selecionado
    }));
  };

  const avancarPasso = () => {
    if (passoAtual === 0 && detalhesAgendamento.servicoId === null) {
      alert("Por favor, selecione um serviço antes de continuar.");
      return;
    }
    setPassoAtual((prev) => Math.min(prev + 1, 4));
  };

  const voltarPasso = () => setPassoAtual((prev) => Math.max(prev - 1, 0));

  const criarAgendamento = async () => {
    const { data, horario, outros, servicoId } = detalhesAgendamento;

    // Combine a data e a hora em um formato ISO 8601
    const dataHoraCombinada = `${data}T${horario}:00`;

    const funcionarioId = funcionarios.find(func => func.nome === detalhesAgendamento.funcionario)?.id;

    const agendamentoData = {
      clienteId: clienteId, // Use o clienteId recebido como prop
      funcionarioId: funcionarioId, // Obtenha o ID do funcionário
      servicoId: servicoId, // Envie o ID do serviço selecionado
      dataHora: dataHoraCombinada,
      descricao: outros,
      status: "PENDENTE",
    };

    console.log("Dados do agendamento:", agendamentoData); // Verifique os dados que estão sendo enviados

    try {
      const response = await fetch("http://localhost:8080/api/agendamentos/criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agendamentoData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Tente obter a resposta de erro
        console.error("Erro ao criar agendamento:", errorData);
        throw new Error("Erro ao criar agendamento");
      }

      const data = await response.json();
      console.log("Agendamento criado com sucesso:", data);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
    }
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
                    name="servico" // Use radio buttons para selecionar apenas um serviço
                    value={servico.id}
                    checked={detalhesAgendamento.servicoId === servico.id} // Verifica se o ID está selecionado
                    onChange={() => handleServicoChange(servico.id)} // Passa o ID para a função
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
          <h2 className="text-xl font-semibold">Escolha o Funcionário</h2>
          <select
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setDetalhesAgendamento((prev) => ({
                ...prev,
                funcionario: e.target.value,
              }))
            }
          >
            <option value="">Selecione um funcionário</option>
            {funcionarios.length > 0 ? (
              funcionarios.map((func) => (
                <option key={func.id} value={func.nome}>
                  {func.nome}
                </option>
              ))
            ) : (
              <option disabled>Carregando...</option>
            )}
          </select>
        </div>
      )}

      {passoAtual === 2 && (
        <div>
          <h2 className="text-xl font-semibold">Escolha a Data</h2>
          <input
            type="date"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setDetalhesAgendamento((prev) => ({
                ...prev,
                data: e.target.value,              }))
              }
            />
          </div>
        )}
  
        {passoAtual === 3 && (
          <div>
            <h2 className="text-xl font-semibold">Escolha o Horário</h2>
            <input
              type="time"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setDetalhesAgendamento((prev) => ({
                  ...prev,
                  horario: e.target.value,
                }))
              }
            />
          </div>
        )}
  
        {passoAtual === 4 && (
          <div>
            <h2 className="text-xl font-semibold">Detalhes do Agendamento</h2>
            <textarea
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detalhes adicionais..."
              onChange={(e) =>
                setDetalhesAgendamento((prev) => ({
                  ...prev,
                  outros: e.target.value,
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
  
          {passoAtual === 4 ? (
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              onClick={() => setMostrarModal(true)}
            >
              Ver Detalhes da Consulta
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
            onConfirm={() => {
              setMostrarModal(false);
              criarAgendamento(); // Chama a função para criar o agendamento
            }}
            detalhes={{
              servicoId: detalhesAgendamento.servicoId, // Passa o ID do serviço
              funcionario: detalhesAgendamento.funcionario,
              data: detalhesAgendamento.data,
              horario: detalhesAgendamento.horario,
              outros: detalhesAgendamento.outros,
            }}
            servicosList={servicos} // Passa a lista de serviços para o modal
          />
        )}
      </div>
    );
  };
  
  export default FormularioAgendamento;