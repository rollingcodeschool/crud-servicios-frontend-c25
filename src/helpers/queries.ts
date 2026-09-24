const urlServicios = import.meta.env.VITE_SERVICIOS + "/servicios";

export const listarServicios = async() => {
    try{
        const respuesta = await fetch(urlServicios)
        return respuesta
    }catch(error){
        console.error(error)
    }
};
