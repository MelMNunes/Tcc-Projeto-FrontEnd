"use client";

import LandingHeader from "./landing/LandingHeader";
import LandingPage from "./landing/page";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen pt-16"> 
      <LandingHeader />
      <main className="flex-grow">
        <LandingPage />
      </main>
    </div>
  );
};

export default Page;