"use client";

import React from "react";

interface MaskedInputProps {
  type: "CPF" | "Telefone";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const applyMask = (value: string, type: "CPF" | "Telefone") => {
  value = value.replace(/\D/g, ""); // Remove tudo que não for dígito

  if (type === "CPF") {
    return value
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2")
      .slice(0, 14); // Limita o tamanho do CPF
  } else if (type === "Telefone") {
    return value
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15); // Limita o tamanho do telefone
  }

  return value;
};

const MaskedInput: React.FC<MaskedInputProps & { className?: string }> = ({ 
  type, 
  value, 
  onChange, 
  placeholder, 
  className = "" 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(applyMask(e.target.value, type));
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      className={`appearance-none bg-transparent focus:outline-none ${className}`}
      placeholder={placeholder || (type === "CPF" ? "Digite seu CPF" : "Digite seu telefone")}
    />
  );
};

export default MaskedInput;