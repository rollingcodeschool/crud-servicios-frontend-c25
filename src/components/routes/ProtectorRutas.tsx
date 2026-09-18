import { Navigate, Outlet } from "react-router";
import { useAppContext } from "../../context/AppContext";

const ProtectorRutas = () => {
const { usuarioLogueado } = useAppContext();
  if (!usuarioLogueado) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectorRutas;