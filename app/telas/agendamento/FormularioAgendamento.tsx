import { Dispatch, SetStateAction, useState, useEffect } from "react";
import ModalConfirmacao from "./components/ModalConfirmacao";

interface FormularioAgendamentoProps {
  passoAtual: number;
  setPassoAtual: Dispatch<SetStateAction<number>>;
}

const FormularioAgendamento: React.FC<FormularioAgendamentoProps> = ({
  passoAtual,
  setPassoAtual,
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [funcionarios, setFuncionarios] = useState<{ id: number; nome: string }[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/usuarios/agendamento/funcionarios")
      .then((res) => res.json())
      .then(setFuncionarios)
      .catch((err) => console.error("Erro ao carregar funcionários", err));
  }, []);

  const avancarPasso = () => setPassoAtual((prev) => Math.min(prev + 1, 4));
  const voltarPasso = () => setPassoAtual((prev) => Math.max(prev - 1, 0));

  const [detalhesAgendamento, setDetalhesAgendamento] = useState({
    funcionario: "",
    data: "",
    horario: "",
    outros: "",
  });

  const renderizarPasso = () => {
    return (
      <div className="space-y-4">
        {passoAtual === 0 && (
          <div>
            <h2 className="text-xl font-semibold">Escolha o Funcionário</h2>
            <select
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setDetalhesAgendamento((prev) => ({ ...prev, funcionario: e.target.value }))
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

        {passoAtual === 1 && (
          <div>
            <h2 className="text-xl font-semibold">Escolha a Data</h2>
            <input
              type="date"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setDetalhesAgendamento((prev) => ({ ...prev, data: e.target.value }))
              }
            />
          </div>
        )}

        {passoAtual === 2 && (
          <div>
            <h2 className="text-xl font-semibold">Escolha o Horário</h2>
            <input
              type="time"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setDetalhesAgendamento((prev) => ({ ...prev, horario: e.target.value }))
              }
            />
          </div>
        )}

        {passoAtual === 3 && (
          <div>
            <h2 className="text-xl font-semibold">Detalhes do Agendamento</h2>
            <textarea
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detalhes adicionais..."
              onChange={(e) =>
                setDetalhesAgendamento((prev) => ({ ...prev, outros: e.target.value }))
              }
            />
          </div>
        )}

        {passoAtual === 4 && <h2 className="text-xl font-semibold">Confirmação</h2>}

        <div className="flex justify-between border-t pt-4">
          {passoAtual > 0 && (
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition"
              onClick={voltarPasso}
            >
              Voltar
            </button>
          )}
          <button
            className={`px-4 py-2 rounded-lg shadow-md transition ${
              passoAtual === 4
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            onClick={passoAtual === 4 ? () => setMostrarModal(true) : avancarPasso}
          >
            {passoAtual === 4 ? "Confirmar" : "Próximo"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-2xl p-6 bg-white rounded-2xl shadow-lg border">
      {renderizarPasso()}
      {mostrarModal && (
        <ModalConfirmacao
          isOpen={mostrarModal}
          onClose={() => setMostrarModal(false)}
          onConfirm={() => {
            setMostrarModal(false);
            console.log("Agendamento confirmado!", detalhesAgendamento);
          }}
          detalhes={detalhesAgendamento}
        />
      )}
    </div>
  );
};

export default FormularioAgendamento;
