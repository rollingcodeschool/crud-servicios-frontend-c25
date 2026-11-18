import { createContext, useContext } from "react";
import type { UsuarioAutenticado } from "../interfaces/usuarios";
// import type { Servicio } from "../interfaces/servicios";

export interface AppContextType {
  usuarioLogueado: boolean;
  setUsuarioLogueado: React.Dispatch<React.SetStateAction<boolean>>;
  usuario: UsuarioAutenticado | null;
  setUsuario: React.Dispatch<React.SetStateAction<UsuarioAutenticado | null>>;
  // servicios: Servicio[];
  // setServicios: React.Dispatch<React.SetStateAction<Servicio[]>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext debe usarse dentro de un AppProvider");
  }
  return context;
}
