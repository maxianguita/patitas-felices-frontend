import { Heart, MapPin, PawPrint } from "lucide-react";

const mascotas = [
  {
    id: 1,
    nombre: "Luna",
    edad: "2 años",
    ubicacion: "Quilmes",
    descripcion: "Es cariñosa, tranquila y se lleva bien con otros perros.",
    imagen:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    nombre: "Simón",
    edad: "1 año",
    ubicacion: "Bernal",
    descripcion: "Es juguetón, curioso y busca una familia responsable.",
    imagen:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    nombre: "Mora",
    edad: "3 años",
    ubicacion: "Ezpeleta",
    descripcion: "Es muy compañera, obediente y disfruta de los paseos.",
    imagen:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Adopciones() {
  return (
    <main className="min-h-screen bg-[#FFF8F4] px-6 py-16">
      <section className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 font-semibold text-[#FF7A47]">
            <PawPrint className="h-5 w-5" />
            Adopciones responsables
          </div>

          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
            Encontrá a tu nuevo compañero
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Conocé a las mascotas que están esperando una familia y un hogar
            lleno de amor.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {mascotas.map((mascota) => (
            <article
              key={mascota.id}
              className="overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={mascota.imagen}
                  alt={mascota.nombre}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />

                <button
                  type="button"
                  aria-label={`Agregar a ${mascota.nombre} a favoritos`}
                  className="absolute right-4 top-4 rounded-full bg-white p-3 text-[#FF7A47] shadow-md transition hover:scale-110"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {mascota.nombre}
                  </h2>

                  <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-[#FF7A47]">
                    {mascota.edad}
                  </span>
                </div>

                <div className="mb-4 flex items-center gap-2 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>{mascota.ubicacion}</span>
                </div>

                <p className="mb-6 text-gray-600">{mascota.descripcion}</p>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF7A47] px-6 py-3 font-bold text-white transition duration-300 hover:bg-orange-600"
                >
                  <Heart className="h-5 w-5" />
                  Quiero adoptarlo
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}