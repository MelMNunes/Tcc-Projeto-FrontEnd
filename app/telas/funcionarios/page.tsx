"use client";

import React, { useEffect, useState } from "react";
import LandingFooter from "@/app/landing/LandingFooter";

const FuncionariosPage = () => {
  const [selectedTab, setSelectedTab] = useState("consultas");
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

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
      {/* Header Fixo */}
      <header className="fixed top-0 left-0 w-full bg-white p-4 shadow-md flex justify-between items-center z-10">
        <h1 className="text-xl font-semibold">Painel do Funcionário</h1>
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

      {/* Layout Principal */}
      <div className="flex flex-grow w-full max-w-5xl mx-auto mt-16">
        {/* Menu Lateral Fixo */}
        <nav className="w-1/4 bg-white p-4 shadow-md h-screen fixed left-0 top-16">
          <ul className="space-y-2">
            <li
              className={`p-2 rounded cursor-pointer ${selectedTab === "consultas" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => setSelectedTab("consultas")}
            >
              Consultas
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${selectedTab === "anamnese" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => setSelectedTab("anamnese")}
            >
              Upload de Anamnese
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${selectedTab === "notas" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => setSelectedTab("notas")}
            >
              Notas Internas
            </li>
          </ul>
        </nav>

        {/* Área de Conteúdo */}
        <main className="w-3/4 bg-white p-6 rounded-lg shadow-md ml-auto mt-16">
          {selectedTab === "consultas" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Consultas</h2>
              <p className="text-gray-600">Aqui serão exibidas as consultas diárias, semanais e mensais.</p>
            </div>
          )}
          {selectedTab === "anamnese" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Upload de Anamnese</h2>
              <p className="text-gray-600">Espaço para upload de imagens relacionadas à anamnese do paciente.</p>
            </div>
          )}
          {selectedTab === "notas" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Notas Internas</h2>
              <p className="text-gray-600">Área para adicionar e visualizar notas sobre os pacientes.</p>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <div className="w-full">
      {isScrolledToBottom && <LandingFooter />}
      </div>
    </div>
  );
};

export default FuncionariosPage;
