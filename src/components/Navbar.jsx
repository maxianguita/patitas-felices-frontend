// patitas-glew-frontend/src/components/Navbar.jsx

import { useState } from "react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  PawPrint,
  User,
  X,
} from "lucide-react";

const navigationLinks = [
  {
    label: "Inicio",
    to: "/",
  },
  {
    label: "Adoptar",
    to: "/adoptar",
  },
  {
    label: "Necesidades",
    to: "/necesidades",
  },
  {
    label: "Contacto",
    to: "/contacto",
  },
];

// Lee de forma segura el usuario guardado en Local Storage
const obtenerUsuarioGuardado = () => {
  try {
    const usuarioGuardado =
      localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      return null;
    }

    return JSON.parse(usuarioGuardado);
  } catch (error) {
    console.error(
      "No se pudo leer el usuario guardado:",
      error
    );

    localStorage.removeItem("usuario");

    return null;
  }
};

// Convierte "pedro aznar" en "Pedro Aznar"
const formatearNombre = (texto = "") => {
  return texto
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() +
        palabra.slice(1)
    )
    .join(" ");
};

const Navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const token =
    localStorage.getItem("token");

  const usuario =
    obtenerUsuarioGuardado();

  const nombreUsuarioSinFormato =
    usuario?.nombreCompleto ||
    usuario?.nombre ||
    usuario?.name ||
    usuario?.email ||
    "Usuario";

  const nombreUsuario =
    formatearNombre(
      nombreUsuarioSinFormato
    );

  const emailUsuario =
    usuario?.email || "";

  const nombreOrganizacionSinFormato =
    usuario?.organizacion?.nombre ||
    usuario?.organizacion?.nombreFantasia ||
    usuario?.organizacion?.razonSocial ||
    usuario?.organizacionNombre ||
    usuario?.nombreOrganizacion ||
    "";

  const nombreOrganizacion =
    formatearNombre(
      nombreOrganizacionSinFormato
    );

  const inicialUsuario =
    nombreUsuario
      .charAt(0)
      .toUpperCase() || "U";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("user");

    setMenuOpen(false);

    navigate("/", {
      replace: true,
    });

    window.location.reload();
  };

  const getNavLinkClass = ({
    isActive,
  }) => {
    const baseClasses = `
      relative py-2 font-semibold
      transition-colors duration-200
      after:absolute after:bottom-0 after:left-0
      after:h-0.5 after:w-full
      after:origin-left after:bg-[#FF7A47]
      after:transition-transform after:duration-300
    `;

    if (isActive) {
      return `
        ${baseClasses}
        text-[#2E7D32]
        after:scale-x-100
      `;
    }

    return `
      ${baseClasses}
      text-gray-700
      after:scale-x-0
      hover:text-[#2E7D32]
      hover:after:scale-x-100
    `;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <nav
        aria-label="Navegación principal"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={() =>
              setMenuOpen(false)
            }
            aria-label="Ir al inicio de Patitas Glew"
            className="group flex items-center gap-3"
          >
            <img
  src="/patitas.png"
  alt=""
  className="h-12 w-12 rounded-full object-contain"
/>

            <span className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
              Patitas{" "}
              <span className="text-[#2E7D32]">
                Felices
              </span>
            </span>
          </Link>

          {/* Navegación de escritorio */}
          <div className="hidden items-center gap-6 md:flex">
            {navigationLinks.map(
              ({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={
                    getNavLinkClass
                  }
                >
                  {label}
                </NavLink>
              )
            )}

            {/* Colaborar */}
            <Link
              to="/donar"
              className="group flex items-center gap-2 rounded-full bg-[#FF7A47] px-5 py-3 font-bold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg"
            >
              <Heart className="h-5 w-5 fill-white transition-transform duration-300 group-hover:scale-110" />

              <span>
                Colaborar
              </span>
            </Link>

            {!token ? (
              /* Usuario sin sesión */
              <Link
                to="/admin/login"
                aria-label="Ingresar al panel administrativo"
                title="Ingresar al panel"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-[#2E7D32] transition hover:bg-green-100"
              >
                <User className="h-5 w-5" />
              </Link>
            ) : (
              /* Usuario autenticado */
              <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                {/* Datos de la sesión */}
                <div className="hidden items-center gap-3 lg:flex">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2E7D32] text-sm font-black text-white">
                    {inicialUsuario}
                  </div>

                  <div className="max-w-48">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {nombreOrganizacion ||
                        nombreUsuario}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {nombreOrganizacion
                        ? `Administrado por ${nombreUsuario}`
                        : emailUsuario ||
                          "Usuario administrador"}
                    </p>
                  </div>
                </div>

                {/* Panel */}
                <Link
                  to="/admin/animales"
                  title="Ir al panel administrativo"
                  className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-sm font-bold text-[#2E7D32] transition hover:bg-green-100"
                >
                  <LayoutDashboard className="h-5 w-5" />

                  <span>
                    Panel
                  </span>
                </Link>

                {/* Cerrar sesión */}
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Cerrar sesión"
                  title="Cerrar sesión"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Botón menú mobile */}
          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                (estadoActual) =>
                  !estadoActual
              )
            }
            aria-label={
              menuOpen
                ? "Cerrar menú"
                : "Abrir menú"
            }
            aria-expanded={menuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 md:hidden"
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Menú mobile */}
        {menuOpen && (
          <div className="border-t border-gray-100 pb-6 pt-4 md:hidden">
            <div className="flex flex-col gap-2">
              {/* Usuario conectado mobile */}
              {token && (
                <div className="mb-3 flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2E7D32] font-black text-white">
                    {inicialUsuario}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-bold text-gray-900">
                      {nombreOrganizacion ||
                        nombreUsuario}
                    </p>

                    <p className="truncate text-sm text-gray-500">
                      {nombreOrganizacion
                        ? `Administrado por ${nombreUsuario}`
                        : emailUsuario ||
                          "Usuario administrador"}
                    </p>
                  </div>
                </div>
              )}

              {/* Navegación */}
              {navigationLinks.map(
                ({ label, to }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className={({
                      isActive,
                    }) =>
                      `rounded-xl px-4 py-3 font-semibold transition ${
                        isActive
                          ? "bg-green-50 text-[#2E7D32]"
                          : "text-gray-700 hover:bg-gray-50 hover:text-[#2E7D32]"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                )
              )}

              {/* Colaborar mobile */}
              <Link
                to="/donar"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#FF7A47] px-5 py-3 font-bold text-white shadow-sm transition hover:bg-orange-600"
              >
                <Heart className="h-5 w-5 fill-white" />

                <span>
                  Colaborar
                </span>
              </Link>

              {!token ? (
                /* Ingresar */
                <Link
                  to="/admin/login"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-green-200 px-5 py-3 font-bold text-[#2E7D32] transition hover:bg-green-50"
                >
                  <User className="h-5 w-5" />

                  <span>
                    Ingresar
                  </span>
                </Link>
              ) : (
                /* Panel y salir */
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <Link
                    to="/admin/animales"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 font-bold text-[#2E7D32] transition hover:bg-green-100"
                  >
                    <LayoutDashboard className="h-5 w-5" />

                    <span>
                      Panel
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 font-bold text-red-600 transition hover:bg-red-100"
                  >
                    <LogOut className="h-5 w-5" />

                    <span>
                      Salir
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;