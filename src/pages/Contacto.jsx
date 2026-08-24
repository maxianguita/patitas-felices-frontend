import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Building2,
  CheckCircle2,
  HeartHandshake,
  Loader2,
  MapPin,
  MessageSquare,
  PawPrint,
  Send,
  ShieldCheck,
} from "lucide-react";

const WHATSAPP_NUMBER = "5491135636555";

const FORM_INICIAL = {
  nombre: "",
  email: "",
  telefono: "",
  localidad: "",
  motivo: "",
  mensaje: "",
  aceptaContacto: false,
};

const MOTIVOS_CONTACTO = [
  {
    value: "consulta_general",
    label: "Consulta general",
  },
  {
    value: "adopcion",
    label: "Quiero adoptar un animal",
  },
  {
    value: "animal_encontrado",
    label: "Encontré un animal",
  },
  {
    value: "transito",
    label: "Quiero ofrecer hogar de tránsito",
  },
  {
    value: "voluntariado",
    label: "Quiero ser voluntario/a",
  },
  {
    value: "donacion",
    label: "Consulta sobre donaciones",
  },
  {
    value: "organizacion",
    label: "Represento a una organización o refugio",
  },
  {
    value: "problema_plataforma",
    label: "Tengo un problema con la plataforma",
  },
];

export default function Contacto() {
  const [form, setForm] = useState(FORM_INICIAL);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const motivoSeleccionado = useMemo(() => {
    return MOTIVOS_CONTACTO.find(
      (motivo) => motivo.value === form.motivo
    );
  }, [form.motivo]);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setError("");
    setEnviado(false);

    setForm((formActual) => ({
      ...formActual,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const validarFormulario = () => {
    if (!form.nombre.trim()) {
      return "Ingresá tu nombre y apellido.";
    }

    if (!form.email.trim()) {
      return "Ingresá tu correo electrónico.";
    }

    if (!form.motivo) {
      return "Seleccioná el motivo de la consulta.";
    }

    if (!form.mensaje.trim()) {
      return "Escribí tu consulta.";
    }

    if (form.mensaje.trim().length < 10) {
      return "La consulta debe tener al menos 10 caracteres.";
    }

    if (!form.aceptaContacto) {
      return "Debés aceptar ser contactado para continuar.";
    }

    return "";
  };

  const crearMensajeWhatsapp = () => {
    const motivo =
      motivoSeleccionado?.label ||
      "Consulta general";

    const lineas = [
      "Hola, quiero comunicarme con Patitas Felices.",
      "",
      `Nombre: ${form.nombre.trim()}`,
      `Motivo: ${motivo}`,
      `Email: ${form.email.trim()}`,
    ];

    if (form.telefono.trim()) {
      lineas.push(
        `Teléfono: ${form.telefono.trim()}`
      );
    }

    if (form.localidad.trim()) {
      lineas.push(
        `Localidad: ${form.localidad.trim()}`
      );
    }

    lineas.push(
      "",
      "Consulta:",
      form.mensaje.trim()
    );

    return lineas.join("\n");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setEnviado(false);

    const errorValidacion =
      validarFormulario();

    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    try {
      setEnviando(true);

      const mensaje =
        crearMensajeWhatsapp();

      const whatsappUrl =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          mensaje
        )}`;

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );

      setEnviado(true);
    } catch (submitError) {
      console.error(
        "Error abriendo WhatsApp:",
        submitError
      );

      setError(
        "No se pudo abrir WhatsApp. Intentá nuevamente."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Encabezado */}
      <section className="bg-gradient-to-br from-green-50 via-white to-orange-50 px-5 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-bold text-[#2E7D32] shadow-sm">
            <MessageSquare className="h-5 w-5" />
            Estamos para ayudarte
          </div>

          <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
            Contactate con Patitas Felices
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Escribinos por adopciones, animales encontrados,
            voluntariado, donaciones o consultas relacionadas
            con la plataforma.
          </p>
        </div>
      </section>

      {/* Tipos de contacto */}
      <section className="px-5 py-14">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
              <PawPrint className="h-6 w-6 text-[#FF7A47]" />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Adopciones y rescates
            </h2>

            <p className="mt-3 leading-6 text-slate-600">
              Consultá por un animal, informá un rescate o
              comunicate para ofrecer tránsito.
            </p>

            <Link
              to="/adoptar"
              className="mt-5 inline-flex font-bold text-[#FF7A47] transition hover:text-orange-600"
            >
              Ver animales en adopción →
            </Link>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <Building2 className="h-6 w-6 text-[#2E7D32]" />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Organizaciones y refugios
            </h2>

            <p className="mt-3 leading-6 text-slate-600">
              Registrá tu organización para publicar y
              administrar animales desde tu propio panel.
            </p>

            <Link
              to="/admin/registrar-organizacion"
              className="mt-5 inline-flex font-bold text-[#2E7D32] transition hover:text-green-700"
            >
              Registrar organización →
            </Link>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Acceso administrativo
            </h2>

            <p className="mt-3 leading-6 text-slate-600">
              Las organizaciones registradas pueden ingresar
              para crear, editar y administrar sus animales.
            </p>

            <Link
              to="/admin/login"
              className="mt-5 inline-flex font-bold text-blue-600 transition hover:text-blue-700"
            >
              Ingresar al panel →
            </Link>
          </article>
        </div>
      </section>

      {/* Formulario */}
      <section className="px-5 pb-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Información lateral */}
          <aside className="rounded-3xl bg-[#2E7D32] p-7 text-white shadow-xl sm:p-9">
            <HeartHandshake className="h-12 w-12 text-orange-300" />

            <h2 className="mt-6 text-3xl font-black">
              ¿Cómo podemos ayudarte?
            </h2>

            <p className="mt-4 leading-7 text-green-50">
              Seleccioná el motivo y contanos brevemente tu
              situación. El mensaje se enviará por WhatsApp
              con todos los datos completados.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-orange-300" />

                <div>
                  <p className="font-bold">
                    Zona de atención
                  </p>

                  <p className="mt-1 text-sm text-green-100">
                    Conurbano Bonaerense y organizaciones
                    registradas en la plataforma.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="mt-1 h-5 w-5 shrink-0 text-orange-300" />

                <div>
                  <p className="font-bold">
                    Contacto por WhatsApp
                  </p>

                  <p className="mt-1 text-sm text-green-100">
                    La conversación continuará directamente
                    con el equipo responsable.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Formulario principal */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-9">
            <div className="mb-7">
              <h2 className="text-2xl font-black text-slate-900">
                Enviar una consulta
              </h2>

              <p className="mt-2 text-slate-500">
                Los campos marcados con * son obligatorios.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
                >
                  {error}
                </div>
              )}

              {enviado && (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0" />

                  <span>
                    Se abrió WhatsApp con tu consulta preparada.
                    Revisá el mensaje y presioná enviar.
                  </span>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="nombre"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Nombre y apellido *
                  </label>

                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    value={form.nombre}
                    onChange={handleChange}
                    disabled={enviando}
                    placeholder="Ejemplo: Denise Giménez"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#FF7A47] focus:ring-2 focus:ring-orange-100 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Correo electrónico *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    disabled={enviando}
                    placeholder="nombre@email.com"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#FF7A47] focus:ring-2 focus:ring-orange-100 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="telefono"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Teléfono
                  </label>

                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={form.telefono}
                    onChange={handleChange}
                    disabled={enviando}
                    placeholder="11 1234 5678"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#FF7A47] focus:ring-2 focus:ring-orange-100 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="localidad"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Localidad
                  </label>

                  <input
                    id="localidad"
                    name="localidad"
                    type="text"
                    value={form.localidad}
                    onChange={handleChange}
                    disabled={enviando}
                    placeholder="Ejemplo: Glew"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#FF7A47] focus:ring-2 focus:ring-orange-100 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="motivo"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Motivo de la consulta *
                  </label>

                  <select
                    id="motivo"
                    name="motivo"
                    required
                    value={form.motivo}
                    onChange={handleChange}
                    disabled={enviando}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-[#FF7A47] focus:ring-2 focus:ring-orange-100 disabled:opacity-60"
                  >
                    <option value="">
                      Seleccionar
                    </option>

                    {MOTIVOS_CONTACTO.map(
                      (motivo) => (
                        <option
                          key={motivo.value}
                          value={motivo.value}
                        >
                          {motivo.label}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="mensaje"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Consulta *
                  </label>

                  <textarea
                    id="mensaje"
                    name="mensaje"
                    required
                    rows={6}
                    maxLength={1500}
                    value={form.mensaje}
                    onChange={handleChange}
                    disabled={enviando}
                    placeholder="Contanos brevemente cómo podemos ayudarte..."
                    className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#FF7A47] focus:ring-2 focus:ring-orange-100 disabled:opacity-60"
                  />

                  <p className="mt-1 text-right text-xs text-slate-400">
                    {form.mensaje.length}/1500
                  </p>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <input
                  name="aceptaContacto"
                  type="checkbox"
                  checked={form.aceptaContacto}
                  onChange={handleChange}
                  disabled={enviando}
                  className="mt-1 h-4 w-4 accent-[#FF7A47]"
                />

                <span className="text-sm leading-6 text-slate-600">
                  Acepto que Patitas Felices o la organización
                  responsable se comunique conmigo para
                  responder esta consulta.
                </span>
              </label>

              <button
                type="submit"
                disabled={enviando}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF7A47] px-6 py-3.5 text-lg font-bold text-white shadow-lg transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
              >
                {enviando ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Preparando mensaje...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Enviar consulta por WhatsApp
                  </>
                )}
              </button>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}