import { Link } from "react-router";
import type { Servicio } from "../../interfaces/servicios";
import { useAppContext } from "../../context/AppContext";
import Swal from "sweetalert2";
import { LuTrash2, LuPencil } from "react-icons/lu";

interface ItemTablaProps {
  servicio: Servicio;
  fila: number;
}

const ItemTabla = ({ servicio, fila }: ItemTablaProps) => {
  const { setServicios, servicios } = useAppContext();

  const borrarServicio = (idServicio: string) => {
    const serviciosFiltrados = servicios.filter(
      (itemServicio) => itemServicio.id !== idServicio,
    );
    setServicios(serviciosFiltrados);
  };

  const eliminarServicio = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No se puede revertir este proceso",
      icon: "warning",
      background: "#18181b", // zinc-900
      color: "#f4f4f5", // zinc-100
      showCancelButton: true,
      confirmButtonColor: "#3b82f6", // blue-500
      cancelButtonColor: "#ef4444", // red-500
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        borrarServicio(servicio.id);
        Swal.fire({
          title: "Eliminado",
          text: `El servicio fue eliminado correctamente`,
          icon: "success",
          background: "#18181b",
          color: "#f4f4f5",
          confirmButtonColor: "#3b82f6",
        });
      }
    });
  };

  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 font-mono">
        {fila}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-200">
        {servicio.nombreServicio}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400 font-mono">
        ${servicio.precio.toLocaleString("es-AR")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex gap-3">
          <Link
            className="text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1"
            to={`/administrador/editar/${servicio._id}`}
          >
            <LuPencil /> Editar
          </Link>
          <button
            onClick={eliminarServicio}
            className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <LuTrash2 /> Borrar
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ItemTabla;
