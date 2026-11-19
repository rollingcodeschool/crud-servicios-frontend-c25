import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import {
  LuCircleCheck,
  LuCircleX,
  LuClock,
  LuShoppingCart,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import { useAppContext } from "../../context/AppContext";
import { obtenerCarrito } from "../../helpers/queries";
import type { Carrito as CarritoDatos } from "../../interfaces/carrito";

interface ResultadoPagoProps {
  estado: "exitoso" | "fallido" | "pendiente";
}

interface ConfiguracionEstado {
  icono: IconType;
  clasesIcono: string;
  titulo: string;
  mensaje: string;
}

const configuracionEstado: Record<
  ResultadoPagoProps["estado"],
  ConfiguracionEstado
> = {
  exitoso: {
    icono: LuCircleCheck,
    clasesIcono: "text-emerald-500",
    titulo: "¡Pago exitoso!",
    mensaje:
      "Tu pago se procesó correctamente y la orden fue registrada. Gracias por tu compra.",
  },
  fallido: {
    icono: LuCircleX,
    clasesIcono: "text-red-500",
    titulo: "Pago fallido",
    mensaje:
      "El pago no pudo procesarse. Podés reintentar la compra desde tu carrito.",
  },
  pendiente: {
    icono: LuClock,
    clasesIcono: "text-yellow-500",
    titulo: "Pago pendiente",
    mensaje:
      "Tu pago está siendo procesado. Te notificaremos cuando se confirme.",
  },
};

const ResultadoPago = ({ estado }: ResultadoPagoProps) => {
  // el backend nos devuelve el id de la orden por query param (?orden=...)
  const [parametrosBusqueda] = useSearchParams();
  const ordenId = parametrosBusqueda.get("orden");
  const { setCantidadCarrito } = useAppContext();

  const { icono: Icono, clasesIcono, titulo, mensaje } =
    configuracionEstado[estado];

  // si el pago fue exitoso, el backend vacia el carrito: sincronizamos el badge del navbar
  useEffect(() => {
    if (estado !== "exitoso") {
      return;
    }
    const sincronizarCarrito = async () => {
      const respuesta = await obtenerCarrito();
      if (respuesta && respuesta.ok) {
        const carrito: CarritoDatos = await respuesta.json();
        setCantidadCarrito(
          carrito.items.reduce((total, item) => total + item.cantidad, 0),
        );
      } else {
        // el backend ya vacio el carrito tras el pago
        setCantidadCarrito(0);
      }
    };
    sincronizarCarrito();
  }, [estado, setCantidadCarrito]);

  return (
    <section className="flex flex-col items-center justify-center text-center max-w-xl mx-auto py-16 animate-fadeIn">
      <Icono className={`text-7xl mb-6 ${clasesIcono}`} />
      <h1 className="text-3xl font-bold text-white mb-3">{titulo}</h1>
      <p className="text-zinc-400 mb-6">{mensaje}</p>

      {ordenId && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 mb-8">
          <p className="text-xs text-zinc-500 uppercase font-semibold mb-1">
            Orden
          </p>
          <p className="font-mono text-sm text-zinc-300 break-all">
            {ordenId}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
        >
          Volver al inicio
        </Link>
        <Link
          to="/carrito"
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
        >
          <LuShoppingCart />
          Ver carrito
        </Link>
      </div>
    </section>
  );
};

export default ResultadoPago;
