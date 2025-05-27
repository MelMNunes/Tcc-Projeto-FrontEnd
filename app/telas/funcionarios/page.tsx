"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import FormularioAgendamentoFuncionario from "../agendamento/formularioFuncionario/FormularioFuncionario";
import { getUsuarioById } from "@/app/services/api";
import Modal from "@/app/components/Modal/Modal"; 
import FormularioAnamnesePage, {
  AnamnesePayload,
} from "@/app/telas/anamnese/page";

const CalendarDaysIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-3.75h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
    />
  </svg>
);
const ListBulletIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
    />
  </svg>
);
const UserCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);
const ArrowLeftOnRectangleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
    />
  </svg>
);
const DocumentTextIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
    />
  </svg>
);
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

interface ConsultaAgendamento {
  id: number;
  dataHora: string;
  servicoNome: string;
  servicoId: number;
  clienteNome: string;
  clienteId: number;
  funcionarioId: number;
  descricao?: string;
  status: "PENDENTE" | "FINALIZADO" | "CANCELADO";
  foto?: string;
  dataRegistroAnamnese?: string;
  queixaPrincipalAnamnese?: string;
}

interface FuncionarioData {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  tipoDeUsuario: "FUNCIONARIO" | "CLIENTE" | "ADMINISTRADOR";
}

interface AnamneseDataDetalhada {
  id: number;
  agendamentoId: number;
  clienteId: number;
  clienteNome?: string;
  dataRegistro: string;
  idade: number;
  genero: string;
  queixaPrincipal: string;
  tempoProblema?: string;
  tratamentoAnterior?: string;
  historia: string;
  doencas: string;
  outraDoenca?: string;
  cirurgiaRecente?: string;
  alergia?: string;
  medicamentos?: string;
  produtos?: string;
  materiais?: string;
  historicoFamiliar?: string;
  historicoFamiliarEspecificar?: string;
  habitos: {
    atividadeFisica: string;
    consomeAlcool: string;
    fuma: string;
    nivelEstresse: string;
  };
  saudePes: {
    dorPes: string;
    calos: string;
    unhasEncravadas: string;
    formigamento: string;
    alteracaoCor: string;
  };
  avaliacao: {
    pele: string;
    unhas: string;
    calosidades: string;
    tipoPisada: string;
    edemas: string;
    hidratacao: string;
  };
  foto?: string | null;
}

const API_BASE_URL = "http://localhost:8080/api";

const FuncionariosPage: React.FC = () => {
  const [statusFiltro, setStatusFiltro] =
    useState<ConsultaAgendamento["status"]>("PENDENTE");
  const [anamneseParaVisualizar, setAnamneseParaVisualizar] =
    useState<AnamneseDataDetalhada | null>(null);
  const [anamneseParaEditar, setAnamneseParaEditar] = useState<
    Partial<AnamnesePayload> | undefined
  >(undefined);
  const [selectedConsultaIdAnamnese, setSelectedConsultaIdAnamnese] = useState<
    number | null
  >(null);
  const [selectedClienteIdAnamnese, setSelectedClienteIdAnamnese] = useState<
    number | null
  >(null);
  const [loadingFinalizarId, setLoadingFinalizarId] = useState<number | null>(
    null
  );
  const [nomeFuncionario, setNomeFuncionario] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<
    "agendamento" | "consultas" | "perfil"
  >("consultas");
  const [funcionarioData, setFuncionarioData] =
    useState<FuncionarioData | null>(null);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [agendamentosPorStatus, setAgendamentosPorStatus] = useState<
    ConsultaAgendamento[]
  >([]);
  const [isModalAnamnesePreencherOpen, setIsModalAnamnesePreencherOpen] =
    useState(false);
  const [isModalAnamneseVisualizarOpen, setIsModalAnamneseVisualizarOpen] =
    useState(false);
  const router = useRouter();
  const [editingProfile, setEditingProfile] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>("");
  const [newTelefone, setNewTelefone] = useState<string>("");
  const [newSenha, setNewSenha] = useState<string>("");
  const [agendamentoParaReagendar, setAgendamentoParaReagendar] =
    useState<ConsultaAgendamento | null>(null);

  const fetchAgendamentosCallback = useCallback(
    async (userId: number, status: ConsultaAgendamento["status"]) => {
      if (!userId) return;
      setLoadingPage(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/agendamentos/funcionarios/${userId}/status/${status}`
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Erro ${response.status} ao buscar agendamentos: ${errorText}`
          );
        }
        const data: ConsultaAgendamento[] = await response.json();
        data.sort((a, b) => {
          const timeA = new Date(a.dataHora).getTime();
          const timeB = new Date(b.dataHora).getTime();
          return status === "PENDENTE" ? timeA - timeB : timeB - timeA;
        });
        setAgendamentosPorStatus(data);
      } catch (error) {
        console.error("Erro na API ao buscar agendamentos:", error);
        setAgendamentosPorStatus([]);
      } finally {
        setLoadingPage(false);
      }
    },
    []
  );

  const fetchFuncionarioDataAndInitialAgendamentos = useCallback(
    async (userId: number) => {
      setLoadingPage(true);
      try {
        const data: FuncionarioData = await getUsuarioById(userId);
        setFuncionarioData(data);
        setNewEmail(data.email);
        setNewTelefone(data.telefone);
        setNomeFuncionario(data.nome);
        await fetchAgendamentosCallback(userId, "PENDENTE");
      } catch (error) {
        console.error("Erro ao buscar dados do funcionário (API):", error);
        setFuncionarioData(null);
        setLoadingPage(false);
        alert(
          "Não foi possível carregar os dados do funcionário. Redirecionando para o login."
        );
        router.push("/");
      }
    },
    [router, fetchAgendamentosCallback]
  );

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    const userIdString = localStorage.getItem("id");

    if (userDataString && userIdString) {
      try {
        const userId = Number(userIdString);
        if (isNaN(userId)) throw new Error("ID do usuário inválido.");
        fetchFuncionarioDataAndInitialAgendamentos(userId);
      } catch (error) {
        console.error("Erro ao processar dados do localStorage:", error);
        setLoadingPage(false);
        router.push("/");
      }
    } else {
      setLoadingPage(false);
      router.push("/");
    }
  }, [fetchFuncionarioDataAndInitialAgendamentos, router]);

  useEffect(() => {
    if (funcionarioData?.id && !loadingPage) {
      fetchAgendamentosCallback(funcionarioData.id, statusFiltro);
    }
  }, [
    statusFiltro,
    funcionarioData?.id,
    fetchAgendamentosCallback,
    loadingPage,
  ]);

  const handleAbrirModalPreencherOuEditarAnamnese = async (
    consulta: ConsultaAgendamento
  ) => {
    if (
      !consulta ||
      consulta.id === undefined ||
      consulta.clienteId === undefined
    ) {
      alert("Dados da consulta inválidos para abrir anamnese.");
      return;
    }
    setLoadingPage(true);
    setAnamneseParaEditar(undefined);

    try {
      const response = await fetch(
        `${API_BASE_URL}/anamnese/agendamento/${consulta.id}`
      );
      if (response.ok) {
        const anamneseExistenteApiDTO = await response.json();

        const payloadFormatado: Partial<AnamnesePayload> = {
          id: anamneseExistenteApiDTO.id, 
          agendamentoId: anamneseExistenteApiDTO.agendamentoId,
          clienteId: anamneseExistenteApiDTO.clienteId,
          dataRegistro: anamneseExistenteApiDTO.dataRegistro?.split("T")[0],
          idade: anamneseExistenteApiDTO.idade,
          genero: anamneseExistenteApiDTO.genero,
          queixaPrincipal: anamneseExistenteApiDTO.queixaPrincipal,
          tempoProblema: anamneseExistenteApiDTO.tempoProblema,
          tratamentoAnterior: anamneseExistenteApiDTO.tratamentoAnterior,
          historia: anamneseExistenteApiDTO.historia,
          doencas: anamneseExistenteApiDTO.doencas,
          outraDoenca: anamneseExistenteApiDTO.outraDoenca,
          cirurgiaRecente: anamneseExistenteApiDTO.cirurgiaRecente,
          alergia: anamneseExistenteApiDTO.alergia,
          medicamentos: anamneseExistenteApiDTO.medicamentos,
          produtos: anamneseExistenteApiDTO.produtos,
          materiais: anamneseExistenteApiDTO.materiais,
          historicoFamiliar: anamneseExistenteApiDTO.historicoFamiliar,
          historicoFamiliarEspecificar:
            anamneseExistenteApiDTO.historicoFamiliarEspecificar,
          habitos: anamneseExistenteApiDTO.habitos,
          saudePes: anamneseExistenteApiDTO.saudePes,
          avaliacao: anamneseExistenteApiDTO.avaliacao,
          foto: anamneseExistenteApiDTO.foto || null,
        };
        setAnamneseParaEditar(payloadFormatado);
      } else if (response.status === 404) {
        console.log(
          "Nenhuma anamnese encontrada para este agendamento, abrindo formulário para criação."
        );
      } else {
        const errorText = await response.text();
        throw new Error(`Erro ao verificar anamnese existente: ${errorText}`);
      }
    } catch (error) {
      console.error("Erro ao buscar/preparar anamnese:", error);
      alert(
        `Erro ao carregar dados da anamnese para edição/criação: ${
          (error as Error).message
        }.`
      );
    } finally {
      setSelectedConsultaIdAnamnese(consulta.id);
      setSelectedClienteIdAnamnese(consulta.clienteId);
      setIsModalAnamnesePreencherOpen(true);
      setLoadingPage(false);
    }
  };

  const handleAbrirModalVisualizarAnamnese = async (agendamentoId: number) => {
    if (agendamentoId === undefined || agendamentoId === null) {
      alert("ID do agendamento inválido para visualizar anamnese.");
      return;
    }
    setLoadingPage(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/anamnese/agendamento/${agendamentoId}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          alert("Nenhuma anamnese salva encontrada para este agendamento.");
          setLoadingPage(false);
          return;
        }
        const errorText = await response.text();
        throw new Error(
          `Erro ${response.status} ao buscar anamnese: ${errorText}`
        );
      }
      const dto = await response.json();

      const dadosFormatadosParaVisualizacao: AnamneseDataDetalhada = {
        ...dto,
        dataRegistro: dto.dataRegistro,
        habitos: dto.habitos
          ? JSON.parse(dto.habitos)
          : {
              atividadeFisica: "",
              consomeAlcool: "",
              fuma: "",
              nivelEstresse: "",
            },
        saudePes: dto.saudePes
          ? JSON.parse(dto.saudePes)
          : {
              dorPes: "",
              calos: "",
              unhasEncravadas: "",
              formigamento: "",
              alteracaoCor: "",
            },
        avaliacao: dto.avaliacao
          ? JSON.parse(dto.avaliacao)
          : {
              pele: "",
              unhas: "",
              calosidades: "",
              tipoPisada: "",
              edemas: "",
              hidratacao: "",
            },
      };

      setAnamneseParaVisualizar(dadosFormatadosParaVisualizacao);
      setIsModalAnamneseVisualizarOpen(true);
    } catch (error) {
      console.error("Erro ao buscar anamnese para visualização:", error);
      alert(
        `Não foi possível carregar a anamnese: ${(error as Error).message}`
      );
    } finally {
      setLoadingPage(false);
    }
  };

  const handleFecharModalAnamnese = () => {
    setIsModalAnamnesePreencherOpen(false);
    setIsModalAnamneseVisualizarOpen(false);
    setSelectedConsultaIdAnamnese(null);
    setSelectedClienteIdAnamnese(null);
    setAnamneseParaVisualizar(null);
    setAnamneseParaEditar(undefined);
    if (funcionarioData?.id && statusFiltro) {
      fetchAgendamentosCallback(funcionarioData.id, statusFiltro);
    }
  };

  interface UpdateProfilePayload {
    nome: string;
    email: string;
    telefone: string;
    tipoDeUsuario: FuncionarioData["tipoDeUsuario"];
    senha?: string;
  }

  const handleUpdateProfile = async () => {
    if (!funcionarioData?.id) {
      alert("Dados do funcionário não carregados.");
      return;
    }
    if (!newEmail.trim() || !/\S+@\S+\.\S+/.test(newEmail)) {
      alert("Por favor, insira um email válido.");
      return;
    }
    if (newSenha && newSenha.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const payload: UpdateProfilePayload = {
      nome: funcionarioData.nome,
      email: newEmail,
      telefone: newTelefone,
      tipoDeUsuario: funcionarioData.tipoDeUsuario,
    };
    if (newSenha.trim() !== "") {
      payload.senha = newSenha;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/usuarios/editar/${funcionarioData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        alert("Perfil atualizado com sucesso!");
        const updatedData = await getUsuarioById(funcionarioData.id);
        setFuncionarioData(updatedData);
        setNewEmail(updatedData.email);
        setNewTelefone(updatedData.telefone);
        setNomeFuncionario(updatedData.nome);
        setEditingProfile(false);
        setNewSenha("");

        const userFromStorage = JSON.parse(
          localStorage.getItem("user") || "{}"
        );
        userFromStorage.email = updatedData.email;
        userFromStorage.nome = updatedData.nome;
        userFromStorage.telefone = updatedData.telefone;
        localStorage.setItem("user", JSON.stringify(userFromStorage));
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        alert(
          `Erro ao atualizar perfil: ${
            errorData.message || "Erro desconhecido"
          }`
        );
      }
    } catch (error) {
      console.error("Erro de comunicação ao atualizar perfil:", error);
      alert("Ocorreu um erro de comunicação. Tente novamente.");
    }
  };

  const handleFinalizarAgendamento = async (agendamentoId: number) => {
    setLoadingFinalizarId(agendamentoId);
    try {
      const response = await fetch(
        `${API_BASE_URL}/agendamentos/atualizar-status/${agendamentoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify("FINALIZADO"),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao finalizar: ${errorText}`);
      }
      if (funcionarioData?.id)
        await fetchAgendamentosCallback(funcionarioData.id, statusFiltro);
      alert("Agendamento finalizado com sucesso!");
    } catch (err) {
      console.error(err);
      alert(`Não foi possível finalizar: ${(err as Error).message}`);
    } finally {
      setLoadingFinalizarId(null);
    }
  };

  const handleCancelarAgendamento = async (agendamentoId: number) => {
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/agendamentos/atualizar-status/${agendamentoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify("CANCELADO"),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao cancelar: ${errorText}`);
      }
      if (funcionarioData?.id)
        await fetchAgendamentosCallback(funcionarioData.id, statusFiltro);
      alert("Agendamento cancelado com sucesso!");
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      alert(`Erro ao cancelar: ${(error as Error).message}`);
    }
  };

  const handleAbrirReagendamento = (consulta: ConsultaAgendamento) => {
    setAgendamentoParaReagendar(consulta);
    setSelectedTab("agendamento");
  };

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      router.push("/");
    }
  };

  if (loadingPage && !funcionarioData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700 text-xl font-medium">
            Carregando dados do funcionário...
          </p>
        </div>
      </div>
    );
  }
  if (!funcionarioData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 text-center bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-xl">
          <h2 className="text-red-600 text-3xl font-semibold mb-3">
            Ops! Algo deu errado.
          </h2>
          <p className="text-gray-700 mb-6 text-lg">
            Não foi possível carregar seus dados. Tente novamente mais tarde ou
            contate o suporte.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium text-lg"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  const tabs: Array<{
    key: "agendamento" | "consultas" | "perfil";
    label: string;
    icon: JSX.Element;
  }> = [
    {
      key: "agendamento",
      label: agendamentoParaReagendar ? "Reagendar" : "Novo Agendamento",
      icon: <CalendarDaysIcon />,
    },
    { key: "consultas", label: "Consultas", icon: <ListBulletIcon /> },
    { key: "perfil", label: "Meu Perfil", icon: <UserCircleIcon /> },
  ];

  const AgendamentoCard: React.FC<{ consulta: ConsultaAgendamento }> = ({
    consulta,
  }) => {
    const statusStyles = {
      PENDENTE: {
        bg: "bg-yellow-50 border-yellow-400",
        text: "text-yellow-700",
        badgeBg: "bg-yellow-500",
      },
      FINALIZADO: {
        bg: "bg-green-50 border-green-400",
        text: "text-green-700",
        badgeBg: "bg-green-600",
      },
      CANCELADO: {
        bg: "bg-red-50 border-red-400",
        text: "text-red-700",
        badgeBg: "bg-red-600",
      },
    };
    const currentStatusStyle =
      statusStyles[consulta.status] || statusStyles.PENDENTE;

    return (
      <div
        className={`rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out relative flex flex-col ${currentStatusStyle.bg} border`}
      >
        <div className="p-5 flex-grow">
          <div
            className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full text-white shadow-sm ${currentStatusStyle.badgeBg}`}
          >
            {consulta.status}
          </div>
          <h3
            className={`text-xl font-semibold ${currentStatusStyle.text} mb-1 pr-20`}
          >
            {new Date(consulta.dataHora).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </h3>
          <p
            className={`text-lg text-gray-800 font-medium mb-3 ${currentStatusStyle.text}`}
          >
            {new Date(consulta.dataHora).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <div className="space-y-1 text-sm text-gray-700">
            <p>
              <strong>Cliente:</strong> {consulta.clienteNome}
            </p>
            <p>
              <strong>Serviço:</strong> {consulta.servicoNome}
            </p>
            {consulta.descricao && (
              <p className="mt-2 text-xs italic bg-gray-100 p-2 rounded">
                Obs: {consulta.descricao}
              </p>
            )}
          </div>
        </div>
        <div className="mt-auto p-4 border-t border-gray-200 space-y-2">
          {consulta.status === "PENDENTE" && (
            <>
              <button
                onClick={() => handleAbrirReagendamento(consulta)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm font-medium shadow-sm"
              >
                Reagendar
              </button>
              <button
                onClick={() => handleFinalizarAgendamento(consulta.id)}
                disabled={loadingFinalizarId === consulta.id}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 text-white rounded-md transition-colors text-sm font-medium shadow-sm ${
                  loadingFinalizarId === consulta.id
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {loadingFinalizarId === consulta.id
                  ? "Finalizando..."
                  : "Finalizar"}
              </button>
              <button
                onClick={() => handleCancelarAgendamento(consulta.id)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium shadow-sm"
              >
                Cancelar
              </button>
            </>
          )}
          <button
            onClick={() => handleAbrirModalPreencherOuEditarAnamnese(consulta)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium shadow-sm"
          >
            <DocumentTextIcon /> Anamnese
          </button>
          <button
            onClick={() => handleAbrirModalVisualizarAnamnese(consulta.id)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
          >
            <EyeIcon /> Ver Anamnese
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black font-sans">
      <nav className="w-64 bg-white p-5 shadow-xl h-screen fixed top-0 left-0 flex flex-col justify-between print:hidden transition-all duration-300 ease-in-out">
        <div>
          <div className="text-center mb-10 pt-2">
            <h1 className="text-2xl font-bold text-blue-700">Painel</h1>
            {funcionarioData && (
              <p className="text-sm text-gray-500 mt-1">Funcionário</p>
            )}
          </div>
          <ul className="space-y-3">
            {tabs.map((tab) => (
              <li key={tab.key}>
                <button
                  onClick={() => {
                    setSelectedTab(tab.key);
                    if (tab.key === "agendamento")
                      setAgendamentoParaReagendar(null);
                    if (tab.key === "consultas" && statusFiltro !== "PENDENTE")
                      setStatusFiltro("PENDENTE");
                  }}
                  className={`flex items-center w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group
                                    ${
                                      selectedTab === tab.key
                                        ? "bg-blue-600 text-white shadow-lg transform scale-105"
                                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
                                    }`}
                >
                  <span className="mr-3 opacity-90 group-hover:opacity-100">
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 mt-8 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md hover:shadow-lg"
        >
          <ArrowLeftOnRectangleIcon /> Sair
        </button>
      </nav>

      <div className="flex flex-col flex-grow ml-64">
        <header className="bg-white p-5 shadow-md sticky top-0 z-20 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              {tabs.find((t) => t.key === selectedTab)?.label}
            </h2>
            <p className="text-gray-600 text-md sm:text-lg">
              Olá,{" "}
              <span className="font-semibold text-blue-700">
                {nomeFuncionario.split(" ")[0]}
              </span>
            </p>
          </div>
        </header>

        <main className="p-4 md:p-8 flex-grow overflow-y-auto bg-slate-50">
          {selectedTab === "agendamento" && funcionarioData && (
            <section className="bg-white p-6 sm:p-8 rounded-xl shadow-xl max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
                {agendamentoParaReagendar
                  ? "Reagendar Consulta"
                  : "Novo Agendamento"}
              </h3>
              <FormularioAgendamentoFuncionario
                funcionarioId={funcionarioData.id}
                funcionarioNome={funcionarioData.nome}
                agendamento={agendamentoParaReagendar}
                onOperacaoConcluida={() => {
                  if (funcionarioData?.id) {
                    setStatusFiltro("PENDENTE");
                  }
                  setSelectedTab("consultas");
                  setAgendamentoParaReagendar(null);
                }}
              />
            </section>
          )}

          {selectedTab === "consultas" && (
            <section>
              <div className="mb-6 p-4 bg-white rounded-lg shadow-md flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                <label
                  htmlFor="statusFiltro"
                  className="font-semibold text-lg text-gray-700 whitespace-nowrap"
                >
                  Filtrar por Status:
                </label>
                <select
                  id="statusFiltro"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white"
                  value={statusFiltro}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setStatusFiltro(
                      e.target.value as ConsultaAgendamento["status"]
                    )
                  }
                >
                  <option value="PENDENTE">🟡 Pendentes</option>
                  <option value="FINALIZADO">✅ Finalizados</option>
                  <option value="CANCELADO">❌ Cancelados</option>
                </select>
              </div>

              {loadingPage && agendamentosPorStatus.length === 0 && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-600 mt-4 text-lg">
                    Carregando agendamentos...
                  </p>
                </div>
              )}
              {!loadingPage && agendamentosPorStatus.length === 0 && (
                <div className="text-center py-12 bg-white p-8 rounded-lg shadow-md">
                  <p className="text-gray-600 text-xl mb-4">
                    Nenhum agendamento encontrado com o status "{statusFiltro}".
                  </p>
                  {statusFiltro !== "PENDENTE" && (
                    <button
                      onClick={() => setStatusFiltro("PENDENTE")}
                      className="mt-2 px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm"
                    >
                      Ver Agendamentos Pendentes
                    </button>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {agendamentosPorStatus.map((consulta) => (
                  <AgendamentoCard key={consulta.id} consulta={consulta} />
                ))}
              </div>
            </section>
          )}

          {selectedTab === "perfil" && funcionarioData && (
            <section className="bg-white p-6 sm:p-8 rounded-xl shadow-xl max-w-lg mx-auto">
              <h2 className="text-2xl font-semibold mb-8 text-center text-gray-700">
                Meu Perfil
              </h2>
              {editingProfile ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateProfile();
                  }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome:
                    </label>
                    <p className="text-lg text-gray-800 p-3 border rounded-md bg-gray-100">
                      {funcionarioData.nome}
                    </p>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="emailFunc"
                    >
                      Email:
                    </label>
                    <input
                      id="emailFunc"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                      className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 transition-shadow focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="telFunc"
                    >
                      Telefone:
                    </label>
                    <input
                      id="telFunc"
                      type="tel"
                      value={newTelefone}
                      onChange={(e) => setNewTelefone(e.target.value)}
                      className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 transition-shadow focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="senhaFunc"
                    >
                      Nova Senha (mín. 6 caracteres):
                    </label>
                    <input
                      id="senhaFunc"
                      type="password"
                      value={newSenha}
                      onChange={(e) => setNewSenha(e.target.value)}
                      className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 transition-shadow focus:border-blue-500"
                      placeholder="Deixe em branco para não alterar"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-3 hover:bg-blue-700 transition-colors font-medium shadow-sm"
                    >
                      Salvar Alterações
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProfile(false);
                        if (funcionarioData) {
                          setNewEmail(funcionarioData.email);
                          setNewTelefone(funcionarioData.telefone);
                        }
                        setNewSenha("");
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 rounded-lg px-4 py-3 hover:bg-gray-300 transition-colors font-medium shadow-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-5">
                  <div className="py-3 border-b border-gray-200">
                    <strong className="text-gray-600 font-medium w-24 inline-block">
                      Nome:
                    </strong>{" "}
                    <span className="text-gray-800">
                      {funcionarioData.nome}
                    </span>
                  </div>
                  <div className="py-3 border-b border-gray-200">
                    <strong className="text-gray-600 font-medium w-24 inline-block">
                      CPF:
                    </strong>{" "}
                    <span className="text-gray-800">{funcionarioData.cpf}</span>
                  </div>
                  <div className="py-3 border-b border-gray-200">
                    <strong className="text-gray-600 font-medium w-24 inline-block">
                      Email:
                    </strong>{" "}
                    <span className="text-gray-800">
                      {funcionarioData.email}
                    </span>
                  </div>
                  <div className="py-3 border-b border-gray-200">
                    <strong className="text-gray-600 font-medium w-24 inline-block">
                      Telefone:
                    </strong>{" "}
                    <span className="text-gray-800">
                      {funcionarioData.telefone || "Não informado"}
                    </span>
                  </div>
                  <div className="py-3">
                    <strong className="text-gray-600 font-medium w-24 inline-block">
                      Senha:
                    </strong>{" "}
                    <span className="text-gray-800">••••••••</span>
                  </div>
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="w-full mt-8 bg-green-500 text-white rounded-lg px-4 py-3 hover:bg-green-600 transition-colors font-medium shadow-md"
                  >
                    Editar Perfil
                  </button>
                </div>
              )}
            </section>
          )}

          <Modal
            isOpen={isModalAnamnesePreencherOpen}
            onClose={handleFecharModalAnamnese}
            dialogClassName="max-w-4xl w-full mx-auto p-0"
          >
            {isModalAnamnesePreencherOpen &&
            selectedConsultaIdAnamnese !== null &&
            selectedClienteIdAnamnese !== null ? (
              <FormularioAnamnesePage
                agendamentoId={selectedConsultaIdAnamnese}
                clienteId={selectedClienteIdAnamnese}
                onClose={handleFecharModalAnamnese}
                anamneseExistente={anamneseParaEditar}
              />
            ) : (
              <div className="p-10 text-center text-gray-600">
                Carregando formulário...
              </div>
            )}
          </Modal>

          <Modal
            isOpen={isModalAnamneseVisualizarOpen}
            onClose={handleFecharModalAnamnese}
            dialogClassName="max-w-3xl w-full mx-auto"
          >
            {loadingPage && !anamneseParaVisualizar && (
              <div className="p-10 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                Carregando anamnese...
              </div>
            )}
            {!loadingPage && anamneseParaVisualizar ? (
              <div className="space-y-6 p-6 sm:p-8 max-h-[90vh] overflow-y-auto bg-white rounded-xl">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 border-b pb-4">
                  Detalhes da Anamnese
                </h2>
                <AnamneseDetailSection title="Identificação">
                  <DetailItem
                    label="Agendamento ID"
                    value={anamneseParaVisualizar.agendamentoId}
                  />
                  <DetailItem
                    label="Cliente ID"
                    value={anamneseParaVisualizar.clienteId}
                  />
                  <DetailItem
                    label="Cliente"
                    value={anamneseParaVisualizar.clienteNome || "N/A"}
                  />
                  <DetailItem
                    label="Data da Anamnese"
                    value={new Date(
                      anamneseParaVisualizar.dataRegistro // Ajuste para garantir que a data seja interpretada corretamente
                    ).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                  />
                  <DetailItem
                    label="Idade (na época)"
                    value={`${anamneseParaVisualizar.idade} anos`}
                  />
                  <DetailItem
                    label="Gênero"
                    value={anamneseParaVisualizar.genero}
                  />
                </AnamneseDetailSection>

                <AnamneseDetailSection title="Queixa e Histórico">
                  <DetailItem
                    label="Queixa Principal"
                    value={anamneseParaVisualizar.queixaPrincipal}
                  />
                  {anamneseParaVisualizar.tempoProblema && (
                    <DetailItem
                      label="Tempo do Problema"
                      value={anamneseParaVisualizar.tempoProblema}
                    />
                  )}
                  {anamneseParaVisualizar.tratamentoAnterior && (
                    <DetailItem
                      label="Tratamento Anterior"
                      value={anamneseParaVisualizar.tratamentoAnterior}
                    />
                  )}
                  <DetailItem
                    label="História da Queixa"
                    value={anamneseParaVisualizar.historia}
                    isBlock
                  />
                </AnamneseDetailSection>

                <AnamneseDetailSection title="Saúde Geral">
                  <DetailItem
                    label="Doenças Diagnosticadas"
                    value={anamneseParaVisualizar.doencas || "Nenhuma"}
                  />
                  {anamneseParaVisualizar.outraDoenca && (
                    <DetailItem
                      label="Outra Doença"
                      value={anamneseParaVisualizar.outraDoenca}
                    />
                  )}
                  <DetailItem
                    label="Cirurgia Recente"
                    value={
                      anamneseParaVisualizar.cirurgiaRecente || "Não informado"
                    }
                  />
                </AnamneseDetailSection>

                <AnamneseDetailSection title="Alergias">
                  <DetailItem
                    label="Possui Alergias"
                    value={anamneseParaVisualizar.alergia || "Não informado"}
                  />
                  {anamneseParaVisualizar.alergia?.toLowerCase() === "sim" && (
                    <>
                      {anamneseParaVisualizar.medicamentos && (
                        <DetailItem
                          label="Medicamentos"
                          value={anamneseParaVisualizar.medicamentos}
                        />
                      )}
                      {anamneseParaVisualizar.produtos && (
                        <DetailItem
                          label="Produtos"
                          value={anamneseParaVisualizar.produtos}
                        />
                      )}
                      {anamneseParaVisualizar.materiais && (
                        <DetailItem
                          label="Materiais"
                          value={anamneseParaVisualizar.materiais}
                        />
                      )}
                    </>
                  )}
                </AnamneseDetailSection>

                <AnamneseDetailSection title="Histórico Familiar">
                  <DetailItem
                    label="Doenças na Família"
                    value={
                      anamneseParaVisualizar.historicoFamiliar ||
                      "Não informado"
                    }
                  />
                  {anamneseParaVisualizar.historicoFamiliar?.toLowerCase() ===
                    "sim" &&
                    anamneseParaVisualizar.historicoFamiliarEspecificar && (
                      <DetailItem
                        label="Especificar"
                        value={
                          anamneseParaVisualizar.historicoFamiliarEspecificar
                        }
                      />
                    )}
                </AnamneseDetailSection>

                {typeof anamneseParaVisualizar.habitos === "object" &&
                  anamneseParaVisualizar.habitos && (
                    <AnamneseDetailSection title="Hábitos">
                      {Object.entries(anamneseParaVisualizar.habitos).map(
                        ([key, value]) => (
                          <DetailItem
                            key={key}
                            label={formatLabel(key)}
                            value={value}
                          />
                        )
                      )}
                    </AnamneseDetailSection>
                  )}
                {typeof anamneseParaVisualizar.saudePes === "object" &&
                  anamneseParaVisualizar.saudePes && (
                    <AnamneseDetailSection title="Saúde dos Pés">
                      {Object.entries(anamneseParaVisualizar.saudePes).map(
                        ([key, value]) => (
                          <DetailItem
                            key={key}
                            label={formatLabel(key)}
                            value={value}
                          />
                        )
                      )}
                    </AnamneseDetailSection>
                  )}
                {typeof anamneseParaVisualizar.avaliacao === "object" &&
                  anamneseParaVisualizar.avaliacao && (
                    <AnamneseDetailSection title="Avaliação Visual (Profissional)">
                      {Object.entries(anamneseParaVisualizar.avaliacao).map(
                        ([key, value]) => (
                          <DetailItem
                            key={key}
                            label={formatLabel(key)}
                            value={value}
                          />
                        )
                      )}
                    </AnamneseDetailSection>
                  )}

                {anamneseParaVisualizar.foto && (
                  <AnamneseDetailSection title="Foto Registrada">
                    <img
                      src={`data:image/jpeg;base64,${anamneseParaVisualizar.foto}`}
                      alt="Foto da Anamnese"
                      className="mt-2 rounded-lg border-2 border-gray-200 max-w-full sm:max-w-md mx-auto h-auto shadow-lg"
                    />
                  </AnamneseDetailSection>
                )}
                <button
                  onClick={handleFecharModalAnamnese}
                  className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors font-medium text-base shadow-md"
                >
                  Fechar Visualização
                </button>
              </div>
            ) : (
              !loadingPage && (
                <p className="p-10 text-center text-gray-500">
                  Nenhuma anamnese encontrada.
                </p>
              )
            )}
          </Modal>
        </main>
      </div>
    </div>
  );
};

const AnamneseDetailSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="py-4 border-b border-gray-200 last:border-b-0">
    <h3 className="text-xl font-semibold text-blue-700 mb-3">{title}</h3>
    <div className="space-y-2 text-sm text-gray-700">{children}</div>
  </div>
);

const DetailItem: React.FC<{
  label: string;
  value: string | number | undefined | null;
  isBlock?: boolean;
}> = ({ label, value, isBlock }) => (
  <p className={isBlock ? "flex flex-col" : "flex justify-between items-start"}>
    <strong className="text-gray-600 font-medium mr-2">{label}:</strong>
    <span className={`text-gray-800 ${isBlock ? "mt-1" : "text-right"}`}>
      {value || "Não informado"}
    </span>
  </p>
);

const formatLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

export default FuncionariosPage;