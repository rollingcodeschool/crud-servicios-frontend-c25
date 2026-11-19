import { useEffect, useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import {
  LuArrowLeft,
  LuCreditCard,
  LuMinus,
  LuShoppingCart,
  LuTrash,
  LuTrash2,
} from "react-icons/lu";
import type {
  Carrito as CarritoDatos,
  ItemCarrito,
} from "../../interfaces/carrito";
import {
  crearOrden,
  obtenerCarrito,
  quitarDelCarrito,
  restarCantidad,
  vaciarCarrito,
} from "../../helpers/queries";
import type { RespuestaOrden } from "../../interfaces/ordenes";
import { formatearPrecio } from "../../utils/formateador";
import { useAppContext } from "../../context/AppContext";

const Carrito = () => {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [cargando, setCargando] = useState(true);
  // contador para forzar la reconsulta del carrito despues de cada operacion
  const [refrescar, setRefrescar] = useState(0);
  const { setCantidadCarrito } = useAppContext();

  useEffect(() => {
    const consultarCarrito = async () => {
      const respuesta = await obtenerCarrito();
      if (respuesta && respuesta.ok) {
        const datos: CarritoDatos = await respuesta.json();
        setItems(datos.items);
        // sincronizamos el badge del carrito en el navbar
        setCantidadCarrito(
          datos.items.reduce((total, item) => total + item.cantidad, 0),
        );
      } else if (respuesta && respuesta.status === 404) {
        // el usuario todavia no tiene un carrito creado
        setItems([]);
        setCantidadCarrito(0);
      } else {
        Swal.fire({
          title: "Ocurrio un error",
          text: "No se pudo obtener el carrito",
          icon: "error",
        });
      }
      setCargando(false);
    };
    consultarCarrito();
  }, [refrescar, setCantidadCarrito]);

  // fuerza la reconsulta del carrito (badge incluido)
  const actualizarCarrito = () => setRefrescar((prev) => prev + 1);

  const restarItem = async (item: ItemCarrito) => {
    // el endpoint de restar usa el id del servicio que esta en el carrito
    const respuesta = await restarCantidad(item.servicio._id);
    if (respuesta && respuesta.ok) {
      // si la cantidad llega a 0 el backend elimina el item
      actualizarCarrito();
    } else {
      Swal.fire({
        title: "Ocurrio un error",
        text: "No se pudo restar la cantidad",
        icon: "error",
      });
    }
  };

  const quitarItem = async (item: ItemCarrito) => {
    const resultado = await Swal.fire({
      title: "¿Quitar servicio del carrito?",
      text: `"${item.servicio.nombreServicio}" se eliminará del carrito`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Quitar",
      cancelButtonText: "Cancelar",
    });
    if (resultado.isConfirmed) {
      const respuesta = await quitarDelCarrito(item.servicio._id);
      if (respuesta && respuesta.ok) {
        Swal.fire({
          title: "Servicio quitado",
          icon: "success",
          timer: 1200,
        });
        actualizarCarrito();
      } else {
        Swal.fire({
          title: "Ocurrio un error",
          text: "No se pudo quitar el servicio del carrito",
          icon: "error",
        });
      }
    }
  };

  const vaciar = async () => {
    const resultado = await Swal.fire({
      title: "¿Vaciar carrito?",
      text: "Se eliminarán todos los servicios del carrito",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Vaciar",
      cancelButtonText: "Cancelar",
    });
    if (resultado.isConfirmed) {
      const respuesta = await vaciarCarrito();
      if (respuesta && respuesta.ok) {
        Swal.fire({ title: "Carrito vacío", icon: "success", timer: 1200 });
        actualizarCarrito();
      } else {
        Swal.fire({
          title: "Ocurrio un error",
          text: "No se pudo vaciar el carrito",
          icon: "error",
        });
      }
    }
  };

  const total = items.reduce(
    (suma, item) => suma + item.servicio.precio * item.cantidad,
    0,
  );

  const comprar = async () => {
    const resultado = await Swal.fire({
      title: "¿Confirmar compra?",
      text: `Total a pagar: ${formatearPrecio(total)}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      confirmButtonText: "Comprar",
      cancelButtonText: "Cancelar",
    });
    if (resultado.isConfirmed) {
      const respuesta = await crearOrden();
      if (respuesta && respuesta.ok) {
        const datos: RespuestaOrden = await respuesta.json();
        // redirigimos al checkout de Mercado Pago (navegacion externa)
        window.location.assign(datos.checkout_url);
      } else {
        Swal.fire({
          title: "Ocurrio un error",
          text: "No se pudo crear la orden de compra",
          icon: "error",
        });
      }
    }
  };

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Encabezado */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-5 gap-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Tu <span className="text-blue-500">Carrito</span>
        </h1>
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-blue-400 transition-colors"
        >
          <LuArrowLeft />
          Volver al catálogo
        </Link>
      </div>

      {cargando ? (
        <p className="text-center text-zinc-400 py-20">
          Cargando carrito...
        </p>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800">
          <LuShoppingCart className="text-5xl text-zinc-700 mb-4" />
          <p className="text-zinc-500 mb-4">Tu carrito está vacío.</p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
          >
            Explorar servicios
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item._id}
              className="flex flex-col sm:flex-row gap-4 bg-zinc-900 rounded-xl border border-zinc-800 p-4"
            >
              <img
                src={item.servicio.imagen}
                alt={item.servicio.nombreServicio}
                className="w-full sm:w-28 h-28 rounded-lg object-cover border border-zinc-800"
              />

              <div className="flex flex-col grow">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-100">
                      {item.servicio.nombreServicio}
                    </h3>
                    <p className="text-sm text-zinc-500">
                      Precio unitario:{" "}
                      {formatearPrecio(item.servicio.precio)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => quitarItem(item)}
                    aria-label="Quitar servicio"
                    title="Quitar servicio"
                    className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                  >
                    <LuTrash2 className="text-xl" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-auto pt-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => restarItem(item)}
                      aria-label="Restar cantidad"
                      title="Restar cantidad"
                      className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-blue-500 transition-colors active:scale-95"
                    >
                      <LuMinus />
                    </button>
                    <span className="text-sm text-zinc-300">
                      Cantidad:{" "}
                      <span className="font-bold text-white">
                        {item.cantidad}
                      </span>
                    </span>
                  </div>
                  <p className="text-lg font-mono text-zinc-200">
                    {formatearPrecio(item.servicio.precio * item.cantidad)}
                  </p>
                </div>
              </div>
            </article>
          ))}

          {/* Total, vaciar y comprar */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={vaciar}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-red-900/40 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-zinc-700 hover:border-red-500/50"
            >
              <LuTrash />
              Vaciar carrito
            </button>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-zinc-500 uppercase font-semibold">
                  Total
                </p>
                <p className="text-2xl font-bold font-mono text-blue-400">
                  {formatearPrecio(total)}
                </p>
              </div>
              <button
                type="button"
                onClick={comprar}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg text-sm font-bold transition-colors shadow-md shadow-emerald-900/20 active:scale-95"
              >
                <LuCreditCard />
                Comprar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Carrito;
