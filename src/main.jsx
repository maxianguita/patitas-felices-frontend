import React from "react";
import { createRoot } from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from "./App";

import Home from "./pages/Home";
import Animales from "./pages/Animales";
import Contacto from "./pages/Contacto";
import Donar from "./pages/Donar";
import Necesidades from "./pages/Nececidades";
import DetalleAnimal from "./pages/DetalleAnimal";

import PanelSolicitudes from "./admin/PanelSolicitudes";
import DetalleSolicitud from "./admin/DetalleSolicitud";
import AdminLogin from "./admin/AdminLogin";
import PanelAnimales from "./admin/PanelAnimales";
import CrearAnimal from "./admin/CrearAnimal";
import EditarAnimal from "./admin/EditarAnimal";
import ChangePassword from "./admin/ChangePassword";
import RegistrarOrganizacion from "./admin/RegisterOrganizacion";

import PrivateRoute from "./components/PrivateRoute";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
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