"use client";

import React, { useEffect, useState } from "react";
// import LandingFooter from "@/app/landing/LandingFooter";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserModal from "@/app/telas/administradores/UserModal";
// import MaskedInput from "@/app/components/InputMask";




interface Usuario {
  id: number;
  nome: string;
  tipodeusuario: string;
}

const AdminPage = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("usuarios");
  // const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<Usuario[]>([]);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const handleScroll = () => {
  //       const isBottom =
  //         window.innerHeight + window.scrollY >= document.body.offsetHeight;
  //       setIsScrolledToBottom(isBottom);
  //     };
  //     window.addEventListener("scroll", handleScroll);
  //     return () => window.removeEventListener("scroll", handleScroll);
  //   }
  // }, []);

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
      let endpoint = "http://localhost:8080/api/usuarios/listar/todos"; // Ajusta para o formato correto
      if (filter !== "todos") {
        endpoint = `http://localhost:8080/api/usuarios/listar/${filter}`; // Usa / ao invés de query param
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
      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const handleSaveUser = async (newUser: {
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    senha: string;
    tipoDeUsuario: string;
  }) => {
    try {
      let endpoint = "api/usuarios";

      switch (newUser.tipoDeUsuario?.toUpperCase()) {
        case "CLIENTE":
          endpoint = "http://localhost:8080/api/usuarios/cadastrar-cliente";
          break;
        case "FUNCIONARIO":
          endpoint = "http://localhost:8080/api/usuarios/cadastrar-funcionario";
          break;
        case "ADMINISTRADOR":
          endpoint =
            "http://localhost:8080/api/usuarios/cadastrar-administrador";
          break;
        default:
          throw new Error("Tipo de usuário inválido");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário");
      }

      const savedUser = await response.text();
      console.log(savedUser); // Exibe a string diretamente
    } catch (error) {
      console.error(error);
      alert("Erro no json ao cadastrar usuário. Tente novamente.");
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
        throw new Error(`Erro ao excluir   usuários: ${response.status}`);
      }

      fetchUsers();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  // const handleEditUser = (userId: number) => {
  //   const user = users.find((user) => user.id === userId);
  //   if (user) {
  //     console.log("Editando usuário:", user);
  //   }
  // };

  return (
    <div className="flex flex-col min-h-screen text-black bg-gray-100">
      <header className="fixed top-0 left-0 w-full bg-white p-4 shadow-md flex justify-between items-center z-10">
        <h1 className="text-xl font-semibold">Painel do Administrador</h1>
        <div className="ml-auto">
          <Link href="/telas/recepcao">
            <span className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-blue-700 hover:text-white">
              Modo Recepção
            </span>
          </Link>
        </div>
        <button
          className="text-red-500 hover:text-red-700 hover:bg-gray-200 px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Sair
        </button>
      </header>

      <div className="flex flex-grow w-full max-w-5xl mx-auto mt-16">
        <nav className="w-1/4 bg-white p-4 shadow-md h-screen fixed left-0 top-16">
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
                selectedTab === "financeiro"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("financeiro")}
            >
              Controle Financeiro
            </li>
          </ul>
        </nav>

        <main className="w-3/4 bg-white p-6 rounded-lg shadow-md ml-auto mt-16">
          {selectedTab === "usuarios" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Gerenciar Usuários</h2>
              <div className="flex gap-4 mb-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
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
              <div className="grid grid-cols-2 gap-4">
                {users
                  .filter((user) =>
                    user.nome.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((user) => (
                    <div key={user.id} className="border p-4 rounded shadow-md">
                      <h3 className="font-semibold">{user.nome}</h3>
                      <p className="text-gray-600">{user.tipodeusuario}</p>
                      <button
                        className="text-blue-500 mt-2"
                        //   value={user.id}
                        //   onClick={() => handleEditUser(user.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="text-red-500 ml-2"
                        value={user.id}
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {modalOpen && (
        <UserModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveUser}
        />
      )}

      {/* <MaskedInput
        type="cpf"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
      />

      <MaskedInput
        type="telefone"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
      /> */}

      {/* <div className="w-full">{isScrolledToBottom && <LandingFooter />}</div> */}
    </div>
  );
};

export default AdminPage;
