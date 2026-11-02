import RequestActions from './RequestActions';
// src/admin/DetalleSolicitud.jsx

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Home,
  Info,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  PawPrint,
  Phone,
  User,
  X,
  XCircle,
} from "lucide-react";

import {
  aprobarSolicitud,
  concretarAdopcion,
  obtenerSolicitudPorId,
  rechazarSolicitud,
} from "./service/solicitudesService";

// ----------------------------------------------------
// Estados
// ----------------------------------------------------

const ESTADOS = {
  en_contacto:{label:'En contacto',className:'border-blue-200 bg-blue-50 text-blue-700',icon:Clock},
  encuentro:{label:'Encuentro',className:'border-blue-200 bg-blue-50 text-blue-700',icon:Clock},
  pendiente: {
    label: "Pendiente",
    className:
      "border-amber-200 bg-amber-50 text-amber-700",
    icon: Clock,
  },

  aprobada: {
    label: "Aprobada",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },

  rechazada: {
    label: "Rechazada",
    className:
      "border-rose-200 bg-rose-50 text-rose-700",
    icon: XCircle,
  },

  adopcion_concretada: {
    label: "Adopción Concretada",
    className:
      "border-indigo-200 bg-indigo-50 text-indigo-700",
    icon: HeartHandshake,
  },
};

// ----------------------------------------------------
// Helpers
// ----------------------------------------------------

const formatearFecha = (fecha) => {
  if (!fecha) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "es-AR",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(new Date(fecha));
};

const formatearValor = (valor) => {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return "No informado";
  }

  return String(valor)
    .replaceAll("_", " ")
    .replace(
      /^\w/,
      (letra) => letra.toUpperCase()
    );
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
// POPUP DE CONFIRMACIÓN
// ====================================================

const ConfirmacionPopup = ({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = "Confirmar",
  tipo = "normal",
  procesando = false,
  onConfirmar,
  onCancelar,
}) => {
  useEffect(() => {
    if (!abierto) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        !procesando
      ) {
        onCancelar();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    const overflowAnterior =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        overflowAnterior;
    };
  }, [
    abierto,
    procesando,
    onCancelar,
  ]);

  if (!abierto) {
    return null;
  }

  const esPeligro =
    tipo === "peligro";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-4 py-6"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !procesando
        ) {
          onCancelar();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmacion-titulo"
        aria-describedby="confirmacion-mensaje"
        className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
      >
        {/* Cerrar */}
        <button
          type="button"
          onClick={onCancelar}
          disabled={procesando}
          aria-label="Cerrar confirmación"
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icono */}
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
            esPeligro
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-[#2E7D32]"
          }`}
        >
          {esPeligro ? (
            <XCircle className="h-8 w-8" />
          ) : (
            <CheckCircle2 className="h-8 w-8" />
          )}
        </div>

        {/* Título */}
        <h2
          id="confirmacion-titulo"
          className="mt-5 text-center text-2xl font-bold text-gray-900"
        >
          {titulo}
        </h2>

        {/* Mensaje */}
        <p
          id="confirmacion-mensaje"
          className="mt-3 text-center text-sm leading-6 text-gray-600"
        >
          {mensaje}
        </p>

        {/* Acciones */}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCancelar}
            disabled={procesando}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirmar}
            disabled={procesando}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              esPeligro
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#2E7D32] hover:bg-green-800"
            }`}
          >
            {procesando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />

                Procesando...
              </>
            ) : (
              textoConfirmar
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// COMPONENTE
// ====================================================

export default function DetalleSolicitud() {
  const { id } = useParams();

  const navigate =
    useNavigate();

  // --------------------------------------------------
  // Estados
  // --------------------------------------------------

  const [
    solicitud,
    setSolicitud,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    procesando,
    setProcesando,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    mensaje,
    setMensaje,
  ] = useState("");

  const [
    observaciones,
    setObservaciones,
  ] = useState("");

  const [
    confirmacion,
    setConfirmacion,
  ] = useState({
    abierto: false,
    accion: null,
    titulo: "",
    mensaje: "",
    textoConfirmar: "Confirmar",
    tipo: "normal",
  });

  // --------------------------------------------------
  // Cargar solicitud
  // --------------------------------------------------

  const cargarSolicitud =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await obtenerSolicitudPorId(
            id
          );

        setSolicitud(data);

        setObservaciones(
          data?.observaciones || ""
        );
      } catch (requestError) {
        console.error(
          "Error cargando solicitud:",
          requestError
        );

        if (
          requestError.status ===
          401
        ) {
          navigate(
            "/admin/login"
          );

          return;
        }

        setError(
          requestError.message ||
            "No se pudo cargar la solicitud."
        );
      } finally {
        setLoading(false);
      }
    }, [
      id,
      navigate,
    ]);

  useEffect(() => {
    cargarSolicitud();
  }, [cargarSolicitud]);

  // --------------------------------------------------
  // Cerrar popup
  // --------------------------------------------------

  const cerrarConfirmacion = () => {
    if (procesando) {
      return;
    }

    setConfirmacion(
      (actual) => ({
        ...actual,
        abierto: false,
      })
    );
  };

  // --------------------------------------------------
  // Aprobar
  // --------------------------------------------------

  const handleAprobar = () => {
    setConfirmacion({
      abierto: true,
      accion: "aprobar",
      titulo:
        "Aprobar solicitud",
      mensaje:
        "¿Querés aprobar esta solicitud de adopción?",
      textoConfirmar:
        "Aprobar",
      tipo: "normal",
    });
  };

  // --------------------------------------------------
  // Rechazar
  // --------------------------------------------------

  const handleRechazar = () => {
    setConfirmacion({
      abierto: true,
      accion: "rechazar",
      titulo:
        "Rechazar solicitud",
      mensaje:
        "¿Estás seguro de que querés rechazar esta solicitud de adopción?",
      textoConfirmar:
        "Rechazar",
      tipo: "peligro",
    });
  };

  // --------------------------------------------------
  // Concretar adopción
  // --------------------------------------------------

  const handleConcretar = () => {
    setConfirmacion({
      abierto: true,
      accion: "concretar",
      titulo:
        "Concretar adopción",

      mensaje: `¿Confirmás que la adopción de ${
        solicitud?.animal
          ?.nombre ||
        "este animal"
      } fue concretada? El animal será marcado como adoptado y dejará de publicarse.`,

      textoConfirmar:
        "Concretar adopción",

      tipo: "normal",
    });
  };

  // --------------------------------------------------
  // Ejecutar acción confirmada
  // --------------------------------------------------

  const ejecutarConfirmacion =
    async () => {
      if (
        !confirmacion.accion ||
        procesando
      ) {
        return;
      }

      try {
        setProcesando(true);
        setError("");
        setMensaje("");

        // -----------------------------
        // Aprobar
        // -----------------------------

        if (
          confirmacion.accion ===
          "aprobar"
        ) {
          await aprobarSolicitud(
            id,
            observaciones.trim() ||
              "Solicitud evaluada y aprobada por la organización."
          );

          setMensaje(
            "La solicitud fue aprobada correctamente."
          );
        }

        // -----------------------------
        // Rechazar
        // -----------------------------

        if (
          confirmacion.accion ===
          "rechazar"
        ) {
          await rechazarSolicitud(
            id,
            observaciones.trim() ||
              "Solicitud rechazada por la organización."
          );

          setMensaje(
            "La solicitud fue rechazada correctamente."
          );
        }

        // -----------------------------
        // Concretar
        // -----------------------------

        if (
          confirmacion.accion ===
          "concretar"
        ) {
          await concretarAdopcion(
            id
          );

          setMensaje(
            "La adopción fue concretada correctamente."
          );
        }

        // Cerrar popup
        setConfirmacion(
          (actual) => ({
            ...actual,
            abierto: false,
            accion: null,
          })
        );

        // Actualizar información
        await cargarSolicitud();
      } catch (requestError) {
        console.error(
          "Error realizando acción:",
          requestError
        );

        setConfirmacion(
          (actual) => ({
            ...actual,
            abierto: false,
          })
        );

        setError(
          requestError.message ||
            "No se pudo realizar la acción."
        );
      } finally {
        setProcesando(false);
      }
    };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#2E7D32]" />

          <p className="text-sm font-medium text-gray-500">
            Cargando detalles de la
            solicitud...
          </p>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Error sin solicitud
  // --------------------------------------------------

  if (
    error &&
    !solicitud
  ) {
    return (
      <main className="min-h-screen bg-gray-50/50 px-4 py-12">
        <div className="mx-auto max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <XCircle className="h-7 w-7" />
          </div>

          <h1 className="mt-4 text-lg font-bold text-gray-900">
            No se pudo cargar la
            solicitud
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {error}
          </p>

          <Link
            to="/admin/solicitudes"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />

            Volver a solicitudes
          </Link>
        </div>
      </main>
    );
  }

  if (!solicitud) {
    return null;
  }

  // --------------------------------------------------
  // Datos
  // --------------------------------------------------

  const estado =
    ESTADOS[
      solicitud.estado
    ] || {
      label:
        solicitud.estado ||
        "Sin estado",

      className:
        "border-gray-200 bg-gray-50 text-gray-700",

      icon: Clock,
    };

  const EstadoIcon =
    estado.icon;

  const animal =
    solicitud.animal;

  const imagen =
    obtenerImagenAnimal(
      animal
    );

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="min-h-screen bg-gray-50/50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* Volver */}
        <Link
          to="/admin/solicitudes"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#2E7D32]"
        >
          <ArrowLeft className="h-4 w-4" />

          Volver a solicitudes
        </Link>

        {/* Header principal */}
        <div className="mb-6 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2E7D32]">

                <PawPrint className="h-4 w-4" />

                Solicitud #
                {solicitud.id}

              </div>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Solicitud de adopción
              </h1>

              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">

                <Calendar className="h-3.5 w-3.5" />

                Recibida el{" "}
                {formatearFecha(
                  solicitud.fechaCreacion
                )}

              </p>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 self-start rounded-full border px-3.5 py-1.5 text-xs font-semibold sm:self-center ${estado.className}`}
            >
              <EstadoIcon className="h-4 w-4" />

              {estado.label}
            </span>

          </div>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">

            <XCircle className="h-5 w-5 shrink-0 text-red-500" />

            <p>{error}</p>

          </div>
        )}

        {mensaje && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">

            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

            <p>{mensaje}</p>

          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* ==========================
              COLUMNA IZQUIERDA
          ========================== */}

          <div className="space-y-6 lg:col-span-2">

            {/* Solicitante */}
            <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-center gap-3.5 border-b border-gray-100 pb-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#FF7A47]">

                  <User className="h-5 w-5" />

                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {
                      solicitud.nombreCompleto
                    }
                  </h2>

                  <p className="text-xs font-medium text-gray-500">
                    Datos del postulante
                  </p>
                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* Email */}
                <div className="rounded-xl bg-gray-50/70 p-3.5">

                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Email
                  </span>

                  <p className="mt-1 flex items-center gap-2 break-all text-sm font-medium text-gray-800">

                    <Mail className="h-4 w-4 shrink-0 text-gray-400" />

                    {solicitud.email}

                  </p>
                </div>

                {/* Teléfono */}
                <div className="rounded-xl bg-gray-50/70 p-3.5">

                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Teléfono
                  </span>

                  <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-800">

                    <Phone className="h-4 w-4 shrink-0 text-gray-400" />

                    {
                      solicitud.telefono
                    }

                  </p>
                </div>

                {/* Localidad */}
                <div className="rounded-xl bg-gray-50/70 p-3.5">

                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Localidad
                  </span>

                  <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-800">

                    <MapPin className="h-4 w-4 shrink-0 text-gray-400" />

                    {
                      solicitud.localidad
                    }

                  </p>
                </div>

                {/* Vivienda */}
                <div className="rounded-xl bg-gray-50/70 p-3.5">

                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Vivienda
                  </span>

                  <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-800">

                    <Home className="h-4 w-4 shrink-0 text-gray-400" />

                    {formatearValor(
                      solicitud.vivienda
                    )}

                  </p>
                </div>

                {/* Otros animales */}
                <div className="rounded-xl bg-gray-50/70 p-3.5 sm:col-span-2">

                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Otros animales
                  </span>

                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {formatearValor(
                      solicitud.otrosAnimales
                    )}
                  </p>

                </div>

              </div>
            </section>

            {/* Motivo */}
            <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">

              <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">

                <MessageSquare className="h-5 w-5 text-gray-400" />

                <h2 className="text-base font-bold text-gray-900">
                  Motivo de adopción
                </h2>

              </div>

              <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
                {solicitud.motivo}
              </p>

            </section>

            {/* Observaciones */}
            <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">

              <div className="mb-2">

                <h2 className="text-base font-bold text-gray-900">
                  Observaciones internas
                </h2>

                <p className="text-xs text-gray-500">
                  Anotaciones o notas sobre la
                  evaluación de la solicitud.
                </p>

              </div>

              <textarea
                value={observaciones}
                onChange={(event) =>
                  setObservaciones(
                    event.target.value
                  )
                }
                rows={4}
                disabled={
                  solicitud.estado ===
                    "adopcion_concretada" ||
                  procesando
                }
                placeholder="Escribí una observación..."
                className="mt-3 w-full rounded-xl border border-gray-200 p-3.5 text-sm text-gray-800 outline-none transition focus:border-[#FF7A47] focus:ring-2 focus:ring-orange-100 disabled:bg-gray-50 disabled:text-gray-400"
              />

            </section>

          </div>

          {/* ==========================
              COLUMNA DERECHA
          ========================== */}

          <aside className="space-y-6">

            {/* Animal */}
            <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">

              <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gray-100">

                {imagen ? (
                  <img
                    src={imagen}
                    alt={
                      animal?.nombre ||
                      "Animal"
                    }
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-300">

                    <PawPrint className="h-12 w-12" />

                  </div>
                )}

              </div>

              <div className="p-5">

                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Animal solicitado
                </span>

                <h3 className="mt-0.5 text-xl font-bold capitalize text-gray-900">
                  {animal?.nombre ||
                    "Sin nombre"}
                </h3>

                <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-xs font-medium text-gray-600">

                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Tipo
                    </span>

                    <span className="text-gray-800">
                      {formatearValor(
                        animal?.tipo
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Sexo
                    </span>

                    <span className="text-gray-800">
                      {formatearValor(
                        animal?.sexo
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Edad
                    </span>

                    <span className="text-gray-800">
                      {formatearValor(
                        animal?.edad
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Tamaño
                    </span>

                    <span className="text-gray-800">
                      {formatearValor(
                        animal?.tamanio
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Estado
                    </span>

                    <span className="font-semibold text-gray-800">
                      {formatearValor(
                        animal?.estado
                      )}
                    </span>
                  </div>

                </div>
              </div>

            </section>

            {/* Acciones */}
            <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">

              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-900">
                Acciones requeridas
              </h3>

              {/* Pendiente */}
              {['pendiente','en_contacto','encuentro'].includes(solicitud.estado) && (

                <div className="space-y-3">

                  <button
                    type="button"
                    onClick={
                      handleAprobar
                    }
                    disabled={
                      procesando
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2E7D32] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />

                    Aprobar solicitud
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleRechazar
                    }
                    disabled={
                      procesando
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />

                    Rechazar solicitud
                  </button>

                </div>
              )}

              {/* Aprobada */}
              {solicitud.estado ===
                "aprobada" && (

                <div className="space-y-3">

                  <div className="flex gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-medium text-emerald-800">

                    <Info className="h-4 w-4 shrink-0 text-emerald-600" />

                    <span>
                      Solicitud aprobada.
                      Confirmá una vez que se
                      complete la entrega del
                      animal.
                    </span>

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleConcretar
                    }
                    disabled={
                      procesando
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF7A47] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <HeartHandshake className="h-4 w-4" />

                    Concretar adopción
                  </button>

                </div>
              )}

              {/* Rechazada */}
              {solicitud.estado ===
                "rechazada" && (

                <div className="rounded-xl bg-rose-50 p-3 text-center text-xs font-semibold text-rose-700">
                  Esta solicitud ha sido
                  rechazada.
                </div>

              )}

              {/* Concretada */}
              {solicitud.estado ===
                "adopcion_concretada" && (

                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs">

                  <div className="flex items-center gap-1.5 font-bold text-indigo-900">

                    <HeartHandshake className="h-4 w-4 text-indigo-600" />

                    Adopción finalizada

                  </div>

                  <p className="mt-1 text-indigo-700">
                    El animal ha sido entregado
                    exitosamente.
                  </p>

                  {solicitud.fechaResolucion && (
                    <p className="mt-2 text-[11px] font-medium text-indigo-500">

                      Fecha:{" "}
                      {formatearFecha(
                        solicitud.fechaResolucion
                      )}

                    </p>
                  )}

                </div>

              )}

            </section>

          </aside>

        </div>

      </div>

      {/* ==================================================
          POPUP DE CONFIRMACIÓN
      ================================================== */}

      <ConfirmacionPopup
        abierto={
          confirmacion.abierto
        }
        titulo={
          confirmacion.titulo
        }
        mensaje={
          confirmacion.mensaje
        }
        textoConfirmar={
          confirmacion.textoConfirmar
        }
        tipo={
          confirmacion.tipo
        }
        procesando={
          procesando
        }
        onCancelar={
          cerrarConfirmacion
        }
        onConfirmar={
          ejecutarConfirmacion
        }
      />

    <RequestActions id={id} estado={solicitud?.estado} onUpdated={cargarSolicitud}/></main>
  );
}