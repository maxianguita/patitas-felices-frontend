// src/admin/EditarAnimal.jsx

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  ImagePlus,
  Loader2,
  PawPrint,
  Save,
  X,
} from "lucide-react";

import {
  actualizarAnimal,
  obtenerAnimalPorId,
} from "../service/animalesServide";

const FORM_INICIAL = {
  nombre: "",
  tipo: "perro",
  estado: "disponible",
  historia: "",
  publicado: true,
  imagen: null,
};

const FORMATOS_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const TAMANIO_MAXIMO =
  5 * 1024 * 1024;

const obtenerUrlImagen = (animal) => {
  const imagen =
    animal?.imageUrl ||
    animal?.imagen ||
    "";

  if (!imagen) {
    return "";
  }

  if (
    imagen.startsWith("http://") ||
    imagen.startsWith("https://") ||
    imagen.startsWith("blob:")
  ) {
    return imagen;
  }

  const baseUrl = (
    import.meta.env.VITE_IMAGES_BASE ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000"
  ).replace(/\/$/, "");

  if (imagen.startsWith("/")) {
    return `${baseUrl}${imagen}`;
  }

  if (imagen.startsWith("uploads/")) {
    return `${baseUrl}/${imagen}`;
  }

  return `${baseUrl}/uploads/${imagen}`;
};

export default function EditarAnimal() {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const inputImagenRef =
    useRef(null);

  const [form, setForm] =
    useState(FORM_INICIAL);

  const [
    previewImagen,
    setPreviewImagen,
  ] = useState("");

  const [
    previewEsTemporal,
    setPreviewEsTemporal,
  ] = useState(false);

  const [
    eliminarImagenActual,
    setEliminarImagenActual,
  ] = useState(false);

  const [cargando, setCargando] =
    useState(true);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [mensaje, setMensaje] =
    useState("");

  // ----------------------------------------------------
  // Cargar animal
  // ----------------------------------------------------

  useEffect(() => {
    let componenteActivo = true;

    const cargarAnimal = async () => {
      try {
        setCargando(true);
        setError("");

        const respuesta =
          await obtenerAnimalPorId(id);

        if (!componenteActivo) {
          return;
        }

        const animal =
          respuesta?.animal ||
          respuesta?.data ||
          respuesta;

        if (!animal?.id) {
          throw new Error(
            "No se encontró el animal solicitado."
          );
        }

        setForm({
          nombre:
            animal.nombre || "",

          tipo:
            animal.tipo || "perro",

          estado:
            animal.estado ||
            "disponible",

          historia:
            animal.historia || "",

          publicado:
            animal.estado === "adoptado"
              ? false
              : animal.publicado !== false,

          imagen: null,
        });

        setPreviewImagen(
          obtenerUrlImagen(animal)
        );

        setPreviewEsTemporal(false);
        setEliminarImagenActual(false);
      } catch (requestError) {
        console.error(
          "Error cargando animal:",
          requestError
        );

        if (componenteActivo) {
          setError(
            requestError.message ||
              "No se pudo cargar el animal."
          );
        }
      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    };

    cargarAnimal();

    return () => {
      componenteActivo = false;
    };
  }, [id]);

  // ----------------------------------------------------
  // Liberar previews temporales
  // ----------------------------------------------------

  useEffect(() => {
    return () => {
      if (
        previewEsTemporal &&
        previewImagen
      ) {
        URL.revokeObjectURL(
          previewImagen
        );
      }
    };
  }, [
    previewImagen,
    previewEsTemporal,
  ]);

  // ----------------------------------------------------
  // Cambios del formulario
  // ----------------------------------------------------

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setError("");
    setMensaje("");

    setForm((formActual) => {
      const nuevoForm = {
        ...formActual,

        [name]:
          type === "checkbox"
            ? checked
            : value,
      };

      if (
        name === "estado" &&
        value === "adoptado"
      ) {
        nuevoForm.publicado = false;
      }

      return nuevoForm;
    });
  };

  // ----------------------------------------------------
  // Seleccionar imagen
  // ----------------------------------------------------

  const handleImagen = (event) => {
    const archivo =
      event.target.files?.[0];

    setError("");
    setMensaje("");

    if (!archivo) {
      return;
    }

    if (
      !FORMATOS_PERMITIDOS.includes(
        archivo.type
      )
    ) {
      setError(
        "La imagen debe tener formato JPG, PNG o WEBP."
      );

      event.target.value = "";
      return;
    }

    if (
      archivo.size >
      TAMANIO_MAXIMO
    ) {
      setError(
        "La imagen no puede superar los 5 MB."
      );

      event.target.value = "";
      return;
    }

    if (
      previewEsTemporal &&
      previewImagen
    ) {
      URL.revokeObjectURL(
        previewImagen
      );
    }

    const nuevaPreview =
      URL.createObjectURL(archivo);

    setPreviewImagen(
      nuevaPreview
    );

    setPreviewEsTemporal(true);
    setEliminarImagenActual(false);

    setForm((formActual) => ({
      ...formActual,
      imagen: archivo,
    }));
  };

  // ----------------------------------------------------
  // Quitar imagen
  // ----------------------------------------------------

  const quitarImagen = () => {
    if (
      previewEsTemporal &&
      previewImagen
    ) {
      URL.revokeObjectURL(
        previewImagen
      );
    }

    setPreviewImagen("");
    setPreviewEsTemporal(false);
    setEliminarImagenActual(true);

    setForm((formActual) => ({
      ...formActual,
      imagen: null,
    }));

    if (inputImagenRef.current) {
      inputImagenRef.current.value =
        "";
    }
  };

  // ----------------------------------------------------
  // Validación
  // ----------------------------------------------------

  const validarFormulario = () => {
    const nombre =
      form.nombre.trim();

    if (!nombre) {
      return "Ingresá el nombre del animal.";
    }

    if (nombre.length < 2) {
      return "El nombre debe tener al menos 2 caracteres.";
    }

    if (!form.tipo) {
      return "Seleccioná el tipo de animal.";
    }

    if (!form.estado) {
      return "Seleccioná el estado del animal.";
    }

    return "";
  };

  // ----------------------------------------------------
  // Guardar cambios
  // ----------------------------------------------------

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setMensaje("");

    const errorValidacion =
      validarFormulario();

    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    try {
      setIsLoading(true);

      await actualizarAnimal(id, {
        nombre:
          form.nombre.trim(),

        tipo:
          form.tipo,

        estado:
          form.estado,

        historia:
          form.historia.trim(),

        publicado:
          form.estado === "adoptado"
            ? false
            : form.publicado,

        imagen:
          form.imagen,

        eliminarImagen:
          eliminarImagenActual,
      });

      setMensaje(
        "Los cambios fueron guardados correctamente."
      );

      window.setTimeout(() => {
        navigate(
          "/admin/animales",
          {
            replace: true,
          }
        );
      }, 1200);
    } catch (requestError) {
      console.error(
        "Error actualizando animal:",
        requestError
      );

      setError(
        requestError.message ||
          "No se pudieron guardar los cambios."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // Estado cargando
  // ----------------------------------------------------

  if (cargando) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-3 bg-slate-50">
        <Loader2 className="h-9 w-9 animate-spin text-[#2E7D32]" />

        <p className="font-medium text-slate-500">
          Cargando información del animal...
        </p>
      </main>
    );
  }

  // ----------------------------------------------------
  // Error inicial
  // ----------------------------------------------------

  if (
    error &&
    !form.nombre
  ) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-5">
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl">
          <CircleAlert className="mx-auto h-12 w-12 text-red-500" />

          <h1 className="mt-4 text-2xl font-black text-slate-900">
            No se pudo cargar el animal
          </h1>

          <p className="mt-3 text-slate-600">
            {error}
          </p>

          <Link
            to="/admin/animales"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E7D32] px-5 py-3 font-bold text-white transition hover:bg-green-700"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver al panel
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-orange-50 to-slate-200 px-5 py-8">
      <div className="mx-auto w-full max-w-3xl">
        {/* Volver */}
        <Link
          to="/admin/animales"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#FF7A47]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a mis animales
        </Link>

        <section className="overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl">
          {/* Encabezado */}
          <header className="border-b border-slate-100 px-6 py-7 sm:px-9">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100">
                <PawPrint className="h-7 w-7 text-[#2E7D32]" />
              </div>

              <div>
                <p className="text-sm font-bold text-[#FF7A47]">
                  Edición de animal
                </p>

                <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                  Editar {form.nombre}
                </h1>

                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                  Modificá la información, el estado
                  de publicación o la imagen del
                  animal.
                </p>
              </div>
            </div>
          </header>

          <form
            onSubmit={handleSubmit}
            className="space-y-7 px-6 py-8 sm:px-9"
          >
            {/* Mensajes */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
              >
                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                {error}
              </div>
            )}

            {mensaje && (
              <div
                role="status"
                className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                {mensaje}
              </div>
            )}

            {/* Información principal */}
            <section>
              <div className="mb-5">
                <h2 className="font-bold text-slate-900">
                  Información principal
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Actualizá los datos generales del animal.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Nombre */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="nombre"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Nombre *
                  </label>

                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    maxLength={80}
                    autoFocus
                    disabled={isLoading}
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Nombre del animal"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#FF7A47] focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label
                    htmlFor="tipo"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Tipo *
                  </label>

                  <select
                    id="tipo"
                    name="tipo"
                    required
                    disabled={isLoading}
                    value={form.tipo}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#FF7A47] focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="perro">
                      Perro
                    </option>

                    <option value="gato">
                      Gato
                    </option>
                  </select>
                </div>

                {/* Estado */}
                <div>
                  <label
                    htmlFor="estado"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Estado *
                  </label>

                  <select
                    id="estado"
                    name="estado"
                    required
                    disabled={isLoading}
                    value={form.estado}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#FF7A47] focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="disponible">
                      Disponible
                    </option>

                    <option value="urgencia_medica">
                      Urgencia médica
                    </option>

                    <option value="adoptado">
                      Adoptado
                    </option>
                  </select>
                </div>

                {/* Historia */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="historia"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Historia
                  </label>

                  <textarea
                    id="historia"
                    name="historia"
                    rows={6}
                    maxLength={2000}
                    disabled={isLoading}
                    value={form.historia}
                    onChange={handleChange}
                    placeholder="Contá su historia, personalidad o situación actual..."
                    className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#FF7A47] focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <p className="mt-1 text-right text-xs text-slate-400">
                    {form.historia.length}/2000
                  </p>
                </div>
              </div>
            </section>

            <div className="border-t border-slate-100" />

            {/* Imagen */}
            <section>
              <div className="mb-5">
                <h2 className="font-bold text-slate-900">
                  Imagen del animal
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Podés mantener, reemplazar o eliminar la imagen actual.
                </p>
              </div>

              {!previewImagen ? (
                <label
                  htmlFor="imagen"
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition ${
                    isLoading
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer hover:border-[#FF7A47] hover:bg-orange-50"
                  }`}
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                    <ImagePlus className="h-6 w-6 text-[#FF7A47]" />
                  </div>

                  <span className="text-sm font-bold text-slate-700">
                    Seleccionar nueva imagen
                  </span>

                  <span className="mt-1 text-xs text-slate-500">
                    JPG, PNG o WEBP. Máximo 5 MB.
                  </span>

                  <input
                    ref={inputImagenRef}
                    id="imagen"
                    name="imagen"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={isLoading}
                    onChange={handleImagen}
                    className="sr-only"
                  />
                </label>
              ) : (
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <img
                    src={previewImagen}
                    alt={`Imagen de ${form.nombre}`}
                    className="h-80 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={quitarImagen}
                    disabled={isLoading}
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-lg transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Quitar imagen"
                    title="Quitar imagen"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 bg-black/55 px-4 py-3 text-sm text-white">
                    {form.imagen
                      ? form.imagen.name
                      : "Imagen actual"}
                  </div>
                </div>
              )}
            </section>

            {/* Publicación */}
            <section>
              <label
                className={`flex items-start gap-3 rounded-xl border p-4 transition ${
                  form.estado === "adoptado"
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 opacity-70"
                    : "cursor-pointer border-slate-200 bg-slate-50 hover:border-orange-200 hover:bg-orange-50"
                }`}
              >
                <input
                  name="publicado"
                  type="checkbox"
                  checked={
                    form.estado === "adoptado"
                      ? false
                      : form.publicado
                  }
                  onChange={handleChange}
                  disabled={
                    isLoading ||
                    form.estado === "adoptado"
                  }
                  className="mt-1 h-4 w-4 accent-[#FF7A47]"
                />

                <span>
                  <span className="block text-sm font-bold text-slate-800">
                    Publicar animal
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {form.estado === "adoptado"
                      ? "Los animales adoptados no se mostrarán en la página pública."
                      : "El animal aparecerá en la página pública de adopciones."}
                  </span>
                </span>
              </label>
            </section>

            {/* Acciones */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                to="/admin/animales"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={
                  isLoading ||
                  Boolean(mensaje)
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E7D32] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}