import React, { useState, useEffect } from "react";
import FormularioFuncionario from "./FormularioFuncionario";

const Page: React.FC = () => {
  const [passoAtual, setPassoAtual] = useState(0);
  const [funcionarioId, setfuncionarioId] = useState<number | null>(null);
  useEffect(() => {
    const id = localStorage.getItem("id"); 
    if (id) {
      setfuncionarioId(Number(id)); 
    }
  }, []);

  if (funcionarioId === null) {
    return <p>Carregando informações do usuário...</p>; 
  }

  return (
    <div className="flex flex-col w-full h-screen p-4 text-black">
      <FormularioFuncionario
        passoAtual={passoAtual} 
        setPassoAtual={setPassoAtual} 
        funcionarioId={funcionarioId}
      />
    </div>
  );
};

export default Page;