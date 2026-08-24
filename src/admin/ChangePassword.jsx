import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
} from "lucide-react";
import { solicitarRecuperacionPassword } from "../service/authService";

export default function ChangePassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMensaje("");
    setError("");
    setIsLoading(true);

    try {
      const respuesta = await solicitarRecuperacionPassword(
        email.trim()
      );

      setMensaje(
        respuesta.message ||
          "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña."
      );

      setEmail("");
    } catch (requestError) {
      console.error(
        "Error solicitando recuperación:",
        requestError
      );

      setError(
        requestError.message ||
          "No se pudo procesar la solicitud. Intentá nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-orange-50 to-gray-200 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-md">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF7A47] text-3xl text-white shadow-lg shadow-orange-500/20">
            🐾
          </div>
        </div>

        {/* Título */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Recuperar contraseña
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Ingresá el correo asociado a tu cuenta y te
            enviaremos las instrucciones para crear una nueva
            contraseña.
          </p>
        </div>

        {/* Mensaje correcto */}
        {mensaje && (
          <div
            role="status"
            className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{mensaje}</span>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email-recuperacion"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Correo electrónico
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                id="email-recuperacion"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@email.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#FF7A47] focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF7A47] py-3.5 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar instrucciones"
            )}
          </button>
        </form>

        <Link
          to="/admin/login"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#FF7A47]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}