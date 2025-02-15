<<<<<<< HEAD
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
=======
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      console.log(oi)
    </div>
  );
}
>>>>>>> 6fe55e12055a4b6a497ae3e4ee2fba7e8f65ee30
