import type { ServicioFormData } from "../interfaces/servicios";

const urlServicios = import.meta.env.VITE_SERVICIOS + "/servicios";
const urlCategorias = import.meta.env.VITE_SERVICIOS + "/categorias";
const urlUsuarios = import.meta.env.VITE_SERVICIOS + "/usuarios";

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

export const listarCategorias = async (pagina = 1, limite = 100) => {
  try {
    const respuesta = await fetch(
      `${urlCategorias}?pagina=${pagina}&limite=${limite}`
    );
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};

export const crearServicio = async (datos: ServicioFormData) => {
  try {
    const respuesta = await fetch(urlServicios, {
      method: "POST",
      credentials: "include",
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

export const editarServicio = async (datos: ServicioFormData, id: string) => {
  try {
    const respuesta = await fetch(urlServicios+ `/${id}`, {
      method: "PUT",
      credentials: "include",
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
      method: "DELETE",
      credentials: "include"
    });
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};

// Login: el backend responde con una cookie httpOnly llamada "token"
export const loginUsuario = async (email: string, password: string) => {
  try {
    const respuesta = await fetch(urlUsuarios + "/login", {
      method: "POST",
      // credentials include: necesario para que el navegador guarde la cookie del backend
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};

// Perfil: devuelve el usuario logueado segun la cookie "token"
export const obtenerPerfil = async () => {
  try {
    const respuesta = await fetch(urlUsuarios + "/perfil", {
      credentials: "include",
    });
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};

// Logout: el backend borra la cookie "token"
export const logoutUsuario = async () => {
  try {
    const respuesta = await fetch(urlUsuarios + "/logout", {
      method: "POST",
      credentials: "include",
    });
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};
