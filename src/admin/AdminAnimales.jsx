import { useState } from "react";

import {
  PawPrint,
  Heart,
  Dog,
  Cat,
  Mars,
  Venus,
  Minimize2,
  Share2,
  Facebook,
  Whatsapp,
  Link as LinkIcon,
  Pencil,
  Trash2,
  CheckCircle2,
  CircleAlert,
  X,
} from "lucide-react";

// ----------------------------------------------------
// Mapa de estados
// ----------------------------------------------------

const estadoMap = {
  disponible: "Disponible",
  urgencia_medica: "Urgencia médica",
  adoptado: "Adoptado",
};

// ----------------------------------------------------
// Colores por estado
// ----------------------------------------------------

const getStatusColor = (estado) => {
  switch (estado) {
    case "disponible":
      return "bg-green-100 text-green-800 border-green-300";

    case "urgencia_medica":
      return "bg-red-100 text-red-800 border-red-300";

    case "adoptado":
      return "bg-gray-200 text-gray-700 border-gray-300";

    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

// ----------------------------------------------------
// Obtener la URL correcta de la imagen
// ----------------------------------------------------

const getAnimalImage = (animal) => {
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
// POPUP DE MENSAJE
// ====================================================

const MensajePopup = ({
  abierto,
  tipo = "exito",
  titulo,
  mensaje,
  onClose,
}) => {
  if (!abierto) {
    return null;
  }

  const esExito =
    tipo === "exito";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-4 py-6"
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
        aria-labelledby="mensaje-popup-titulo"
        aria-describedby="mensaje-popup-descripcion"
        className="relative w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl"
      >
        {/* Cerrar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar mensaje"
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icono */}
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

        {/* Título */}
        <h3
          id="mensaje-popup-titulo"
          className="text-2xl font-bold text-gray-900"
        >
          {titulo}
        </h3>

        {/* Mensaje */}
        <p
          id="mensaje-popup-descripcion"
          className="mt-3 leading-6 text-gray-600"
        >
          {mensaje}
        </p>

        {/* Acción */}
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
// TARJETA
// ====================================================

export default function AnimalCard({
  a,
  onAdoptar,
  esAdmin = false,
  onEditar,
  onEliminar,
  onMarcarAdoptado,
}) {
  // ----------------------------------------------------
  // Popup
  // ----------------------------------------------------

  const [popup, setPopup] =
    useState({
      abierto: false,
      tipo: "exito",
      titulo: "",
      mensaje: "",
    });

  if (!a) {
    return null;
  }

  const src =
    getAnimalImage(a);

  const IconForType =
    a.tipo === "gato"
      ? Cat
      : Dog;

  const IconForSex =
    a.sexo === "macho"
      ? Mars
      : Venus;

  const colorSex =
    a.sexo === "macho"
      ? "text-blue-500"
      : "text-pink-500";

  const disponible =
    a.estado === "disponible";

  const shareUrl =
    `${window.location.origin}/adoptar`;

  const shareText =
    `Conocé a ${a.nombre} 🐾 Está buscando una familia en Patitas Felices.`;

  const shareTitle =
    `Adoptar a ${a.nombre}`;

  // ----------------------------------------------------
  // Popup
  // ----------------------------------------------------

  const cerrarPopup = () => {
    setPopup(
      (popupActual) => ({
        ...popupActual,
        abierto: false,
      })
    );
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

  // ----------------------------------------------------
  // Abrir formulario público de adopción
  // ----------------------------------------------------

  const handleAdoptar = () => {
    if (!disponible) {
      return;
    }

    if (
      typeof onAdoptar ===
      "function"
    ) {
      onAdoptar(a);
    }
  };

  // ----------------------------------------------------
  // Compartir
  // ----------------------------------------------------

  const handleShare =
    async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl,
          });

          return;
        } catch (error) {
          if (
            error?.name ===
            "AbortError"
          ) {
            return;
          }

          console.error(
            "Error compartiendo:",
            error
          );
        }
      }

      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`,
        "_blank",
        "noopener,noreferrer,width=600,height=520"
      );
    };

  // ----------------------------------------------------
  // Método alternativo para copiar
  // ----------------------------------------------------

  const copiarConMetodoAlternativo =
    () => {
      const textarea =
        document.createElement(
          "textarea"
        );

      textarea.value =
        shareUrl;

      textarea.style.position =
        "fixed";

      textarea.style.left =
        "-9999px";

      textarea.style.opacity =
        "0";

      document.body.appendChild(
        textarea
      );

      textarea.focus();
      textarea.select();

      const copiado =
        document.execCommand(
          "copy"
        );

      document.body.removeChild(
        textarea
      );

      if (!copiado) {
        throw new Error(
          "No se pudo copiar el enlace."
        );
      }
    };

  // ----------------------------------------------------
  // Copiar enlace
  // ----------------------------------------------------

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
        mensaje: `El enlace para conocer a ${a.nombre} se copió correctamente al portapapeles.`,
      });
    } catch (copyError) {
      console.error(
        "Error copiando enlace:",
        copyError
      );

      mostrarPopup({
        tipo: "error",
        titulo:
          "No se pudo copiar",
        mensaje:
          "Ocurrió un problema al copiar el enlace. Intentá nuevamente.",
      });
    }
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <>
      <li className="mt-6 flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">

        {/* Imagen */}
        <div className="flex h-56 w-full items-center justify-center overflow-hidden bg-gray-50 sm:h-48">

          {src ? (
            <img
              src={src}
              alt={`Foto de ${a.nombre}`}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          ) : (
            <PawPrint className="h-12 w-12 text-gray-300" />
          )}

        </div>

        {/* Contenido */}
        <div className="flex flex-1 flex-col p-5">

          <div>

            {/* Nombre y estado */}
            <div className="mb-3 flex items-start justify-between gap-3">

              <h3 className="truncate text-2xl font-extrabold text-gray-800">
                {a.nombre}
              </h3>

              <span
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
                  a.estado
                )}`}
              >
                {estadoMap[
                  a.estado
                ] ||
                  a.estado ||
                  "Sin estado"}
              </span>

            </div>

            {/* Información */}
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-600">

              {/* Tipo */}
              <span className="flex items-center gap-1">

                <IconForType className="h-4 w-4 text-[#2E7D32]" />

                <span className="capitalize">
                  {a.tipo ||
                    "Sin especificar"}
                </span>

              </span>

              {/* Sexo */}
              {a.sexo ? (
                <span className="flex items-center gap-1">

                  <IconForSex
                    className={`h-4 w-4 ${colorSex}`}
                  />

                  <span className="capitalize">
                    {a.sexo}
                  </span>

                </span>
              ) : (
                <span className="flex items-center gap-1">

                  <PawPrint className="h-4 w-4 text-gray-400" />

                  Sexo sin especificar

                </span>
              )}

              {/* Tamaño */}
              <span className="flex items-center gap-1">

                <Minimize2 className="h-4 w-4 text-gray-500" />

                <span className="capitalize">
                  {a.tamanio ||
                    a.tamaño ||
                    "Tamaño sin especificar"}
                </span>

              </span>

            </div>

            {/* Historia */}
            {a.historia && (
              <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-gray-500">
                {a.historia}
              </p>
            )}

          </div>

          {/* ==================================================
              VISTA PÚBLICA
          ================================================== */}

          {!esAdmin && (
            <>
              {/* Adoptar */}
              <button
                type="button"
                onClick={
                  handleAdoptar
                }
                disabled={
                  !disponible
                }
                className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 font-bold text-white transition ${
                  disponible
                    ? "bg-[#FF7A47] hover:bg-orange-600"
                    : "cursor-not-allowed bg-gray-300"
                }`}
              >
                <Heart className="h-4 w-4" />

                <span>
                  {disponible
                    ? `Adoptar a ${a.nombre}`
                    : a.estado ===
                        "adoptado"
                      ? "Ya fue adoptado"
                      : "No disponible"}
                </span>
              </button>

              {/* Compartir */}
              <div className="mt-3 grid grid-cols-2 gap-2">

                {/* Compartir nativo */}
                <button
                  type="button"
                  onClick={
                    handleShare
                  }
                  className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
                >
                  <Share2 className="h-4 w-4" />

                  Compartir
                </button>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Facebook className="h-4 w-4" />

                  Facebook
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `${shareText} ${shareUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-green-500 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
                >
                  <Whatsapp className="h-4 w-4" />

                  WhatsApp
                </a>

                {/* Copiar */}
                <button
                  type="button"
                  onClick={copyLink}
                  className="flex items-center justify-center gap-2 rounded-lg bg-gray-50 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
                >
                  <LinkIcon className="h-4 w-4" />

                  Copiar
                </button>

              </div>
            </>
          )}

          {/* ==================================================
              VISTA ADMINISTRATIVA
          ================================================== */}

          {esAdmin && (
            <div className="space-y-2">

              {/* Editar */}
              {typeof onEditar ===
                "function" && (
                <button
                  type="button"
                  onClick={() =>
                    onEditar(a)
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <Pencil className="h-4 w-4" />

                  Editar
                </button>
              )}

              {/* Adoptado */}
              {a.estado !==
                  "adoptado" &&
                typeof onMarcarAdoptado ===
                  "function" && (
                  <button
                    type="button"
                    onClick={() =>
                      onMarcarAdoptado(
                        a
                      )
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 font-semibold text-white transition hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />

                    Marcar como adoptado
                  </button>
                )}

              {/* Eliminar */}
              {typeof onEliminar ===
                "function" && (
                <button
                  type="button"
                  onClick={() =>
                    onEliminar(a)
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2.5 font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />

                  Eliminar
                </button>
              )}

            </div>
          )}

        </div>
      </li>

      {/* ==================================================
          POPUP
      ================================================== */}

      <MensajePopup
        abierto={popup.abierto}
        tipo={popup.tipo}
        titulo={popup.titulo}
        mensaje={popup.mensaje}
        onClose={cerrarPopup}
      />
    </>
  );
}