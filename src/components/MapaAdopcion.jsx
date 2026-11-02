import {API_URL} from '../lib/adoption';
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import {
  Cat,
  Dog,
  ExternalLink,
  MapPin,
  Search,
  X,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// -----------------------------------------------------------------------------
// CONFIGURACIÓN DE LOS MARCADORES
// -----------------------------------------------------------------------------

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// -----------------------------------------------------------------------------
// DATOS TEMPORALES
// Estos refugios son de ejemplo. Más adelante pueden venir desde el backend.
// -----------------------------------------------------------------------------



// -----------------------------------------------------------------------------
// AJUSTA EL MAPA SEGÚN LOS RESULTADOS
// -----------------------------------------------------------------------------

function AjustarMapa({ refugiosVisibles }) {
  const map = useMap();

  useEffect(() => {
    if (!refugiosVisibles.length) {
      return;
    }

    if (refugiosVisibles.length === 1) {
      const refugio = refugiosVisibles[0];

      map.flyTo([refugio.latitud, refugio.longitud], 14, {
        duration: 0.8,
      });

      return;
    }

    const limites = L.latLngBounds(
      refugiosVisibles.map((refugio) => [
        refugio.latitud,
        refugio.longitud,
      ])
    );

    map.fitBounds(limites, {
      padding: [50, 50],
      maxZoom: 13,
    });
  }, [map, refugiosVisibles]);

  return null;
}

// -----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// -----------------------------------------------------------------------------

export default function MapaAdopcion() {
  const navigate = useNavigate();
  const [refugios,setRefugios]=useState([]);
  const [mapError,setMapError]=useState('');
  useEffect(()=>{let active=true;fetch(API_URL+'/api/organizaciones').then(r=>{if(!r.ok)throw Error('No se pudieron cargar las organizaciones.');return r.json();}).then(data=>{if(active)setRefugios(data.filter(org=>Number.isFinite(org.latitud)&&Number.isFinite(org.longitud)));}).catch(e=>{if(active)setMapError(e.message);});return()=>{active=false;};},[]);

  const [busqueda, setBusqueda] = useState("");
  const [refugioSeleccionado, setRefugioSeleccionado] = useState(null);

  const refugiosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    if (!texto) {
      return refugios;
    }

    return refugios.filter((refugio) => {
      return (
        refugio.nombre.toLowerCase().includes(texto) ||
        refugio.zona.toLowerCase().includes(texto) ||
        refugio.direccion.toLowerCase().includes(texto)
      );
    });
  }, [busqueda,refugios]);

  useEffect(() => {
    if (
      refugioSeleccionado &&
      !refugiosFiltrados.some(
        (refugio) => refugio.id === refugioSeleccionado.id
      )
    ) {
      setRefugioSeleccionado(null);
    }
  }, [refugiosFiltrados, refugioSeleccionado]);

  const limpiarBusqueda = () => {
    setBusqueda("");
    setRefugioSeleccionado(null);
  };

  const abrirIndicaciones = (refugio) => {
    const destino = `${refugio.latitud},${refugio.longitud}`;

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destino}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const verAnimales = (refugio) => {
    navigate(`/adoptar?organizacion=${refugio.id}`);
  };

  return (
    <section className="w-full">
      {mapError&&<p role="alert" className="mb-4 text-red-700">{mapError}</p>}
      {!refugios.length&&!mapError&&<p className="mb-4 text-sm text-slate-500">Todavía no hay organizaciones con ubicación pública. Los hogares de tránsito mantienen su dirección privada.</p>}
      {/* BUSCADOR */}
      <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label
              htmlFor="buscar-zona"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Buscar por zona o refugio
            </label>

            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                id="buscar-zona"
                type="search"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Ejemplo: Glew, Adrogué o Lomas de Zamora"
                className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-11 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#FF7A47] focus:ring-4 focus:ring-[#FF7A47]/10"
              />

              {busqueda && (
                <button
                  type="button"
                  onClick={limpiarBusqueda}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex min-h-[48px] items-center rounded-xl bg-[#2E7D32]/10 px-4 text-sm font-semibold text-[#2E7D32]">
            <MapPin className="mr-2 h-5 w-5" />

            {refugiosFiltrados.length === 1
              ? "1 lugar encontrado"
              : `${refugiosFiltrados.length} lugares encontrados`}
          </div>
        </div>
      </div>

      {/* MAPA */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
        <MapContainer
          center={[-34.82, -58.39]}
          zoom={11}
          scrollWheelZoom
          className="h-[650px] w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <AjustarMapa refugiosVisibles={refugiosFiltrados} />

          {refugiosFiltrados.map((refugio) => (
            <Marker
              key={refugio.id}
              position={[refugio.latitud, refugio.longitud]}
              eventHandlers={{
                click: () => setRefugioSeleccionado(refugio),
              }}
            >
              <Popup>
                <div className="min-w-[220px]">
                  <p className="text-base font-bold text-gray-900">
                    {refugio.nombre}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {refugio.direccion}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                      <Dog className="h-3.5 w-3.5" />
                      {refugio.perros} perros
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      <Cat className="h-3.5 w-3.5" />
                      {refugio.gatos} gatos
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setRefugioSeleccionado(refugio)}
                    className="mt-4 font-semibold text-[#FF7A47] hover:underline"
                  >
                    Ver información
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* TARJETA FLOTANTE DEL REFUGIO SELECCIONADO */}
        {refugioSeleccionado && (
          <article className="absolute bottom-5 left-5 right-5 z-[500] rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl md:left-6 md:right-auto md:w-[350px]">
            <button
              type="button"
              onClick={() => setRefugioSeleccionado(null)}
              aria-label="Cerrar información"
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="pr-8">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#2E7D32]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#2E7D32]">
                <MapPin className="h-3.5 w-3.5" />
                {refugioSeleccionado.zona}
              </span>

              <h3 className="mt-3 text-xl font-extrabold text-gray-900">
                {refugioSeleccionado.nombre}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {refugioSeleccionado.direccion}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-orange-50 p-3">
                <Dog className="h-5 w-5 text-orange-600" />

                <p className="mt-2 text-lg font-bold text-gray-900">
                  {refugioSeleccionado.perros}
                </p>

                <p className="text-xs text-gray-600">Perros</p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3">
                <Cat className="h-5 w-5 text-blue-600" />

                <p className="mt-2 text-lg font-bold text-gray-900">
                  {refugioSeleccionado.gatos}
                </p>

                <p className="text-xs text-gray-600">Gatos</p>
              </div>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => verAnimales(refugioSeleccionado)}
                className="rounded-xl bg-[#FF7A47] px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                Ver animales
              </button>

              <button
                type="button"
                onClick={() => abrirIndicaciones(refugioSeleccionado)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Cómo llegar
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </article>
        )}

        {/* SIN RESULTADOS */}
        {refugiosFiltrados.length === 0 && (
          <div className="absolute inset-0 z-[500] flex items-center justify-center bg-white/75 p-6 backdrop-blur-sm">
            <div className="max-w-sm rounded-2xl bg-white p-7 text-center shadow-xl">
              <MapPin className="mx-auto h-10 w-10 text-gray-400" />

              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No encontramos refugios
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Probá buscando otra localidad o eliminá el texto ingresado.
              </p>

              <button
                type="button"
                onClick={limpiarBusqueda}
                className="mt-5 rounded-xl bg-[#2E7D32] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
              >
                Ver todos los refugios
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-gray-400">
        Seleccioná un marcador para consultar la información del lugar.
      </p>
    </section>
  );
}