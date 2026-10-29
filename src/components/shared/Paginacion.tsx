import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface PaginacionProps {
  pagina: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
}

type ElementoPaginacion = number | "elipsis";

const generarPaginas = (
  pagina: number,
  totalPaginas: number,
): ElementoPaginacion[] => {
  const maximoVisible = 7;

  if (totalPaginas <= maximoVisible) {
    return Array.from({ length: totalPaginas }, (_, indice) => indice + 1);
  }

  // Cerca del inicio: 1 2 3 4 5 ... ultima
  if (pagina <= 4) {
    return [1, 2, 3, 4, 5, "elipsis", totalPaginas];
  }

  // Cerca del final: 1 ... anteultima-4 ... ultima
  if (pagina >= totalPaginas - 3) {
    return [
      1,
      "elipsis",
      totalPaginas - 4,
      totalPaginas - 3,
      totalPaginas - 2,
      totalPaginas - 1,
      totalPaginas,
    ];
  }

  // En el medio: 1 ... anterior actual siguiente ... ultima
  return [1, "elipsis", pagina - 1, pagina, pagina + 1, "elipsis", totalPaginas];
};

const Paginacion = ({
  pagina,
  totalPaginas,
  onCambiarPagina,
}: PaginacionProps) => {
  if (totalPaginas <= 1) return null;

  const paginas = generarPaginas(pagina, totalPaginas);

  const claseFlecha =
    "flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-800 disabled:hover:text-zinc-300";

  return (
    <nav
      aria-label="Paginación de servicios"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onCambiarPagina(pagina - 1)}
        disabled={pagina <= 1}
        aria-label="Página anterior"
        className={claseFlecha}
      >
        <LuChevronLeft />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      {/* Números: visibles desde pantallas pequeñas en adelante */}
      <div className="hidden items-center gap-2 sm:flex">
        {paginas.map((elemento, indice) =>
          elemento === "elipsis" ? (
            <span
              key={`elipsis-${indice}`}
              aria-hidden="true"
              className="select-none px-1 text-sm text-zinc-600"
            >
              …
            </span>
          ) : (
            <button
              key={elemento}
              type="button"
              onClick={() => onCambiarPagina(elemento)}
              disabled={elemento === pagina}
              aria-label={`Ir a la página ${elemento}`}
              aria-current={elemento === pagina ? "page" : undefined}
              className={`h-9 min-w-9 rounded-lg border px-2 text-sm font-medium transition-colors ${
                elemento === pagina
                  ? "border-blue-500 bg-blue-600 text-white"
                  : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-blue-500 hover:text-white"
              }`}
            >
              {elemento}
            </button>
          ),
        )}
      </div>

      {/* En móvil se muestra el indicador compacto en lugar de los números */}
      <span className="text-sm text-zinc-500 sm:hidden">
        Página <span className="font-medium text-zinc-300">{pagina}</span> de{" "}
        <span className="font-medium text-zinc-300">{totalPaginas}</span>
      </span>

      <button
        type="button"
        onClick={() => onCambiarPagina(pagina + 1)}
        disabled={pagina >= totalPaginas}
        aria-label="Página siguiente"
        className={claseFlecha}
      >
        <span className="hidden sm:inline">Siguiente</span>
        <LuChevronRight />
      </button>
    </nav>
  );
};

export default Paginacion;
