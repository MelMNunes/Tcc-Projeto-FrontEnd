"use client";
import React, { useState } from "react";
import Passo1EscolherProfissional from "./Passo1EscolherProfissional";
import Passo2EscolherDia from "./Passo2EscolherDia";
import Passo3EscolherHorario from "./Passo3EscolherHorario";
import Passo4Detalhes from "./Passo4Detalhes";
import { Profissional } from "./Passo1EscolherProfissional"  // Importação da classe ou interface

const Agendamento = () => {
  const [step, setStep] = useState(1);
  const [profissional, setProfissional] = useState<Profissional | null>(null);
  const [dia, setDia] = useState("");
  const [horario, setHorario] = useState("");

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrevious = () => setStep((prev) => prev - 1);

  const confirmarAgendamento = () => {
    if (profissional) {
      alert(`Agendamento confirmado com ${profissional.nome} em ${dia} às ${horario}`);
    }
    // Redirecionar ou realizar uma ação adicional
  };

  return (
    <div className="min-h-screen text-black flex flex-col items-center justify-center p-4 bg-gray-100">
      {step === 1 && (
        <Passo1EscolherProfissional
          onSelecionarProfissional={(prof: Profissional) => {
            setProfissional(prof);
            handleNext();
          }}
        />
      )}
      {step === 2 && profissional && (
        <Passo2EscolherDia
          profissional={profissional}
          onSelecionarDia={(date) => {
            setDia(date);
            handleNext();
          }}
        />
      )}
      {step === 3 && dia && (
        <Passo3EscolherHorario
          dia={dia}
          onSelecionarHorario={(time) => {
            setHorario(time);
            handleNext();
          }}
        />
      )}
      {step === 4 && horario && (
        <Passo4Detalhes
          horario={horario}
          onConfirmarAgendamento={confirmarAgendamento}
        />
      )}
      <div className="flex justify-between mt-4">
        {step > 1 && (
          <button
            onClick={handlePrevious}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Voltar
          </button>
        )}
        {step < 4 && (
          <button
            onClick={handleNext}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Avançar
          </button>
        )}
      </div>
    </div>
  );
};

export default Agendamento;
