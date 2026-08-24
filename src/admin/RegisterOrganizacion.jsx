import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import { registrarOrganizacion } from "../service/authService";

const initialForm = {
  nombreOrganizacion: "",
  emailOrganizacion: "",
  telefono: "",
  localidad: "",
  provincia: "",
  nombreAdministrador: "",
  emailAdministrador: "",
  password: "",
  confirmarPassword: "",
};

export default function RegistrarOrganizacion() {
  const [form, setForm] = useState(initialForm);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMensaje("");

    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (form.password !== form.confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setIsLoading(true);

      const respuesta = await registrarOrganizacion({
        nombreOrganizacion: form.nombreOrganizacion.trim(),
        emailOrganizacion: form.emailOrganizacion
          .trim()
          .toLowerCase(),
        telefono: form.telefono.trim(),
        localidad: form.localidad.trim(),
        provincia: form.provincia.trim(),
        nombreAdministrador: form.nombreAdministrador.trim(),
        emailAdministrador: form.emailAdministrador
          .trim()
          .toLowerCase(),
        password: form.password,
      });

      setMensaje(
        respuesta.message ||
          "La organización fue registrada correctamente."
      );

      setForm(initialForm);

      setTimeout(() => {
        navigate("/admin/login", {
          replace: true,
        });
      }, 1800);
    } catch (requestError) {
      console.error(
        "Error registrando organización:",
        requestError
      );

      setError(
        requestError.message ||
          "No se pudo registrar la organización."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-orange-50 to-gray-200 px-5 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          to="/admin/login"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#FF7A47]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio de sesión
        </Link>

        <div className="overflow-hidden rounded-3xl border border-white/50 bg-white shadow-2xl">
          {/* Encabezado */}
          <div className="border-b border-gray-100 px-6 py-7 sm:px-9">
            <div className="mb-5 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF7A47] text-3xl text-white shadow-lg shadow-orange-500/20">
                🐾
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Registrar organización
              </h1>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Creá la cuenta de tu refugio u organización para
                publicar animales y gestionar solicitudes de adopción.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 px-6 py-8 sm:px-9"
          >
            {mensaje && (
              <div
                role="status"
                className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{mensaje}</span>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* Datos de la organización */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                  <Building2 className="h-5 w-5 text-[#FF7A47]" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Datos de la organización
                  </h2>

                  <p className="text-xs text-slate-500">
                    Información pública del refugio.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="nombreOrganizacion"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Nombre de la organización
                  </label>

                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="nombreOrganizacion"
                      name="nombreOrganizacion"
                      type="text"
                      required
                      disabled={isLoading}
                      value={form.nombreOrganizacion}
                      onChange={handleChange}
                      placeholder="Ejemplo: Refugio Huellitas"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none transition focus:border-[#FF7A47] focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="emailOrganizacion"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Correo de la organización
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="emailOrganizacion"
                      name="emailOrganizacion"
                      type="email"
                      required
                      autoComplete="email"
                      disabled={isLoading}
                      value={form.emailOrganizacion}
                      onChange={handleChange}
                      placeholder="contacto@refugio.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none transition focus:border-[#FF7A47] focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="telefono"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Teléfono
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      disabled={isLoading}
                      value={form.telefono}
                      onChange={handleChange}
                      placeholder="11 1234 5678"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none transition focus:border-[#FF7A47] focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="localidad"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Localidad
                  </label>

                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="localidad"
                      name="localidad"
                      type="text"
                      disabled={isLoading}
                      value={form.localidad}
                      onChange={handleChange}
                      placeholder="Ejemplo: Quilmes"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none transition focus:border-[#FF7A47] focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="provincia"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Provincia
                  </label>

                  <input
                    id="provincia"
                    name="provincia"
                    type="text"
                    disabled={isLoading}
                    value={form.provincia}
                    onChange={handleChange}
                    placeholder="Ejemplo: Buenos Aires"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#FF7A47] focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>
            </section>

            <div className="border-t border-slate-100" />

            {/* Datos del administrador */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                  <User className="h-5 w-5 text-[#FF7A47]" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Administrador de la cuenta
                  </h2>

                  <p className="text-xs text-slate-500">
                    Estas credenciales se usarán para ingresar al panel.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="nombreAdministrador"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Nombre y apellido
                  </label>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="nombreAdministrador"
                      name="nombreAdministrador"
                      type="text"
                      required
                      autoComplete="name"
                      disabled={isLoading}
                      value={form.nombreAdministrador}
                      onChange={handleChange}
                      placeholder="Ejemplo: María López"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none transition focus:border-[#FF7A47] focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="emailAdministrador"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Correo de acceso
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="emailAdministrador"
                      name="emailAdministrador"
                      type="email"
                      required
                      autoComplete="email"
                      disabled={isLoading}
                      value={form.emailAdministrador}
                      onChange={handleChange}
                      placeholder="administrador@refugio.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none transition focus:border-[#FF7A47] focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Contraseña
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={mostrarPassword ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      disabled={isLoading}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-12 outline-none transition focus:border-[#FF7A47] focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setMostrarPassword((prev) => !prev)
                      }
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={
                        mostrarPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {mostrarPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmarPassword"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Repetir contraseña
                  </label>

                  <div className="relative">
                    <input
                      id="confirmarPassword"
                      name="confirmarPassword"
                      type={
                        mostrarConfirmacion ? "text" : "password"
                      }
                      required
                      minLength={8}
                      autoComplete="new-password"
                      disabled={isLoading}
                      value={form.confirmarPassword}
                      onChange={handleChange}
                      placeholder="Repetí la contraseña"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-12 outline-none transition focus:border-[#FF7A47] focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setMostrarConfirmacion((prev) => !prev)
                      }
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={
                        mostrarConfirmacion
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {mostrarConfirmacion ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={isLoading || Boolean(mensaje)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF7A47] py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Registrar organización"
              )}
            </button>

            <p className="text-center text-sm text-slate-500">
              ¿Ya tenés una cuenta?{" "}
              <Link
                to="/admin/login"
                className="font-semibold text-[#FF7A47] hover:underline"
              >
                Iniciar sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}