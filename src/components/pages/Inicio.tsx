import CardServicio from "../services/CardServicio";
import { useEffect, useState } from "react";
import { listarServicios } from "../../helpers/queries";
import Swal from "sweetalert2";
import {
  LuChevronLeft,
  LuChevronRight,
  LuSearch,
  LuX,
} from "react-icons/lu";
import type { ListadoServicios, Servicio } from "../../interfaces/servicios";

const Inicio = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cantidadServicios, setCantidadServicios] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [termino, setTermino] = useState("");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    const consultarAPI = async () => {
      const respuesta = await listarServicios({
        termino: termino || undefined,
        pagina,
      });
      if (respuesta?.status === 200) {
        const datos: ListadoServicios = await respuesta.json();
        setServicios(datos.servicios);
        setCantidadServicios(datos.cantidadServicios);
        setTotalPaginas(datos.totalPaginas || 1);
      } else {
        Swal.fire({
          title: "Ocurrio un error",
          text: "No se pudieron obtener los datos",
          icon: "error",
        });
      }
    };
    consultarAPI();
  }, [termino, pagina]);

  const buscarServicios = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nuevoTermino = textoBusqueda.trim();
    setTermino(nuevoTermino);
    setPagina(1);
  };

  const limpiarBusqueda = () => {
    setTextoBusqueda("");
    setTermino("");
    setPagina(1);
  };

  const cambiarPagina = (nuevaPagina: number) => {
    setPagina(nuevaPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Encabezado con estilo moderno */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Catálogo de <span className="text-blue-500">Servicios</span>
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Explora nuestras soluciones tecnológicas personalizadas.
          </p>
        </div>

        <div className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 self-start md:self-center">
          {cantidadServicios} {cantidadServicios === 1 ? "servicio disponible" : "servicios disponibles"}
        </div>
      </div>

      {/* Filtro de búsqueda */}
      <form onSubmit={buscarServicios} className="flex gap-2">
        <div className="relative flex-1">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={textoBusqueda}
            onChange={(e) => setTextoBusqueda(e.target.value)}
            placeholder="Buscar servicios por nombre, categoría o descripción..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-10 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-blue-500 transition-colors"
          />
          {textoBusqueda && (
            <button
              type="button"
              onClick={limpiarBusqueda}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <LuX />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <LuSearch />
          Buscar
        </button>
      </form>

      {servicios.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {servicios.map((servicio) => (
              <CardServicio key={servicio._id} servicio={servicio} />
            ))}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => cambiarPagina(pagina - 1)}
                disabled={pagina <= 1}
                className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium hover:border-blue-500 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-zinc-800 disabled:hover:text-zinc-300"
              >
                <LuChevronLeft />
                Anterior
              </button>
              <span className="text-sm text-zinc-500">
                Página <span className="text-zinc-300 font-medium">{pagina}</span> de{" "}
                <span className="text-zinc-300 font-medium">{totalPaginas}</span>
              </span>
              <button
                type="button"
                onClick={() => cambiarPagina(pagina + 1)}
                disabled={pagina >= totalPaginas}
                className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium hover:border-blue-500 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-zinc-800 disabled:hover:text-zinc-300"
              >
                Siguiente
                <LuChevronRight />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800">
          <i className="bi bi-search text-4xl text-zinc-700 mb-4"></i>
          <p className="text-zinc-500">
            {termino
              ? `No se encontraron resultados para "${termino}".`
              : "No se encontraron servicios disponibles."}
          </p>
          {termino && (
            <button
              type="button"
              onClick={limpiarBusqueda}
              className="mt-4 text-sm text-blue-500 hover:text-blue-400 transition-colors"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default Inicio;
