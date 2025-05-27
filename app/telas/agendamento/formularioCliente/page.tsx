"use client";

import React, { useState, useEffect } from "react";
import BarraProgresso from "../components/BarraProgresso";
import FormularioCliente from "./FormularioCliente";

const AgendamentoPage: React.FC = () => {
  const [passoAtual, setPassoAtual] = useState(0);
  const [clienteId, setclienteId] = useState<number | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("id"); 
    if (id) {
      setclienteId(Number(id)); 
    }
  }, []);

  if (clienteId === null) {
    return <p>Carregando informações do usuário...</p>; 
  }
  
  console.log("Passo atual no AgendamentoPage:", passoAtual);
  return (
    <div className="flex flex-col w-full h-screen p-4">
      
      <BarraProgresso passoAtual={passoAtual} totalPassos={4} />
      
      <FormularioCliente 
        passoAtual={passoAtual} 
        setPassoAtual={setPassoAtual} 
        clienteId={clienteId} 
      />
    </div>
  );
};

export default AgendamentoPage;