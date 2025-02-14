"use client";

import React from "react";
import InputMask from "react-input-mask";

interface MaskedInputProps {
  type: "cpf" | "telefone";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const MaskedInput: React.FC<MaskedInputProps> = ({ type, value, onChange, placeholder }) => {
  const masks = {
    cpf: "999.999.999-99",
    telefone: "(99) 99999-9999",
  };

  return (
    <InputMask
      mask={masks[type]}
      value={value}
      onChange={onChange}
    >
      {(inputProps) => (
        <input
          {...inputProps}
          className="border px-4 py-2 rounded w-full"
          placeholder={placeholder || (type === "cpf" ? "CPF" : "Telefone")}
        />
      )}
    </InputMask>
  );
};

export default MaskedInput;
