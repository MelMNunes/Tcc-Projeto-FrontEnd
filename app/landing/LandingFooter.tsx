"use client";

const LandingFooter = () => {
 return (
   <footer className="bg-gray-800 text-gray-300 py-8 text-center mt-16">
     <div className="container mx-auto px-4">
       <p className="text-sm mb-2">
         Rua dos Podólogos, 123 - Santa Cruz do Sul, RS - Brasil
       </p>
       <p className="text-sm">
         &copy; {new Date().getFullYear()} Clínica de Podologia. Todos os direitos
         reservados.
       </p>
     </div>
   </footer>
 );
};

export default LandingFooter;