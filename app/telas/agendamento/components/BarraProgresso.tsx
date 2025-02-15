// Componente de barra de progresso
import React from "react";

interface BarraProgressoProps {
    passoAtual: number;
    totalPassos: number;
  }
  
  const BarraProgresso: React.FC<BarraProgressoProps> = ({ passoAtual, totalPassos }) => {
    const progresso = (passoAtual / totalPassos) * 100;
  
    return (
      <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progresso}%` }}
        />
      </div>
    );
  };
  
  export default BarraProgresso;
  