import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { LuMinus, LuPlus, LuShoppingCart } from "react-icons/lu";
import Swal from "sweetalert2";
import type { Servicio } from "../../interfaces/servicios";
import { formatearPrecio } from "../../utils/formateador";
import { agregarAlCarrito } from "../../helpers/queries";
import { useAppContext } from "../../context/AppContext";

interface CardServicioProps {
  servicio: Servicio;
}

const CardServicio = ({ servicio }: CardServicioProps) => {
  // cantidad elegida para comprar, por defecto 1
  const [cantidad, setCantidad] = useState(1);
  const { usuarioLogueado, setCantidadCarrito } = useAppContext();
  const navegacion = useNavigate();

  const cambiarCantidad = (nuevaCantidad: number) => {
    // permitimos entre 1 y 99 unidades
    if (nuevaCantidad >= 1 && nuevaCantidad <= 99) {
      setCantidad(nuevaCantidad);
    }
  };

  const comprarServicio = async () => {
    // si no hay sesion activa, lo mandamos al login
    if (!usuarioLogueado) {
      navegacion("/login");
      return;
    }
    const respuesta = await agregarAlCarrito(servicio._id, cantidad);
    if (respuesta && respuesta.ok) {
      // actualizamos el badge del carrito en el navbar
      setCantidadCarrito((prev) => prev + cantidad);
      Swal.fire({
        title: "Servicio agregado",
        text: `${cantidad} x ${servicio.nombreServicio} agregado al carrito`,
        icon: "success",
        timer: 1500,
      });
    } else {
      Swal.fire({
        title: "Ocurrio un error",
        text: "No se pudo agregar el servicio al carrito",
        icon: "error",
      });
    }
  };

  return (
    <article className="group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/10 flex flex-col h-full">
      {/* Contenedor de Imagen */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={servicio.imagen}
          alt={servicio.nombreServicio}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-zinc-950/80 backdrop-blur-sm text-blue-400 text-xs font-bold px-2 py-1 rounded border border-zinc-700 uppercase tracking-wider">
            {servicio.categoria?.nombre ?? "Sin categoría"}
          </span>
        </div>
      </div>

      {/* Cuerpo de la Card */}
      <div className="p-5 flex flex-col grow">
        <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-blue-400 transition-colors">
          {servicio.nombreServicio}
        </h3>

        <p className="text-zinc-400 text-sm line-clamp-3 mb-4 grow">
          {servicio.descripcion}
        </p>

        <div className="pt-4 border-t border-zinc-800 mt-auto space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs text-zinc-500 uppercase font-semibold">
                Precio
              </p>
              <p className="text-lg font-mono text-zinc-200">
                {formatearPrecio(servicio.precio)}
              </p>
            </div>

            {/* Selector de cantidad */}
            <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => cambiarCantidad(cantidad - 1)}
                aria-label="Restar cantidad"
                disabled={cantidad <= 1}
                className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
              >
                <LuMinus />
              </button>
              <input
                type="number"
                min={1}
                max={99}
                value={cantidad}
                onChange={(e) => {
                  const valor = parseInt(e.target.value, 10);
                  setCantidad(
                    Number.isNaN(valor)
                      ? 1
                      : Math.min(Math.max(valor, 1), 99),
                  );
                }}
                aria-label="Cantidad"
                className="w-12 bg-transparent text-center text-sm text-zinc-200 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => cambiarCantidad(cantidad + 1)}
                aria-label="Sumar cantidad"
                disabled={cantidad >= 99}
                className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
              >
                <LuPlus />
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={comprarServicio}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-md shadow-emerald-900/20 active:scale-95"
            >
              <LuShoppingCart />
              Comprar
            </button>
            <Link
              to={`/detalle-servicio/${servicio._id}`}
              className="flex items-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors active:scale-95"
            >
              Ver detalle
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CardServicio;
