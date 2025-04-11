"use client";

import React, { useState, useEffect } from "react";
import ModalConfirmacao from "../components/ModalConfirmacao";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Funcionario {
  id: number;
  nome: string;
}

interface Servico {
  id: number;
  nome: string;
  preco: number;
}

const FormularioAgendamento: React.FC<{ clienteId: number }> = ({
  clienteId,
}) => {
  const [passoAtual, setPassoAtual] = useState(0);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const horariosFixos: string[] = [
    "09:00",
    "09:50",
    "10:40",
    "11:30",
    "13:00",
    "13:50",
    "14:40",
    "15:30",
    "16:20",
    "17:10",
  ];

  const [detalhesAgendamento, setDetalhesAgendamento] = useState({
    funcionarioId: null as number | null, // Alterado para number | null
    funcionarioNome: "",
    servicoId: null as number | null, // Alterado para number | null
    servicoNome: "",
    data: "",
    horario: "",
    descricao: "",
  });

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [funcionariosRes, servicosRes] = await Promise.all([
          fetch("http://localhost:8080/api/usuarios/agendamento/funcionarios"),
          fetch("http://localhost:8080/api/servicos/listarServicos"),
        ]);
        const funcionariosData = await funcionariosRes.json();
        const servicosData = await servicosRes.json();

        setFuncionarios(funcionariosData);
        setServicos(servicosData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };
    fetchDados();
  }, []);

  useEffect(() => {
    const buscarHorariosDisponiveis = async () => {
      if (!detalhesAgendamento.data || !detalhesAgendamento.funcionarioId)
        return;

      try {
        const response = await fetch(
          `http://localhost:8080/api/agendamentos/disponiveis?data=${detalhesAgendamento.data}&funcionarioId=${detalhesAgendamento.funcionarioId}`
        );
        const ocupados: string[] = await response.json();

        const horariosFiltrados = horariosFixos.filter(
          (hora) => !ocupados.includes(hora)
        );
        setHorariosDisponiveis(horariosFiltrados);
      } catch (err) {
        console.error("Erro ao buscar horários ocupados:", err);
      }
    };

    buscarHorariosDisponiveis();
  }, [detalhesAgendamento.data, detalhesAgendamento.funcionarioId]);

  const avancarPasso = () => {
    if (passoAtual === 0 && detalhesAgendamento.funcionarioId === null)
      return alert("Escolha um funcionário");
    if (passoAtual === 1 && detalhesAgendamento.servicoId === null)
      return alert("Escolha um serviço");
    if (
      passoAtual === 2 &&
      (!detalhesAgendamento.data || !detalhesAgendamento.horario)
    )
      return alert("Escolha data e horário");

    setPassoAtual((prev) => prev + 1);
  };

  const voltarPasso = () => setPassoAtual((prev) => Math.max(prev - 1, 0));

  const handleConfirmarAgendamento = async () => {
    try {
      const agendamentoData = {
        clienteId: clienteId, // Usando o ID do cliente passado como prop
        funcionarioId: detalhesAgendamento.funcionarioId,
        servicoId: detalhesAgendamento.servicoId,
        dataHora: `${detalhesAgendamento.data}T${detalhesAgendamento.horario}:00`,
        descricao: detalhesAgendamento.descricao,
        status: "PENDENTE",
      };

      console.log("Enviando agendamento:", agendamentoData);

      const response = await fetch(
        "http://localhost:8080/api/agendamentos/criar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(agendamentoData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao salvar agendamento");
      }

      console.log("Agendamento salvo com sucesso");
      alert("Agendamento realizado!");
      setMostrarModal(false); // Fecha o modal apenas após sucesso
    } catch (error) {
      console.error("Erro ao agendar:", error);
      alert("Erro ao realizar agendamento.");
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl p-6 bg-white rounded-2xl shadow-lg border">
      {passoAtual === 0 && (
        <div>
          <h2 className="text-xl font-semibold">Escolha o Funcionário</h2>
          {funcionarios.map((func) => (
            <button
              key={func.id}
              className={`p-2 border rounded-lg w-full my-2 ${
                detalhesAgendamento.funcionarioId === func.id
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
              onClick={() =>
                setDetalhesAgendamento({
                  ...detalhesAgendamento,
                  funcionarioId: func.id,
                  funcionarioNome: func.nome,
                })
              }
            >
              {func.nome}
            </button>
          ))}
        </div>
      )}

      {passoAtual === 1 && (
        <div>
          <h2 className="text-xl font-semibold">Escolha o Serviço</h2>
          {servicos.map((servico) => (
            <button
              key={servico.id}
              className={`p-2 border rounded-lg w-full my-2 ${
                detalhesAgendamento.servicoId === servico.id
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
              onClick={() =>
                setDetalhesAgendamento({
                  ...detalhesAgendamento,
                  servicoId: servico.id,
                  servicoNome: servico.nome,
                })
              }
            >
              {servico.nome} - R$ {servico.preco.toFixed(2)}
            </button>
          ))}
        </div>
      )}

{passoAtual === 2 && (
  <div>
    <h2 className="text-xl font-semibold mb-2">Escolha a Data</h2>

    <DatePicker
      selected={
        detalhesAgendamento.data
          ? new Date(detalhesAgendamento.data)
          : null
      }
      onChange={(date: Date | null) => {
        if (!date) return;
        const dataFormatada = date.toISOString().split("T")[0];
        setDetalhesAgendamento({
          ...detalhesAgendamento,
          data: dataFormatada,
        });
      }}
      className="w-full p-2 border rounded-lg"
      dateFormat="dd/MM/yyyy"
      minDate={new Date()}
      placeholderText="Selecione uma data"
    />

    {detalhesAgendamento.data && (
      <>
        <h3 className="text-lg font-semibold mt-4 mb-2">
          Horários disponíveis
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {[
            "09:00", "09:50", "10:40", "11:30",
            "13:00", "13:50", "14:40", "15:30", "16:20", "17:10"
          ].map((hora) => (
            <button
              key={hora}
              className="p-2 border rounded-lg bg-gray-100 hover:bg-blue-100 transition"
            >
              {hora}
            </button>
          ))}
        </div>
      </>
    )}
  </div>
)}




      {passoAtual === 3 && (
        <div>
          <h2 className="text-xl font-semibold">Comentários Adicionais</h2>
          <textarea
            className="w-full p-2 border rounded-lg"
            value={detalhesAgendamento.descricao}
            onChange={(e) =>
              setDetalhesAgendamento({
                ...detalhesAgendamento,
                descricao: e.target.value,
              })
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
        {passoAtual < 3 ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={avancarPasso}
          >
            Próximo
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
            onClick={() => setMostrarModal(true)}
          >
            Confirmar
          </button>
        )}
      </div>

      {mostrarModal && (
        <ModalConfirmacao
          isOpen={mostrarModal}
          onClose={() => setMostrarModal(false)}
          onConfirm={handleConfirmarAgendamento}
          detalhes={{
            servicoId: detalhesAgendamento.servicoId,
            funcionario:
              detalhesAgendamento.funcionarioNome || "Não selecionado",
            cliente: "Nome do Cliente", // Aqui você pode substituir pelo nome real do cliente, se disponível
            data: detalhesAgendamento.data,
            horario: detalhesAgendamento.horario,
            outros: detalhesAgendamento.descricao,
          }}
          servicosList={servicos}
        />
      )}
    </div>
  );
};

export default FormularioAgendamento;
