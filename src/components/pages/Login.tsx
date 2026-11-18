import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useAppContext } from "../../context/AppContext";
import { loginUsuario, obtenerPerfil } from "../../helpers/queries";
import type { UsuarioAutenticado } from "../../interfaces/usuarios";

// Definimos la estructura de los datos del formulario
interface LoginFormInputs {
  email: string;
  password: string;
}

const Login = () => {
  // usamos los datos necesarios del contexto
  const { setUsuarioLogueado, setUsuario } = useAppContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navegacion = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    //1- enviamos las credenciales al backend, si son validas nos devuelve una cookie httpOnly con el token
    try {
      const respuesta = await loginUsuario(data.email, data.password);

      if (respuesta && respuesta.ok) {
        const datos = await respuesta.json();
        setUsuarioLogueado(true);
        // pedimos el perfil para guardar los datos completos del usuario
        const respuestaPerfil = await obtenerPerfil();
        if (respuestaPerfil && respuestaPerfil.ok) {
          const usuarioAutenticado: UsuarioAutenticado =
            await respuestaPerfil.json();
          setUsuario(usuarioAutenticado);
        }
        Swal.fire({
          title: `Bienvenido ${datos.nombre}`,
          text: "Ingresando al sistema",
          icon: "success",
          background: "#18181b",
          color: "#f4f4f5",
          confirmButtonColor: "#3b82f6",
        });
        //redirecciono al admin
        navegacion("/administrador");
      } else {
        Swal.fire({
          title: "Ocurrió un error",
          text: "Credenciales incorrectas",
          icon: "error",
          background: "#18181b",
          color: "#f4f4f5",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      // si ocurre un error de red mostramos el mensaje
      console.error(error);
      Swal.fire({
        title: "Ocurrió un error",
        text: "No se pudo conectar con el servidor",
        icon: "error",
        background: "#18181b",
        color: "#f4f4f5",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <section className="flex grow items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-md w-full space-y-8 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-sm">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Accede al panel de control de{" "}
            <span className="text-blue-500 font-semibold">CODE</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-300 mb-1"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`w-full px-4 py-3 bg-zinc-950 border ${errors.email ? "border-red-500" : "border-zinc-700"} rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                placeholder="correo@dominio.com"
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value:
                      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
                    message: "Email no válido",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1 italic">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-300 mb-1"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className={`w-full px-4 py-3 bg-zinc-950 border ${errors.password ? "border-red-500" : "border-zinc-700"} rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                placeholder="••••••••"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  pattern: {
                    value:
                      /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/,
                    message:
                      "Debe tener 8-16 caracteres, mayúscula, minúscula, número y símbolo.",
                  },
                })}
              />
              {errors.password && (
                <span className="text-red-500 text-xs mt-1 italic">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:ring-blue-500 transition-all active:scale-95"
            >
              Ingresar al sistema
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
