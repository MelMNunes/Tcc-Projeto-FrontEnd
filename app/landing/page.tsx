// app/LandingPage.tsx
"use client";

import Image from "next/image";
import React from "react";
import LandingHeader from "./LandingHeader";
import LandingFooter from "./LandingFooter";
import Carrossel from "@/app/components/Carrossel";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Carrossel */}
      <Carrossel />

      {/* Header */}
      <LandingHeader />

      {/* Conteúdo principal */}
      <main className="flex-grow">
        {/* Seção Sobre */}
        <section className="py-16 bg-white" id="sobre">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
              Sobre Nós
            </h2>
            <p className="text-center text-lg text-gray-600 mb-12">
              Conheça mais sobre os serviços da nossa clínica de podologia e
              como podemos ajudar você a manter seus pés saudáveis!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex flex-col items-center border-radius: 50%;">
                <Image
                  src="/images/sobre1.jpeg"
                  alt="Sobre 1"
                  className="object-cover w-auto h-auto"
                  width={500}
                  height={500}
                />
                <p className="mt-4 text-center text-lg text-gray-700">
                  Cuidado atencioso com os clientes
                </p>
              </div>
              <div className="flex flex-col items-center border-radius: 50%;">
                <Image
                  src="/images/sobre2.jpeg"
                  alt="Sobre 2"
                  className="object-cover w-auto h-auto"
                  width={500}
                  height={500}
                />
                <p className="mt-4 text-center text-lg text-gray-700">
                  Equipamentos de ponta para tratar seus pés
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Serviços */}
        <section className="py-16 bg-gray-100" id="servicos">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
              Serviços
            </h2>
            <p className="text-center text-lg text-gray-600 mb-12">
              Conheça os serviços que oferecemos para garantir a saúde dos seus
              pés.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img
                    src="https://i.redd.it/rd7nhk0cuxe91.png"
                    alt={`Serviço ${index + 1}`}
                    className="w-full max-w-sm rounded-lg shadow-lg"
                  />
                  <p className="mt-4 text-center text-lg text-gray-700">
                    Descrição do Serviço {index + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção Contato */}
        <section className="py-16 bg-white" id="contato">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
              Contato
            </h2>
            <p className="text-center text-lg text-gray-600 mb-12">
              Entre em contato conosco através das nossas redes sociais.
            </p>
            <div className="flex justify-center gap-8">
              <div className="flex items-center space-x-4">
                <img
                  src="https://i.redd.it/rd7nhk0cuxe91.png"
                  alt="Instagram"
                  className="w-12 h-12 rounded-full"
                />
                <span className="text-lg text-gray-700">
                  @clinica_podologia
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <img
                  src="https://i.redd.it/rd7nhk0cuxe91.png"
                  alt="WhatsApp"
                  className="w-12 h-12 rounded-full"
                />
                <span className="text-lg text-gray-700">(11) 99999-9999</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;