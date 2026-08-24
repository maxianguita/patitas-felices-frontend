// src/service/solicitudesService.js

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

// ====================================================
// REQUEST PÚBLICO
// ====================================================

const requestPublico = async (
  endpoint,
  options = {}
) => {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",
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
// SOLICITUD DE ADOPCIÓN PÚBLICA
// ====================================================

// POST /api/solicitudes
export const crearSolicitudAdopcion = async (
  solicitud
) => {
  return requestPublico(
    "/api/solicitudes",
    {
      method: "POST",

      body: JSON.stringify({
        animalId:
          solicitud.animalId,

        nombreCompleto:
          solicitud.nombreCompleto,

        email:
          solicitud.email,

        telefono:
          solicitud.telefono,

        localidad:
          solicitud.localidad,

        vivienda:
          solicitud.vivienda,

        otrosAnimales:
          solicitud.otrosAnimales,

        motivo:
          solicitud.motivo,

        aceptaContacto:
          solicitud.aceptaContacto,
      }),
    }
  );
};