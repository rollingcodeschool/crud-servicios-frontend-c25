export interface Servicio {
  _id: string;
  nombreServicio: string;
  precio: number;
  imagen: string;
  categoria: string;
  descripcion: string;
}

export interface ListadoServicios {
  cantidadServicios: number;
  paginaActual: number;
  totalPaginas: number;
  servicios: Servicio[];
}

export type ServicioFormData = Omit<Servicio, 'id'>;