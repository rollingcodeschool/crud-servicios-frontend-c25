// Respuesta del backend al crear una orden de compra (POST /ordenes)
export interface RespuestaOrden {
  ordenId: string;
  checkout_url: string;
}
