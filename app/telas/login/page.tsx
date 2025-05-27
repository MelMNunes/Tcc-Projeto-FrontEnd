"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/services/authService";
import MaskedInput from "@/app/components/InputMask";
import { Eye, EyeOff } from "react-feather";

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

const Button: React.FC<{
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
}> = ({ children, type = "button" }) => {
  return (
    <button
      type={type}
      className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
    >
      {children}
    </button>
  );
};

const LoginCadastro = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "cadastro">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [senha, setSenha] = useState("");
  const [validacoes, setValidacoes] = useState({
    hasUppercase: false,
    haslowercase: false,
    hasNumber: false,
    isLongEnough: false,
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validarSenha = (senha: string) => {
    const hasUppercase = /[A-Z]/.test(senha);
    const haslowercase = /[a-z]/.test(senha);
    const hasNumber = /\d/.test(senha);
    const isLongEnough = senha.length >= 8;

    setValidacoes({
      hasUppercase,
      haslowercase,
      hasNumber,
      isLongEnough,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await login({ login: email, senha: password });

      console.log("Resposta do login:", response); 

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("tipoDeUsuario", response.tipoDeUsuario);
        localStorage.setItem("nome", response.nome);
        localStorage.setItem("id", response.id);
        localStorage.setItem("cpf", response.cpf);
        localStorage.setItem("telefone", response.telefone);
        localStorage.setItem(
          "user",
          JSON.stringify({
            nome: response.nome,
            email: email,
            tipoDeUsuario: response.tipoDeUsuario,
            cpf: response.cpf,
            telefone: response.telefone,
          })
        );

        alert("Login realizado com sucesso!");

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
            console.error(
              "Tipo de usuário não reconhecido:",
              response.tipoDeUsuario
            );
            router.push("/");
        }
      } else {
        setError("Erro ao fazer login. Verifique suas credenciais.");
      }
    } catch (err) {
      console.error("Erro no login:", err);

      if (err instanceof Error) {
        if (err.message.includes("email")) {
          setError("Email incorreto. Tente novamente.");
        } else if (err.message.includes("senha")) {
          setError("Senha incorreta. Tente novamente.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Erro desconhecido ao fazer login.");
      }
    }
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    if (
      !nome ||
      !email ||
      !cpf ||
      !telefone ||
      !senha ||
      !confirmarSenha
    ) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
  
    if (senha !== confirmarSenha) {
      setError("As senhas não são iguais!");
      return;
    }
  
    console.log("Enviando dados para cadastro:", {
      email,
      nome,
      cpf,
      telefone,
      senha,
    });
  
    try {
      const response = await fetch(
        "http://localhost:8080/api/usuarios/cadastrar-cliente",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            nome,
            email,
            cpf,
            telefone,
            senha,
          }),
        }
      );
  
      const contentType = response.headers.get("Content-Type");
      let data = null;
  
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text(); 
        console.warn("Resposta do servidor não é JSON:", data);
      }
  
      console.log("Resposta do servidor:", data);
  
      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
      } else {
        setError(data?.message || "Erro ao cadastrar usuário.");
      }
    } catch (err) {
      console.error("Erro ao cadastrar usuário:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao cadastrar usuário."
      );
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
            <MaskedInput
              type="CPF"
              value={cpf}
              onChange={setCpf}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-black placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
            <MaskedInput
              type="Telefone"
              value={telefone}
              onChange={setTelefone}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-black placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  validarSenha(e.target.value);
                }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute text-black right-3 top-3"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

              <div className="text-sm text-black">
                <p>Requisitos da senha:</p>
                <ul className="list-disc list-inside">
                  <li
                    style={{
                      color: validacoes.hasUppercase ? "green" : "gray",
                    }}
                  >
                    Pelo menos uma letra maiúscula
                  </li>
                  <li
                    style={{
                      color: validacoes.haslowercase ? "green" : "gray",
                    }}
                  >
                    Pelo menos uma letra minúscula
                  </li>
                  <li
                    style={{ color: validacoes.hasNumber ? "green" : "gray" }}
                  >
                    Pelo menos um número
                  </li>
                  <li
                    style={{
                      color: validacoes.isLongEnough ? "green" : "gray",
                    }}
                  >
                    Mínimo de 8 caracteres
                  </li>
                </ul>
              </div>
            </div>

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
      </div>
    </div>
  );
};

export default LoginCadastro;