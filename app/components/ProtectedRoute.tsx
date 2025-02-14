import { useEffect } from "react";
import { useRouter } from "next/router";

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const router = useRouter();
  const tipoDeUsuario = localStorage.getItem("tipoDeUsuario");

  useEffect(() => {
    if (!tipoDeUsuario || !allowedRoles.includes(tipoDeUsuario)) {
      router.push("/"); // Redireciona para a página inicial se o usuário não tiver permissão
    }
  }, [tipoDeUsuario, router, allowedRoles]);

  return <>{children}</>;
};

export default ProtectedRoute;