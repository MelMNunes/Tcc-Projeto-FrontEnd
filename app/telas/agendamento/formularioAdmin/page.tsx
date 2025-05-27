import React, { useState, useEffect } from "react";
import FormularioAdmin from "./FormularioAdmin";

const Page: React.FC = () => {
  const [passoAtual, setPassoAtual] = useState(0);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("id"); 
    if (id) {
      setUsuarioId(Number(id));
    }
  }, []);

  if (usuarioId === null) {
    return <p>Carregando informações do usuário...</p>;
  }

  return (
    <div className="flex flex-col w-full h-screen p-4">
      <FormularioAdmin 
        passoAtual={passoAtual} 
        setPassoAtual={setPassoAtual} 
        usuarioId={usuarioId} 
      />
    </div>
  );
};

export default Page;