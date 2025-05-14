"use client";

import { useState, useEffect } from "react";
import ModalConfirmacao from "../components/ModalConfirmacao";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from 'date-fns/locale/pt-BR';

registerLocale('pt-BR', ptBR);

interface Agendamento {
  id: number;
  clienteId: number;
  funcionarioId: number;
  servicoId: number;
  dataHora: string;
  descricao: string;
  status: string;
  clienteNome?: string;
  servicoNome?: string;
}

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  tipoDeUsuario: string;
}

// Interface Funcionario não é necessária aqui se não listamos funcionários
// interface Funcionario {
//   id: number;
//   nome: string;
// }

interface Servico {
  id: number;
  nome: string;
  preco: number;
}

interface FormularioAgendamentoFuncionarioProps {
  funcionarioId: number;
  funcionarioNome: string; // Nome do funcionário para exibição no modal
  agendamento?: Agendamento | null;
  onOperacaoConcluida?: () => void;
}

const FormularioAgendamentoFuncionario: React.FC<FormularioAgendamentoFuncionarioProps> = ({
  funcionarioId,
  funcionarioNome, // Recebendo o nome do funcionário
  agendamento,
  onOperacaoConcluida,
}) => {
  const [passoAtual, setPassoAtual] = useState(0);
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null);
  const [loadingDados, setLoadingDados] = useState(true);

  const [detalhesAgendamento, setDetalhesAgendamento] = useState({
    servicoId: null as number | null,
    clienteId: null as number | null,
    data: "",
    horario: "",
    descricao: "",
  });

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      setLoadingDados(true);
      try {
        const [clientesRes, servicosRes] = await Promise.all([
          fetch("http://localhost:8080/api/usuarios/listar/CLIENTE"),
          fetch("http://localhost:8080/api/servicos/listar"),
        ]);

        if (!clientesRes.ok) throw new Error('Falha ao carregar clientes');
        if (!servicosRes.ok) throw new Error('Falha ao carregar serviços');

        const clientesData: Cliente[] = await clientesRes.json();
        const servicosData: Servico[] = await servicosRes.json();

        setClientes(clientesData);
        setServicos(servicosData);
        setFilteredClientes(clientesData);

      } catch (err) {
        console.error("Erro ao carregar dados iniciais do formulário:", err);
      } finally {
        setLoadingDados(false);
      }
    };
    carregarDadosIniciais();
  }, []);

  useEffect(() => {
    if (agendamento) {
      setDetalhesAgendamento({
        servicoId: agendamento.servicoId ?? null,
        clienteId: agendamento.clienteId ?? null,
        data: agendamento.dataHora ? agendamento.dataHora.split("T")[0] : "",
        horario: agendamento.dataHora
          ? new Date(agendamento.dataHora).toLocaleTimeString('pt-BR', {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        descricao: agendamento.descricao ?? "",
      });
      setSelectedClienteId(agendamento.clienteId ?? null);
      setPassoAtual(0);
    } else {
      setDetalhesAgendamento({
        servicoId: null,
        clienteId: null,
        data: "",
        horario: "",
        descricao: "",
      });
      setSelectedClienteId(null);
      setPassoAtual(0);
    }
  }, [agendamento]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredClientes(clientes);
    } else {
      setFilteredClientes(
        clientes.filter((cliente) =>
          cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, clientes]);

  useEffect(() => {
    if (!detalhesAgendamento.data || !funcionarioId) {
        setHorariosOcupados([]);
        return;
    }

    const fetchAgendamentosDoDia = async () => {
      try {
        const diaISO = detalhesAgendamento.data;
        const res = await fetch(
          `http://localhost:8080/api/agendamentos/funcionarios/${funcionarioId}/dia/${diaISO}`
        );
        if (!res.ok) {
            if (res.status === 404) {
                setHorariosOcupados([]);
                return;
            }
            throw new Error('Falha ao buscar horários');
        }
        const lista: Pick<Agendamento, 'dataHora'>[] = await res.json();
        const ocupados = lista.map((a) =>
          new Date(a.dataHora).toLocaleTimeString('pt-BR', {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setHorariosOcupados(ocupados);
      } catch(err) {
        console.error("Erro ao buscar horários ocupados:", err);
        setHorariosOcupados([]);
      }
    };
    fetchAgendamentosDoDia();
  }, [detalhesAgendamento.data, funcionarioId]);

  const avancarPasso = () => {
    if (passoAtual === 0 && !detalhesAgendamento.servicoId) {
      alert("Por favor, selecione um serviço."); return;
    }
    if (passoAtual === 1 && !detalhesAgendamento.clienteId) {
      alert("Por favor, selecione um cliente."); return;
    }
    if (passoAtual === 2 && !detalhesAgendamento.data) {
      alert("Por favor, selecione uma data."); return;
    }
    if (passoAtual === 3 && !detalhesAgendamento.horario) {
      alert("Por favor, selecione um horário."); return;
    }
    setPassoAtual((prev) => Math.min(prev + 1, 4));
  };

  const voltarPasso = () => setPassoAtual((prev) => Math.max(prev - 1, 0));

  const handleServicoChange = (servicoId: number) => {
    setDetalhesAgendamento((prev) => ({ ...prev, servicoId }));
  };

  const handleClienteChange = (clienteId: number) => {
    setSelectedClienteId(clienteId);
    setDetalhesAgendamento((prev) => ({ ...prev, clienteId }));
  };

  const handleSubmit = async () => {
    const { data, horario, descricao, servicoId, clienteId: agClienteId } = detalhesAgendamento;

    if (!data || !horario || !servicoId || !agClienteId) {
      alert("Preencha todos os campos obrigatórios (Serviço, Cliente, Data e Horário).");
      setMostrarModal(false);
      return;
    }

    const dataHoraCombinada = `${data}T${horario}:00`;

    const agendamentoDataPayload = {
      clienteId: agClienteId,
      funcionarioId: funcionarioId,
      servicoId,
      dataHora: dataHoraCombinada,
      descricao,
      status: "PENDENTE",
    };

    try {
      const url = agendamento?.id
        ? `http://localhost:8080/api/agendamentos/${agendamento.id}`
        : "http://localhost:8080/api/agendamentos/criar";
      const metodo = agendamento?.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamentoDataPayload),
      });

      if (!response.ok) {
        const errorBody = await response.text(); // Tenta pegar o corpo do erro
        throw new Error(`Erro ao salvar agendamento: ${errorBody || response.status}`);
      }

      alert(`Agendamento ${agendamento?.id ? 'atualizado' : 'realizado'} com sucesso!`);
      setMostrarModal(false);
      onOperacaoConcluida?.();

    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      alert(`Erro ao realizar o agendamento: ${(error as Error).message}. Tente novamente.`);
      setMostrarModal(false);
    }
  };

  const horariosPadrao = [
    "09:00", "09:50", "10:40", "11:30", "13:00", "13:50", "14:40", "15:30", "16:20", "17:10",
  ];

  if (loadingDados) {
      return <div className="text-center p-10 text-gray-600">Carregando dados do formulário...</div>;
  }

  return (
    <div className="flex flex-col w-full p-6 bg-white rounded-2xl shadow-xl border text-black">
      {passoAtual === 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">1. Escolha o Serviço</h2>
          <div className="space-y-3">
            {servicos.length > 0 ? (
              servicos.map((servico) => (
                <button
                  key={servico.id}
                  onClick={() => handleServicoChange(servico.id)}
                  className={`w-full flex justify-between items-center p-4 border rounded-lg text-left transition-all duration-150 ease-in-out transform hover:scale-105 ${
                    detalhesAgendamento.servicoId === servico.id
                      ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
                      : "bg-gray-50 hover:bg-blue-100 text-gray-800"
                  }`}
                >
                  <span>{servico.nome}</span>
                  <span className="font-semibold text-sm">R$ {servico.preco.toFixed(2)}</span>
                </button>
              ))
            ) : (
              <p className="text-gray-500">Nenhum serviço encontrado.</p>
            )}
          </div>
        </div>
      )}

      {passoAtual === 1 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">2. Escolha o Cliente</h2>
          <input
            type="text"
            placeholder="Pesquisar cliente pelo nome..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="border p-3 rounded-lg mb-6 w-full focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
          {filteredClientes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
              {filteredClientes.map((cliente) => (
                <div
                  key={cliente.id}
                  className={`p-4 border rounded-lg shadow-sm cursor-pointer transition-all duration-150 ease-in-out transform hover:scale-105 ${
                    selectedClienteId === cliente.id
                      ? "bg-blue-600 text-white ring-2 ring-blue-400"
                      : "bg-gray-50 hover:bg-blue-100 text-gray-800"
                  }`}
                  onClick={() => handleClienteChange(cliente.id)}
                >
                  <h3 className="text-xl font-semibold">{cliente.nome}</h3>
                  <p className="text-sm">Email: {cliente.email}</p>
                  <p className="text-sm">Telefone: {cliente.telefone}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhum cliente encontrado com o termo "{searchTerm}".</p>
          )}
          {selectedClienteId && (
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-700">Cliente Selecionado:</h3>
              <p className="text-blue-600">
                {clientes.find((c) => c.id === selectedClienteId)?.nome}
              </p>
            </div>
          )}
        </div>
      )}

      {passoAtual === 2 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">3. Escolha a Data</h2>
           <DatePicker
              selected={detalhesAgendamento.data ? new Date(detalhesAgendamento.data + "T00:00:00") : null}
              onChange={(date: Date | null) => {
                if (date) {
                  const dataFormatada = date.toISOString().split("T")[0];
                  setDetalhesAgendamento((prev) => ({
                    ...prev,
                    data: dataFormatada,
                    horario: "",
                  }));
                } else {
                    setDetalhesAgendamento(prev => ({ ...prev, data: "", horario: ""}));
                }
              }}
              inline
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              minDate={new Date()}
              locale="pt-BR"
              dateFormat="dd/MM/yyyy"
            />
        </div>
      )}

      {passoAtual === 3 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">4. Escolha o Horário</h2>
          {detalhesAgendamento.data ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {horariosPadrao.map((hora) => {
              const ocupado = horariosOcupados.includes(hora);
              return (
                <button
                  key={hora}
                  onClick={() =>
                    !ocupado &&
                    setDetalhesAgendamento((prev) => ({ ...prev, horario: hora }))
                  }
                  disabled={ocupado}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all duration-150 ease-in-out ${
                    ocupado
                      ? "bg-red-100 text-red-500 cursor-not-allowed line-through"
                      : detalhesAgendamento.horario === hora
                      ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
                      : "bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-sm"
                  }`}
                >
                  {hora}
                </button>
              );
            })}
            {horariosPadrao.every(h => horariosOcupados.includes(h)) && horariosPadrao.length > 0 &&
              <p className="col-span-full text-orange-500 mt-2">Todos os horários para esta data e profissional estão ocupados.</p>
            }
          </div>
          ) : (
            <p className="text-gray-500">Por favor, selecione uma data no passo anterior.</p>
          )}
        </div>
      )}

      {passoAtual === 4 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">5. Observações (Opcional)</h2>
          <textarea
            className="w-full p-3 border rounded-lg h-28 focus:ring-2 focus:ring-blue-500 transition-shadow"
            placeholder="Alguma observação para este agendamento?"
            value={detalhesAgendamento.descricao}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => // Tipagem para textarea
              setDetalhesAgendamento((prev) => ({ ...prev, descricao: e.target.value }))
            }
          />
        </div>
      )}

      <div className="flex justify-between border-t pt-6 mt-8">
        <button
          className={`px-6 py-3 rounded-lg transition-colors text-white font-medium ${
            passoAtual === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600'
          }`}
          onClick={voltarPasso}
          disabled={passoAtual === 0}
        >
          Voltar
        </button>

        {passoAtual < 4 ? (
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            onClick={avancarPasso}
          >
            Próximo
          </button>
        ) : (
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            onClick={() => setMostrarModal(true)}
          >
            {agendamento?.id ? "Confirmar Reagendamento" : "Confirmar Agendamento"}
          </button>
        )}
      </div>

      {mostrarModal && (
        <ModalConfirmacao
          isOpen={mostrarModal}
          onClose={() => setMostrarModal(false)}
          onConfirm={handleSubmit}
          detalhes={{
            servicoId: detalhesAgendamento.servicoId,
            funcionario: funcionarioNome, // Usando a prop funcionarioNome
            cliente: clientes.find((cli) => cli.id === detalhesAgendamento.clienteId)?.nome || "Cliente não selecionado",
            data: detalhesAgendamento.data,
            horario: detalhesAgendamento.horario,
            outros: detalhesAgendamento.descricao,
          }}
          servicosList={servicos} // Passando a lista de serviços para o modal encontrar o nome
          isEditing={!!agendamento?.id}
        />
      )}
    </div>
  );
};

export default FormularioAgendamentoFuncionario;