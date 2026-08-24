import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);

  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    try {
      await login(email, password);
      nav("/admin/animales");
    } catch (e) {
      setErr("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold">
            A
          </div>

          <h1 className="mt-5 text-3xl font-bold text-gray-900">
            Admin Panel
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in to continue
          </p>
        </div>

        {err && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="admin@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black py-3 text-white font-semibold transition hover:bg-gray-800 active:scale-[0.99]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 border-t pt-5 text-center">
          <Link
            to="/"
            className="text-gray-500 hover:text-black transition"
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}