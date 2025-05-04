import React, { useState } from "react";
import Modal from "@/app/components/Modal/Modal"; // Importar seu componente de modal

interface ModalReagendamentoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (novaDataHora: string) => void;
}

const ModalReagendamento: React.FC<ModalReagendamentoProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [novaData, setNovaData] = useState<string>("");
  const [novaHora, setNovaHora] = useState<string>("");

  const horarios = [
    "09:00",
    "09:50",
    "10:40",
    "13:00",
    "13:50",
    "14:40",
    "15:30",
    "16:20",
  ];

  const handleConfirm = () => {
    if (!novaData || !novaHora) {
      alert("Por favor, selecione uma data e um horário.");
      return;
    }
    const novaDataHora = `${novaData}T${novaHora}:00`;
    onConfirm(novaDataHora);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-semibold mb-4">Reagendar Consulta</h2>
      <input
        type="date"
        className="w-full p-2 border rounded-lg mb-4"
        value={novaData}
        onChange={(e) => setNovaData(e.target.value)}
      />
      <h3 className="text-lg mb-2">Escolha o Horário</h3>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {horarios.map((hora) => (
          <button
            key={hora}
            className={`p-2 rounded-lg border text-center ${
              novaHora === hora ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-blue-100"
            }`}
            onClick={() => setNovaHora(hora)}
          >
            {hora}
          </button>
        ))}
      </div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        onClick={handleConfirm}
      >
        Confirmar Reagendamento
      </button>
    </Modal>
  );
};

export default ModalReagendamento;