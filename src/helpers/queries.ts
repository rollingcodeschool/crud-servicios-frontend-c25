import type { Servicio } from "../interfaces/servicios";

const urlServicios = import.meta.env.VITE_SERVICIOS + "/servicios";

export const listarServicios = async () => {
  try {
    const respuesta = await fetch(urlServicios);
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
