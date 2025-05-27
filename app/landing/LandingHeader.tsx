"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className="fixed top-0 w-full z-50 bg-sky-600 text-white py-4"
    >
      <div className="container mx-auto px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="text-xl md:text-2xl font-bold hover:text-sky-100 transition-colors duration-300">
          Clínica de Podologia
        </Link>

        <nav className="hidden md:flex items-center space-x-5 lg:space-x-6">
          <button
            onClick={() => handleScrollTo("sobre")}
            className="text-sky-50 hover:text-white transition-colors duration-300"
          >
            Sobre
          </button>
          <button
            onClick={() => handleScrollTo("servicos")}
            className="text-sky-50 hover:text-white transition-colors duration-300"
          >
            Serviços
          </button>
          <button
            onClick={() => handleScrollTo("contato")}
            className="text-sky-50 hover:text-white transition-colors duration-300"
          >
            Contato
          </button>
          <Link href="/telas/login">
            <span className="bg-white text-sky-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-sky-50 transition-all duration-300">
              Agendamentos
            </span>
          </Link>
        </nav>

        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none hover:text-sky-100"
          >
            {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-sky-600 py-3 border-t border-sky-500">
          <nav className="flex flex-col items-center space-y-2">
            <button
              onClick={() => handleScrollTo("sobre")}
              className="text-sky-50 hover:text-white transition-colors duration-300 py-2 w-full text-center"
            >
              Sobre
            </button>
            <button
              onClick={() => handleScrollTo("servicos")}
              className="text-sky-50 hover:text-white transition-colors duration-300 py-2 w-full text-center"
            >
              Serviços
            </button>
            <button
              onClick={() => handleScrollTo("contato")}
              className="text-sky-50 hover:text-white transition-colors duration-300 py-2 w-full text-center"
            >
              Contato
            </button>
            <Link href="/telas/login" className="w-full px-6 pt-2 pb-3">
              <span className="block text-center bg-white text-sky-700 px-4 py-2.5 rounded-md hover:bg-sky-50 transition-colors duration-300 font-medium">
                Agendamentos
              </span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;