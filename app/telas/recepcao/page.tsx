"use client";

import React, { useEffect, useState } from "react";
import LandingFooter from "@/app/landing/LandingFooter";

const RecepcaoPage = () => {
  const [selectedTab, setSelectedTab] = useState("agendamentos");
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;
      setIsScrolledToBottom(isBottom);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-black bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white p-4 shadow-md flex justify-between items-center z-10">
        <h1 className="text-xl font-semibold">Painel da Recepção</h1>
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
      <div className="flex flex-grow w-full max-w-6xl mx-auto mt-16">
        {/* Menu Lateral */}
        <nav className="w-1/4 bg-white p-4 shadow-md h-screen fixed left-0 top-16">
          <ul className="space-y-2">
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "agendamentos"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("agendamentos")}
            >
              Agendamentos
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "fila"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("fila")}
            >
              Fila de Atendimento
            </li>
            <li
              className={`p-2 rounded cursor-pointer ${
                selectedTab === "pagamentos"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTab("pagamentos")}
            >
              Pagamentos
            </li>
          </ul>
        </nav>

        {/* Área de Conteúdo */}
        <main className="w-3/4 bg-white p-6 rounded-lg shadow-md ml-auto mt-16">
          {selectedTab === "agendamentos" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Agendamentos</h2>
              <p className="text-gray-600">Calendário e consultas do dia.</p>
            </div>
          )}
          {selectedTab === "fila" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Fila de Atendimento
              </h2>
              <p className="text-gray-600">
                Lista de pacientes aguardando atendimento.
              </p>
            </div>
          )}
          {selectedTab === "pagamentos" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Pagamentos</h2>
              <p className="text-gray-600">
                Confirmação de pagamentos e métodos utilizados.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <div className="w-full">{isScrolledToBottom && <LandingFooter />}</div>
    </div>
  );
};

export default RecepcaoPage;
