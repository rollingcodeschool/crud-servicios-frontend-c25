import { useForm, type SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import type {
  Categoria,
  ListadoCategorias,
  ServicioFormData,
} from "../../interfaces/servicios";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  buscarServicioPorId,
  crearServicio,
  editarServicio,
  listarCategorias,
} from "../../helpers/queries";

interface FormularioProps {
  titulo: string;
}

// Definimos el esquema del formulario para React Hook Form
const FormularioServicio = ({ titulo }: FormularioProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ServicioFormData>();
  // traigo los datos que necesito del contexto
  const { id } = useParams<{ id: string }>();
  const navegacion = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  // preview de la imagen: la actual del servicio (editar) o la del archivo elegido
  const esEdicion = titulo.includes("Editar");
  const [imagenActual, setImagenActual] = useState<string | null>(null);
  const [previewArchivo, setPreviewArchivo] = useState<string | null>(null);

  // cuando el usuario elige un archivo generamos la preview con una URL local
  const cambiarImagen = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = evento.target.files?.[0];
    setPreviewArchivo(archivo ? URL.createObjectURL(archivo) : null);
  };

  // liberamos la URL local de la preview anterior y al desmontar el componente
  useEffect(() => {
    return () => {
      if (previewArchivo) {
        URL.revokeObjectURL(previewArchivo);
      }
    };
  }, [previewArchivo]);

  // obtenemos las categorias disponibles en el backend
  useEffect(() => {
    const obtenerCategorias = async () => {
      const respuesta = await listarCategorias();
      if (respuesta?.status === 200) {
        const datos: ListadoCategorias = await respuesta.json();
        setCategorias(datos.categorias);
      } else {
        Swal.fire({
          title: "Ocurrio un error",
          text: "No se pudieron obtener las categorias. Intentalo en unos minutos",
          icon: "error",
          background: "#18181b",
          color: "#f4f4f5",
          confirmButtonColor: "#3b82f6",
        });
      }
      setCargandoCategorias(false);
    };
    obtenerCategorias();
  }, []);

  useEffect(() => {
    const obtenerServicio = async () => {
      if (esEdicion && id) {
        const respuesta = await buscarServicioPorId(id);

        if (respuesta?.status === 200) {
          const servicioBuscado = await respuesta.json();

          setValue("nombreServicio", servicioBuscado.nombreServicio);
          setValue("precio", servicioBuscado.precio);
          setValue("categoria", servicioBuscado.categoria?._id ?? "");
          setValue("descripcion", servicioBuscado.descripcion);
          // la imagen actual solo se usa para la preview, no se envia al editar
          setImagenActual(servicioBuscado.imagen ?? null);
        } else {
          alert("Ocurrio un error al obtener el servicio buscado");
        }
      }
    };
    obtenerServicio();
  }, [esEdicion, id, setValue]);

  const onSubmit: SubmitHandler<ServicioFormData> = async (data, e) => {
    if (!esEdicion) {
      const respuesta = await crearServicio(data);
      if (respuesta?.status === 201) {
        Swal.fire({
          title: "Servicio creado",
          text: `El servicio '${data.nombreServicio}' fue creado correctamente`,
          icon: "success",
          background: "#18181b",
          color: "#f4f4f5",
          confirmButtonColor: "#3b82f6",
        });
        if (e) {
          (e.target as HTMLFormElement).reset();
          // limpiamos la preview al resetear el formulario
          setPreviewArchivo(null);
        }
      } else {
        Swal.fire({
          title: "Ocurrio un error",
          text: `El servicio '${data.nombreServicio}' no pudo ser creado. Intentalo en unos minutos`,
          icon: "error",
          background: "#18181b",
          color: "#f4f4f5",
          confirmButtonColor: "#3b82f6",
        });
      }
    } else if (id) {
      const respuesta = await editarServicio(data, id);
      if(respuesta?.status === 200){
        Swal.fire({
          title: "Servicio editado",
          text: `El servicio '${data.nombreServicio}' fue editado correctamente`,
          icon: "success",
          background: "#18181b",
          color: "#f4f4f5",
          confirmButtonColor: "#3b82f6",
        });
        navegacion("/administrador");
      }else{
         Swal.fire({
          title: "Ocurrio un error",
          text: `El servicio '${data.nombreServicio}' no pudo ser editado. Intentelo en unos minutos`,
          icon: "error",
          background: "#18181b",
          color: "#f4f4f5",
          confirmButtonColor: "#3b82f6",
        });
      }
    }
  };

  // const editarServicio = (
  //   idServicio: string,
  //   servicioEditar: ServicioFormData,
  // ) => {
  //   const serviciosEditados = servicios.map((itemServicio) => {
  //     if (itemServicio.id === idServicio) {
  //       return { ...itemServicio, ...servicioEditar };
  //     }
  //     return itemServicio;
  //   });
  //   setServicios(serviciosEditados);
  // };

  // const buscarServicio = (idServicio: string): Servicio | undefined => {
  //   return servicios.find((item) => item.id === idServicio);
  // };

  // Clase utilitaria para inputs consistentes
  const inputClass = (hasError: boolean) => `
    w-full px-4 py-2.5 bg-zinc-950 border rounded-lg text-zinc-100 
    focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all
    ${hasError ? "border-red-500" : "border-zinc-700"}
  `;

  return (
    <section className="max-w-4xl mx-auto animate-fadeIn">
      <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-zinc-800 pb-4">
          {titulo}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre del Servicio */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Nombre del Servicio*
              </label>
              <input
                type="text"
                placeholder="Ej: Diseño de sitio web institucional"
                className={inputClass(!!errors.nombreServicio)}
                {...register("nombreServicio", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 5, message: "Mínimo 5 caracteres" },
                  maxLength: { value: 100, message: "Máximo 100 caracteres" },
                })}
              />
              <p className="text-red-500 text-xs mt-1 italic">
                {errors.nombreServicio?.message}
              </p>
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Precio*
              </label>
              <input
                type="number"
                placeholder="Ej: 50000"
                className={inputClass(!!errors.precio)}
                {...register("precio", {
                  required: "El precio es obligatorio",
                  min: { value: 50, message: "Mínimo $50" },
                  valueAsNumber: true,
                })}
              />
              <p className="text-red-500 text-xs mt-1 italic">
                {errors.precio?.message}
              </p>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Categoría*
              </label>
              <select
                disabled={cargandoCategorias}
                className={inputClass(!!errors.categoria)}
                {...register("categoria", {
                  required: "Seleccione una categoría",
                })}
              >
                <option value="" className="bg-zinc-900">
                  {cargandoCategorias
                    ? "Cargando categorías..."
                    : "Seleccione una opción"}
                </option>
                {categorias.map((categoria) => (
                  <option
                    key={categoria._id}
                    value={categoria._id}
                    className="bg-zinc-900"
                  >
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              <p className="text-red-500 text-xs mt-1 italic">
                {errors.categoria?.message}
              </p>
            </div>

            {/* Imagen (archivo opcional) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Imagen (opcional, máx 2MB)
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Preview de la imagen subida o la actual del servicio */}
                <div className="w-32 h-32 shrink-0 rounded-xl border border-zinc-700 bg-zinc-950 overflow-hidden flex items-center justify-center">
                  {previewArchivo || imagenActual ? (
                    <img
                      src={previewArchivo ?? imagenActual ?? ""}
                      alt="Vista previa de la imagen del servicio"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-zinc-600 text-xs italic text-center px-2">
                      Sin imagen
                    </span>
                  )}
                </div>
                <div className="flex-1 w-full">
                  <input
                    type="file"
                    accept="image/*"
                    className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-lg text-zinc-100 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:font-bold file:cursor-pointer file:transition-colors hover:file:bg-blue-500 cursor-pointer
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all
                    ${errors.imagen ? "border-red-500" : "border-zinc-700"}`}
                    {...register("imagen", {
                      onChange: cambiarImagen,
                      validate: (archivos) => {
                        const archivo = archivos?.[0];
                        if (!archivo) return true;
                        if (!archivo.type.startsWith("image/")) {
                          return "El archivo debe ser una imagen";
                        }
                        if (archivo.size > 2 * 1024 * 1024) {
                          return "La imagen no puede superar los 2MB";
                        }
                        return true;
                      },
                    })}
                  />
                  <p className="text-zinc-500 text-xs mt-2">
                    {esEdicion
                      ? "Si no elegís una imagen nueva, se mantiene la actual."
                      : "Si no subís una imagen, se asignará una por defecto."}
                  </p>
                  <p className="text-red-500 text-xs mt-1 italic">
                    {errors.imagen?.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Descripción*
              </label>
              <textarea
                rows={4}
                placeholder="Describa el servicio detalladamente..."
                className={inputClass(!!errors.descripcion)}
                {...register("descripcion", {
                  required: "La descripción es obligatoria",
                  minLength: { value: 10, message: "Mínimo 10 caracteres" },
                  maxLength: { value: 500, message: "Máximo 500 caracteres" },
                })}
              />
              <p className="text-red-500 text-xs mt-1 italic">
                {errors.descripcion?.message}
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-900/20"
            >
              Guardar Servicio
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default FormularioServicio;
