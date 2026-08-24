// src/admin/CrearAnimal.jsx

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Loader2,
  PawPrint,
  Save,
  X,
} from "lucide-react";

import { crearAnimal } from "../service/animalesServide";

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

const TAMANIO_MAXIMO = 5 * 1024 * 1024;

export default function CrearAnimal() {
  const [form, setForm] = useState(FORM_INICIAL);
  const [previewImagen, setPreviewImagen] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputImagenRef = useRef(null);
  const navigate = useNavigate();

  // Liberar la URL temporal de la imagen
  useEffect(() => {
    return () => {
      if (previewImagen) {
        URL.revokeObjectURL(previewImagen);
      }
    };
  }, [previewImagen]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setError("");

    setForm((formActual) => ({
      ...formActual,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImagen = (event) => {
    const archivo = event.target.files?.[0];

    setError("");

    if (!archivo) {
      return;
    }

    if (!FORMATOS_PERMITIDOS.includes(archivo.type)) {
      setError(
        "La imagen debe tener formato JPG, PNG o WEBP."
      );

      event.target.value = "";
      return;
    }

    if (archivo.size > TAMANIO_MAXIMO) {
      setError(
        "La imagen no puede superar los 5 MB."
      );

      event.target.value = "";
      return;
    }

    if (previewImagen) {
      URL.revokeObjectURL(previewImagen);
    }

    const nuevaPreview = URL.createObjectURL(archivo);

    setPreviewImagen(nuevaPreview);

    setForm((formActual) => ({
      ...formActual,
      imagen: archivo,
    }));
  };

  const quitarImagen = () => {
    if (previewImagen) {
      URL.revokeObjectURL(previewImagen);
    }

    setPreviewImagen("");

    setForm((formActual) => ({
      ...formActual,
      imagen: null,
    }));

    if (inputImagenRef.current) {
      inputImagenRef.current.value = "";
    }
  };

  const validarFormulario = () => {
    const nombre = form.nombre.trim();

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMensaje("");

    const errorValidacion = validarFormulario();

    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    try {
      setIsLoading(true);

      await crearAnimal({
        nombre: form.nombre.trim(),
        tipo: form.tipo,
        estado: form.estado,
        historia: form.historia.trim(),
        publicado:
          form.estado === "adoptado"
            ? false
            : form.publicado,
        imagen: form.imagen,
      });

      setMensaje(
        "El animal fue creado correctamente."
      );

      setForm(FORM_INICIAL);
      quitarImagen();

      window.setTimeout(() => {
        navigate("/admin/animales", {
          replace: true,
        });
      }, 1200);
    } catch (requestError) {
      console.error(
        "Error al crear el animal:",
        requestError
      );

      setError(
        requestError.message ||
          "No se pudo crear el animal."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100">
                <PawPrint className="h-7 w-7 text-[#FF7A47]" />
              </div>

              <div>
                <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
                  Agregar animal
                </h1>

                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                  Cargá los datos del animal. Quedará
                  asociado automáticamente a tu
                  organización.
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
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
              >
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
                  Los campos marcados como obligatorios deben
                  completarse.
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
                    placeholder="Ejemplo: Firulais"
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
                    placeholder="Contá brevemente su historia, personalidad o situación actual..."
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
                  Podés cargar una imagen JPG, PNG o WEBP.
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
                    Seleccionar imagen
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
                    alt="Vista previa del animal"
                    className="h-80 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={quitarImagen}
                    disabled={isLoading}
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-lg transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Quitar imagen"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 bg-black/55 px-4 py-3 text-sm text-white">
                    {form.imagen?.name}
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
                  isLoading || Boolean(mensaje)
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF7A47] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Crear animal
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