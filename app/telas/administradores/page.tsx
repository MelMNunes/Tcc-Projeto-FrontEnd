"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import UserModal from "@/app/telas/administradores/UserModal";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  tipoDeUsuario?: string;
}

interface AdminData {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  senha?: string;
  tipoDeUsuario?: string;
}

interface Servico {
  id?: number;
  nome: string;
  descricao: string;
  preco: number | string;
  duracao_minutos: number | string;
}

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);
const ServicesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.023.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.982l7.5-4.04a2.25 2.25 0 0 1 2.134 0l7.5 4.04a2.25 2.25 0 0 1 1.183 1.982V17.25Z" />
  </svg>
);
const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);
const ReceptionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6A2.25 2.25 0 0 1 18.75 5.25V9m-13.5 0V5.25A2.25 2.25 0 0 0 7.5 3h1.062a2.25 2.25 0 0 1 2.122 1.5H13.5A2.25 2.25 0 0 1 15.75 3h1.062a2.25 2.25 0 0 0 2.122-1.5H21A2.25 2.25 0 0 1 23.25 5.25V9M8.25 9h2.25m-.195 3.99A2.25 2.25 0 0 1 9.75 15h-.033A2.25 2.25 0 0 1 7.5 12.99V9.75m0 3.24A2.25 2.25 0 0 1 9.75 15h.033A2.25 2.25 0 0 1 12 12.99V9.75m0 3.24A2.25 2.25 0 0 1 14.25 15h.033A2.25 2.25 0 0 1 16.5 12.99V9.75m0 3.24a2.25 2.25 0 0 1 2.25-2.25h.033a2.25 2.25 0 0 1 2.225 2.25v3.728a2.25 2.25 0 0 1-2.25 2.25H7.5a2.25 2.25 0 0 1-2.25-2.25V12.99Z" />
    </svg>
);
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
  </svg>
);

const AdminPage = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<string>("usuarios");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("todos");
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState<Usuario[]>([]);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingProfile, setEditingProfile] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>("");
  const [newTelefone, setNewTelefone] = useState<string>("");
  const [newSenha, setNewSenha] = useState<string>("");

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [newServico, setNewServico] = useState<Servico>({
    nome: "",
    descricao: "",
    preco: "",
    duracao_minutos: "",
  });
  const [addingServico, setAddingServico] = useState<boolean>(false);

  const API_BASE_URL = "http://localhost:8080/api";

  const fetchAdminDataFromStorage = useCallback(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);

        console.log("AdminPage: Dados brutos do localStorage ('user'):", userData);
        console.log("AdminPage: Valor de userData.cpf:", userData.cpf, "| Tipo:", typeof userData.cpf);
        console.log("AdminPage: Valor de userData.telefone:", userData.telefone, "| Tipo:", typeof userData.telefone);

        const processField = (value: any): string => {
            if (value && typeof value === 'string' && value.trim() !== "") {
                return value.trim();
            }
            if (value === 0) {
                 return "0";
            }
            if (typeof value === 'number') {
                return String(value);
            }
            return "Não informado";
        };

        const finalCpf = processField(userData.cpf);
        const finalTelefone = processField(userData.telefone);

        console.log("AdminPage: Valor final para CPF:", finalCpf);
        console.log("AdminPage: Valor final para Telefone:", finalTelefone);

        setAdminData({
          id: userData.id,
          nome: userData.nome || "Nome não disponível",
          email: userData.email || "Email não disponível",
          telefone: finalTelefone,
          cpf: finalCpf,         
          tipoDeUsuario: userData.tipoDeUsuario || "Não especificado",
        });

        setNewEmail(userData.email || "");
        setNewTelefone(finalTelefone === "Não informado" ? "" : finalTelefone);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao recuperar dados do admin do localStorage:", error);
        alert("Erro ao carregar dados do administrador. Verifique o console.");
        setLoading(false);
      }
    } else {
        alert("Sessão não encontrada ou dados de usuário ausentes no localStorage. Redirecionando...");
        setLoading(false); 
        router.push("/");
    }
  }, [router]);

  useEffect(() => {
    setLoading(true); 
    fetchAdminDataFromStorage();
  }, [fetchAdminDataFromStorage]);

  const fetchUsers = useCallback(async () => {
    if (!adminData) return;
    setLoading(true); 
    try {
      const endpoint = filter === "todos"
        ? `${API_BASE_URL}/usuarios/listar/todos`
        : `${API_BASE_URL}/usuarios/listar/${filter}`;
      const response = await fetch(endpoint, { cache: "no-cache" });
      if (!response.ok) throw new Error(`Erro ${response.status} ao buscar usuários.`);
      const data: Usuario[] = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      alert(error instanceof Error ? error.message : "Falha ao carregar usuários.");
      setUsers([]);
    } finally {
      setLoading(false); 
    }
  }, [filter, adminData]); 

  useEffect(() => {
    if (selectedTab === "usuarios" && adminData) {
      fetchUsers();
    }
  }, [selectedTab, fetchUsers, adminData]); 

  const fetchServicos = useCallback(async () => {
    if (!adminData) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/servicos/listar`, { cache: "no-cache" });
      if (!response.ok) throw new Error(`Erro ${response.status} ao buscar serviços.`);
      const data = await response.json();
      setServicos(data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      alert(error instanceof Error ? error.message : "Falha ao carregar serviços.");
      setServicos([]);
    } finally {
      setLoading(false);
    }
  }, [adminData]); 

  useEffect(() => {
    if (selectedTab === "servicos" && adminData) {
      fetchServicos();
    }
  }, [selectedTab, fetchServicos, adminData]);

  const handleAddServico = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServico.nome.trim() || !newServico.descricao.trim()) {
        alert("Nome e Descrição do serviço são obrigatórios.");
        return;
    }
    const precoValido = parseFloat(String(newServico.preco));
    const duracaoValida = parseInt(String(newServico.duracao_minutos));

    if (isNaN(precoValido) || precoValido <= 0) {
      alert("Por favor, insira um preço válido (número positivo).");
      return;
    }
    if (isNaN(duracaoValida) || duracaoValida <= 0) {
      alert("Por favor, insira uma duração válida (número positivo em minutos).");
      return;
    }

    const servicoParaAdicionar = {
      nome: newServico.nome,
      descricao: newServico.descricao,
      preco: precoValido,
      duracao_minutos: duracaoValida,
    };

    setAddingServico(true);
    try {
      const response = await fetch(`${API_BASE_URL}/servicos/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(servicoParaAdicionar),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Erro ao adicionar serviço: ${errorData || response.status}`);
      }
      setNewServico({ nome: "", descricao: "", preco: "", duracao_minutos: "" });
      fetchServicos(); 
      alert("Serviço adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar serviço:", error);
      alert(error instanceof Error ? error.message : "Ocorreu um erro ao adicionar o serviço.");
    } finally {
      setAddingServico(false);
    }
  };

  const handleDeleteServico = async (id?: number) => {
    if (!id) return;
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/servicos/excluir/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Erro ${response.status} ao excluir serviço.`);
      fetchServicos(); 
      alert("Serviço excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      alert(error instanceof Error ? error.message : "Ocorreu um erro ao excluir o serviço.");
    }
  };

const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminData?.id) {
        alert("Dados do administrador não carregados.");
        return;
    }

    const payload: any = {
        nome: adminData.nome, 
        email: newEmail,
        telefone: newTelefone.trim() || null, 
        tipoDeUsuario: adminData.tipoDeUsuario,
    };
    if (newSenha.trim() !== "") {
        payload.senha = newSenha;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/usuarios/editar/${adminData.id}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            }
        );

        if (response.ok) {
            const successMessage = await response.text(); 
            console.log("Mensagem de sucesso do servidor:", successMessage);
            alert("Perfil atualizado com sucesso!");
            const processField = (value: any): string => {
                if (value && typeof value === 'string' && value.trim() !== "") return value.trim();
                if (typeof value === 'number') return String(value);
                if (value === null || value === undefined || String(value).trim() === "") return "Não informado"; 
                return String(value);
            };
            
            const updatedAdminDataForState = {
                ...adminData, 
                id: adminData.id, 
                email: newEmail,
                telefone: processField(newTelefone),
            };
            setAdminData(updatedAdminDataForState);

            const userFromStorage = JSON.parse(localStorage.getItem("user") || "{}");
            userFromStorage.id = adminData.id; 
            userFromStorage.email = newEmail; 
            userFromStorage.nome = adminData.nome; 
            userFromStorage.telefone = processField(newTelefone); 
            userFromStorage.cpf = adminData.cpf;
            userFromStorage.tipoDeUsuario = adminData.tipoDeUsuario;
            localStorage.setItem("user", JSON.stringify(userFromStorage));

            setNewTelefone(processField(newTelefone) === "Não informado" ? "" : processField(newTelefone));
            setNewSenha("");
            setEditingProfile(false); 

        } else {
            const errorMessage = await response.text(); 
            alert(`Erro ao atualizar perfil: ${errorMessage || `Erro ${response.status}`}`);
        }
    } catch (error) {
        console.error("Erro de rede ou ao atualizar perfil:", error);
        alert(`Ocorreu um erro de rede ou inesperado: ${ (error instanceof Error) ? error.message : "Erro desconhecido"}`);
    }
};


  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/usuarios/excluir/${userId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error(`Erro ${response.status} ao excluir usuário.`);
      fetchUsers();
      alert("Usuário excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      alert(error instanceof Error ? error.message : "Ocorreu um erro ao excluir o usuário.");
    }
  };

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      router.push("/");
    }
  };

  const modoRecepcao = () => {
    if (confirm("Tem certeza que deseja entrar no modo recepção?")) {
      router.push("/telas/recepcao");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nome.toLowerCase().includes(search.toLowerCase()) ||
      (user.cpf && user.cpf.includes(search)) ||
      (user.telefone && user.telefone.includes(search)) 
  );

  const NavLink: React.FC<{tabName: string; currentTab: string; onClick: () => void; icon?: React.ReactNode; label: string; isExternal?: boolean}> =
    ({ tabName, currentTab, onClick, icon, label, isExternal = false }) => (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out group
                    ${ !isExternal && currentTab === tabName
                        ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                        : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                    }`}
      >
        {icon && <span className="mr-3 opacity-90 group-hover:opacity-100">{icon}</span>}
        <span>{label}</span>
      </button>
    </li>
  );

  const renderContent = () => {
    if (loading || !adminData) {
        return (
            <div className="flex justify-center items-center h-full pt-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="ml-3 text-lg text-gray-600">Carregando...</p>
            </div>
        );
    }

    switch (selectedTab) {
      case "usuarios":
        return (
          <section className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700">
                Gerenciar Usuários
              </h2>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center w-full sm:w-auto justify-center"
                onClick={() => setModalOpen(true)}
              >
                <UsersIcon /> <span className="ml-2">Cadastrar Novo</span>
              </button>
            </div>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label htmlFor="searchUser" className="sr-only">Buscar usuário</label>
                <input
                  id="searchUser" type="text" placeholder="Buscar por nome, CPF ou telefone"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 text-sm"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="filterUserType" className="sr-only">Filtrar por tipo</label>
                <select
                  id="filterUserType"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 text-sm text-black bg-white"
                  value={filter} onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="todos">Todos os Tipos</option>
                  <option value="CLIENTE">Clientes</option>
                  <option value="FUNCIONARIO">Funcionários</option>
                  <option value="ADMINISTRADOR">Administradores</option>
                </select>
              </div>
            </div>
            {loading && !filteredUsers.length ? (
              <div className="text-center py-10">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                 <p className="text-gray-500">Carregando usuários...</p>
              </div>
            ) : !loading && filteredUsers.length > 0 ? (
              <div className="overflow-x-auto shadow-md rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Telefone</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">CPF</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">{user.telefone || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">{user.cpf || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${ user.tipoDeUsuario === 'ADMINISTRADOR' ? 'bg-red-100 text-red-800' : user.tipoDeUsuario === 'FUNCIONARIO' ? 'bg-yellow-100 text-yellow-800' : user.tipoDeUsuario === 'CLIENTE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800' }`}>
                            {user.tipoDeUsuario || "Não definido"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button type="button" onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800 transition duration-150 hover:underline" aria-label={`Excluir usuário ${user.nome}`}>Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (<p className="text-center text-gray-500 py-10 text-lg">Nenhum usuário encontrado.</p>)}
          </section>
        );

       case "servicos":
        return (
          <section className="bg-white p-4 sm:p-6 rounded-xl shadow-lg text-black">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-6">Gerenciar Serviços</h2>
            <form onSubmit={handleAddServico} className="mb-8 p-4 sm:p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <h3 className="text-xl font-medium text-gray-700 col-span-1 md:col-span-2 mb-2">Adicionar Novo Serviço</h3>
              <div>
                <label htmlFor="servicoNome" className="block text-sm font-medium text-gray-700 mb-1">Nome <span className="text-red-500">*</span></label>
                <input id="servicoNome" type="text" placeholder="Ex: Unha Encravada" value={newServico.nome} onChange={(e) => setNewServico({ ...newServico, nome: e.target.value })} className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm" required />
              </div>
              <div>
                <label htmlFor="servicoDescricao" className="block text-sm font-medium text-gray-700 mb-1">Descrição <span className="text-red-500">*</span></label>
                <input id="servicoDescricao" type="text" placeholder="Ex: Desencrava unhas" value={newServico.descricao} onChange={(e) => setNewServico({ ...newServico, descricao: e.target.value })} className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm" required />
              </div>
              <div>
                <label htmlFor="servicoPreco" className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) <span className="text-red-500">*</span></label>
                <input id="servicoPreco" type="number" placeholder="Ex: 50.00" value={newServico.preco} onChange={(e) => setNewServico({ ...newServico, preco: e.target.value })} className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm" min="0.01" step="0.01" required />
              </div>
              <div>
                <label htmlFor="servicoDuracao" className="block text-sm font-medium text-gray-700 mb-1">Duração (minutos) <span className="text-red-500">*</span></label>
                <input id="servicoDuracao" type="number" placeholder="Ex: 30" value={newServico.duracao_minutos} onChange={(e) => setNewServico({ ...newServico, duracao_minutos: e.target.value })} className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm" min="1" step="1" required />
              </div>
              <div className="md:col-span-2 flex justify-end mt-2">
                <button type="submit" disabled={addingServico} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto">
                  {addingServico ? "Adicionando..." : "Adicionar Serviço"}
                </button>
              </div>
            </form>
            {loading && !servicos.length ? (
               <div className="text-center py-10">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                 <p className="text-gray-500">Carregando serviços...</p>
              </div>
            ) : servicos.length > 0 ? (
              <div className="overflow-x-auto shadow-md rounded-lg border">
                 <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Descrição</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duração</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {servicos.map((servico) => (
                      <tr key={servico.id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{servico.nome}</td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-xs truncate hidden md:table-cell" title={servico.descricao}>{servico.descricao}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">R$ {Number(servico.preco).toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{servico.duracao_minutos} min</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button type="button" onClick={() => handleDeleteServico(servico.id)} className="text-red-600 hover:text-red-800 transition duration-150 hover:underline" aria-label={`Excluir serviço ${servico.nome}`}>Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (<p className="text-center text-gray-500 py-10 text-lg">Nenhum serviço cadastrado.</p>)}
          </section>
        );
      case "perfil":
        if (!adminData) {
           return <div className="text-center text-gray-500 py-10">Carregando dados do perfil...</div>;
        }
        return (
          <section className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-xl mx-auto text-black">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-8 text-center">
              Meu Perfil
            </h2>
            {!editingProfile ? (
              <div className="space-y-5">
                <div className="pb-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-black">Nome</p>
                  <p className="text-lg text-black">{adminData.nome}</p>
                </div>
                <div className="pb-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-black">CPF</p>
                  <p className="text-lg text-black">{adminData.cpf}</p>
                </div>
                <div className="pb-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-black">Email</p>
                  <p className="text-lg text-black">{adminData.email}</p>
                </div>
                <div className="pb-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-black">Telefone</p>
                  <p className="text-lg text-black">{adminData.telefone}</p>
                </div>
                <div className="pb-3">
                  <p className="text-sm font-medium text-black">Senha</p>
                  <p className="text-lg text-black">••••••••</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                      if (adminData) {
                        setNewEmail(adminData.email);
                        setNewTelefone(adminData.telefone === "Não informado" ? "" : adminData.telefone);
                        setNewSenha("");
                        setEditingProfile(true);
                      }
                  }}
                  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out"
                >
                  Editar Perfil
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-6 text-black">
                 <div>
                  <label htmlFor="profileNome" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <p id="profileNome" className="text-sm p-3 bg-gray-100 rounded-md text-gray-500">{adminData.nome} (Não editável)</p>
                </div>
                 <div>
                  <label htmlFor="profileCPF" className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <p id="profileCPF" className="text-sm p-3 bg-gray-100 rounded-md text-gray-500">{adminData.cpf} (Não editável)</p>
                </div>
                <div>
                  <label htmlFor="profileEmail" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input id="profileEmail" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm" required />
                </div>
                <div>
                  <label htmlFor="profileTelefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input id="profileTelefone" type="tel" value={newTelefone} onChange={(e) => setNewTelefone(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="(XX) XXXXX-XXXX" />
                </div>
                <div>
                  <label htmlFor="profileSenha" className="block text-sm font-medium text-gray-700 mb-1">Nova Senha (mín. 8 caracteres, 1 letra maiuscula, 1 letra minuscula e 1 número)</label>
                  <input id="profileSenha" type="password" value={newSenha} onChange={(e) => setNewSenha(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Deixe em branco para não alterar" minLength={6} />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button type="submit" className="w-full sm:w-auto flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out">Salvar Alterações</button>
                  <button type="button" onClick={() => { setEditingProfile(false); if (adminData) { setNewEmail(adminData.email); setNewTelefone(adminData.telefone === "Não informado" ? "" : adminData.telefone); } setNewSenha(""); }}
                    className="w-full sm:w-auto flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out">
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </section>
        );
      default:
        return <p className="text-center text-gray-500 py-10">Selecione uma opção no menu.</p>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <nav className="w-64 bg-white p-5 shadow-xl h-full fixed top-0 left-0 flex flex-col justify-between print:hidden transition-transform duration-300 ease-in-out">
        <div>
          <div className="text-center mb-10 pt-2">
            <h1 className="text-2xl font-bold text-blue-700">Painel Admin</h1>
            {adminData && <p className="text-sm text-gray-500 mt-1">Olá, {adminData.nome?.split(" ")[0]}</p>}
          </div>
          <ul className="space-y-3">
            <NavLink tabName="usuarios" currentTab={selectedTab} onClick={() => setSelectedTab("usuarios")} icon={<UsersIcon />} label="Usuários" />
            <NavLink tabName="servicos" currentTab={selectedTab} onClick={() => setSelectedTab("servicos")} icon={<ServicesIcon />} label="Serviços" />
            <NavLink tabName="recepcao" currentTab={selectedTab} onClick={modoRecepcao} icon={<ReceptionIcon />} label="Modo Recepção" isExternal={true}/>
            <NavLink tabName="perfil" currentTab={selectedTab} onClick={() => setSelectedTab("perfil")} icon={<ProfileIcon />} label="Meu Perfil" />
          </ul>
        </div>
        <button type="button" onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out">
          <LogoutIcon />
          <span className="ml-2">Sair</span>
        </button>
      </nav>

      <div className="flex flex-col flex-grow ml-64">
        <header className="w-full bg-white shadow-md p-5 print:hidden sticky top-0 z-20 border-b border-gray-200">
            <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 capitalize">
                    {selectedTab.replace("usuarios", "Gerenciamento de Usuários").replace("servicos", "Gerenciamento de Serviços").replace("perfil", "Configurações de Perfil").replace("recepcao", "Modo Recepção")}
                </h2>
                {adminData && <p className="text-gray-600">Olá, {adminData.nome}</p>}
            </div>
        </header>
        <main className="flex-grow p-4 sm:p-8 overflow-y-auto bg-slate-50">
          {renderContent()}
        </main>
      </div>

      {modalOpen && (
        <UserModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={(newUser) => { 
             setModalOpen(false);
             if (selectedTab === "usuarios") {
                 fetchUsers();
             }
          }}
        />
      )}
    </div>
  );
};

export default AdminPage;