// src/admin/service/solicitudesService.js

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

// ----------------------------------------------------
// Token
// ----------------------------------------------------

const obtenerToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("token")
  );
};

// ----------------------------------------------------
// Request genérico
// ----------------------------------------------------

const request = async (
  endpoint,
  options = {}
) => {
  const token = obtenerToken();

  if (!token) {
    const error = new Error(
      "No hay una sesión administrativa activa."
    );

    error.status = 401;

    throw error;
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    }
  );

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        "Ocurrió un error al comunicarse con el servidor."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};

// ====================================================
// SOLICITUDES
// ====================================================

// GET /api/admin/solicitudes
export const obtenerSolicitudes = async ({
  page = 1,
  pageSize = 100,
} = {}) => {
  return request(
    `/api/admin/solicitudes?page=${page}&pageSize=${pageSize}`
  );
};

// GET /api/admin/solicitudes/:id
export const obtenerSolicitudPorId = async (
  id
) => {
  return request(
    `/api/admin/solicitudes/${id}`
  );
};

// PATCH /api/admin/solicitudes/:id/estado
export const actualizarEstadoSolicitud =
  async (
    id,
    estado,
    observaciones = undefined
  ) => {
    const body = {
      estado,
    };

    if (observaciones !== undefined) {
      body.observaciones = observaciones;
    }

    return request(
      `/api/admin/solicitudes/${id}/estado`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      }
    );
  };

// Aprobar
export const aprobarSolicitud = async (
  id,
  observaciones
) => {
  return actualizarEstadoSolicitud(
    id,
    "aprobada",
    observaciones
  );
};

// Rechazar
export const rechazarSolicitud = async (
  id,
  observaciones
) => {
  return actualizarEstadoSolicitud(
    id,
    "rechazada",
    observaciones
  );
};

// PATCH /api/admin/solicitudes/:id/concretar
export const concretarAdopcion = async (
  id
) => {
  return request(
    `/api/admin/solicitudes/${id}/concretar`,
    {
      method: "PATCH",
    }
  );
};