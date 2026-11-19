import { createContext, useContext } from "react";
import type { UsuarioAutenticado } from "../interfaces/usuarios";
// import type { Servicio } from "../interfaces/servicios";

export interface AppContextType {
  usuarioLogueado: boolean;
  setUsuarioLogueado: React.Dispatch<React.SetStateAction<boolean>>;
  usuario: UsuarioAutenticado | null;
  setUsuario: React.Dispatch<React.SetStateAction<UsuarioAutenticado | null>>;
  // true mientras validamos la cookie de sesion contra el backend al arrancar
  verificandoSesion: boolean;
  setVerificandoSesion: React.Dispatch<React.SetStateAction<boolean>>;
  // cantidad total de items del carrito del usuario logueado
  cantidadCarrito: number;
  setCantidadCarrito: React.Dispatch<React.SetStateAction<number>>;
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
