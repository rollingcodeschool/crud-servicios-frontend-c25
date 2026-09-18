export interface Servicio {
  id: string;
  nombreServicio: string;
  precio: number;
  imagen: string;
  categoria: string;
  descripcion: string;
}

export type ServicioFormData = Omit<Servicio, 'id'>;