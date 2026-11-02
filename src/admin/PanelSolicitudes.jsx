// src/admin/PanelSolicitudes.jsx

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  CalendarDays,
  ClipboardList,
  Eye,
  Loader2,
  MapPin,
  PawPrint,
  RefreshCw,
  User,
} from "lucide-react";

import {
  obtenerSolicitudes,
} from "./service/solicitudesService";

// ----------------------------------------------------
// Estados visuales
// ----------------------------------------------------

const ESTADOS = {
 en_contacto:{label:'En contacto',className:'border-blue-200 bg-blue-50 text-blue-700',icon:CalendarDays},
 encuentro:{label:'Encuentro',className:'border-blue-200 bg-blue-50 text-blue-700',icon:CalendarDays},
  pendiente: {
    label: "Pendiente",
    className:
      "border-yellow-300 bg-yellow-100 text-yellow-800",
  },

  aprobada: {
    label: "Aprobada",
    className:
      "border-green-300 bg-green-100 text-green-800",
  },

  rechazada: {
    label: "Rechazada",
    className:
      "border-red-300 bg-red-100 text-red-800",
  },

  adopcion_concretada: {
    label: "Adopción concretada",
    className:
      "border-blue-300 bg-blue-100 text-blue-800",
  },
};

const FILTROS = [
  {
    value: "todas",
    label: "Todas",
  },
  {
    value: "pendiente",
    label: "Pendientes",
  },
  {
    value: "aprobada",
    label: "Aprobadas",
  },
  {
    value: "rechazada",
    label: "Rechazadas",
  },
  {
    value: "adopcion_concretada",
    label: "Concretadas",
  },
];

// ----------------------------------------------------
// Helpers
// ----------------------------------------------------

const formatearFecha = (fecha) => {
  if (!fecha) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat(
    "es-AR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(fecha));
};

const obtenerImagenAnimal = (animal) => {
  const image =
    animal?.imageUrl ||
    animal?.imagen;

  if (!image) {
    return null;
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  const baseUrl = (
    import.meta.env.VITE_IMAGES_BASE ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000"
  ).replace(/\/$/, "");

  if (image.startsWith("/")) {
    return `${baseUrl}${image}`;
  }

  if (image.startsWith("uploads/")) {
    return `${baseUrl}/${image}`;
  }

  return `${baseUrl}/uploads/${image}`;
};

// ====================================================
// COMPONENTE
// ====================================================

export default function PanelSolicitudes() {
  const navigate = useNavigate();

  const [solicitudes, setSolicitudes] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filtro, setFiltro] =
    useState("todas");

  // --------------------------------------------------
  // Cargar solicitudes
  // --------------------------------------------------

  const cargarSolicitudes = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const respuesta =
          await obtenerSolicitudes({
            page: 1,
            pageSize: 100,
          });

        const lista = Array.isArray(
          respuesta
        )
          ? respuesta
          : Array.isArray(
                respuesta?.items
              )
            ? respuesta.items
            : [];

        setSolicitudes(lista);
      } catch (requestError) {
        console.error(
          "Error cargando solicitudes:",
          requestError
        );

        if (
          requestError.status === 401
        ) {
          navigate("/admin/login");
          return;
        }

        setError(
          requestError.message ||
            "No se pudieron cargar las solicitudes."
        );
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);

  // --------------------------------------------------
  // Filtrar
  // --------------------------------------------------

  const solicitudesFiltradas =
    useMemo(() => {
      if (filtro === "todas") {
        return solicitudes;
      }

      return solicitudes.filter(
        (solicitud) =>
          solicitud.estado === filtro
      );
    }, [solicitudes, filtro]);

  // --------------------------------------------------
  // Contadores
  // --------------------------------------------------

  const contarEstado = (estado) => {
    if (estado === "todas") {
      return solicitudes.length;
    }

    return solicitudes.filter(
      (solicitud) =>
        solicitud.estado === estado
    ).length;
  };

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-10">
      <section className="mx-auto max-w-7xl">

        {/* Encabezado */}
        <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2 font-bold text-[#2E7D32]">
              <PawPrint className="h-6 w-6" />

              Panel administrativo
            </div>

            <h1 className="text-3xl font-black text-gray-900">
              Solicitudes de adopción
            </h1>

            <p className="mt-2 text-gray-500">
              Revisá y gestioná las solicitudes
              recibidas por los animales de tu
              organización.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <Link
              to="/admin/animales"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
            >
              <PawPrint className="h-5 w-5" />
              Mis animales
            </Link>

            <button
              type="button"
              onClick={cargarSolicitudes}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF7A47] px-5 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-5 w-5 ${
                  loading
                    ? "animate-spin"
                    : ""
                }`}
              />

              Actualizar
            </button>

          </div>
        </div>

        {/* Filtros */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex min-w-max gap-2">

            {FILTROS.map(
              (opcion) => (
                <button
                  key={opcion.value}
                  type="button"
                  onClick={() =>
                    setFiltro(
                      opcion.value
                    )
                  }
                  className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                    filtro ===
                    opcion.value
                      ? "bg-[#2E7D32] text-white shadow-sm"
                      : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {opcion.label}

                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                      filtro ===
                      opcion.value
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {contarEstado(
                      opcion.value
                    )}
                  </span>
                </button>
              )
            )}

          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-2xl bg-white shadow-sm">

            <Loader2 className="h-8 w-8 animate-spin text-[#2E7D32]" />

            <p className="text-gray-500">
              Cargando solicitudes...
            </p>

          </div>
        ) : solicitudesFiltradas.length ===
          0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

            <ClipboardList className="mx-auto mb-4 h-14 w-14 text-gray-300" />

            <h2 className="text-xl font-bold text-gray-800">
              No hay solicitudes
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-gray-500">
              No hay solicitudes correspondientes
              al estado seleccionado.
            </p>

          </div>
        ) : (

          /* Tarjetas */
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {solicitudesFiltradas.map(
              (solicitud) => {
                const estado =
                  ESTADOS[
                    solicitud.estado
                  ] || {
                    label:
                      solicitud.estado,
                    className:
                      "border-gray-300 bg-gray-100 text-gray-700",
                  };

                const animal =
                  solicitud.animal;

                const imagen =
                  obtenerImagenAnimal(
                    animal
                  );

                return (
                 <article
  key={solicitud.id}
  className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
>
                    {/* Animal */}
                    <div className="flex items-center gap-4 border-b border-gray-100 p-5">

                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">

                        {imagen ? (
                          <img
                            src={imagen}
                            alt={
                              animal?.nombre ||
                              "Animal"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <PawPrint className="h-8 w-8 text-gray-300" />
                        )}

                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                          Solicitud para
                        </p>

                        <h2 className="truncate text-xl font-black capitalize text-gray-900">
                          {animal?.nombre ||
                            "Animal"}
                        </h2>

                        <p className="mt-1 text-sm capitalize text-gray-500">
                          {animal?.tipo ||
                            "Sin especificar"}
                        </p>

                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${estado.className}`}
                      >
                        {estado.label}
                      </span>

                    </div>

                    {/* Solicitante */}
                    <div className="p-5">

                      <div className="mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-[#FF7A47]" />

                        <h3 className="font-bold text-gray-900">
                          {
                            solicitud.nombreCompleto
                          }
                        </h3>
                      </div>

                      <div className="space-y-3 text-sm text-gray-500">

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />

                          <span>
                            {solicitud.localidad ||
                              "Sin localidad"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 flex-shrink-0 text-gray-400" />

                          <span>
                            {formatearFecha(
                              solicitud.fechaCreacion
                            )}
                          </span>
                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/admin/solicitudes/${solicitud.id}`
                          )
                        }
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF7A47] px-4 py-3 font-bold text-white transition hover:bg-orange-600"
                      >
                        <Eye className="h-5 w-5" />

                        Ver solicitud
                      </button>

                    </div>
                  </article>
                );
              }
            )}

          </div>
        )}

      </section>
    </main>
  );
}