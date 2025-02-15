// import { useState } from "react";

interface ModalConfirmacaoProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    detalhes: {
      funcionario: string;
      data: string;
      horario: string;
      outros: string;
    };
  }
  
  const ModalConfirmacao = ({ isOpen, onClose, onConfirm, detalhes }: ModalConfirmacaoProps) => {
    if (!isOpen) return null;
  
    return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Confirmação de Agendamento</h2>
        <p><strong>Funcionário:</strong> {detalhes.funcionario}</p>
        <p><strong>Data:</strong> {detalhes.data}</p>
        <p><strong>Horário:</strong> {detalhes.horario}</p>
        <p><strong>Detalhes:</strong> {detalhes.outros}</p>
        <div className="flex justify-end mt-4 gap-2">
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={onClose}>Cancelar</button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg" onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacao;
