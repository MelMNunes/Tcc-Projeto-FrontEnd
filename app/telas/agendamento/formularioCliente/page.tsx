// AgendamentoPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import BarraProgresso from "../components/BarraProgresso";
import FormularioCliente from "./FormularioCliente";

const AgendamentoPage: React.FC = () => {
  const [passoAtual, setPassoAtual] = useState(0);
  const [clienteId, setclienteId] = useState<number | null>(null); // Estado para armazenar o ID do usuário

  useEffect(() => {
    const id = localStorage.getItem("id"); // Supondo que o ID do usuário esteja armazenado no localStorage
    if (id) {
      setclienteId(Number(id)); // Converte o ID para número e armazena no estado
    }
  }, []);

  if (clienteId === null) {
    return <p>Carregando informações do usuário...</p>; // Exibe uma mensagem enquanto o ID do usuário não é carregado
  }
  
  console.log("Passo atual no AgendamentoPage:", passoAtual);
  return (
    <div className="flex flex-col w-full h-screen p-4">
      {/* Barra de Progresso */}
      <BarraProgresso passoAtual={passoAtual} totalPassos={4} />
      
      {/* Conteúdo dos passos */}
      <FormularioCliente 
        passoAtual={passoAtual} 
        setPassoAtual={setPassoAtual} 
        clienteId={clienteId} // Passa o clienteId para o FormularioAgendamento
      />
    </div>
  );
};

export default AgendamentoPage;