"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/app/services/authService";
// import MaskedInput from "@/app/components/InputMask";

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

// Componente Button
interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({ children, type = "button" }) => {
  return (
    <button
      type={type}
      className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
    >
      {children}
    </button>
  );
};

// Componente principal de Login e Cadastro
const LoginCadastro = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "cadastro">("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nome, setNome] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Função para login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
        const loginData = { login: email, senha: password };
        const response = await login(loginData);

        if (response.token) {
            localStorage.setItem("token", response.token);
            localStorage.setItem("tipoDeUsuario", response.tipoDeUsuario);

            if (response.nome) {
                localStorage.setItem("user", JSON.stringify({ nome: response.nome }));
            }

            alert("Login realizado com sucesso!");

            // Redirecionamento baseado no tipo de usuário
            switch (response.tipoDeUsuario) {
                case "ADMINISTRADOR":
                    router.push("/telas/administradores");
                    break;
                case "FUNCIONARIO":
                    router.push("/telas/funcionarios");
                    break;
                case "CLIENTE":
                    router.push("/telas/clientes");
                    break;
                default:
                    router.push("/");
            }
        } else {
            setError("Erro ao fazer login. Verifique suas credenciais.");
        }
    } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido ao fazer login.");
    }
};


  // Função para cadastro
  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpa os erros
  
    if (senha !== confirmarSenha) {
      setError("As senhas não conferem!");
      return;
    }
  
    try {
      const response = await register({
        email,
        nome,
        cpf,
        telefone,
        senha,
        tipoDeUsuario: "CLIENTE",
      });
      console.log("Cadastro realizado com sucesso:", response);
      alert("Cadastro realizado com sucesso!");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao realizar cadastro.");
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 font-bold ${
              activeTab === "login"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 font-bold ${
              activeTab === "cadastro"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("cadastro")}
          >
            Cadastro
          </button>
        </div>

        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4 text-black">
            <Input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit">Entrar</Button>
          </form>
        )}

        {activeTab === "cadastro" && (
          <form onSubmit={handleCadastro} className="space-y-4">
            <Input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="text"
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
            <Input
              type="tel"
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirme sua senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit">Cadastrar</Button>
          </form>
        )}

        
      </div>
    </div>
  );
};

export default LoginCadastro;
