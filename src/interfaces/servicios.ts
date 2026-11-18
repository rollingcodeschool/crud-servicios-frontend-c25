export interface Categoria {
  _id: string;
  nombre: string;
  descripcion?: string;
}

export interface Servicio {
  _id: string;
  nombreServicio: string;
  precio: number;
  imagen: string;
  categoria?: Categoria | null;
  descripcion: string;
}

export interface ListadoServicios {
  cantidadServicios: number;
  paginaActual: number;
  totalPaginas: number;
  servicios: Servicio[];
}

export interface ListadoCategorias {
  cantidadCategorias: number;
  paginaActual: number;
  totalPaginas: number;
  categorias: Categoria[];
}

// Datos que envia el formulario: sin _id y con la categoria como ID (string)
export type ServicioFormData = Omit<Servicio, "_id" | "categoria"> & {
  categoria: string;
};
