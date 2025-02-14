// app/cliente/agendamento/pages/Passo3EscolherHorario.tsx
"use client";
import React from "react";

type Passo3EscolherHorarioProps = {
    dia: string; // Tipo da prop dia
    onSelecionarHorario: (horario: string) => void; // Tipo da função de callback
};

const horariosDisponiveis = [
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
];

const Passo3EscolherHorario: React.FC<Passo3EscolherHorarioProps> = ({ dia, onSelecionarHorario }) => {
    const [horarioSelecionado, setHorarioSelecionado] = React.useState("");

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setHorarioSelecionado(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSelecionarHorario(horarioSelecionado);
    };

    return (
        <div>
            <h2>3º - Selecione o horário desejado para o atendimento no dia {dia}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    value={horarioSelecionado}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Selecione um horário</option>
                    {horariosDisponiveis.map((horario) => (
                        <option key={horario} value={horario}>{horario}</option>
                    ))}
                </select>
                <button
                    type="submit"
                    disabled={!horarioSelecionado}
                    className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Continuar
                </button>
            </form>
        </div>
    );
};

export default Passo3EscolherHorario;