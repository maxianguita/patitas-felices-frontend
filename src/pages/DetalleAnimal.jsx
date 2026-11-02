import {AdopcionModal} from './Animales';
import {crearSolicitudAdopcion} from '../service/solicitudesService';
import FavoriteButton from '../components/FavoriteButton';
import AnimalExtras from '../components/AnimalExtras';
// src/pages/DetalleAnimal.jsx

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Cat,
  CheckCircle2,
  CircleAlert,
  Dog,
  Heart,
  Loader2,
  MapPin,
  PawPrint,
  ShieldCheck,
  Syringe,
} from "lucide-react";

import {
  obtenerAnimalPublicoPorId,
} from "../service/animalesServide";

const estadoMap = {
  disponible: "Disponible para adoptar",
  urgencia_medica: "Urgencia médica",
  adoptado: "Adoptado",
};

const getStatusClasses = (estado) => {
  switch (estado) {
    case "disponible":
      return "border-green-200 bg-green-50 text-green-700";

    case "urgencia_medica":
      return "border-red-200 bg-red-50 text-red-700";

    case "adoptado":
      return "border-gray-200 bg-gray-100 text-gray-600";

    default:
      return "border-gray-200 bg-gray-100 text-gray-600";
  }
};

const getAnimalImage = (animal) => {
  const image =
    animal?.imageUrl ||
    animal?.imagen ||
    "";

  if (!image || typeof image !== "string") {
    return "";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("blob:")
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

const formatearTexto = (valor) => {
  if (!valor) {
    return "No especificado";
  }

  return String(valor)
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letra) => letra.toUpperCase()
    );
};

const InformacionSalud = ({
  activo,
  texto,
}) => {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
        activo
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-gray-200 bg-gray-50 text-gray-500"
      }`}
    >
      <CheckCircle2
        className={`h-5 w-5 ${
          activo
            ? "text-green-600"
            : "text-gray-400"
        }`}
      />

      {texto}
    </div>
  );
};

export default function DetalleAnimal() {
  const [adopcionAbierta,setAdopcionAbierta]=useState(false);
  const { id } = useParams();

  const [animal, setAnimal] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let componenteActivo = true;

    const cargarAnimal = async () => {
      try {
        setLoading(true);
        setError("");

        const respuesta =
          await obtenerAnimalPublicoPorId(id);

        const animalRecibido =
          respuesta?.animal ||
          respuesta?.data ||
          respuesta;

        if (!animalRecibido?.id) {
          throw new Error(
            "No se encontró el animal solicitado."
          );
        }

        if (componenteActivo) {
          setAnimal(animalRecibido);
        }
      } catch (requestError) {
        console.error(
          "Error cargando el detalle del animal:",
          requestError
        );

        if (componenteActivo) {
          setError(
            requestError.message ||
              "No se pudo cargar la información del animal."
          );
        }
      } finally {
        if (componenteActivo) {
          setLoading(false);
        }
      }
    };

    cargarAnimal();

    return () => {
      componenteActivo = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-3 bg-gray-50 px-5">
        <Loader2 className="h-10 w-10 animate-spin text-[#2E7D32]" />

        <p className="font-medium text-gray-500">
          Cargando información...
        </p>
      </main>
    );
  }

  if (error || !animal) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-5 py-12">
        <section className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-lg">
          <CircleAlert className="mx-auto h-12 w-12 text-red-500" />

         <h1 className="mt-4 text-center text-2xl font-black leading-tight text-gray-900">
  No pudimos cargar el animal
</h1>

          <p className="mt-3 leading-6 text-gray-500">
            {error}
          </p>

          <Link
            to="/adoptar"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E7D32] px-5 py-3 font-bold text-white transition hover:bg-green-700"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver a adopciones
          </Link>
        </section>
      </main>
    );
  }

  const imagenAnimal =
    getAnimalImage(animal);

  const TipoIcon =
    animal.tipo === "gato"
      ? Cat
      : Dog;

  const puedeAdoptarse =
    animal.estado === "disponible" && !animal.adoptado;

  const organizacion =
    animal.organizacion;

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Volver */}
        <Link
          to="/adoptar"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition hover:text-[#2E7D32]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a adopciones
        </Link>

        <div className="my-6 flex flex-wrap items-center gap-4"><FavoriteButton id={animal.id}/>{organizacion?.id&&<Link to={`/organizaciones/${organizacion.id}`} className="text-sm font-semibold text-green-700 underline">{organizacion.nombre}{organizacion.verificada?' · Verificada':''}</Link>}</div>
        {adopcionAbierta&&<AdopcionModal animal={animal} onClose={()=>setAdopcionAbierta(false)} onSubmit={crearSolicitudAdopcion}/>}
        {/* Información principal */}
        <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
          <div className="grid lg:grid-cols-2">
            {/* Imagen */}
            <div className="flex min-h-[380px] items-center justify-center bg-gray-100 lg:min-h-[600px]">
              {imagenAnimal ? (
                <img
                  src={imagenAnimal}
                  alt={`Foto de ${animal.nombre}`}
                  className="h-full min-h-[380px] w-full object-cover lg:min-h-[600px]"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-gray-300">
                  <PawPrint className="h-20 w-20" />

                  <span className="font-semibold">
                    Sin imagen disponible
                  </span>
                </div>
              )}
            </div>

            {/* Detalle */}
            <div className="flex flex-col p-6 sm:p-9 lg:p-12">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-wide ${getStatusClasses(
                    animal.estado
                  )}`}
                >
                  {estadoMap[animal.estado] ||
                    formatearTexto(
                      animal.estado
                    )}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-bold capitalize text-[#FF7A47]">
                  <TipoIcon className="h-4 w-4" />

                  {animal.tipo ||
                    "Animal"}
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-black text-gray-900 sm:text-5xl">
                {animal.nombre}
              </h1>

              {animal.localidad && (
                <div className="mt-4 flex items-center gap-2 text-gray-500">
                  <MapPin className="h-5 w-5 text-[#2E7D32]" />

                  <span className="font-medium">
                    {animal.localidad}
                  </span>
                </div>
              )}

              {/* Datos generales */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Sexo
                  </p>

                  <p className="mt-1 font-black text-gray-800">
                    {formatearTexto(
                      animal.sexo
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Edad
                  </p>

                  <p className="mt-1 font-black text-gray-800">
                    {animal.edad ||
                      "No especificada"}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Tamaño
                  </p>

                  <p className="mt-1 font-black text-gray-800">
                    {formatearTexto(
                      animal.tamanio
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Raza
                  </p>

                  <p className="mt-1 font-black text-gray-800">
                    {animal.raza ||
                      "Mestizo"}
                  </p>
                </div>
              </div>

              {/* Historia */}
              <div className="mt-8">
                <h2 className="text-xl font-black text-gray-900">
                  Su historia
                </h2>

                <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
                  {animal.historia ||
                    "Todavía no se agregó una historia para este animal."}
                </p>
              </div>

              {/* Acción */}
              <div className="mt-auto pt-9">
                {puedeAdoptarse ? (
                  <button type="button" onClick={()=>setAdopcionAbierta(true)} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#FF7A47] px-6 py-4 text-lg font-black text-white hover:bg-orange-600"><Heart className="h-6 w-6"/>Quiero adoptar a {animal.nombre}</button>
                ) : (
                  <div className="rounded-2xl border border-gray-200 bg-gray-100 px-6 py-4 text-center font-bold text-gray-500">
                    Este animal no está disponible para adoptar en este momento
                  </div>
                )}

                <p className="mt-3 text-center text-xs leading-5 text-gray-400">
                  La adopción está sujeta a una
                  evaluación responsable por parte
                  de la organización.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8"><AnimalExtras animal={animal}/></div>
        {/* Información complementaria */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Salud */}
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                <ShieldCheck className="h-6 w-6 text-[#2E7D32]" />
              </div>

              <div>
                <h2 className="text-xl font-black text-gray-900">
                  Salud y cuidados
                </h2>

                <p className="text-sm text-gray-500">
                  Información proporcionada por la
                  organización.
                </p>
              </div>
            </div>

            {animal.estadoSalud && (
              <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                <h3 className="font-bold text-gray-800">
                  Estado de salud
                </h3>

                <p className="mt-2 whitespace-pre-line leading-6 text-gray-600">
                  {animal.estadoSalud}
                </p>
              </div>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <InformacionSalud
                activo={Boolean(
                  animal.vacunado
                )}
                texto={
                  animal.vacunado
                    ? "Vacunado"
                    : "Vacunación sin confirmar"
                }
              />

              <InformacionSalud
                activo={Boolean(
                  animal.castrado
                )}
                texto={
                  animal.castrado
                    ? "Castrado"
                    : "Castración sin confirmar"
                }
              />

              <InformacionSalud
                activo={Boolean(
                  animal.desparasitado
                )}
                texto={
                  animal.desparasitado
                    ? "Desparasitado"
                    : "Desparasitación sin confirmar"
                }
              />
            </div>

            {animal.personalidad && (
              <div className="mt-7">
                <h3 className="font-black text-gray-900">
                  Personalidad
                </h3>

                <p className="mt-2 whitespace-pre-line leading-7 text-gray-600">
                  {animal.personalidad}
                </p>
              </div>
            )}

            {animal.requisitos && (
              <div className="mt-7">
                <h3 className="font-black text-gray-900">
                  Requisitos de adopción
                </h3>

                <p className="mt-2 whitespace-pre-line leading-7 text-gray-600">
                  {animal.requisitos}
                </p>
              </div>
            )}
          </section>

          {/* Organización */}
          <aside className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
              <PawPrint className="h-7 w-7 text-[#FF7A47]" />
            </div>

            <h2 className="mt-5 text-xl font-black text-gray-900">
              Organización responsable
            </h2>

            <p className="mt-3 text-lg font-bold text-[#2E7D32]">
              {organizacion?.nombre ||
                "Patitas Glew"}
            </p>

            {organizacion?.descripcion && (
              <p className="mt-3 leading-6 text-gray-500">
                {organizacion.descripcion}
              </p>
            )}

            {organizacion?.localidad && (
              <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4 text-[#2E7D32]" />

                {organizacion.localidad}
              </div>
            )}

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-green-50 p-4">
              <Syringe className="mt-0.5 h-5 w-5 shrink-0 text-[#2E7D32]" />

              <p className="text-sm leading-6 text-green-800">
                Consultá siempre con la organización
                el estado de salud actualizado antes
                de iniciar la adopción.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}