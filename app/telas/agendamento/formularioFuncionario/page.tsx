import React, { useState, useEffect } from "react";
import FormularioFuncionario from "./FormularioFuncionario";

const Page: React.FC = () => {
  const [passoAtual, setPassoAtual] = useState(0);
  const [usuarioId, setUsuarioId] = useState<number | null>(null); // Estado para armazenar o ID do usuário

  useEffect(() => {
    const id = localStorage.getItem("id"); // Supondo que o ID do usuário esteja armazenado no localStorage
    if (id) {
      setUsuarioId(Number(id)); // Converte o ID para número e armazena no estado
    }
  }, []);

  if (usuarioId === null) {
    return <p>Carregando informações do usuário...</p>; // Exibe uma mensagem enquanto o ID do usuário não é carregado
  }

  return (
    <div className="flex flex-col w-full h-screen p-4">
      <FormularioFuncionario 
        passoAtual={passoAtual} 
        setPassoAtual={setPassoAtual} 
        usuarioId={usuarioId} // Passa o ID do usuário para o FormularioFuncionario
      />
    </div>
  );
};

export default Page;