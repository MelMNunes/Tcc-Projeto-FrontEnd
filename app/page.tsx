// page.tsx
"use client";

import LandingHeader from "./landing/LandingHeader";
import LandingPage from "./landing/page";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen pt-16"> {/* pt-16 para garantir que o conteúdo não fique escondido atrás do header fixo */}
      <LandingHeader />
      {/* <div>
        <Cliente />
      </div> */}
      <main className="flex-grow">
        <LandingPage />
        {/* Adicione mais conteúdo aqui */}
      </main>

    </div>
  );
};

export default Page;