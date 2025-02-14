"use client";

import Link from "next/link";

const LandingHeader = () => {
  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-blue-500 text-white fixed w-full top-0 z-10">
      <h1 className="text-2xl font-bold">Clínica de Podologia</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <button
              onClick={() => handleScroll("sobre")}
              className="hover:text-blue-700"
            >
              Sobre
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScroll("servicos")}
              className="hover:text-blue-700"
            >
              Serviços
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScroll("contato")}
              className="hover:text-blue-700"
            >
              Contato
            </button>
          </li>
          <li>
            <Link href="/telas/login">
              <span className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-blue-700 hover:text-white">
                Agendamentos
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default LandingHeader;
