interface ModalConfirmacaoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>; // Modificado para suportar async
  detalhes: {
    servicoId: number | null;
    funcionario: string;
    cliente: string;
    data: string;
    horario: string;
    outros: string;
  };
  servicosList: { id: number; nome: string; preco: number }[];
}

const ModalConfirmacao = ({
  isOpen,
  onClose,
  onConfirm,
  detalhes,
  servicosList,
}: ModalConfirmacaoProps) => {
  if (!isOpen) return null; // Se o modal não estiver aberto, não renderiza nada

  const servico = servicosList.find((s) => s.id === detalhes.servicoId);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Confirmação de Agendamento</h2>
        <p>
          <strong>Serviço Escolhido:</strong>
        </p>
        <ul className="list-disc list-inside">
          {servico ? (
            <li>{`${servico.nome} - R$ ${servico.preco.toFixed(2)}`}</li>
          ) : (
            <li>Serviço não encontrado</li>
          )}
        </ul>
        <p>
          <strong>Funcionário:</strong> {detalhes.funcionario}
        </p>
        <p>
          <strong>Data:</strong> {detalhes.data}
        </p>
        <p>
          <strong>Horário:</strong> {detalhes.horario}
        </p>
        <p>
          <strong>Detalhes:</strong> {detalhes.outros}
        </p>
        <div className="flex justify-end mt-4 gap-2">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
            onClick={onClose} // Fecha o modal ao clicar em Cancelar
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
            onClick={async () => {
              await onConfirm(); // Aguarda a requisição ser concluída antes de fechar o modal
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacao;
