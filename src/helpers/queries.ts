import type { Servicio } from "../interfaces/servicios";

const urlServicios = import.meta.env.VITE_SERVICIOS + "/servicios";

export interface ParametrosListado {
  termino?: string;
  pagina?: number;
  limite?: number;
}

export const listarServicios = async (params?: ParametrosListado) => {
  try {
    const query = new URLSearchParams();
    if (params?.termino) query.set("termino", params.termino);
    if (params?.pagina) query.set("pagina", String(params.pagina));
    if (params?.limite) query.set("limite", String(params.limite));
    const queryString = query.toString();
    const respuesta = await fetch(urlServicios + (queryString ? `?${queryString}` : ""));
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};

export const crearServicio = async (datos: Servicio) => {
  try {
    const respuesta = await fetch(urlServicios, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};

export const editarServicio = async (datos: Servicio, id: string) => {
  try {
    const respuesta = await fetch(urlServicios+ `/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};

export const buscarServicioPorId = async (id: string) => {
  try {
    const respuesta = await fetch(urlServicios+ `/${id}`);
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};

export const borrarServicio = async (id: string) => {
  try {
    const respuesta = await fetch(urlServicios+ `/${id}`, {
      method: "DELETE"
    });
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};
