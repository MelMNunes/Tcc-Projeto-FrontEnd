"use client";

import { Dispatch, SetStateAction, useState, useEffect, useMemo } from "react";
import ModalConfirmacao from "../components/ModalConfirmacao"; 
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from 'date-fns/locale/pt-BR';
registerLocale('pt-BR', ptBR);

// Interface para a prop 'agendamento' que vem da RecepcaoPage ou outra página
interface AgendamentoProp {
  id: number; // ID do agendamento existente, crucial para edição
  clienteId: number;
  funcionarioId: number;
  servicoId: number;
  dataHora: string; // Formato "YYYY-MM-DDTHH:mm:ss" ou similar
  descricao: string;
  status: string;
}

interface Funcionario {
  id: number;
  nome: string;
}

interface Cliente {
  id: number;
  nome: string;
}

interface Servico {
  id: number;
  nome: string;
  preco: number;
}

interface FormularioAdminProps {
  agendamento?: AgendamentoProp; // Prop para pré-preencher/editar. Opcional.
  onFormSubmitSuccess?: () => void;
  // As props passoAtual e setPassoAtual foram removidas, o formulário gerencia seus passos.
}

const horariosPadrao = [
  "09:00", "09:50", "10:40", "11:30",
  "13:00", "13:50", "14:40", "15:30", "16:20", "17:10",
];
const MAX_STEPS = 4; // 0-indexado: Serviço, Cliente, Funcionário, Data/Hora, Descrição

const FormularioAdmin: React.FC<FormularioAdminProps> = ({
  agendamento, 
  onFormSubmitSuccess,
}) => {
  const [passoAtualInterno, setPassoAtualInterno] = useState(0);

  // DEBUG INICIAL: Verificar as props recebidas pelo formulário
  console.log("FormularioAdmin RENDERIZADO. Props recebidas:", { agendamento }); 

  const [mostrarModal, setMostrarModal] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);

  const [detalhesAgendamento, setDetalhesAgendamento] = useState({
    servicoId: null as number | null,
    clienteId: null as number | null,
    funcionarioId: null as number | null,
    data: "",
    horario: "",
    descricao: "",
  });

  const [termoBuscaCliente, setTermoBuscaCliente] = useState("");
  const [termoBuscaFuncionario, setTermoBuscaFuncionario] = useState("");

  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [loadingInitialData, setLoadingInitialData] = useState<boolean>(true);
  const [loadingHorarios, setLoadingHorarios] = useState<boolean>(false);

  // Efeito para carregar dados iniciais (clientes, funcionários, serviços)
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingInitialData(true);
      try {
        // Paraleliza as chamadas de API
        const [clientesRes, funcionariosRes, servicosRes] = await Promise.all([
          fetch("http://localhost:8080/api/usuarios/listar/CLIENTE"),
          fetch("http://localhost:8080/api/usuarios/listar/FUNCIONARIO"),
          fetch("http://localhost:8080/api/servicos/listar"),
        ]);

        if (!clientesRes.ok) throw new Error('Falha ao buscar clientes');
        if (!funcionariosRes.ok) throw new Error('Falha ao buscar funcionários');
        if (!servicosRes.ok) throw new Error('Falha ao buscar serviços');

        setClientes(await clientesRes.json());
        setFuncionarios(await funcionariosRes.json());
        setServicos(await servicosRes.json());

      } catch (err) {
        console.error("FormularioAdmin - Erro ao carregar dados iniciais:", err);
        // Considerar mostrar um feedback para o usuário aqui
      } finally {
        setLoadingInitialData(false);
      }
    };
    fetchInitialData();
  }, []); // Executa apenas uma vez na montagem

  // Efeito para preencher o formulário quando 'agendamento' (para edição) mudar
  useEffect(() => {
    console.log("FormularioAdmin useEffect [agendamento] - Prop 'agendamento' recebida:", agendamento); 
    if (agendamento && agendamento.id !== undefined) { 
      console.log("FormularioAdmin: Preenchendo formulário para EDIÇÃO com ID:", agendamento.id);
      setDetalhesAgendamento({
        servicoId: agendamento.servicoId ?? null,
        clienteId: agendamento.clienteId ?? null,
        funcionarioId: agendamento.funcionarioId ?? null,
        data: agendamento.dataHora ? agendamento.dataHora.split("T")[0] : "",
        horario: agendamento.dataHora
          ? new Date(agendamento.dataHora).toLocaleTimeString('pt-BR', {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        descricao: agendamento.descricao ?? "",
      });
      setPassoAtualInterno(0); // Sempre reseta para o primeiro passo ao carregar para edição
    } else {
      console.log("FormularioAdmin: Resetando formulário para NOVO agendamento.");
      setDetalhesAgendamento({
        servicoId: null, clienteId: null, funcionarioId: null,
        data: "", horario: "", descricao: "",
      });
      setTermoBuscaCliente("");
      setTermoBuscaFuncionario("");
      setPassoAtualInterno(0); // Reseta para o primeiro passo para novo agendamento
    }
  }, [agendamento]); // Dependência correta: reage a mudanças na prop 'agendamento'

  // Efeito para buscar horários ocupados
  useEffect(() => {
    const buscarHorariosOcupados = async () => {
      if (!detalhesAgendamento.data || !detalhesAgendamento.funcionarioId) {
        setHorariosOcupados([]);
        return;
      }
      setLoadingHorarios(true);
      try {
        // A URL deve ser para buscar horários de um funcionário específico em um dia específico
        const response = await fetch(
          `http://localhost:8080/api/agendamentos/funcionarios/${detalhesAgendamento.funcionarioId}/dia/${detalhesAgendamento.data}`
        );
        if (!response.ok) {
          if (response.status === 404) { // Nenhum horário ocupado encontrado
            setHorariosOcupados([]); 
          } else { // Outro erro
            const errorText = await response.text();
            console.warn(`FormularioAdmin - Erro ao buscar horários (${response.status}): ${errorText}`);
            setHorariosOcupados([]); 
          }
          return;
        }
        const listaAgendamentosDoDia: { dataHora: string }[] = await response.json();
        const ocupados = listaAgendamentosDoDia.map((a) =>
          new Date(a.dataHora).toLocaleTimeString('pt-BR', { // Formata para HH:MM
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setHorariosOcupados(ocupados);
      } catch (err) {
        console.error("FormularioAdmin - Erro crítico ao buscar horários ocupados:", err);
        setHorariosOcupados([]); 
      } finally {
        setLoadingHorarios(false);
      }
    };
    // Busca horários apenas se estiver no passo de Data/Hora e os dados necessários estiverem presentes
      if (passoAtualInterno === 3 && detalhesAgendamento.data && detalhesAgendamento.funcionarioId) {
        buscarHorariosOcupados();
      }
  }, [detalhesAgendamento.data, detalhesAgendamento.funcionarioId, passoAtualInterno]);

  const clientesFiltrados = useMemo(() => {
    if (!termoBuscaCliente) return clientes;
    return clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(termoBuscaCliente.toLowerCase())
    );
  }, [clientes, termoBuscaCliente]);

  const funcionariosFiltrados = useMemo(() => {
    if (!termoBuscaFuncionario) return funcionarios;
    return funcionarios.filter(func =>
      func.nome.toLowerCase().includes(termoBuscaFuncionario.toLowerCase())
    );
  }, [funcionarios, termoBuscaFuncionario]);


  const avancarPasso = () => {
    if (passoAtualInterno === 0 && detalhesAgendamento.servicoId === null) {
      alert("Por favor, selecione um serviço."); return;
    }
    if (passoAtualInterno === 1 && detalhesAgendamento.clienteId === null) {
      alert("Por favor, selecione um cliente."); return;
    }
    if (passoAtualInterno === 2 && detalhesAgendamento.funcionarioId === null) {
      alert("Por favor, selecione um funcionário."); return;
    }
    if (passoAtualInterno === 3 && (!detalhesAgendamento.data || !detalhesAgendamento.horario)) {
      alert("Por favor, escolha data e horário."); return;
    }
    setPassoAtualInterno((prev) => Math.min(prev + 1, MAX_STEPS));
  };

  const voltarPasso = () => setPassoAtualInterno((prev) => Math.max(prev - 1, 0));

  const handleInputChange = (field: keyof typeof detalhesAgendamento, value: any) => {
    setDetalhesAgendamento((prev) => ({ ...prev, [field]: value }));
  };

  const handleFuncionarioChange = (funcionarioId: number) => {
    setDetalhesAgendamento((prev) => ({
      ...prev,
      funcionarioId,
      data: "", 
      horario: "",
    }));
    setHorariosOcupados([]); 
  };

  const handleDataChange = (date: Date | null) => {
    if (date) {
      const dataFormatada = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      setDetalhesAgendamento(prev => ({ ...prev, data: dataFormatada, horario: "" }));
    } else {
      setDetalhesAgendamento(prev => ({ ...prev, data: "", horario: "" }));
      setHorariosOcupados([]);
    }
  };


  const handleSubmit = async () => {
    console.log("FormularioAdmin handleSubmit - Prop 'agendamento' no início do submit:", agendamento);

    const { data, horario, descricao, servicoId, clienteId, funcionarioId } = 
      detalhesAgendamento;

    if (!data || !horario || !servicoId || !clienteId || !funcionarioId) { 
      alert("Todos os campos obrigatórios (Serviço, Cliente, Funcionário, Data e Horário) devem ser preenchidos.");
      setMostrarModal(false);
      return;
    }

    const dataHoraCombinada = `${data}T${horario}:00`; 

    const agendamentoDataPayload = {
      // Se estiver editando, o backend espera o ID do agendamento no path da URL,
      // mas o payload deve conter os campos a serem atualizados.
      // O ID do agendamento em si não precisa estar no payload se a API usa o ID da URL.
      // No entanto, enviar os IDs de cliente, funcionário e serviço é necessário.
      clienteId,
      funcionarioId, 
      servicoId,
      dataHora: dataHoraCombinada,
      descricao,
      status: "PENDENTE", // Para reagendamentos, geralmente volta para pendente
    };

    try {
      // 'agendamento' é a prop que vem da RecepcaoPage (ou outra).
      // Se ela (e seu id) existir, estamos editando.
      const isEditing = agendamento && agendamento.id !== undefined;
      
      console.log("FormularioAdmin handleSubmit - isEditing:", isEditing);
      if(isEditing) {
        console.log("FormularioAdmin handleSubmit - ID do agendamento para editar:", agendamento.id);
      }

      const url = isEditing
        ? `http://localhost:8080/api/agendamentos/${agendamento.id}` // URL para PUT
        : "http://localhost:8080/api/agendamentos/criar";           // URL para POST
      const metodo = isEditing ? "PUT" : "POST";

      console.log(`FormularioAdmin: Tentando ${metodo} para ${url} com payload:`, JSON.stringify(agendamentoDataPayload, null, 2));

      const response = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamentoDataPayload),
      });

      if (!response.ok) {
        const errorBody = await response.text(); // Ler como texto para ver o erro exato
        console.error("FormularioAdmin - Erro do backend:", errorBody);
        let errorMessage = `Falha ao ${isEditing ? 'atualizar' : 'criar'} agendamento.`;
        try {
            const errorJson = JSON.parse(errorBody);
            errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (e) {
            // Se não for JSON, usa o texto da resposta se houver
            if (errorBody) errorMessage = errorBody;
        }
        throw new Error(errorMessage);
      }

      alert(`Agendamento ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
      setMostrarModal(false);
      if(onFormSubmitSuccess) {
        console.log("FormularioAdmin: Chamando onFormSubmitSuccess");
        onFormSubmitSuccess(); 
      }
      // Resetar o formulário para o estado inicial de criação
      setPassoAtualInterno(0); 
      setDetalhesAgendamento({ 
        servicoId: null, clienteId: null, funcionarioId: null,
        data: "", horario: "", descricao: ""
      });
      setTermoBuscaCliente(""); 
      setTermoBuscaFuncionario("");
      // Importante: A prop 'agendamento' não é resetada aqui, pois ela vem de fora.
      // A página pai (RecepcaoPage) deve limpar 'agendamentoParaEdicao' após o sucesso,
      // o que fará este formulário resetar através do useEffect [agendamento].

    } catch (error) {
      console.error("FormularioAdmin - Erro ao salvar agendamento:", error);
      alert(`Erro: ${(error as Error).message}`);
      setMostrarModal(false); 
    }
  };

  if (loadingInitialData) {
    return <div className="text-center p-10"><p className="text-gray-600">Carregando dados do formulário...</p></div>;
  }

  return (
    <div className="flex flex-col w-full max-w-3xl p-6 sm:p-8 bg-white rounded-xl shadow-xl border border-gray-200 space-y-8">
      {/* Passo 0: Escolha o Serviço */}
      {passoAtualInterno === 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">1. Escolha o Serviço</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servicos.map((serv) => (
              <button
                key={serv.id}
                className={`p-4 border rounded-lg text-left transition-all duration-150 ease-in-out transform hover:shadow-md flex justify-between items-center ${
                  detalhesAgendamento.servicoId === serv.id
                    ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-400"
                    : "bg-gray-50 hover:bg-blue-50 text-gray-700"
                }`}
                onClick={() => handleInputChange("servicoId", serv.id)}
              >
                <span>{serv.nome}</span>
                <span className="font-semibold text-sm">R$ {serv.preco.toFixed(2)}</span>
              </button>
            ))}
            {servicos.length === 0 && <p className="text-gray-500 col-span-full">Nenhum serviço disponível.</p>}
          </div>
        </section>
      )}

      {/* Passo 1: Escolha o Cliente */}
      {passoAtualInterno === 1 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">2. Escolha o Cliente</h2>
          <input
            type="text"
            placeholder="Buscar cliente por nome..."
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white text-gray-700"
            value={termoBuscaCliente}
            onChange={(e) => setTermoBuscaCliente(e.target.value)}
          />
          <div className="max-h-72 overflow-y-auto space-y-2 pr-2">
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cli) => (
                <button
                  key={cli.id}
                  className={`w-full p-4 border rounded-lg text-left transition-all duration-150 ease-in-out transform hover:shadow-md flex justify-between items-center ${
                    detalhesAgendamento.clienteId === cli.id
                      ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-400"
                      : "bg-gray-50 hover:bg-blue-50 text-gray-700"
                  }`}
                  onClick={() => handleInputChange("clienteId", cli.id)}
                >
                  <span>{cli.nome}</span>
                </button>
              ))
            ) : (
              <p className="text-gray-500 p-3 text-center">
                {termoBuscaCliente ? "Nenhum cliente encontrado com este nome." : "Nenhum cliente disponível."}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Passo 2: Escolha o Funcionário */}
      {passoAtualInterno === 2 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">3. Escolha o Profissional</h2>
          <input
            type="text"
            placeholder="Buscar profissional por nome..."
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white text-gray-700"
            value={termoBuscaFuncionario}
            onChange={(e) => setTermoBuscaFuncionario(e.target.value)}
          />
          <div className="max-h-72 overflow-y-auto space-y-2 pr-2">
            {funcionariosFiltrados.length > 0 ? (
              funcionariosFiltrados.map((func) => (
                <button
                  key={func.id}
                  className={`w-full p-4 border rounded-lg text-left transition-all duration-150 ease-in-out transform hover:shadow-md ${
                    detalhesAgendamento.funcionarioId === func.id
                      ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-400"
                      : "bg-gray-50 hover:bg-blue-50 text-gray-700"
                  }`}
                  onClick={() => handleFuncionarioChange(func.id)} 
                >
                  {func.nome}
                </button>
              ))
            ) : (
              <p className="text-gray-500 p-3 text-center">
                 {termoBuscaFuncionario ? "Nenhum profissional encontrado com este nome." : "Nenhum profissional disponível."}
              </p>
            )}
             {funcionarios.length === 0 && !termoBuscaFuncionario && <p className="text-gray-500 col-span-full">Nenhum funcionário disponível.</p>}
          </div>
        </section>
      )}

      {/* Passo 3: Escolha Data e Horário */}
      {passoAtualInterno === 3 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">4. Escolha Data e Horário</h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Data:</label>
            <DatePicker
              selected={detalhesAgendamento.data ? new Date(detalhesAgendamento.data + "T00:00:00") : null}
              onChange={handleDataChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white"
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              locale="pt-BR"
              placeholderText="Clique para selecionar uma data"
            />
          </div>

          {detalhesAgendamento.data && detalhesAgendamento.funcionarioId && ( // Garante que funcionário também foi selecionado
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-600">
                Horários disponíveis em {new Date(detalhesAgendamento.data + "T00:00:00").toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}:
              </h3>
              {loadingHorarios ? (
                <p className="text-gray-500">Carregando horários...</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {horariosPadrao.length > 0 ? horariosPadrao.map((hora) => {
                    const isOcupado = horariosOcupados.includes(hora);
                    const isSelected = detalhesAgendamento.horario === hora;
                    return (
                      <button
                        key={hora}
                        onClick={() => !isOcupado && handleInputChange("horario", hora)}
                        disabled={isOcupado}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 ${
                          isOcupado
                            ? "bg-red-100 text-red-500 cursor-not-allowed line-through focus:ring-red-300"
                            : isSelected
                            ? "bg-blue-600 text-white shadow-md ring-blue-400 focus:ring-blue-400"
                            : "bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-sm focus:ring-green-300"
                        }`}
                      >
                        {hora}
                      </button>
                    );
                  }) : <p className="col-span-full text-gray-500">Nenhum horário padrão definido.</p>}
                  {!loadingHorarios && horariosPadrao.length > 0 && horariosPadrao.every(h => horariosOcupados.includes(h)) &&
                   <p className="col-span-full text-orange-600 mt-2">Todos os horários para esta data e profissional estão ocupados.</p>
                  }
                </div>
              )}
            </div>
          )}
          {(!detalhesAgendamento.data || !detalhesAgendamento.funcionarioId) && <p className="text-sm text-gray-500 mt-4">Selecione uma data e um profissional para ver os horários.</p>}
        </section>
      )}

      {/* Passo 4: Descrição */}
      {passoAtualInterno === 4 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">5. Detalhes Adicionais (Opcional)</h2>
          <textarea
            className="w-full p-3 h-32 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white"
            placeholder="Alguma observação, sintoma ou pedido especial?"
            value={detalhesAgendamento.descricao}
            onChange={(e) => handleInputChange("descricao", e.target.value)}
          />
        </section>
      )}

      <div className="flex justify-between border-t border-gray-200 pt-6 mt-8">
        <button
          className={`px-6 py-3 rounded-lg transition-colors text-white font-medium shadow hover:shadow-md ${
            passoAtualInterno === 0 ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-gray-500 hover:bg-gray-600'
          }`}
          onClick={voltarPasso}
          disabled={passoAtualInterno === 0}
        >
          Voltar
        </button>

        {passoAtualInterno < MAX_STEPS ? (
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow hover:shadow-md"
            onClick={avancarPasso}
          >
            Próximo
          </button>
        ) : (
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow hover:shadow-md"
            onClick={() => setMostrarModal(true)}
          >
            {agendamento && agendamento.id !== undefined ? "Atualizar Agendamento" : "Confirmar Agendamento"}
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
            funcionario: funcionarios.find(f => f.id === detalhesAgendamento.funcionarioId)?.nome || "N/A",
            cliente: clientes.find(c => c.id === detalhesAgendamento.clienteId)?.nome || "N/A",
            data: detalhesAgendamento.data,
            horario: detalhesAgendamento.horario,
            outros: detalhesAgendamento.descricao,
          }}
          servicosList={servicos}
          isEditing={!!(agendamento && agendamento.id !== undefined)}
        />
      )}
    </div>
  );
};

export default FormularioAdmin;