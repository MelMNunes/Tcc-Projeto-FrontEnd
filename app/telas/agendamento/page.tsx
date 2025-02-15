'use client';

import React, { useState } from "react";
import BarraProgresso from "./components/BarraProgresso";
import FormularioAgendamento from "./FormularioAgendamento";

const AgendamentoPage: React.FC = () => {
  const [passoAtual, setPassoAtual] = useState(0);

  return (
    <div className="flex flex-col w-full h-screen p-4">
      {/* Barra de Progresso */}
      <BarraProgresso passoAtual={passoAtual} totalPassos={4} />
      
      {/* Conteúdo dos passos */}
      {/* <div className="flex flex-col items-center justify-center flex-1"> */}
        <FormularioAgendamento passoAtual={passoAtual} setPassoAtual={setPassoAtual} />
      {/* </div> */}
    </div>
  );
};

export default AgendamentoPage;
