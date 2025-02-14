"use client";

import React, { useEffect, useState } from "react";
import LandingFooter from "@/app/landing/LandingFooter";

const ClientesPage = () => {
  const [nome, setNome] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState("consultas");
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setNome(userData.nome || "Usuário");
      } catch (error) {
        console.error("Erro ao recuperar dados do usuário:", error);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
      setIsScrolledToBottom(isBottom);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-black bg-gray-100">
      <header className="fixed top-0 left-0 w-full bg-white p-4 shadow-md flex justify-between items-center z-10">
        <h1 className="text-xl font-semibold">Olá, {nome}!</h1>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Sair
        </button>
      </header>

      <div className="flex flex-grow w-full max-w-5xl mx-auto mt-16">
        <nav className="w-1/4 bg-white p-4 shadow-md h-screen fixed left-0 top-16">
          <ul className="space-y-2">
            <li
              className={`p-2 rounded cursor-pointer ${selectedTab === "consultas" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => setSelectedTab("consultas")}
            >
              Próximas Consultas
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${selectedTab === "historico" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => setSelectedTab("historico")}
            >
              Histórico
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${selectedTab === "perfil" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => setSelectedTab("perfil")}
            >
              Perfil
            </li>
          </ul>
        </nav>

        <main className="w-3/4 bg-white p-6 rounded-lg shadow-md ml-auto mt-16">
          {selectedTab === "consultas" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Próximas Consultas</h2>
              <p className="text-gray-600">Aqui serão exibidas as próximas consultas agendadas do cliente.</p>
            </div>
          )}
          {selectedTab === "historico" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Histórico</h2>
              <p className="text-gray-600">Aqui será exibido o histórico de consultas do cliente.</p>
            </div>
          )}
          {selectedTab === "perfil" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Perfil</h2>
              <p className="text-gray-600">Aqui serão exibidas as informações do perfil do cliente.</p>
            </div>
          )}
        </main>
      </div>

      <div className="w-full">
      {isScrolledToBottom && <LandingFooter />}
      </div>
    </div>
  );
};

export default ClientesPage;
