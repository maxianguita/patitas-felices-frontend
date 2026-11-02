// src/service/api.js

const API_BASE = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

// ----------------------------------------------------
// Construir URL
// ----------------------------------------------------

const buildUrl = (path, params) => {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  const validParams = Object.fromEntries(
    Object.entries(params || {}).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== ""
    )
  );

  const queryString = Object.keys(validParams).length
    ? `?${new URLSearchParams(validParams).toString()}`
    : "";

  return `${API_BASE}${normalizedPath}${queryString}`;
};

// ----------------------------------------------------
// Leer respuesta JSON de manera segura
// ----------------------------------------------------

const parseMaybeJson = async (response) => {
  // Respuestas sin contenido, por ejemplo DELETE con 204
  if (response.status === 204) {
    return null;
  }

  const contentType =
    response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  const text = await response.text().catch(() => "");

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

// ----------------------------------------------------
// Obtener token
// ----------------------------------------------------

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ----------------------------------------------------
// Configurar body y encabezados
// ----------------------------------------------------

const createRequestConfig = (
  method,
  data,
  customHeaders = {}
) => {
  const isFormData = data instanceof FormData;
  const hasBody = data !== undefined && data !== null;

  return {
    method,

    headers: {
      ...getAuthHeaders(),

      ...(hasBody && !isFormData
        ? {
            "Content-Type": "application/json",
          }
        : {}),

      ...customHeaders,
    },

    body: !hasBody
      ? undefined
      : isFormData
        ? data
        : JSON.stringify(data),
  };
};

// ----------------------------------------------------
// Petición general
// ----------------------------------------------------

const request = async (url, options = {}) => {
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),20000);
  try {
    const response = await fetch(url, {
      credentials: "include",
      ...options,
      signal:controller.signal,
    });

    const data = await parseMaybeJson(response);

    if (!response.ok) {
      const error = new Error(
        data?.message ||
          data?.error ||
          `Error ${response.status} en la solicitud.`
      );

      error.status = response.status;

      error.response = {
        status: response.status,
        data,
      };

      throw error;
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    // Si fetch falla completamente, por ejemplo backend apagado
    if (!error.response) {
      const connectionError = new Error(
        "No se pudo conectar con el servidor."
      );

      connectionError.cause = error;

      throw connectionError;
    }

    // Token vencido o inválido
    if (error.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      const currentPath = window.location.pathname;

      const publicAdminRoutes = [
        "/admin/login",
        "/admin/Change-password",
        "/admin/restablecer-password",
        "/admin/registrar-organizacion",
      ];

      if (
        currentPath.startsWith("/admin") &&
        !publicAdminRoutes.includes(currentPath)
      ) {
        window.location.href = "/admin/login";
      }
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

// ----------------------------------------------------
// Métodos disponibles
// ----------------------------------------------------

const api = {
  get: async (url, config = {}) => {
    const fullUrl = buildUrl(url, config.params);

    return request(fullUrl, {
      method: "GET",

      headers: {
        ...getAuthHeaders(),
        ...config.headers,
      },
    });
  },

  post: async (url, data, config = {}) => {
    const fullUrl = buildUrl(url);

    return request(
      fullUrl,
      createRequestConfig(
        "POST",
        data,
        config.headers
      )
    );
  },

  // Necesario para editar animales
  put: async (url, data, config = {}) => {
    const fullUrl = buildUrl(url);

    return request(
      fullUrl,
      createRequestConfig(
        "PUT",
        data,
        config.headers
      )
    );
  },

  patch: async (url, data, config = {}) => {
    const fullUrl = buildUrl(url);

    return request(
      fullUrl,
      createRequestConfig(
        "PATCH",
        data,
        config.headers
      )
    );
  },

  delete: async (url, config = {}) => {
    const fullUrl = buildUrl(url);

    return request(fullUrl, {
      method: "DELETE",

      headers: {
        ...getAuthHeaders(),
        ...config.headers,
      },
    });
  },
};

export default api;