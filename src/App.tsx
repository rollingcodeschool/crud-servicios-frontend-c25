import Administrador from "./components/pages/Administrador";
import Inicio from "./components/pages/Inicio";
import DetalleServicio from "./components/pages/DetalleServicio";
import Footer from "./components/shared/Footer";
import Menu from "./components/shared/Menu";
import Error404 from "./components/pages/Error404";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./components/pages/Login";
import FormularioServicio from "./components/pages/FormularioServicio";
import ProtectorRutas from "./components/routes/ProtectorRutas";
import Carrito from "./components/pages/Carrito";
import { useEffect, useState } from "react";
import { AppContext } from "./context/AppContext";
import { obtenerCarrito, obtenerPerfil } from "./helpers/queries";
import type { Carrito as CarritoDatos } from "./interfaces/carrito";
import type { UsuarioAutenticado } from "./interfaces/usuarios";

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState<boolean>(false);
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  // cantidad total de items del carrito del usuario logueado
  const [cantidadCarrito, setCantidadCarrito] = useState<number>(0);
  // agregamos los servicios
  // const serviciosLocalStorage = JSON.parse(
  //   localStorage.getItem("serviciosKey") || "[]",
  // );

  // Al montar la app validamos la sesion con la cookie httpOnly del backend
  // Si la cookie sigue vigente, restauramos el usuario logueado
  useEffect(() => {
    const validarSesion = async () => {
      try {
        const respuesta = await obtenerPerfil();
        if (respuesta && respuesta.ok) {
          const usuarioAutenticado: UsuarioAutenticado = await respuesta.json();
          setUsuario(usuarioAutenticado);
          setUsuarioLogueado(true);

          // restauramos la cantidad de items del carrito del usuario
          const respuestaCarrito = await obtenerCarrito();
          if (respuestaCarrito && respuestaCarrito.ok) {
            const carrito: CarritoDatos = await respuestaCarrito.json();
            setCantidadCarrito(
              carrito.items.reduce((total, item) => total + item.cantidad, 0),
            );
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    validarSesion();
  }, []);

  return (
    <AppContext.Provider
      value={{
        usuarioLogueado,
        setUsuarioLogueado,
        usuario,
        setUsuario,
        cantidadCarrito,
        setCantidadCarrito,
      }}
    >
      <BrowserRouter>
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
          <Menu></Menu>
          <main className="grow container mx-auto my-4 px-4 py-8">
            <Routes>
              <Route path="/" element={<Inicio></Inicio>}></Route>
              <Route path="/login" element={<Login></Login>}></Route>
              <Route
                path="/detalle-servicio/:id"
                element={<DetalleServicio></DetalleServicio>}
              ></Route>
              {/* carrito de compras: solo para usuarios logueados */}
              <Route path="/carrito" element={<ProtectorRutas />}>
                <Route index element={<Carrito />} />
              </Route>
              <Route path="/administrador" element={<ProtectorRutas />}>
                <Route index element={<Administrador />} />
                <Route
                  path="crear"
                  element={
                    <FormularioServicio
                      titulo={"Crear Servicio"}
                    ></FormularioServicio>
                  }
                />
                <Route
                  path="editar/:id"
                  element={
                    <FormularioServicio
                      titulo={"Editar Servicio"}
                    ></FormularioServicio>
                  }
                />
              </Route>
              <Route path="*" element={<Error404></Error404>}></Route>
            </Routes>
          </main>
          <Footer></Footer>
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
