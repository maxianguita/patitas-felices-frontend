import {
  Heart,
  PawPrint,
  HandHeart,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  MonitorSmartphone,
  Wrench,
  Users,
} from "lucide-react";

// ====================================================
// CONFIGURACIÓN
// ====================================================

const MERCADO_PAGO_URL =
  "https://link.mercadopago.com.ar/patitasfelices7";
const QR_DONACION =
  "/mante.png";

// ====================================================
// COMPONENTE
// ====================================================

export default function Donar() {
 const abrirMercadoPago = () => {
  window.open(
    MERCADO_PAGO_URL,
    "_blank",
    "noopener,noreferrer"
  );
};
  return (
    <main className="min-h-screen bg-gray-50">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-orange-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">

        {/* Decoración */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-green-100/50 blur-3xl" />

        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-orange-100/60 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">

          {/* Badge */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-bold text-[#2E7D32] shadow-sm">
            <Heart className="h-4 w-4 fill-current" />

            Sumate a sostener el proyecto
          </div>

          {/* Título */}
          <h1 className="mx-auto max-w-4xl text-4xl font-black leading-tight text-gray-900 sm:text-5xl lg:text-6xl">

            Ayudanos a mantener{" "}

            <span className="text-[#2E7D32]">
              Patitas Felices
            </span>

          </h1>

          {/* Descripción */}
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600 sm:text-xl">

            Tu colaboración nos ayuda a mantener
            la plataforma activa, cubrir costos
            de funcionamiento y seguir mejorando
            un espacio que conecta animales que
            buscan una familia con personas que
            quieren adoptar.

          </p>

          {/* CTA */}
          <div className="mt-8 flex justify-center">

            <a
              href="#colaborar"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF7A47] px-7 py-3.5 text-lg font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-xl"
            >
              <HandHeart className="h-5 w-5" />

              Quiero colaborar
            </a>

          </div>

        </div>

      </section>

      {/* ==================================================
          PARA QUÉ SIRVE EL APORTE
      ================================================== */}

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-6xl">

          <div className="mb-12 text-center">

            <PawPrint className="mx-auto mb-4 h-10 w-10 text-[#2E7D32]" />

            <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
              Tu aporte ayuda a sostener el proyecto
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Cada colaboración nos permite mantener
              Patitas Felices disponible y continuar
              desarrollando una plataforma útil para
              animales, organizaciones y adoptantes.
            </p>

          </div>

          <div className="grid items-stretch gap-5 md:grid-cols-3">

            {/* Mantener plataforma */}
            <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-[#2E7D32]">

                <MonitorSmartphone className="h-7 w-7" />

              </div>

              <h3 className="mt-4 text-xl font-black text-gray-900">
                Mantener la plataforma
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Nos ayuda a cubrir los costos
                necesarios para que Patitas Felices
                continúe funcionando y disponible.
              </p>

            </article>

            {/* Mejoras */}
            <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-[#FF7A47]">

                <Wrench className="h-7 w-7" />

              </div>

              <h3 className="mt-4 text-xl font-black text-gray-900">
                Seguir mejorando el sitio
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Permite continuar desarrollando
                mejoras, nuevas funcionalidades y
                una mejor experiencia para quienes
                utilizan la plataforma.
              </p>

            </article>

            {/* Conectar */}
            <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-[#2E7D32]">

                <Users className="h-7 w-7" />

              </div>

              <h3 className="mt-4 text-xl font-black text-gray-900">
                Seguir conectando familias
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Ayuda a mantener un espacio donde
                animales que buscan un hogar puedan
                encontrarse con personas dispuestas
                a adoptar.
              </p>

            </article>

          </div>

        </div>

      </section>

      {/* ==================================================
          COLABORAR
      ================================================== */}

      <section
        id="colaborar"
        className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >

        <div className="mx-auto max-w-5xl">

          <div className="grid items-center gap-10 lg:grid-cols-2">

            {/* Texto */}
            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-[#2E7D32]">

                <HandHeart className="h-4 w-4" />

                Colaborá con Patitas Felices

              </div>

              <h2 className="text-3xl font-black leading-tight text-gray-900 sm:text-4xl">

                Cada aporte ayuda a que Patitas
                Felices pueda seguir creciendo

              </h2>

              <p className="mt-5 leading-7 text-gray-600">

                No importa el monto. Tu colaboración
                contribuye al mantenimiento y
                evolución de la plataforma para que
                podamos seguir brindando este espacio
                a quienes buscan ayudar, adoptar o
                encontrar una familia para un animal.

              </p>

              {/* Transparencia */}
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4">

                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#2E7D32]" />

                <div>

                  <p className="font-bold text-gray-900">
                    Un aporte para sostener el proyecto
                  </p>

                  <p className="mt-1 text-sm leading-5 text-gray-600">
                    Las colaboraciones están destinadas
                    a ayudar a mantener y mejorar la
                    plataforma Patitas Felices.
                  </p>

                </div>

              </div>

            </div>

            {/* Card colaboración */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">

              <div className="text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-[#FF7A47]">

                  <Heart className="h-7 w-7 fill-current" />

                </div>

                <h3 className="mt-4 text-2xl font-black text-gray-900">
                  Hacé tu aporte
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Cada colaboración suma para que
                  podamos seguir manteniendo y
                  mejorando Patitas Felices.
                </p>

              </div>

              {/* QR */}
              <div className="mx-auto mt-6 flex max-w-xs items-center justify-center rounded-2xl border border-gray-200 bg-white p-5">

                <img
                  src={QR_DONACION}
                  alt="Código QR para colaborar con el proyecto Patitas Felices mediante Mercado Pago"
                  className="h-auto w-full object-contain"
                />

              </div>

             

              {/* Separador */}
              <div className="my-6 flex items-center gap-3">

                <div className="h-px flex-1 bg-gray-200" />

                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  o
                </span>

                <div className="h-px flex-1 bg-gray-200" />

              </div>

              {/* Mercado Pago */}
              <button
                type="button"
                onClick={abrirMercadoPago}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF7A47] px-6 py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg"
              >

                <HandHeart className="h-5 w-5" />

                Colaborar con el proyecto

                <ExternalLink className="h-4 w-4" />

              </button>

              <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                Serás redirigido a Mercado Pago
                para realizar tu aporte.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          MENSAJE FINAL
      ================================================== */}

      <section className="bg-[#2E7D32] px-4 py-14 text-white sm:px-6 lg:px-8">

        <div className="mx-auto max-w-3xl text-center">

          <Sparkles className="mx-auto h-10 w-10" />

          <h2 className="mt-4 text-3xl font-black">
            Gracias por acompañar a Patitas Felices
          </h2>

          <p className="mx-auto mt-3 max-w-2xl leading-7 text-green-50">
            Cada persona que adopta, comparte,
            difunde o colabora ayuda a que este
            proyecto pueda seguir creciendo y
            generando nuevas oportunidades.
          </p>

        </div>

      </section>

    </main>
  );
}