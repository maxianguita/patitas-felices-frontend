// src/admin/AdminLogin.jsx

import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Building2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";

import {
  login,
} from "../service/authService";

// Obtiene el token desde las posibles estructuras
// que puede devolver el backend.
const obtenerToken = (respuesta) => {
  return (
    respuesta?.token ||
    respuesta?.accessToken ||
    respuesta?.data?.token ||
    respuesta?.data?.accessToken ||
    localStorage.getItem("token") ||
    ""
  );
};

// Obtiene los datos del usuario autenticado.
const obtenerUsuario = (
  respuesta,
  emailIngresado
) => {
  const usuario =
    respuesta?.user ||
    respuesta?.usuario ||
    respuesta?.data?.user ||
    respuesta?.data?.usuario;

  if (usuario) {
    return {
      id: usuario.id ?? null,

      nombre:
        usuario.nombre ||
        usuario.nombreCompleto ||
        usuario.name ||
        "",

      email:
        usuario.email ||
        emailIngresado,

      rol:
        usuario.rol ||
        usuario.role ||
        "admin",

      organizacionId:
        usuario.organizacionId ??
        usuario.organizacion?.id ??
        null,

      organizacion:
        usuario.organizacion ||
        null,
    };
  }

  // Respaldo por si el backend devuelve
  // los datos directamente en la raíz.
  return {
    id:
      respuesta?.id ||
      respuesta?.data?.id ||
      null,

    nombre:
      respuesta?.nombre ||
      respuesta?.nombreCompleto ||
      respuesta?.data?.nombre ||
      respuesta?.data?.nombreCompleto ||
      "",

    email:
      respuesta?.email ||
      respuesta?.data?.email ||
      emailIngresado,

    rol:
      respuesta?.rol ||
      respuesta?.data?.rol ||
      "admin",

    organizacionId:
      respuesta?.organizacionId ??
      respuesta?.data?.organizacionId ??
      null,

    organizacion:
      respuesta?.organizacion ||
      respuesta?.data?.organizacion ||
      null,
  };
};

export default function AdminLogin() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    mostrarPassword,
    setMostrarPassword,
  ] = useState(false);

  const [err, setErr] =
    useState("");

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const navigate =
    useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();

    setErr("");
    setIsLoading(true);

    const emailNormalizado =
      email.trim().toLowerCase();

    try {
      const respuesta = await login(
        emailNormalizado,
        password
      );

      console.log(
        "Respuesta del login:",
        respuesta
      );

      const tokenRecibido =
        obtenerToken(respuesta);

      if (!tokenRecibido) {
        throw new Error(
          "El servidor no devolvió el token de acceso."
        );
      }

      const usuarioRecibido =
        obtenerUsuario(
          respuesta,
          emailNormalizado
        );

      /*
        Eliminamos completamente cualquier
        información de la sesión anterior.
      */
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      localStorage.removeItem("user");

      /*
        Guardamos la sesión nueva.
      */
      localStorage.setItem(
        "token",
        tokenRecibido
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(
          usuarioRecibido
        )
      );

      console.log(
        "Usuario guardado:",
        usuarioRecibido
      );

      navigate(
        "/admin/animales",
        {
          replace: true,
        }
      );

      /*
        Fuerza al Navbar a leer inmediatamente
        los datos de la nueva sesión.
      */
      window.location.reload();
    } catch (error) {
      console.error(
        "Error al iniciar sesión:",
        error
      );

      setErr(
        error.message ||
          "Credenciales inválidas. Por favor, intentá nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);

    if (err) {
      setErr("");
    }
  };

  const handlePasswordChange = (
    event
  ) => {
    setPassword(event.target.value);

    if (err) {
      setErr("");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 via-orange-50 to-gray-200 px-6 py-10">
      <section className="w-full max-w-md rounded-2xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-md">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF7A47] text-3xl font-bold text-white shadow-lg shadow-orange-500/20 transition duration-300 hover:rotate-6">
            🐾
          </div>
        </div>

        {/* Título */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Panel de control
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Ingresá con la cuenta de tu organización
          </p>
        </div>

        {/* Error */}
        {err && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <span
              aria-hidden="true"
              className="text-base"
            >
              ⚠️
            </span>

            <span>
              {err}
            </span>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="space-y-5"
        >
          {/* Correo */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Correo electrónico
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                required
                placeholder="admin@email.com"
                value={email}
                onChange={
                  handleEmailChange
                }
                disabled={isLoading}
                className={`w-full rounded-xl border py-3 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 ${
                  err
                    ? "border-red-300 bg-red-50/30 focus:ring-2 focus:ring-red-200"
                    : "border-slate-200 bg-slate-50/50 focus:border-[#FF7A47] focus:bg-white focus:ring-2 focus:ring-orange-100"
                }`}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Contraseña
            </label>

            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                id="password"
                name="password"
                type={
                  mostrarPassword
                    ? "text"
                    : "password"
                }
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={
                  handlePasswordChange
                }
                disabled={isLoading}
                className={`w-full rounded-xl border py-3 pl-12 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 ${
                  err
                    ? "border-red-300 bg-red-50/30 focus:ring-2 focus:ring-red-200"
                    : "border-slate-200 bg-slate-50/50 focus:border-[#FF7A47] focus:bg-white focus:ring-2 focus:ring-orange-100"
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  setMostrarPassword(
                    (valorActual) =>
                      !valorActual
                  )
                }
                disabled={isLoading}
                aria-label={
                  mostrarPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
                title={
                  mostrarPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {mostrarPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Recuperación */}
            <div className="mt-2 text-right">
              <Link
                to="/admin/cangepasword"
                className="text-sm font-semibold text-[#FF7A47] transition hover:text-orange-600 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          {/* Ingresar */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF7A47] py-3.5 font-semibold text-white shadow-lg shadow-orange-500/20 transition-all duration-200 hover:bg-orange-600 hover:shadow-orange-500/30 disabled:cursor-not-allowed disabled:bg-orange-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />

                <span>
                  Verificando...
                </span>
              </>
            ) : (
              <span>
                Ingresar al panel
              </span>
            )}
          </button>
        </form>

        {/* Registro de organización */}
        <div className="mt-7 border-t border-slate-200 pt-6 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
              <Building2 className="h-5 w-5 text-[#FF7A47]" />
            </div>
          </div>

          <p className="text-sm font-semibold text-slate-700">
            ¿Representás a un refugio u organización?
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Registrá la organización para publicar
            animales y gestionar solicitudes de
            adopción.
          </p>

          <Link
            to="/admin/registrar-organizacion"
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-[#FF7A47] px-5 py-2.5 text-sm font-bold text-[#FF7A47] transition hover:bg-orange-50"
          >
            Registrar mi organización
          </Link>
        </div>

        <p className="mt-8 text-center text-xs tracking-wide text-slate-400">
          SISTEMA DE GESTIÓN INTERNA
        </p>
      </section>
    </main>
  );
}