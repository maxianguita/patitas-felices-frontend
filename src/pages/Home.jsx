import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import Logo from "../assets/catdog.jpg";

import {
  Cat,
  Dog,
  Handshake,
  Heart,
  Loader2,
  MapPin,
  MessageSquare,
  PawPrint,
  ShieldAlert,
  Users,
  X,
  Stethoscope,
  Bone,
  Truck,
  HeartHandshake,
} from "lucide-react";

import MapaAdopcion from "../components/MapaAdopcion";
import AvisosInicio from "../components/AvisosInicio";

import {
  obtenerAnimalesPublicos,
} from "../service/animalesServide";

// -----------------------------------------------------------------------------
// CONFIGURACIÓN DE WHATSAPP
// -----------------------------------------------------------------------------

const WHATSAPP_NUMBER =
  "5491135636555";

const WHATSAPP_MESSAGE =
  "Hola! Quiero unirme como voluntario/a en Patitas Felices. ¿Podrían darme más información sobre cómo empezar?";

const WHATSAPP_LINK =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

// -----------------------------------------------------------------------------
// OBTENER IMAGEN DEL ANIMAL
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// MODAL DE WHATSAPP
// -----------------------------------------------------------------------------

const WhatsappModal = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-700"
          aria-label="Cerrar modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center">
          <MessageSquare className="mx-auto mb-4 h-12 w-12 rounded-full bg-[#2E7D32]/10 p-2 text-[#2E7D32]" />

          <h3 className="mb-2 text-2xl font-extrabold text-gray-800">
            ¡Gracias por tu interés!
          </h3>

          <p className="mb-6 text-gray-600">
            Para coordinar tu voluntariado,
            envianos un mensaje directo a
            WhatsApp.
          </p>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-[1.03] hover:bg-green-600"
          >
            <MessageSquare className="h-5 w-5" />

            <span>
              Contactar por WhatsApp
            </span>
          </a>

          <p className="mt-4 text-xs text-gray-400">
            Serás redirigido a WhatsApp con un
            mensaje preparado.
          </p>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// ANIMALES DESTACADOS
// -----------------------------------------------------------------------------

const AnimalesDestacados = ({
  animales,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="flex min-h-52 flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#2E7D32]" />

        <p className="text-gray-500">
          Cargando animales...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
        <p className="font-semibold text-red-700">
          {error}
        </p>

        <Link
          to="/adoptar"
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#FF7A47] px-5 py-3 font-bold text-white transition hover:bg-orange-600"
        >
          Ver animales en adopción
        </Link>
      </div>
    );
  }

  if (animales.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-12 text-center">
        <PawPrint className="mx-auto mb-4 h-12 w-12 text-gray-300" />

        <h3 className="text-xl font-bold text-gray-800">
          Todavía no hay animales publicados
        </h3>

        <p className="mt-2 text-gray-500">
          Cuando las organizaciones publiquen
          animales, aparecerán en esta sección.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {animales.map((animal) => {
        const src =
          getAnimalImage(animal);

        const IconForType =
          animal.tipo === "gato"
            ? Cat
            : Dog;

        const ubicacion =
          animal.localidad ||
          animal.organizacion?.localidad ||
          "Ubicación a consultar";

        return (
          <article
            key={animal.id}
            className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gray-100">
              {src ? (
                <img
                  src={src}
                  alt={`Foto de ${animal.nombre}`}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <PawPrint className="h-16 w-16 text-gray-300" />
              )}

              <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-sm font-bold capitalize text-[#2E7D32] shadow">
                <IconForType className="h-4 w-4" />
                {animal.tipo ||
                  "Animal"}
              </span>
            </div>

            <div className="p-6">
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="min-h-[64px] line-clamp-2 text-2xl font-black leading-tight text-gray-900">
  {animal.nombre}
</h3>
                <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  Disponible
                </span>
              </div>

              <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{ubicacion}</span>
              </div>

              {animal.historia ? (
                <p className="mb-6 line-clamp-3 min-h-[72px] leading-6 text-gray-600">
                  {animal.historia}
                </p>
              ) : (
                <p className="mb-6 min-h-[72px] leading-6 text-gray-500">
                  Está buscando una familia que le
                  brinde cuidado, compañía y un
                  hogar definitivo.
                </p>
              )}

              <Link
                to={`/adoptar/${animal.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF7A47] px-6 py-3 font-bold text-white transition duration-300 hover:bg-orange-600"
              >
                <Heart className="h-5 w-5" />
                Conocer a {animal.nombre}
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
};

// -----------------------------------------------------------------------------
// CASOS DE URGENCIA
// -----------------------------------------------------------------------------

const CasosUrgentes = () => {
 const [items,setItems]=useState([]),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 useEffect(()=>{let active=true;obtenerAnimalesPublicos({estado:'urgencia_medica',pageSize:3}).then(data=>{if(active)setItems(data.items||[]);}).catch(()=>{if(active)setError('No pudimos cargar los casos urgentes.');}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[]);
 if(loading)return <p role="status">Cargando casos urgentes...</p>;
 if(error)return <p role="alert">{error}</p>;
 if(!items.length)return <div className="rounded-2xl border p-7 text-center"><p>No hay urgencias médicas publicadas en este momento.</p><Link to="/necesidades" className="mt-3 inline-block text-green-700 underline">Ver otras formas de ayudar</Link></div>;
 return <div className="grid gap-5 md:grid-cols-3">{items.map(animal=><article key={animal.id} className="rounded-2xl border p-6"><h3 className="text-xl font-bold">{animal.nombre}</h3><p className="my-3">{animal.estadoSalud||animal.historia||'Consultá a su organización cómo colaborar.'}</p><Link to={`/adoptar/${animal.id}`} className="text-green-700 underline">Conocer el caso</Link></article>)}</div>;
};

// -----------------------------------------------------------------------------
// HOME
// -----------------------------------------------------------------------------

const Home = () => {
  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [
    animalesDestacados,
    setAnimalesDestacados,
  ] = useState([]);

  const [
    loadingAnimales,
    setLoadingAnimales,
  ] = useState(true);

  const [
    errorAnimales,
    setErrorAnimales,
  ] = useState("");

  const colorPrimary =
    "text-[#2E7D32]";

  const colorSecondary =
    "text-[#FF7A47]";

  // ---------------------------------------------------------------------------
  // CARGAR ANIMALES REALES
  // ---------------------------------------------------------------------------

  useEffect(() => {
    let componenteActivo = true;

    const cargarAnimales = async () => {
      try {
        setLoadingAnimales(true);
        setErrorAnimales("");

        const respuesta =
          await obtenerAnimalesPublicos({
            page: 1,
            pageSize: 20,
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

        const disponibles = lista
          .filter((animal) => {
            const estado = String(
              animal?.estado || ""
            )
              .trim()
              .toLowerCase();

            const estaPublicado =
              animal?.publicado !== false;

            const noFueAdoptado =
              animal?.adoptado !== true;

            return (
              estado === "disponible" &&
              estaPublicado &&
              noFueAdoptado
            );
          })
          .slice(0, 3);

        setAnimalesDestacados(
          disponibles
        );
      } catch (requestError) {
        if (!componenteActivo) {
          return;
        }

        console.error(
          "Error cargando animales destacados:",
          requestError
        );

        setErrorAnimales(
          requestError.message ||
            "No se pudieron cargar los animales destacados."
        );
      } finally {
        if (componenteActivo) {
          setLoadingAnimales(false);
        }
      }
    };

    cargarAnimales();

    return () => {
      componenteActivo = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-white font-sans">
      <section className="border-b border-orange-100 bg-orange-50 px-5 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-slate-900">¿Perdiste o encontraste un perro o un gato?</p><p className="mt-1 text-sm text-slate-600">Publicá una foto y una zona de referencia para que la comunidad pueda ayudar.</p></div><div className="flex flex-wrap gap-3"><Link to="/avisos/nuevo?categoria=perdido" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-green-700 bg-white px-5 py-3 font-bold text-green-800">Perdí a mi mascota</Link><Link to="/avisos/nuevo" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-600 px-5 py-3 font-bold text-white">Encontré un animal</Link></div></div>
      </section>
      {/* HERO */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 sm:px-6 lg:flex-row lg:px-8">
          <div className="text-center lg:w-1/2 lg:text-left">
            <h1
              className={`text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl ${colorPrimary}`}
            >
              Su rescate, tu hogar.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-xl text-gray-600 lg:mx-0 lg:max-w-full">
              En Patitas Felices, cada perro y gato
              rescatado del Conurbano Bonaerense
              espera la segunda oportunidad que vos
              podés darle.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                to="/adoptar"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FF7A47] px-8 py-3 text-lg font-bold text-white shadow-xl transition duration-300 hover:scale-105 hover:bg-orange-600"
              >
                <Heart className="h-5 w-5 fill-white" />
                <span>Adoptar ahora</span>
              </Link>

              <Link
                to="/donar"
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#FF7A47] bg-white px-8 py-3 text-lg font-bold text-[#FF7A47] transition duration-300 hover:scale-105 hover:bg-orange-50"
              >
                <Handshake className="h-5 w-5" />
                <span>Quiero donar</span>
              </Link>
            </div>
          </div>

          <div className="mt-10 w-full lg:mt-0 lg:w-1/2">
            <img
              src={Logo}
              alt="Perro rescatado esperando ser adoptado"
              className="h-auto w-full rotate-1 rounded-3xl object-cover shadow-2xl transition duration-500 hover:rotate-0"
              onError={(event) => {
                event.currentTarget.onerror =
                  null;

                event.currentTarget.src =
                  "https://placehold.co/600x400/4CAF50/ffffff?text=Patitas+Glew+Rescate";
              }}
            />
          </div>
        </div>
      </section>

      <AvisosInicio />

      {/* MISIÓN */}
      <section className="bg-white py-20">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* Presentación */}
    <div className="mx-auto mb-12 max-w-4xl text-center">
      <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-[#2E7D32]">
        <PawPrint className="h-5 w-5" />
        Una red de ayuda para animales
      </span>

      <h2 className="text-4xl font-extrabold text-gray-900">
        Conectamos animales con nuevas oportunidades
      </h2>

      <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-gray-600">
        Patitas Felices es una plataforma que permite difundir animales
        en adopción y conectar personas, rescatistas, refugios y
        organizaciones comprometidas con la adopción responsable.
      </p>
    </div>

    {/* Colaboración */}
    <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-green-50 p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
          <HeartHandshake className="h-8 w-8 text-[#FF7A47]" />
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold text-[#2E7D32]">
            Tu ayuda nos permite seguir creciendo
          </h3>

          <p className="mt-2 max-w-3xl leading-7 text-gray-700">
            Cada colaboración voluntaria contribuye al mantenimiento
            y mejora de la plataforma, permitiéndonos continuar
            difundiendo animales que buscan una familia y ofrecer
            mejores herramientas a quienes trabajan por ellos.
          </p>
        </div>

        <Link
          to="/donar"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FF7A47] px-6 py-3 font-bold text-white shadow-md transition hover:bg-orange-600"
        >
          <HeartHandshake className="h-5 w-5" />
          Conocé cómo colaborar
        </Link>
      </div>
    </div>
  </div>
</section>

      {/* ANIMALES DESTACADOS */}
      <section className="bg-[#FFF8F4] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 font-bold text-[#FF7A47]">
              <PawPrint className="h-5 w-5" />
              Adopciones responsables
            </div>

            <h2 className="text-4xl font-extrabold text-gray-900">
              Conocé a quienes buscan una familia
            </h2>

            <p className="mt-4 text-lg text-gray-600">
              Estos animales están esperando una
              oportunidad para encontrar un hogar
              definitivo.
            </p>
          </div>

          <AnimalesDestacados
            animales={animalesDestacados}
            loading={loadingAnimales}
            error={errorAnimales}
          />

          {animalesDestacados.length >
            0 &&
            !loadingAnimales && (
              <div className="mt-12 text-center">
                <Link
                  to="/adoptar"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#2E7D32] bg-white px-7 py-3 font-bold text-[#2E7D32] transition hover:bg-green-50"
                >
                  <PawPrint className="h-5 w-5" />
                  Ver todos los animales
                </Link>
              </div>
            )}
        </div>
      </section>

      {/* MAPA DE ADOPCIÓN */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <MapPin className="mx-auto mb-4 h-12 w-12 rounded-full bg-[#2E7D32]/10 p-2 text-[#2E7D32]" />

            <h2 className="text-4xl font-extrabold text-[#2E7D32]">
              Encontrá un lugar de adopción cerca
              tuyo
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600">
              Buscá refugios por zona, consultá los
              animales disponibles y obtené
              indicaciones para llegar.
            </p>
          </div>

          <MapaAdopcion />
        </div>
      </section>

      {/* VOLUNTARIADO */}
      <section className="bg-[#2E7D32]/10 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border-b-4 border-[#FF7A47] bg-white p-8 text-center shadow-xl transition duration-300 hover:scale-[1.01]">
            <Users
              className={`mx-auto mb-4 h-12 w-12 ${colorSecondary}`}
            />

            <h3 className="mb-2 text-3xl font-extrabold text-gray-800">
              ¿Querés dar tu tiempo? Sumate como
              voluntario
            </h3>

            <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-600">
              Ayudanos en paseos, eventos, tareas
              administrativas o traslados. Toda
              colaboración es importante.
            </p>

            <button
              type="button"
              onClick={() =>
                setIsModalOpen(true)
              }
              className="inline-flex items-center gap-2 rounded-full bg-[#2E7D32] px-8 py-3 text-lg font-bold text-white shadow-lg transition duration-300 hover:bg-green-700 hover:shadow-2xl"
            >
              <Handshake className="h-5 w-5" />
              <span>
                Contactate con nosotros
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* CASOS DE URGENCIA */}
    <section className="bg-red-50/60 py-20">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* Encabezado */}
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-600">
        <ShieldAlert className="h-5 w-5" />
        Ayuda urgente
      </div>

      <h2 className="text-4xl font-extrabold text-gray-900">
        Animales que necesitan ayuda hoy
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-gray-600">
        Algunas situaciones requieren atención veterinaria,
        medicación o alimento especial. Tu colaboración puede
        ayudarnos a cubrir estos gastos.
      </p>
    </div>

    {/* Casos */}
    <CasosUrgentes />

    {/* Acción principal */}
    <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center">
      <p className="max-w-xl text-sm text-gray-500">
        Cada aporte, sin importar el monto, ayuda a sostener
        tratamientos y cuidados veterinarios.
      </p>

      <Link
        to="/donar"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF7A47] px-7 py-3.5 text-lg font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-xl"
      >
        <Heart className="h-5 w-5 fill-white" />
        Ayudar con una donación
      </Link>
    </div>
  </div>
</section>

      <WhatsappModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
      />
    </main>
  );
};

export default Home;
