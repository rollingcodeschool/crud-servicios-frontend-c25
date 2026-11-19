import type { ServicioFormData } from "../interfaces/servicios";

const urlServicios = import.meta.env.VITE_SERVICIOS + "/servicios";
const urlCategorias = import.meta.env.VITE_SERVICIOS + "/categorias";
const urlUsuarios = import.meta.env.VITE_SERVICIOS + "/usuarios";
const urlCarrito = import.meta.env.VITE_SERVICIOS + "/carrito";
const urlOrdenes = import.meta.env.VITE_SERVICIOS + "/ordenes";

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

// Armamos el cuerpo multipart/form-data: texto plano + archivo de imagen opcional.
// Si no hay imagen, el backend asigna una por defecto.
const armarFormData = (datos: ServicioFormData) => {
  const formData = new FormData();
  formData.append("nombreServicio", datos.nombreServicio);
  formData.append("precio", String(datos.precio));
  formData.append("categoria", datos.categoria);
  formData.append("descripcion", datos.descripcion);
  const archivo = datos.imagen?.[0];
  if (archivo) {
    formData.append("imagen", archivo);
  }
  return formData;
};

export const crearServicio = async (datos: ServicioFormData) => {
  try {
    const respuesta = await fetch(urlServicios, {
      method: "POST",
      credentials: "include",
      // No seteamos Content-Type: el navegador genera el boundary del multipart
      body: armarFormData(datos),
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
      // No seteamos Content-Type: el navegador genera el boundary del multipart
      body: armarFormData(datos),
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

// Carrito: obtener el carrito del usuario logueado
export const obtenerCarrito = async () => {
  try {
    const respuesta = await fetch(urlCarrito, {
      credentials: "include",
    });
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};

// Carrito: agregar un servicio con la cantidad elegida
export const agregarAlCarrito = async (
  servicioId: string,
  cantidad: number
) => {
  try {
    const respuesta = await fetch(urlCarrito, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ servicioId, cantidad }),
    });
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};

// Carrito: vaciar el carrito del usuario logueado
export const vaciarCarrito = async () => {
  try {
    const respuesta = await fetch(urlCarrito, {
      method: "DELETE",
      credentials: "include",
    });
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};

// Carrito: quitar un servicio del carrito por su id
export const quitarDelCarrito = async (idServicio: string) => {
  try {
    const respuesta = await fetch(urlCarrito + `/${idServicio}`, {
      method: "DELETE",
      credentials: "include",
    });
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};

// Carrito: restar en uno la cantidad de un servicio del carrito
export const restarCantidad = async (idServicio: string) => {
  try {
    const respuesta = await fetch(urlCarrito + `/${idServicio}/restar`, {
      method: "PATCH",
      credentials: "include",
    });
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};

// Ordenes: crear una orden de compra con los items del carrito del usuario
// El backend responde con { ordenId, checkout_url } para pagar con Mercado Pago
export const crearOrden = async () => {
  try {
    const respuesta = await fetch(urlOrdenes, {
      method: "POST",
      credentials: "include",
    });
    return respuesta;
  } catch (error) {
    console.error(error);
  }
};
