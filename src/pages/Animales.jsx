import {
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  PawPrint,
  Heart,
  Loader2,
  Dog,
  Cat,
  Mars,
  Venus,
  Minimize2,
  Share2,
  Link as LinkIcon,
  X,
  Send,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";

import {
  obtenerAnimalesPublicos,
} from "../service/animalesServide";
 import {
  crearSolicitudAdopcion,
} from "../service/solicitudesService";
// ----------------------------------------------------
// Mapeo de estados
// ----------------------------------------------------

const estadoMap = {
  disponible: "Disponible",
  urgencia_medica: "Urgencia médica",
  adoptado: "Adoptado",
};

// ----------------------------------------------------
// Color según el estado
// ----------------------------------------------------

const getStatusColor = (estado) => {
  switch (estado) {
    case "disponible":
      return "border-green-300 bg-green-100 text-green-800";

    case "urgencia_medica":
      return "border-red-300 bg-red-100 text-red-800";

    case "adoptado":
      return "border-gray-300 bg-gray-200 text-gray-700";

    default:
      return "border-gray-300 bg-gray-100 text-gray-800";
  }
};

// ----------------------------------------------------
// Obtener imagen del animal
// ----------------------------------------------------

const getAnimalImage = (animal) => {
  const image =
    animal?.imageUrl || animal?.imagen;

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
// POPUP DE MENSAJES
// ====================================================

const MensajePopup = ({
  abierto,
  tipo = "exito",
  titulo,
  mensaje,
  onClose,
}) => {
  useEffect(() => {
    if (!abierto) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
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
  }, [abierto, onClose]);

  if (!abierto) {
    return null;
  }

  const esExito = tipo === "exito";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 px-4 py-6"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mensaje-popup-title"
        aria-describedby="mensaje-popup-description"
        className="relative w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar mensaje"
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${
            esExito
              ? "bg-green-100"
              : "bg-red-100"
          }`}
        >
          {esExito ? (
            <CheckCircle2 className="h-9 w-9 text-green-600" />
          ) : (
            <CircleAlert className="h-9 w-9 text-red-600" />
          )}
        </div>

        <h3
          id="mensaje-popup-title"
          className="text-2xl font-bold text-gray-900"
        >
          {titulo}
        </h3>

        <p
          id="mensaje-popup-description"
          className="mt-3 leading-6 text-gray-600"
        >
          {mensaje}
        </p>

        <button
          type="button"
          onClick={onClose}
          className={`mt-7 w-full rounded-xl px-5 py-3 font-bold text-white transition ${
            esExito
              ? "bg-[#2E7D32] hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

// ====================================================
// MODAL PÚBLICO DE ADOPCIÓN
// ====================================================

const AdopcionModal = ({
  animal,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    nombreCompleto: "",
    email: "",
    telefono: "",
    localidad: "",
    vivienda: "",
    otrosAnimales: "",
    motivo: "",
    aceptaContacto: false,
  });

  const [enviando, setEnviando] =
    useState(false);

  const [enviado, setEnviado] =
    useState(false);

  const [error, setError] =
    useState("");

  const animalImage =
    getAnimalImage(animal);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previousForm) => ({
      ...previousForm,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.aceptaContacto) {
      setError(
        "Debés aceptar ser contactado para enviar la solicitud."
      );

      return;
    }

    try {
      setEnviando(true);

      await onSubmit({
        animalId: animal.id,
        animalNombre: animal.nombre,
        ...form,
      });

      setEnviado(true);
    } catch (submitError) {
      console.error(
        "Error enviando solicitud:",
        submitError
      );

      setError(
        submitError.message ||
          "No se pudo enviar la solicitud. Intentá nuevamente."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="adopcion-modal-title"
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Encabezado */}
        <div className="flex items-start justify-between border-b border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
              {animalImage ? (
                <img
                  src={animalImage}
                  alt={animal.nombre}
                  className="h-full w-full object-cover"
                />
              ) : (
                <PawPrint className="h-7 w-7 text-gray-300" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-[#FF7A47]">
                Solicitud de adopción
              </p>

              <h2
                id="adopcion-modal-title"
                className="text-2xl font-extrabold text-gray-900"
              >
                Adoptar a {animal.nombre}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={enviando}
            aria-label="Cerrar formulario"
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="overflow-y-auto p-5 sm:p-6">
          {enviado ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-9 w-9 text-green-600" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900">
                Solicitud enviada
              </h3>

              <p className="mt-3 max-w-md text-gray-600">
                Recibimos tu solicitud para
                adoptar a {animal.nombre}. La
                organización responsable se pondrá
                en contacto con vos para continuar
                con el proceso.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-7 rounded-xl bg-[#FF7A47] px-6 py-3 font-bold text-white transition hover:bg-orange-600"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <p className="rounded-xl bg-orange-50 p-4 text-sm text-orange-900">
                Completá tus datos para que la
                organización pueda contactarte y
                conocer un poco más sobre el hogar
                que le ofrecerías a {animal.nombre}.
              </p>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Nombre */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="nombreCompleto"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Nombre y apellido
                  </label>

                  <input
                    id="nombreCompleto"
                    name="nombreCompleto"
                    type="text"
                    required
                    disabled={enviando}
                    value={
                      form.nombreCompleto
                    }
                    onChange={handleChange}
                    placeholder="Ejemplo: Denise Giménez"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#FF7A47] focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Correo electrónico
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    disabled={enviando}
                    value={form.email}
                    onChange={handleChange}
                    placeholder="nombre@email.com"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#FF7A47] focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label
                    htmlFor="telefono"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Teléfono
                  </label>

                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    required
                    autoComplete="tel"
                    disabled={enviando}
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="11 1234 5678"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#FF7A47] focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* Localidad */}
                <div>
                  <label
                    htmlFor="localidad"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Localidad
                  </label>

                  <input
                    id="localidad"
                    name="localidad"
                    type="text"
                    required
                    disabled={enviando}
                    value={form.localidad}
                    onChange={handleChange}
                    placeholder="Ejemplo: Glew"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#FF7A47] focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* Vivienda */}
                <div>
                  <label
                    htmlFor="vivienda"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Tipo de vivienda
                  </label>

                  <select
                    id="vivienda"
                    name="vivienda"
                    required
                    disabled={enviando}
                    value={form.vivienda}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#FF7A47] focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">
                      Seleccionar
                    </option>

                    <option value="casa_con_patio">
                      Casa con patio
                    </option>

                    <option value="casa_sin_patio">
                      Casa sin patio
                    </option>

                    <option value="departamento">
                      Departamento
                    </option>

                    <option value="otro">
                      Otro
                    </option>
                  </select>
                </div>

                {/* Otros animales */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="otrosAnimales"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    ¿Tenés otros animales?
                  </label>

                  <select
                    id="otrosAnimales"
                    name="otrosAnimales"
                    required
                    disabled={enviando}
                    value={
                      form.otrosAnimales
                    }
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#FF7A47] focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">
                      Seleccionar
                    </option>

                    <option value="no">
                      No
                    </option>

                    <option value="perros">
                      Sí, perros
                    </option>

                    <option value="gatos">
                      Sí, gatos
                    </option>

                    <option value="perros_y_gatos">
                      Sí, perros y gatos
                    </option>

                    <option value="otros">
                      Sí, otros animales
                    </option>
                  </select>
                </div>

                {/* Motivo */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="motivo"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    ¿Por qué querés adoptar a{" "}
                    {animal.nombre}?
                  </label>

                  <textarea
                    id="motivo"
                    name="motivo"
                    required
                    rows={4}
                    disabled={enviando}
                    value={form.motivo}
                    onChange={handleChange}
                    placeholder="Contanos por qué querés adoptar y cómo sería su nuevo hogar."
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#FF7A47] focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Consentimiento */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4">
                <input
                  name="aceptaContacto"
                  type="checkbox"
                  checked={
                    form.aceptaContacto
                  }
                  onChange={handleChange}
                  disabled={enviando}
                  className="mt-1 h-4 w-4 accent-[#FF7A47]"
                />

                <span className="text-sm text-gray-600">
                  Acepto que la organización
                  responsable se comunique conmigo
                  para evaluar y continuar el proceso
                  de adopción.
                </span>
              </label>

              {/* Acciones */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={enviando}
                  className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={enviando}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#FF7A47] px-5 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
                >
                  {enviando ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Enviar solicitud
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ====================================================
// TARJETA PÚBLICA DEL ANIMAL
// ====================================================

const AnimalCard = ({
  animal,
  onAdoptar,
}) => {
  const [popup, setPopup] = useState({
    abierto: false,
    tipo: "exito",
    titulo: "",
    mensaje: "",
  });

  const src = getAnimalImage(animal);

  const IconForType =
    animal.tipo === "gato"
      ? Cat
      : Dog;

  const IconForSex =
    animal.sexo === "macho"
      ? Mars
      : Venus;

  const colorSex =
    animal.sexo === "macho"
      ? "text-blue-500"
      : "text-pink-500";

  const disponible =
    animal.estado === "disponible";

  const shareUrl =
    `${window.location.origin}/adoptar`;

  const shareText =
    `Conocé a ${animal.nombre} 🐾 Está buscando una familia.`;

  const shareTitle =
    `Adoptar a ${animal.nombre}`;

  const cerrarPopup = () => {
    setPopup((popupActual) => ({
      ...popupActual,
      abierto: false,
    }));
  };

  const mostrarPopup = ({
    tipo,
    titulo,
    mensaje,
  }) => {
    setPopup({
      abierto: true,
      tipo,
      titulo,
      mensaje,
    });
  };

  const handleAdoptar = () => {
    if (!disponible) {
      return;
    }

    onAdoptar(animal);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });

        return;
      } catch (shareError) {
        if (
          shareError?.name ===
          "AbortError"
        ) {
          return;
        }

        console.error(
          "Error compartiendo:",
          shareError
        );
      }
    }

    const facebookUrl =
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`;

    window.open(
      facebookUrl,
      "_blank",
      "noopener,noreferrer,width=600,height=520"
    );
  };

  const copiarConMetodoAlternativo = () => {
    const textarea =
      document.createElement("textarea");

    textarea.value = shareUrl;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";

    document.body.appendChild(
      textarea
    );

    textarea.focus();
    textarea.select();

    const copiado =
      document.execCommand("copy");

    document.body.removeChild(
      textarea
    );

    if (!copiado) {
      throw new Error(
        "No se pudo copiar el enlace."
      );
    }
  };

  const copyLink = async () => {
    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(
          shareUrl
        );
      } else {
        copiarConMetodoAlternativo();
      }

      mostrarPopup({
        tipo: "exito",
        titulo: "Enlace copiado",
        mensaje: `El enlace para conocer a ${animal.nombre} se copió correctamente.`,
      });
    } catch (copyError) {
      console.error(
        "Error copiando enlace:",
        copyError
      );

      mostrarPopup({
        tipo: "error",
        titulo: "No se pudo copiar",
        mensaje:
          "Ocurrió un problema al copiar el enlace. Intentá nuevamente.",
      });
    }
  };

  return (
<li className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
      {/* Imagen */}
     <div className="flex h-52 w-full items-center justify-center overflow-hidden bg-gray-100">
  {src ? (
    <img
      src={src}
      alt={`Foto de ${animal.nombre}`}
      className="h-full w-full object-contain"
      loading="lazy"
    />
  ) : (
    <PawPrint className="h-12 w-12 text-gray-300" />
  )}
</div>

      {/* Contenido */}
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="truncate text-2xl font-extrabold text-gray-800">
            {animal.nombre}
          </h3>

          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
              animal.estado
            )}`}
          >
            {estadoMap[animal.estado] ||
              animal.estado ||
              "Sin estado"}
          </span>
        </div>

        {/* Información */}
        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <IconForType className="h-4 w-4 text-[#2E7D32]" />

            <span className="capitalize">
              {animal.tipo ||
                "Sin especificar"}
            </span>
          </span>

          {animal.sexo ? (
            <span className="flex items-center gap-1">
              <IconForSex
                className={`h-4 w-4 ${colorSex}`}
              />

              <span className="capitalize">
                {animal.sexo}
              </span>
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <PawPrint className="h-4 w-4 text-gray-400" />

              <span>
                Sexo sin especificar
              </span>
            </span>
          )}

          <span className="flex items-center gap-1">
            <Minimize2 className="h-4 w-4 text-gray-500" />

            <span className="capitalize">
              {animal.tamanio ||
                animal.tamaño ||
                "Tamaño sin especificar"}
            </span>
          </span>
        </div>
        {/* Ver detalle */}
<Link
  to={`/adoptar/${animal.id}`}
  className="mb-3 flex w-full items-center justify-center rounded-xl border border-[#2E7D32] bg-white px-4 py-2.5 font-bold text-[#2E7D32] transition hover:bg-green-50"
>
  Conocer a {animal.nombre}
</Link>

        {/* Adoptar */}
        <button
          type="button"
          onClick={handleAdoptar}
          disabled={!disponible}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-bold text-white transition ${
            disponible
              ? "bg-[#FF7A47] hover:bg-orange-600"
              : "cursor-not-allowed bg-gray-300"
          }`}
        >
          <Heart className="h-4 w-4" />

          <span>
            {disponible
              ? `Adoptar a ${animal.nombre}`
              : animal.estado === "adoptado"
                ? "Ya fue adoptado"
                : "No disponible"}
          </span>
        </button>

        {/* Compartir */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <Share2 className="h-4 w-4" />
            Compartir
          </button>

          <button
            type="button"
            onClick={copyLink}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
          >
            <LinkIcon className="h-4 w-4" />
            Copiar
          </button>
        </div>
      </div>

      <MensajePopup
        abierto={popup.abierto}
        tipo={popup.tipo}
        titulo={popup.titulo}
        mensaje={popup.mensaje}
        onClose={cerrarPopup}
      />
    </li>
  );
};

// ====================================================
// PÁGINA PÚBLICA DE ANIMALES
// ====================================================

export default function Animales() {
  const [animales, setAnimales] =
    useState([]);

  const [
    animalSeleccionado,
    setAnimalSeleccionado,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let componenteActivo = true;

    const cargarAnimales = async () => {
      try {
        setLoading(true);
        setError("");

        const respuesta =
          await obtenerAnimalesPublicos({
            page: 1,
            pageSize: 100,
          });

        if (!componenteActivo) {
          return;
        }

        const lista = Array.isArray(
          respuesta
        )
          ? respuesta
          : Array.isArray(
                respuesta?.items
              )
            ? respuesta.items
            : [];

        setAnimales(lista);
      } catch (requestError) {
        if (!componenteActivo) {
          return;
        }

        console.error(
          "Error cargando animales:",
          requestError
        );

        setError(
          requestError.message ||
            "No se pudieron cargar los animales desde el servidor."
        );
      } finally {
        if (componenteActivo) {
          setLoading(false);
        }
      }
    };

    cargarAnimales();

    return () => {
      componenteActivo = false;
    };
  }, []);

 const handleEnviarSolicitud = async (
  solicitud
) => {
  try {
    const respuesta =
      await crearSolicitudAdopcion(
        solicitud
      );

    console.log(
      "Solicitud creada correctamente:",
      respuesta
    );

    return respuesta;
  } catch (error) {
    console.error(
      "Error enviando solicitud:",
      error
    );

    throw error;
  }
};

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#2E7D32]" />

        <p className="text-gray-500">
          Cargando animales...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
          >
            Volver a intentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#2E7D32]">
            🐾 Animales en adopción
          </h1>

          <p className="mt-2 text-gray-500">
            Conocé a los animales que están
            buscando una familia.
          </p>
        </div>

        {animales.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 px-6 py-16 text-center">
            <PawPrint className="mb-4 h-12 w-12 text-gray-300" />

            <p className="text-lg font-semibold text-gray-700">
              No hay animales disponibles
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Cuando las organizaciones publiquen
              animales, aparecerán en esta sección.
            </p>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {animales.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                onAdoptar={
                  setAnimalSeleccionado
                }
              />
            ))}
          </ul>
        )}
      </section>

      {animalSeleccionado && (
        <AdopcionModal
          animal={animalSeleccionado}
          onClose={() =>
            setAnimalSeleccionado(null)
          }
          onSubmit={
            handleEnviarSolicitud
          }
        />
      )}
    </>
  );
}