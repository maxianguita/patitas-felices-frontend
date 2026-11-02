import React,{lazy} from "react";
import { createRoot } from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from "./App";

const Home=lazy(()=>import('./pages/Home'));
const Animales=lazy(()=>import('./pages/Catalogo'));
const Historias=lazy(()=>import('./pages/Comunidad').then(module=>({default:module.Historias})));
const Organizacion=lazy(()=>import('./pages/Comunidad').then(module=>({default:module.Organizacion})));
const Necesidades=lazy(()=>import('./pages/Comunidad').then(module=>({default:module.NecesidadesReales})));
const SeguimientoSolicitud=lazy(()=>import('./pages/SeguimientoSolicitud'));
const RestablecerPassword=lazy(()=>import('./admin/RestablecerPassword'));
const ComunidadAdmin=lazy(()=>import('./admin/ComunidadAdmin'));
const Contacto=lazy(()=>import('./pages/Contacto'));
const Donar=lazy(()=>import('./pages/Donar'));

const DetalleAnimal=lazy(()=>import('./pages/DetalleAnimal'));

const PanelSolicitudes=lazy(()=>import('./admin/PanelSolicitudes'));
const DetalleSolicitud=lazy(()=>import('./admin/DetalleSolicitud'));
const AdminLogin=lazy(()=>import('./admin/AdminLogin'));
const PanelAnimales=lazy(()=>import('./admin/PanelAnimales'));
const CrearAnimal=lazy(()=>import('./admin/CrearAnimal'));
const EditarAnimal=lazy(()=>import('./admin/EditarAnimal'));
const ChangePassword=lazy(()=>import('./admin/ChangePassword'));
const RegistrarOrganizacion=lazy(()=>import('./admin/RegisterOrganizacion'));

const MiActividad=lazy(()=>import('./pages/MiActividad'));
const Avisos=lazy(()=>import('./pages/Avisos'));
const PublicarAviso=lazy(()=>import('./pages/PublicarAviso'));
const DetalleAviso=lazy(()=>import('./pages/DetalleAviso'));
const GestionAviso=lazy(()=>import('./pages/GestionAviso'));
const ModerarAvisos=lazy(()=>import('./admin/ModerarAvisos'));
import PrivateRoute from "./components/PrivateRoute";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      {path:'mi-actividad',element:<MiActividad/>},
      {path:'avisos',element:<Avisos/>},
      {path:'avisos/nuevo',element:<PublicarAviso/>},
      {path:'avisos/gestion/:token',element:<GestionAviso/>},
      {path:'avisos/:id',element:<DetalleAviso/>},
      {path:'admin/avisos',element:<PrivateRoute><ModerarAvisos/></PrivateRoute>},
      {path:'favoritos',element:<Animales/>},
      {path:'historias',element:<Historias/>},
      {path:'organizaciones/:id',element:<Organizacion/>},
      {path:'mi-solicitud/:token',element:<SeguimientoSolicitud/>},
      {path:'admin/restablecer-password',element:<RestablecerPassword/>},
      {path:'admin/comunidad',element:<PrivateRoute><ComunidadAdmin/></PrivateRoute>},
      // Página principal
      {
        index: true,
        element: <Home />,
      },

      // Página pública de animales
      {
        path: "adoptar",
        element: <Animales />,
      },
      // pagina de detalle de animal por id
      {
  path: "adoptar/:id",
  element: <DetalleAnimal />,
},

      // Página de donaciones
      {
        path: "donar",
        element: <Donar />,
      },

      // Página de contacto
      {
        path: "contacto",
        element: <Contacto />,
      },

      // Página de necesidades
      {
        path: "necesidades",
        element: <Necesidades />,
      },

      // Inicio de sesión administrativo
      {
        path: "admin/login",
        element: <AdminLogin />,
      },
      {
  path: "admin/solicitudes",
  element: (
    <PrivateRoute>
      <PanelSolicitudes />
    </PrivateRoute>
  ),
},

{
  path: "admin/solicitudes/:id",
  element: (
    <PrivateRoute>
      <DetalleSolicitud />
    </PrivateRoute>
  ),
},

      // Recuperar contraseña
      // Se mantiene igual
      {
        path: "admin/Change-password",
        element: <ChangePassword />,
      },

      // Registrar organización y usuario administrador
      {
        path: "admin/registrar-organizacion",
        element: <RegistrarOrganizacion />,
      },

      // Panel privado de animales
      {
        path: "admin/animales",
        element: (
          <PrivateRoute>
            <PanelAnimales />
          </PrivateRoute>
        ),
      },

      // Crear animal
      {
        path: "admin/animales/nuevo",
        element: (
          <PrivateRoute>
            <CrearAnimal />
          </PrivateRoute>
        ),
      },

      // Editar animal
      {
        path: "admin/animales/:id/editar",
        element: (
          <PrivateRoute>
            <EditarAnimal />
          </PrivateRoute>
        ),
      },

      // Página no encontrada
      {
        path: "*",
        element: (
          <main
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <div
              style={{
                textAlign: "center",
              }}
            >
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                }}
              >
                404
              </h1>

              <p
                style={{
                  marginTop: 8,
                }}
              >
                Página no encontrada
              </p>
            </div>
          </main>
        ),
      },
    ],
  },
]);

createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);