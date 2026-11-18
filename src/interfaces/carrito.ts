// Servicio embebido dentro de cada item del carrito (respuesta del GET /carrito)
export interface ServicioCarrito {
  _id: string;
  nombreServicio: string;
  precio: number;
  imagen: string;
}

export interface ItemCarrito {
  _id: string;
  cantidad: number;
  servicio: ServicioCarrito;
}

export interface Carrito {
  _id: string;
  usuario: string;
  items: ItemCarrito[];
  createdAt: string;
  updatedAt: string;
}
