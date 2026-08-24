import {
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  Bone,
  Building2,
  CheckCircle2,
  Heart,
  MapPin,
  PawPrint,
  Search,
  ShieldAlert,
  Stethoscope,
  Truck,
} from "lucide-react";

// -----------------------------------------------------------------------------
// DATOS TEMPORALES
// Más adelante pueden venir desde el backend.
// -----------------------------------------------------------------------------

const NECESIDADES_DEMO = [
  {
    id: 1,
    titulo: "Tratamiento veterinario",
    descripcion:
      "Necesitamos cubrir estudios, medicación y controles veterinarios para continuar con su recuperación.",
    animalNombre: "Luna",
    tipo: "veterinaria",
    urgencia: "alta",
    organizacion: "Patitas Felices",
    localidad: "Glew",
    montoObjetivo: 120000,
    montoRecaudado: 68000,
    imagen:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    titulo: "Alimento para animales rescatados",
    descripcion:
      "Buscamos reunir alimento balanceado para cubrir las necesidades del refugio durante el próximo mes.",
    animalNombre: null,
    tipo: "alimento",
    urgencia: "media",
    organizacion: "Huellitas del Sur",
    localidad: "Quilmes",
    montoObjetivo: 90000,
    montoRecaudado: 35000,
    imagen:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    titulo: "Traslado y medicación",
    descripcion:
      "Se necesita ayuda para trasladar animales a centros veterinarios y comprar medicamentos esenciales.",
    animalNombre: "Milo",
    tipo: "traslado",
    urgencia: "media",
    organizacion: "Red de Rescate Animal",
    localidad: "Lomas de Zamora",
    montoObjetivo: 65000,
    montoRecaudado: 65000,
    imagen:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80",
  },
];

const FILTROS = [
  {
    value: "todas",
    label: "Todas",
  },
  {
    value: "veterinaria",
    label: "Veterinaria",
  },
  {
    value: "alimento",
    label: "Alimento",
  },
  {
    value: "traslado",
    label: "Traslados",
  },
];

// -----------------------------------------------------------------------------
// AYUDANTES
// -----------------------------------------------------------------------------

const formatearMonto = (monto) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(monto || 0);

const getTipoConfig = (tipo) => {
  switch (tipo) {
    case "veterinaria":
      return {
        label: "Atención veterinaria",
        Icono: Stethoscope,
        className:
          "bg-red-100 text-red-700",
      };

    case "alimento":
      return {
        label: "Alimentación",
        Icono: Bone,
        className:
          "bg-orange-100 text-orange-700",
      };

    case "traslado":
      return {
        label: "Traslado",
        Icono: Truck,
        className:
          "bg-blue-100 text-blue-700",
      };

    default:
      return {
        label: "Otra necesidad",
        Icono: PawPrint,
        className:
          "bg-gray-100 text-gray-700",
      };
  }
};

const getUrgenciaConfig = (urgencia) => {
  switch (urgencia) {
    case "alta":
      return {
        label: "Urgencia alta",
        className:
          "border-red-200 bg-red-50 text-red-700",
      };

    case "media":
      return {
        label: "Urgencia media",
        className:
          "border-orange-200 bg-orange-50 text-orange-700",
      };

    default:
      return {
        label: "Necesidad activa",
        className:
          "border-gray-200 bg-gray-50 text-gray-700",
      };
  }
};

// -----------------------------------------------------------------------------
// TARJETA DE NECESIDAD
// -----------------------------------------------------------------------------

const NecesidadCard = ({ necesidad }) => {
  const tipoConfig =
    getTipoConfig(necesidad.tipo);

  const urgenciaConfig =
    getUrgenciaConfig(necesidad.urgencia);

  const TipoIcono =
    tipoConfig.Icono;

  const porcentaje =
    necesidad.montoObjetivo > 0
      ? Math.min(
          Math.round(
            (necesidad.montoRecaudado /
              necesidad.montoObjetivo) *
              100
          ),
          100
        )
      : 0;

  const completada =
    porcentaje >= 100;

  const montoRestante = Math.max(
    necesidad.montoObjetivo -
      necesidad.montoRecaudado,
    0
  );

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Imagen */}
      <div className="relative h-56 overflow-hidden bg-slate-100">
        {necesidad.imagen ? (
          <img
            src={necesidad.imagen}
            alt={necesidad.titulo}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <PawPrint className="h-14 w-14 text-slate-300" />
          </div>
        )}

        <span
          className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${tipoConfig.className}`}
        >
          <TipoIcono className="h-4 w-4" />
          {tipoConfig.label}
        </span>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            {necesidad.animalNombre && (
              <p className="mb-1 text-sm font-bold text-[#FF7A47]">
                Para {necesidad.animalNombre}
              </p>
            )}

            <h2 className="text-2xl font-black text-slate-900">
              {necesidad.titulo}
            </h2>
          </div>

          <span
            className={`rounded-full border px-3 py-1 text-xs font-bold ${urgenciaConfig.className}`}
          >
            {completada
              ? "Objetivo alcanzado"
              : urgenciaConfig.label}
          </span>
        </div>

        <p className="mb-5 flex-1 leading-6 text-slate-600">
          {necesidad.descripcion}
        </p>

        {/* Organización */}
        <div className="mb-5 space-y-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#2E7D32]" />

            <span className="font-semibold">
              {necesidad.organizacion}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            {necesidad.localidad}
          </div>
        </div>

        {/* Progreso */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-bold text-slate-700">
              {formatearMonto(
                necesidad.montoRecaudado
              )}{" "}
              recaudados
            </span>

            <span className="font-bold text-[#2E7D32]">
              {porcentaje}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                completada
                  ? "bg-green-600"
                  : "bg-[#FF7A47]"
              }`}
              style={{
                width: `${porcentaje}%`,
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Objetivo:{" "}
              {formatearMonto(
                necesidad.montoObjetivo
              )}
            </span>

            {!completada && (
              <span>
                Faltan:{" "}
                {formatearMonto(
                  montoRestante
                )}
              </span>
            )}
          </div>
        </div>

        {/* Acción */}
        {completada ? (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-green-50 px-5 py-3 font-bold text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            Objetivo alcanzado
          </div>
        ) : (
          <Link
            to="/donar"
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#FF7A47] px-5 py-3 font-bold text-white transition hover:bg-orange-600"
          >
            <Heart className="h-5 w-5 fill-white" />
            Colaborar
          </Link>
        )}
      </div>
    </article>
  );
};

// -----------------------------------------------------------------------------
// PÁGINA NECESIDADES
// -----------------------------------------------------------------------------

export default function Necesidades() {
  const [filtro, setFiltro] =
    useState("todas");

  const [busqueda, setBusqueda] =
    useState("");

  const necesidadesFiltradas =
    useMemo(() => {
      const termino = busqueda
        .trim()
        .toLowerCase();

      return NECESIDADES_DEMO.filter(
        (necesidad) => {
          const coincideFiltro =
            filtro === "todas" ||
            necesidad.tipo === filtro;

          const coincideBusqueda =
            !termino ||
            necesidad.titulo
              .toLowerCase()
              .includes(termino) ||
            necesidad.descripcion
              .toLowerCase()
              .includes(termino) ||
            necesidad.organizacion
              .toLowerCase()
              .includes(termino) ||
            necesidad.animalNombre
              ?.toLowerCase()
              .includes(termino);

          return (
            coincideFiltro &&
            coincideBusqueda
          );
        }
      );
    }, [filtro, busqueda]);

  const necesidadesActivas =
    NECESIDADES_DEMO.filter(
      (necesidad) =>
        necesidad.montoRecaudado <
        necesidad.montoObjetivo
    ).length;

  const totalRecaudado =
    NECESIDADES_DEMO.reduce(
      (total, necesidad) =>
        total +
        necesidad.montoRecaudado,
      0
    );

  const organizaciones =
    new Set(
      NECESIDADES_DEMO.map(
        (necesidad) =>
          necesidad.organizacion
      )
    ).size;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Encabezado */}
      <section className="bg-gradient-to-br from-red-50 via-white to-orange-50 px-5 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 font-bold text-red-600 shadow-sm">
            <ShieldAlert className="h-5 w-5" />
            Necesidades activas
          </div>

          <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
            Ayudá donde más se necesita
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Conocé las necesidades publicadas por
            refugios y organizaciones. Cada aporte
            ayuda a cubrir tratamientos, alimento,
            traslados y cuidados esenciales.
          </p>
        </div>
      </section>

      {/* Resumen */}
      <section className="relative z-10 -mt-8 px-5">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg">
            <p className="text-3xl font-black text-[#FF7A47]">
              {necesidadesActivas}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              Necesidades activas
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg">
            <p className="text-3xl font-black text-[#2E7D32]">
              {formatearMonto(
                totalRecaudado
              )}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              Total recaudado
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg">
            <p className="text-3xl font-black text-blue-600">
              {organizaciones}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              Organizaciones participantes
            </p>
          </article>
        </div>
      </section>

      {/* Listado */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          {/* Filtros */}
          <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {FILTROS.map((opcion) => (
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
                        ? "bg-[#2E7D32] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {opcion.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="search"
                  value={busqueda}
                  onChange={(event) =>
                    setBusqueda(
                      event.target.value
                    )
                  }
                  placeholder="Buscar necesidad u organización"
                  className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-[#FF7A47] focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          </div>

          {necesidadesFiltradas.length ===
          0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <PawPrint className="mx-auto mb-4 h-14 w-14 text-slate-300" />

              <h2 className="text-xl font-bold text-slate-800">
                No encontramos necesidades
              </h2>

              <p className="mt-2 text-slate-500">
                Probá cambiando los filtros o
                realizando otra búsqueda.
              </p>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {necesidadesFiltradas.map(
                (necesidad) => (
                  <NecesidadCard
                    key={necesidad.id}
                    necesidad={necesidad}
                  />
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Cierre */}
      <section className="bg-[#2E7D32] px-5 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <Heart className="mx-auto h-12 w-12 fill-orange-300 text-orange-300" />

          <h2 className="mt-5 text-3xl font-black">
            Cada colaboración suma
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-green-50">
            Podés realizar una donación general o
            colaborar con las necesidades
            publicadas por las organizaciones.
          </p>

          <Link
            to="/donar"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF7A47] px-7 py-3.5 font-bold text-white transition hover:bg-orange-600"
          >
            <Heart className="h-5 w-5 fill-white" />
            Realizar una donación
          </Link>
        </div>
      </section>
    </main>
  );
}