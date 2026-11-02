import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  CheckCircle2,
  Dog,
  Cat,
  Loader2,
  Pencil,
  Plus,
  PawPrint,
  RefreshCw,
  Trash2,
  ClipboardList,
  X,
} from "lucide-react";

import {
  obtenerMisAnimales,
  eliminarAnimal,
  marcarAnimalComoAdoptado,
} from "../service/animalesServide";

// ----------------------------------------------------
// Estados
// ----------------------------------------------------

const estadoMap = {
  disponible: "Disponible",
  urgencia_medica: "Urgencia médica",
  adoptado: "Adoptado",
};

const getStatusColor = (estado) => {
  switch (estado) {
    case "disponible":
      return "border-green-300 bg-green-100 text-green-800";

    case "urgencia_medica":
      return "border-red-300 bg-red-100 text-red-800";

    case "adoptado":
      return "border-gray-300 bg-gray-200 text-gray-700";

    default:
      return "border-gray-300 bg-gray-100 text-gray-700";
  }
};

// ----------------------------------------------------
// Imagen
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
// COMPONENTE
// ====================================================

export default function PanelAnimales() {
  const navigate = useNavigate();

  const [animales, setAnimales] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    procesandoAnimalId,
    setProcesandoAnimalId,
  ] = useState(null);

  const [
    animalParaAdoptar,
    setAnimalParaAdoptar,
  ] = useState(null);

  // --------------------------------------------------
  // Cargar animales de la organización
  // --------------------------------------------------

  const cargarAnimales = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const respuesta =
          await obtenerMisAnimales({
            page: 1,
            pageSize: 100,
          });

        const lista =
          Array.isArray(respuesta)
            ? respuesta
            : Array.isArray(
                  respuesta?.items
                )
              ? respuesta.items
              : [];

        setAnimales(lista);
      } catch (requestError) {
        console.error(
          "Error cargando animales de la organización:",
          requestError
        );

        setError(
          requestError.message ||
            "No se pudieron cargar los animales de la organización."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    cargarAnimales();
  }, [cargarAnimales]);

  // --------------------------------------------------
  // Editar
  // --------------------------------------------------

  const handleEditar = (animal) => {
    navigate(
      `/admin/animales/${animal.id}/editar`
    );
  };

  // --------------------------------------------------
  // Marcar como adoptado
  // --------------------------------------------------

  const abrirModalAdopcion = (animal) => {
    setAnimalParaAdoptar(animal);
  };

  const cerrarModalAdopcion = () => {
    if (procesandoAnimalId) {
      return;
    }

    setAnimalParaAdoptar(null);
  };

  const confirmarAdopcion = async () => {
    if (!animalParaAdoptar) {
      return;
    }

    try {
      setProcesandoAnimalId(
        animalParaAdoptar.id
      );

      setError("");

      await marcarAnimalComoAdoptado(
        animalParaAdoptar.id
      );

      setAnimalParaAdoptar(null);

      await cargarAnimales();
    } catch (requestError) {
      console.error(
        "Error marcando animal como adoptado:",
        requestError
      );

      setError(
        requestError.message ||
          "No se pudo actualizar el estado del animal."
      );
    } finally {
      setProcesandoAnimalId(null);
    }
  };

  // --------------------------------------------------
  // Eliminar
  // --------------------------------------------------

  const handleEliminar =
    async (animal) => {
      const confirmar =
        window.confirm(
          `¿Querés eliminar a ${animal.nombre}? Esta acción no se puede deshacer.`
        );

      if (!confirmar) {
        return;
      }

      try {
        setProcesandoAnimalId(
          animal.id
        );

        setError("");

        await eliminarAnimal(
          animal.id
        );

        setAnimales(
          (listaActual) =>
            listaActual.filter(
              (item) =>
                item.id !==
                animal.id
            )
        );
      } catch (requestError) {
        console.error(
          "Error eliminando animal:",
          requestError
        );

        setError(
          requestError.message ||
            "No se pudo eliminar el animal."
        );
      } finally {
        setProcesandoAnimalId(
          null
        );
      }
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
              Mis animales
            </h1>

            <p className="mt-2 text-gray-500">
              Creá y administrá los animales
              registrados por tu organización.
            </p>
          </div>

          {/* Acciones superiores */}
          <div className="flex flex-col gap-3 sm:flex-row">

            {/* Actualizar */}
            <button
              type="button"
              onClick={cargarAnimales}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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

            {/* Solicitudes */}
            <Link
              to="/admin/solicitudes"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2E7D32] bg-white px-5 py-3 font-bold text-[#2E7D32] transition hover:bg-green-50"
            >
              <ClipboardList className="h-5 w-5" />

              Solicitudes de adopción
            </Link>

            {/* Agregar animal */}
            <Link
              to="/admin/animales/nuevo"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF7A47] px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              <Plus className="h-5 w-5" />

              Agregar animal
            </Link>

          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
          >
            {error}
          </div>
        )}

        {/* Cargando */}
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-2xl bg-white">

            <Loader2 className="h-8 w-8 animate-spin text-[#2E7D32]" />

            <p className="text-gray-500">
              Cargando animales...
            </p>

          </div>
        ) : animales.length === 0 ? (

          /* Sin animales */
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

            <PawPrint className="mx-auto mb-4 h-14 w-14 text-gray-300" />

            <h2 className="text-xl font-bold text-gray-800">
              Todavía no cargaste animales
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-gray-500">
              Creá el primer animal de tu
              organización para que aparezca en la
              página pública de adopciones.
            </p>

            <Link
              to="/admin/animales/nuevo"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF7A47] px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              <Plus className="h-5 w-5" />

              Crear primer animal
            </Link>

          </div>

        ) : (

          /* Listado */
          <ul className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {animales.map(
              (animal) => {
                const src =
                  getAnimalImage(
                    animal
                  );

                const IconForType =
                  animal.tipo ===
                  "gato"
                    ? Cat
                    : Dog;

                const procesando =
                  procesandoAnimalId ===
                  animal.id;

                return (
                  <li
                    key={animal.id}
                    className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                  >

                    {/* Imagen */}
                    <div className="flex h-52 shrink-0 items-center justify-center overflow-hidden bg-gray-100">

                      {src ? (
                        <img
                          src={src}
                          alt={animal.nombre}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <PawPrint className="h-12 w-12 text-gray-300" />
                      )}

                    </div>

                    {/* Contenido */}
                    <div className="flex flex-1 flex-col p-5">

                      {/* Encabezado de card */}
                      <div className="mb-4 flex min-h-[92px] items-start justify-between gap-3">

                        {/* Nombre + tipo */}
                        <div className="min-w-0 flex-1">

                          <h2
                            className="line-clamp-2 min-h-[58px] text-2xl font-black leading-[1.2] text-gray-900"
                            title={animal.nombre}
                          >
                            {animal.nombre}
                          </h2>

                          <div className="mt-2 flex items-center gap-2 text-sm capitalize text-gray-500">

                            <IconForType className="h-4 w-4 shrink-0 text-[#2E7D32]" />

                            <span className="truncate">
                              {animal.tipo ||
                                "Sin especificar"}
                            </span>

                          </div>

                        </div>

                        {/* Estado */}
                        <span
                          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${getStatusColor(
                            animal.estado
                          )}`}
                        >
                          {estadoMap[
                            animal.estado
                          ] ||
                            animal.estado ||
                            "Sin estado"}
                        </span>

                      </div>

                      {/* Historia */}
                      <div className="mb-5 min-h-[72px]">

                        {animal.historia ? (
                          <p className="line-clamp-3 text-sm leading-6 text-gray-500">
                            {animal.historia}
                          </p>
                        ) : (
                          <p className="text-sm italic text-gray-400">
                            Sin historia cargada.
                          </p>
                        )}

                      </div>

                      {/* Acciones administrativas */}
                      <div className="mt-auto grid gap-2">

                        {/* Editar */}
                        <button
                          type="button"
                          onClick={() =>
                            handleEditar(
                              animal
                            )
                          }
                          disabled={
                            procesando
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Pencil className="h-4 w-4" />

                          Editar
                        </button>

                        {/* Marcar adoptado */}
                        {animal.estado !==
                          "adoptado" && (

                          <button
                            type="button"
                            onClick={() =>
                              abrirModalAdopcion(
                                animal
                              )
                            }
                            disabled={
                              procesando
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
                          >

                            {procesando ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}

                            Marcar como adoptado
                          </button>

                        )}

                        {/* Eliminar */}
                        <button
                          type="button"
                          onClick={() =>
                            handleEliminar(
                              animal
                            )
                          }
                          disabled={
                            procesando
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >

                          {procesando ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}

                          Eliminar
                        </button>

                      </div>

                    </div>

                  </li>
                );
              }
            )}

          </ul>
        )}

      </section>


      {/* Modal confirmar adopción */}
      {animalParaAdoptar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-modal-adopcion"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              cerrarModalAdopcion();
            }
          }}
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-700" />
              </div>

              <button
                type="button"
                onClick={cerrarModalAdopcion}
                disabled={
                  procesandoAnimalId ===
                  animalParaAdoptar.id
                }
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5">
              <h2
                id="titulo-modal-adopcion"
                className="text-2xl font-black text-gray-900"
              >
                ¿Marcar como adoptado?
              </h2>

              <p className="mt-3 leading-6 text-gray-600">
                ¿Confirmás que{" "}
                <span className="font-bold text-gray-900">
                  {animalParaAdoptar.nombre}
                </span>{" "}
                fue adoptado?
              </p>

              <p className="mt-2 text-sm leading-5 text-gray-500">
                Al continuar, dejará de aparecer en el
                listado público de adopciones.
              </p>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={cerrarModalAdopcion}
                disabled={
                  procesandoAnimalId ===
                  animalParaAdoptar.id
                }
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarAdopcion}
                disabled={
                  procesandoAnimalId ===
                  animalParaAdoptar.id
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {procesandoAnimalId ===
                animalParaAdoptar.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Sí, marcar como adoptado
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
