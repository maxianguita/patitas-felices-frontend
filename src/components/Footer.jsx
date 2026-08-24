// patitas-Felices-frontend/src/components/Footer.jsx

import { Link } from "react-router-dom";

import {
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  PawPrint,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-4 border-[#FF7A47] bg-[#1B4332] text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF7A47]">
                <PawPrint className="h-6 w-6 text-white" />
              </div>

              <span className="text-xl font-black">
                Patitas Felices
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-green-100">
              Una plataforma para conectar animales que buscan
              un hogar con personas, refugios y organizaciones
              comprometidas con la adopción responsable.
            </p>

            <div className="mt-5 space-y-3 text-sm text-green-100">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-orange-300" />
                <span>Buenos Aires, Argentina</span>
              </div>

              <a
                href="mailto:contacto@patitasfelices.org"
                className="flex items-center gap-2 transition hover:text-orange-300"
              >
                <Mail className="h-4 w-4 shrink-0 text-orange-300" />
                contacto@patitasfelices.org
              </a>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h2 className="text-base font-bold">
              Explorar
            </h2>

            <ul className="mt-5 space-y-3 text-sm text-green-100">
              <li>
                <Link
                  to="/adoptar"
                  className="transition hover:text-orange-300"
                >
                  Animales en adopción
                </Link>
              </li>

              <li>
                <Link
                  to="/necesidades"
                  className="transition hover:text-orange-300"
                >
                  Necesidades
                </Link>
              </li>

              <li>
                <Link
                  to="/donar"
                  className="transition hover:text-orange-300"
                >
                  Colaborar
                </Link>
              </li>

              <li>
                <Link
                  to="/contacto"
                  className="transition hover:text-orange-300"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Organizaciones */}
          <div>
            <h2 className="text-base font-bold">
              Organizaciones
            </h2>

            <ul className="mt-5 space-y-3 text-sm text-green-100">
              <li>
                <Link
                  to="/admin/registrar-organizacion"
                  className="transition hover:text-orange-300"
                >
                  Registrar organización
                </Link>
              </li>

              <li>
                <Link
                  to="/admin/login"
                  className="transition hover:text-orange-300"
                >
                  Ingresar al panel
                </Link>
              </li>

              <li>
                <Link
                  to="/contacto"
                  className="transition hover:text-orange-300"
                >
                  Solicitar ayuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Colaboración y redes */}
          <div>
            <h2 className="text-base font-bold">
              Ayudanos a continuar
            </h2>

            <p className="mt-5 text-sm leading-6 text-green-100">
              Tu aporte voluntario ayuda a mantener la plataforma
              activa y mejorar sus herramientas.
            </p>

            <Link
              to="/donar"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#FF7A47] px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              <Heart className="h-5 w-5 fill-white" />
              Colaborar
            </Link>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Patitas Felices"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#FF7A47]"
              >
                <Instagram className="h-5 w-5" />
              </a>

              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Patitas Felices"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#FF7A47]"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Parte inferior */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-6 text-sm text-green-100 md:flex-row md:items-center md:justify-between">
          <p>
            © {currentYear} Patitas Felices. Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              to="/terminos"
              className="transition hover:text-orange-300"
            >
              Términos y condiciones
            </Link>

            <Link
              to="/privacidad"
              className="transition hover:text-orange-300"
            >
              Política de privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;