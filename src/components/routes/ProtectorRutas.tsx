import { LuLoaderCircle } from "react-icons/lu";
import { Navigate, Outlet } from "react-router";
import { useAppContext } from "../../context/AppContext";

const ProtectorRutas = () => {
  const { usuarioLogueado, verificandoSesion } = useAppContext();

  // Mientras validamos la cookie contra el backend no decidimos nada:
  // si redirigieramos ahora, un F5 en una ruta privada saltaria al login
  // aunque la sesion siguiera vigente.
  if (verificandoSesion) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <LuLoaderCircle className="text-5xl text-blue-600 animate-spin" />
      </section>
    );
  }

  if (!usuarioLogueado) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectorRutas;
