// AgendamentoPage.tsx
"use client";

import React, { useState } from "react";
import BarraProgresso from "../components/BarraProgresso";
import FormularioCliente from "./FormularioCliente";

interface AgendamentoPageProps {
  clienteId: number; // Adicione esta linha para receber o clienteId
}

const AgendamentoPage: React.FC<AgendamentoPageProps> = ({ clienteId }) => {
  const [passoAtual, setPassoAtual] = useState(0);

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