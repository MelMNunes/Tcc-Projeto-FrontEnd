// import React, { createContext, useContext, useState, ReactNode } from 'react';

// // Definindo o tipo do usuário
// interface User {
//   id: number | null; // O ID pode ser um número ou null
//   name: string;
// }

// // Definindo o tipo do contexto
// interface AuthContextType {
//   user: User;
//   set:User  React.Dispatch<React.SetStateAction<User>>; // Função para atualizar o usuário
// }

// // Criação do contexto com um valor padrão
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Provedor de autenticação
// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser ] = useState<User>({ id: null, name: '' }); // Armazena o ID e nome do usuário

//   return (
//     <AuthContext.Provider value={{ user, setUser  }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook para usar o contexto
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };