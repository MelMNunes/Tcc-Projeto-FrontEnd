"use client";

import React, { useState, useEffect } from "react";
import ModalConfirmacao from "../components/ModalConfirmacao"; // Verifique o caminho
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from 'date-fns/locale/pt-BR';
registerLocale('pt-BR', ptBR);

interface Props {
  clienteId: number;
  passoAtual: number;
  setPassoAtual: React.Dispatch<React.SetStateAction<number>>;
  agendamentoIdParaEditar?: number | null; // ID do agendamento para edição
  dadosIniciaisAgendamento?: {           // Dados para pré-preencher
    funcionarioId: number | null;
    funcionarioNome: string;
    servicoId: number | null;
    servicoNome: string;
    data: string;
    horario: string;
    descricao: string;
  };
  onAgendamentoConcluido: () => void;     // Callback após sucesso
}

interface Funcionario {
  id: number;
  nome: string;
}

interface Servico {
  id: number;
  nome: string;
  preco: number;
}

const FormularioAgendamento: React.FC<Props> = ({
  clienteId,
  passoAtual,
  setPassoAtual,
  agendamentoIdParaEditar,
  dadosIniciaisAgendamento,
  onAgendamentoConcluido,
}) => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [clienteNome, setClienteNome] = useState(""); // Pode ser preenchido se necessário
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [loadingDadosIniciais, setLoadingDadosIniciais] = useState<boolean>(true);
  const [loadingHorarios, setLoadingHorarios] = useState<boolean>(false);

  const [detalhesAgendamento, setDetalhesAgendamento] = useState({
    funcionarioId: null as number | null,
    funcionarioNome: "",
    servicoId: null as number | null,
    servicoNome: "",
    data: "",
    horario: "",
    descricao: "",
  });

  // Efeito para carregar dados iniciais do formulário (funcionários, serviços)
  // e preencher com dadosIniciaisAgendamento se for uma edição
  useEffect(() => {
    const fetchDadosEssenciais = async () => {
      setLoadingDadosIniciais(true);
      try {
        const [funcionariosRes, servicosRes, clienteRes] = await Promise.all([
          fetch("http://localhost:8080/api/usuarios/agendamento/funcionarios"),
          fetch("http://localhost:8080/api/servicos/listar"),
          fetch(`http://localhost:8080/api/usuarios/${clienteId}`) // Para pegar o nome do cliente para o modal
        ]);

        if (!funcionariosRes.ok) throw new Error('Falha ao buscar funcionários');
        if (!servicosRes.ok) throw new Error('Falha ao buscar serviços');
        if (!clienteRes.ok) throw new Error('Falha ao buscar dados do cliente');


        const funcionariosData = await funcionariosRes.json();
        const servicosData = await servicosRes.json();
        const clienteInfo = await clienteRes.json();


        setFuncionarios(funcionariosData);
        setServicos(servicosData);
        setClienteNome(clienteInfo.nome || "Cliente");


        // Preenche o formulário se for uma edição (dadosIniciaisAgendamento)
        if (dadosIniciaisAgendamento) {
          setDetalhesAgendamento({
            funcionarioId: dadosIniciaisAgendamento.funcionarioId || null,
            funcionarioNome: dadosIniciaisAgendamento.funcionarioNome || "",
            servicoId: dadosIniciaisAgendamento.servicoId || null,
            servicoNome: dadosIniciaisAgendamento.servicoNome || "",
            data: dadosIniciaisAgendamento.data || "",
            horario: dadosIniciaisAgendamento.horario || "",
            descricao: dadosIniciaisAgendamento.descricao || "",
          });
        } else {
        // Limpa para novo agendamento
          setDetalhesAgendamento({
            funcionarioId: null, funcionarioNome: "", servicoId: null,
            servicoNome: "", data: "", horario: "", descricao: ""
          });
        }

      } catch (err) {
        console.error("Erro ao carregar dados essenciais para o formulário:", err);
        // Tratar erro (ex: mostrar mensagem para o usuário)
      } finally {
        setLoadingDadosIniciais(false);
      }
    };

    fetchDadosEssenciais();
  }, [clienteId, dadosIniciaisAgendamento]); // Depende de dadosIniciaisAgendamento para reagir a um reagendamento


  // Efeito para buscar horários ocupados
  useEffect(() => {
    const buscarHorariosOcupados = async () => {
      if (!detalhesAgendamento.data || !detalhesAgendamento.funcionarioId) {
        setHorariosOcupados([]);
        return;
      }
      setLoadingHorarios(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/agendamentos/funcionarios/${detalhesAgendamento.funcionarioId}/dia/${detalhesAgendamento.data}`
        );
        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`Erro ao buscar horários (${response.status}): ${errorText}`);
          // Se a API retorna 404 para "sem horários" em vez de array vazio, ajuste aqui.
          // Por enquanto, vamos assumir que um erro significa que não há horários ou falha.
          setHorariosOcupados([]);
          return;
        }
        const lista: { dataHora: string }[] = await response.json();
        const ocupados = lista.map((a) =>
          new Date(a.dataHora).toLocaleTimeString('pt-BR', {
            hour: "2-digit",
            minute: "2-digit",
            // hour12: false, // Garante formato 24h se a API não retornar assim
          })
        );
        setHorariosOcupados(ocupados);
      } catch (err) {
        console.error("Erro crítico ao buscar horários ocupados:", err);
        setHorariosOcupados([]);
      } finally {
        setLoadingHorarios(false);
      }
    };

    if(passoAtual === 2) { // Busca horários apenas se estiver no passo de data/hora
        buscarHorariosOcupados();
    }
  }, [detalhesAgendamento.data, detalhesAgendamento.funcionarioId, passoAtual]);

  const avancarPasso = () => {
    // Validações específicas de cada passo
    if (passoAtual === 0 && !detalhesAgendamento.funcionarioId) {
      alert("Por favor, selecione um profissional."); return;
    }
    if (passoAtual === 1 && !detalhesAgendamento.servicoId) {
      alert("Por favor, selecione um serviço."); return;
    }
    if (passoAtual === 2 && (!detalhesAgendamento.data || !detalhesAgendamento.horario)) {
      alert("Por favor, selecione data e horário."); return;
    }
    setPassoAtual((prev) => Math.min(prev + 1, 3)); // Não ir além do último passo
  };

  const voltarPasso = () => {
    setPassoAtual((prev) => Math.max(prev - 1, 0));
  };

  const handleConfirmarAgendamento = async () => {
    if (!detalhesAgendamento.funcionarioId || !detalhesAgendamento.servicoId || !detalhesAgendamento.data || !detalhesAgendamento.horario) {
        alert("Preencha todos os campos obrigatórios: Profissional, Serviço, Data e Horário.");
        setMostrarModal(false);
        return;
    }

    const agendamentoPayload = {
      clienteId: clienteId,
      funcionarioId: detalhesAgendamento.funcionarioId,
      servicoId: detalhesAgendamento.servicoId,
      // Formato ISO para backend: YYYY-MM-DDTHH:MM:SS
      dataHora: `${detalhesAgendamento.data}T${detalhesAgendamento.horario}:00`,
      descricao: detalhesAgendamento.descricao,
      status: "PENDENTE", // Ou conforme sua lógica de status
    };

    console.log("Payload do agendamento:", agendamentoPayload);
    console.log("ID para editar:", agendamentoIdParaEditar);


    try {
      let response;
      const url = agendamentoIdParaEditar
        ? `http://localhost:8080/api/agendamentos/${agendamentoIdParaEditar}`
        : "http://localhost:8080/api/agendamentos/criar";
      const method = agendamentoIdParaEditar ? "PUT" : "POST";

      response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamentoPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Erro ao ${agendamentoIdParaEditar ? 'reagendar' : 'agendar'}`);
      }

      alert(`Agendamento ${agendamentoIdParaEditar ? 'reagendado' : 'realizado'} com sucesso!`);
      setMostrarModal(false);
      onAgendamentoConcluido(); // Chama o callback
      // setPassoAtual(0); // Opcional: Resetar o passo, ou deixar a página pai decidir

    } catch (error) {
      console.error(`Erro ao ${agendamentoIdParaEditar ? 'reagendar' : 'agendar'}:`, error);
      alert(`Erro: ${(error as Error).message}`);
      setMostrarModal(false);
    }
  };

  const horariosPadrao = [
    "09:00", "09:50", "10:40", "11:30",
    "13:00", "13:50", "14:40", "15:30", "16:20", "17:10",
  ];

  if (loadingDadosIniciais) {
    return <div className="text-center p-10"><p>Carregando dados do formulário...</p></div>;
  }

  return (
    <div className="flex flex-col w-full p-6 bg-white rounded-2xl "> {/* Removido max-w-2xl, shadow-lg, border para ser controlado pela ClientesPage */}
      {/* Passo 0: Escolha do Funcionário */}
      {passoAtual === 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">1. Escolha o Profissional</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {funcionarios.map((func) => (
              <button
                key={func.id}
                className={`p-4 border rounded-lg text-left transition-all duration-150 ease-in-out transform hover:scale-105 ${
                  detalhesAgendamento.funcionarioId === func.id
                    ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
                    : "bg-gray-50 hover:bg-blue-100 hover:shadow-sm"
                }`}
                onClick={() => {
                  setDetalhesAgendamento({
                    ...detalhesAgendamento,
                    funcionarioId: func.id,
                    funcionarioNome: func.nome,
                    // Limpar data e horário ao mudar funcionário, pois disponibilidade pode mudar
                    data: "",
                    horario: "",
                  });
                }}
              >
                {func.nome}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Passo 1: Escolha do Serviço */}
      {passoAtual === 1 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">2. Escolha o Serviço</h2>
          <div className="space-y-3">
            {servicos.map((servico) => (
              <button
                key={servico.id}
                className={`p-4 border rounded-lg w-full text-left transition-all duration-150 ease-in-out transform hover:scale-105 flex justify-between items-center ${
                  detalhesAgendamento.servicoId === servico.id
                  ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
                  : "bg-gray-50 hover:bg-blue-100 hover:shadow-sm"
                }`}
                onClick={() =>
                  setDetalhesAgendamento({
                    ...detalhesAgendamento,
                    servicoId: servico.id,
                    servicoNome: servico.nome,
                  })
                }
              >
                <span>{servico.nome}</span>
                <span className="font-semibold text-sm">R$ {servico.preco.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Passo 2: Escolha da Data e Horário */}
      {passoAtual === 2 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">3. Escolha Data e Horário</h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Data:</label>
            <DatePicker
              selected={detalhesAgendamento.data ? new Date(detalhesAgendamento.data + "T00:00:00") : null} // Adiciona T00:00 para evitar problemas de fuso local
              onChange={(date: Date | null) => {
                if (date) {
                  const dataFormatada = date.toISOString().split("T")[0]; // YYYY-MM-DD
                  setDetalhesAgendamento({
                    ...detalhesAgendamento,
                    data: dataFormatada,
                    horario: "", // Limpa horário ao mudar a data
                  });
                } else {
                    setDetalhesAgendamento({...detalhesAgendamento, data: "", horario: ""});
                }
              }}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              placeholderText="Clique para selecionar uma data"
              locale="pt-BR"
            />
          </div>

          {detalhesAgendamento.data && (
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-600">
                Horários disponíveis em {new Date(detalhesAgendamento.data + "T00:00:00").toLocaleDateString('pt-BR')}:
              </h3>
              {loadingHorarios ? (
                <p className="text-gray-500">Carregando horários...</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {horariosPadrao.length > 0 ? horariosPadrao.map((hora) => {
                    const ocupado = horariosOcupados.includes(hora);
                    return (
                      <button
                        key={hora}
                        onClick={() => {
                          if (!ocupado) {
                            setDetalhesAgendamento((prev) => ({ ...prev, horario: hora, }));
                          }
                        }}
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
                  }) : <p className="col-span-full text-gray-500">Nenhum horário padrão definido.</p>}
                   {!loadingHorarios && horariosPadrao.every(h => horariosOcupados.includes(h)) && horariosPadrao.length > 0 &&
                    <p className="col-span-full text-orange-500 mt-2">Todos os horários para esta data estão ocupados.</p>
                   }
                </div>
              )}
            </div>
          )}
          {!detalhesAgendamento.data && <p className="text-gray-500 mt-4">Selecione uma data para visualizar os horários disponíveis.</p>}
        </div>
      )}

      {/* Passo 3: Comentários Adicionais */}
      {passoAtual === 3 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">4. Observações (Opcional)</h2>
          <textarea
            className="w-full p-3 border rounded-lg h-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            value={detalhesAgendamento.descricao}
            placeholder="Alguma observação para o profissional?"
            onChange={(e) =>
              setDetalhesAgendamento({
                ...detalhesAgendamento,
                descricao: e.target.value,
              })
            }
          />
        </div>
      )}

      {/* Botões de Navegação e Confirmação */}
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

        {passoAtual < 3 ? (
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
            {agendamentoIdParaEditar ? "Confirmar Reagendamento" : "Confirmar Agendamento"}
          </button>
        )}
      </div>

      {/* Modal de Confirmação */}
      {mostrarModal && (
        <ModalConfirmacao
          isOpen={mostrarModal}
          onClose={() => setMostrarModal(false)}
          onConfirm={handleConfirmarAgendamento}
          detalhes={{
            cliente: clienteNome, // Nome do cliente obtido no useEffect
            funcionario: detalhesAgendamento.funcionarioNome || "Não selecionado",
            servicoId: detalhesAgendamento.servicoId,
            data: detalhesAgendamento.data,
            horario: detalhesAgendamento.horario,
            outros: detalhesAgendamento.descricao,
          }}
          servicosList={servicos}
          isEditing={!!agendamentoIdParaEditar} // Informa ao modal se é edição
        />
      )}
    </div>
  );
};

export default FormularioAgendamento; 