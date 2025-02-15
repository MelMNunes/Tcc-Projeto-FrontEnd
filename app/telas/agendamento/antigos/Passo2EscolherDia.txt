"use client";

import React, { useState } from "react";

interface Profissional {
  id: number;
  nome: string;
}

interface Passo2EscolherDiaProps {
  profissional: Profissional;
  onSelecionarDia: (date: string) => void;
}

const Passo2EscolherDia: React.FC<Passo2EscolherDiaProps> = ({
  profissional,
  onSelecionarDia,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    onSelecionarDia(date); // Chama a função que recebe a data
  };

  // Função para gerar dias fictícios de um mês
  const generateFakeCalendar = () => {
    const daysInMonth = 30; // Vamos gerar um mês fictício com 30 dias
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = `2025-01-${i.toString().padStart(2, "0")}`;
      days.push(date);
    }
    return days;
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">
        2º - Selecione o dia desejado para o profissional{" "}
        {profissional.nome}
      </h2>
      <div className="grid grid-cols-7 gap-2">
        {/* Cabeçalho do calendário (dias da semana) */}
        <div className="font-semibold text-center">Dom</div>
        <div className="font-semibold text-center">Seg</div>
        <div className="font-semibold text-center">Ter</div>
        <div className="font-semibold text-center">Qua</div>
        <div className="font-semibold text-center">Qui</div>
        <div className="font-semibold text-center">Sex</div>
        <div className="font-semibold text-center">Sáb</div>

        {/* Gerando dias fictícios do mês */}
        {generateFakeCalendar().map((date) => (
          <button
            key={date}
            className={`p-2 text-center rounded ${
              selectedDate === date ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleDateClick(date)}
          >
            {date.slice(-2)} {/* Exibe apenas o dia (últimos dois caracteres da data) */}
          </button>
        ))}
      </div>

      {selectedDate && (
        <div className="mt-4 text-center text-xl text-blue-600">
          Você selecionou: {selectedDate}
        </div>
      )}
    </div>
  );
};

export default Passo2EscolherDia;
