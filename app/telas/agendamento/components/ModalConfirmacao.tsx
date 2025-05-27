interface ModalDetalhes {
  cliente: string;
  funcionario: string;
  servicoId: number | null;
  data: string;
  horario: string;
  outros?: string;
}

interface ServicoParaModal {
    id: number;
    nome: string;
}

interface ModalConfirmacaoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  detalhes: ModalDetalhes;
  servicosList: ServicoParaModal[]; 
  isEditing?: boolean; 
}

const ModalConfirmacao: React.FC<ModalConfirmacaoProps> = ({
  isOpen,
  onClose,
  onConfirm,
  detalhes,
  servicosList,
  isEditing,
}) => {
  if (!isOpen) return null;

  const servicoSelecionado = servicosList.find(s => s.id === detalhes.servicoId);
  const nomeServico = servicoSelecionado ? servicoSelecionado.nome : "Serviço não informado";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {isEditing ? "Confirmar Reagendamento?" : "Confirmar Agendamento?"}
        </h2>
        <div className="space-y-2 text-gray-700">
          <p><strong>Cliente:</strong> {detalhes.cliente}</p>
          <p><strong>Profissional:</strong> {detalhes.funcionario}</p>
          <p><strong>Serviço:</strong> {nomeServico}</p>
          <p><strong>Data:</strong> {detalhes.data ? new Date(detalhes.data + "T00:00:00").toLocaleDateString('pt-BR') : 'N/A'}</p>
          <p><strong>Horário:</strong> {detalhes.horario || 'N/A'}</p>
          {detalhes.outros && <p><strong>Observações:</strong> {detalhes.outros}</p>}
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-md transition-colors ${
              isEditing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isEditing ? "Reagendar" : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacao;