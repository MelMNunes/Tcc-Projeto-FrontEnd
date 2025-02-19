"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserModal from "@/app/telas/administradores/UserModal";

interface Usuario {
  id: number;
  nome: string;
  tipoDeUsuario?: string;
}

const AdminPage = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("usuarios");
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<Usuario[]>([]);

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

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
      console.log("Usuários recebidos:", data); // Verificar os dados no console

      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
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

  return (
    <div className="flex min-h-screen text-black bg-gray-100">
      <nav className="w-64 bg-white p-4 shadow-md h-screen fixed top-0 left-0 flex flex-col justify-between">
        <div>
          <h1 className="text-lg font-semibold mb-6 text-center">Painel</h1>
          <ul className="space-y-2">
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "usuarios" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("usuarios")}
            >
              Gerenciar Usuários
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "financeiro" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("financeiro")}
            >
              Controle Financeiro
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "recepcao" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => router.push("/telas/recepcao")}
            >
              Modo Recepção
            </li>
          </ul>
        </div>
        <button
          className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 w-full"
          onClick={handleLogout}
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
              <h2 className="text-2xl font-semibold mb-4">Gerenciar Usuários</h2>
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
                    .filter((user) =>
                      user.nome.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((user) => {
                      console.log("Usuário exibido:", user); // Verificar dados
                      return (
                        <div key={user.id} className="p-4 border rounded-lg shadow">
                          <p>
                            <strong>Nome:</strong> {user.nome}
                          </p>
                          <p>
                            <strong>Tipo:</strong> {user.tipoDeUsuario || "Tipo não informado"}
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
        </main>
      </div>

      {modalOpen && (
        <UserModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={() => fetchUsers()}
        />
      )}
    </div>
  );
};

export default AdminPage;