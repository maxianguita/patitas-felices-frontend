// src/service/authService.js

import api from "./api";

// ----------------------------------------------------
// Iniciar sesión
// ----------------------------------------------------

export const login = async (email, password) => {
  try {
    const { data } = await api.post("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });

    if (!data.token) {
      throw new Error("El servidor no devolvió un token.");
    }

    localStorage.setItem("token", data.token);

    // Admite que el backend responda "user" o "usuario".
    const usuario = data.user || data.usuario || null;

    if (usuario) {
      localStorage.setItem(
        "usuario",
        JSON.stringify(usuario)
      );
    }

    return usuario;
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Correo o contraseña incorrectos.";

    throw new Error(mensaje);
  }
};

// ----------------------------------------------------
// Registrar organización y usuario administrador
// ----------------------------------------------------

export const registrarOrganizacion = async (datos) => {
  try {
    const { data } = await api.post(
      "/auth/registrar-organizacion",
      {
        nombreOrganizacion:
          datos.nombreOrganizacion?.trim(),

        emailOrganizacion:
          datos.emailOrganizacion
            ?.trim()
            .toLowerCase(),

        telefono:
          datos.telefono?.trim() || null,

        localidad:
          datos.localidad?.trim() || null,

        provincia:
          datos.provincia?.trim() || null,

        nombreAdministrador:
          datos.nombreAdministrador?.trim(),

        emailAdministrador:
          datos.emailAdministrador
            ?.trim()
            .toLowerCase(),

        password: datos.password,
      }
    );

    return data;
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "No se pudo registrar la organización.";

    throw new Error(mensaje);
  }
};

// ----------------------------------------------------
// Solicitar recuperación de contraseña
// ----------------------------------------------------

export const solicitarRecuperacionPassword = async (
  email
) => {
  try {
    const { data } = await api.post(
      "/auth/olvide-password",
      {
        email: email.trim().toLowerCase(),
      }
    );

    return data;
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "No se pudo solicitar la recuperación de contraseña.";

    throw new Error(mensaje);
  }
};

// ----------------------------------------------------
// Restablecer contraseña mediante token
// ----------------------------------------------------

export const restablecerPassword = async (
  token,
  nuevaPassword
) => {
  try {
    const { data } = await api.post(
      "/auth/restablecer-password",
      {
        token,
        nuevaPassword,
      }
    );

    return data;
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "No se pudo restablecer la contraseña.";

    throw new Error(mensaje);
  }
};

// ----------------------------------------------------
// Cambiar contraseña con la sesión iniciada
// ----------------------------------------------------

export const cambiarPassword = async (
  passwordActual,
  nuevaPassword
) => {
  try {
    const { data } = await api.patch(
      "/auth/cambiar-password",
      {
        passwordActual,
        nuevaPassword,
      }
    );

    return data;
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "No se pudo cambiar la contraseña.";

    throw new Error(mensaje);
  }
};

// ----------------------------------------------------
// Cerrar sesión
// ----------------------------------------------------

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};

// ----------------------------------------------------
// Obtener token
// ----------------------------------------------------

export const getToken = () => {
  return localStorage.getItem("token");
};

// ----------------------------------------------------
// Obtener usuario guardado
// ----------------------------------------------------

export const getUsuario = () => {
  const usuarioGuardado =
    localStorage.getItem("usuario");

  if (!usuarioGuardado) {
    return null;
  }

  try {
    return JSON.parse(usuarioGuardado);
  } catch (error) {
    console.error(
      "No se pudo leer el usuario guardado:",
      error
    );

    localStorage.removeItem("usuario");

    return null;
  }
};

// ----------------------------------------------------
// Verificar autenticación
// ----------------------------------------------------

export const isAuth = () => {
  return Boolean(getToken());
};