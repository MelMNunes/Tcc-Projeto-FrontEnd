// app/cliente/agendamento/pages/Passo4Detalhes.tsx

"use client";
import React from "react";

interface Passo4DetalhesProps {
    horario: string;
    onConfirmarAgendamento: () => void; // Tipo da função de callback
}

const Passo4Detalhes: React.FC<Passo4DetalhesProps> = ({ horario, onConfirmarAgendamento }) => {
    return (
        <div>
            <h2>4º - Confirme os detalhes do seu agendamento</h2>
            <p>Horário selecionado: {horario}</p>
            <button
                onClick={onConfirmarAgendamento}
                className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-200"
            >
                Confirmar Agendamento
            </button>
        </div>
    );
};

export default Passo4Detalhes;