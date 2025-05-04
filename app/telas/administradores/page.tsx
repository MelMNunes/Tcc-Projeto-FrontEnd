"use client";

import React, { useEffect, useState } from "react";
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
  senha: string;
}

const AdminPage = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("usuarios");
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false); // Novo estado para o modal de senha
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<Usuario[]>([]);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [adminPassword, setAdminPassword] = useState(""); // Estado para armazenar a senha digitada
  const [passwordError, setPasswordError] = useState(""); // Estado para armazenar erros de senha
  // const [searchTerm] = useState<string>("");

  useEffect(() => {
    fetchUsers();
    fetchAdminData();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      let endpoint = "http://localhost:8080/api/usuarios/listar/todos";
      if (filter !== "todos") {
        endpoint = `http://localhost:8080/api/usuarios/listar/${filter}`;
      }

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar usuários: ${response.status}`);
      }

      const data: Usuario[] = await response.json();
      console.log("Usuários recebidos:", data);
      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const fetchAdminData = () => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        console.log("Dados do administrador:", userData);
        setAdminData({
          id: userData.id,
          nome: userData.nome,
          email: userData.email,
          telefone: userData.telefone || "Não informado",
          cpf: userData.cpf || "Não informado",
          senha: userData.senha || "Não informada",
        });
      } catch (error) {
        console.error("Erro ao recuperar dados do administrador:", error);
      }
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/usuarios/excluir/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao excluir usuários: ${response.status}`);
      }

      fetchUsers();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  const handleOpenReception = () => {
    setPasswordModalOpen(true); // Abre o modal de senha
  };

  const handlePasswordSubmit = () => {
    if (adminData && adminPassword === adminData.senha) {
      setPasswordModalOpen(true);
      router.push("app/telas/recepcao/page"); // Redireciona para a tela de recepção
    } else {
      setPasswordError("Senha incorreta. Tente novamente."); // Exibe erro se a senha estiver incorreta
    }
  };

  return (
    <div className="flex min-h-screen text-black bg-gray-100">
      <nav className="w-64 bg-white p-4 shadow-md h-screen fixed top-0 left-0 flex flex-col justify-between">
        <div>
          <h1 className="text-lg font-semibold mb-6 text-center">Painel</h1>
          <ul className="space-y-2">
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "usuarios"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("usuarios")}
            >
              Gerenciar Usuários
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "recepcao"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={handleOpenReception} // Abre o modal de senha ao clicar
            >
              Modo Recepção
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "perfil"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("perfil")}
            >
              Perfil
            </li>
          </ul>
        </div>
        <button
          onClick={() => {
            const confirmar = confirm("Tem certeza que deseja sair?");
            if (confirmar) {
              window.location.href = "/";
            }
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sair
        </button>
      </nav>

      <div className="flex flex-col flex-grow ml-64 min-h-screen">
        <header className="w-full bg-white shadow-md p-4">
          <h2 className="text-2xl font-semibold">Tela do Administrador</h2>
        </header>

        <main className="flex-grow p-8">
          {selectedTab === "usuarios" && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Gerenciar Usuários
              </h2>
              <div className="flex gap-4 mb-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => setModalOpen(true)}
                >
                  Cadastrar Novo Usuário
                </button>
                <select
                  className="border px-4 py-2 rounded"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="todos">Todos</option>
                  <option value="CLIENTE">Clientes</option>
                  <option value="FUNCIONARIO">Funcionários</option>
                  <option value="ADMINISTRADOR">Administradores</option>
                </select>
                <input
                  type="text"
                  placeholder="Buscar usuário"
                  className="border px-4 py-2 rounded"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {users.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {users
                    .filter(
                      (user) =>
                        user.nome
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                        user.cpf.includes(search) ||
                        user.telefone.includes(search)
                    )
                    .map((user) => {
                      console.log("Usuário exibido:", user);
                      return (
                        <div
                          key={user.id}
                          className="p-4 border rounded-lg shadow"
                        >
                          <p>
                            <strong>Nome:</strong> {user.nome}
                          </p>
                          <p>
                            <strong>Email:</strong> {user.email}
                          </p>
                          <p>
                            <strong>Telefone:</strong>{" "}
                            {user.telefone || "Não informado"}
                          </p>
                          <p>
                            <strong>CPF:</strong> {user.cpf || "Não informado"}
                          </p>
                          <p>
                            <strong>Tipo:</strong>{" "}
                            {user.tipoDeUsuario || "Tipo não informado"}
                          </p>
                          <button
                            className="text-red-500 mt-2"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Excluir
                          </button>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-gray-600">Nenhum usuário encontrado.</p>
              )}
            </section>
          )}
          {selectedTab === "perfil" && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Perfil</h2>
              {adminData ? (
                <div className="space-y-4">
                  <div>
                    <strong>Nome:</strong> {adminData.nome}
                  </div>
                  <div>
                    <strong>CPF:</strong> {adminData.cpf || "Não informado"}
                  </div>
                  <div>
                    <strong>Email:</strong> {adminData.email}
                  </div>
                  <div>
                    <strong>Telefone:</strong>{" "}
                    {adminData.telefone || "Não informado"}
                  </div>
                  <div>
                    <strong>Senha:</strong> <span>••••••••</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">
                  Carregando dados do administrador...
                </p>
              )}
            </section>
          )}
        </main>
      </div>

      {modalOpen && (
        <UserModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={() => fetchUsers()}
        />
      )}

      {/* Modal de Senha */}
      {passwordModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">
              Digite a Senha do Administrador
            </h2>
            <input
              type="password"
              placeholder="Senha"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="border px-4 py-2 rounded w-full mb-2"
            />
            {passwordError && <p className="text-red-500">{passwordError}</p>}
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handlePasswordSubmit}
              >
                Confirmar
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 ml-2"
                onClick={() => setPasswordModalOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
