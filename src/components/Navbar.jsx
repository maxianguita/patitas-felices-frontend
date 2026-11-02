import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Heart, Menu, X, User, ChevronDown, LogOut, LayoutDashboard, Building2, ShieldCheck, ClipboardList, House, PawPrint, MapPin, BookOpen, HeartHandshake, Mail } from "lucide-react";
import { readFavorites } from "../lib/adoption";
const primaryLinks = [{
  to: "/",
  label: "Inicio",
  icon: House
}, {
  to: "/adoptar",
  label: "Adoptar",
  icon: PawPrint
}, {
  to: "/avisos",
  label: "Perdidos y encontrados",
  icon: MapPin
}];
const communityLinks = [{to:'/mi-actividad',label:'Mis avisos y solicitudes',icon:ClipboardList},{
  to: "/historias",
  label: "Historias de adopción",
  icon: BookOpen
}, {
  to: "/necesidades",
  label: "Necesidades",
  icon: HeartHandshake
}, {
  to: "/contacto",
  label: "Contacto",
  icon: Mail
}];
const mobileLink = ({
  isActive
}) => ["flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", isActive ? "bg-green-50 text-green-800" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"].join(" ");
const desktopLink = ({
  isActive
}) => ["inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold transition-colors", isActive ? "bg-green-50 text-green-800" : "text-slate-600 hover:bg-slate-50 hover:text-green-800"].join(" ");
function NavigationItem({
  item,
  onClick
}) {
  const Icon = item.icon;
  return <NavLink to={item.to} end={item.to === '/'} onClick={onClick} className={mobileLink}><Icon aria-hidden="true" size={18} />{item.label}</NavLink>;
}
function readSession() {
  try {
    return {
      token: localStorage.getItem("token"),
      user: JSON.parse(localStorage.getItem("usuario") || "null")
    };
  } catch {
    return {
      token: null,
      user: null
    };
  }
}
export default function Navbar() {
  const navigate = useNavigate(),
    location = useLocation();
  const [session, setSession] = useState(readSession),
    [mobileOpen, setMobileOpen] = useState(false),
    [favorites, setFavorites] = useState(() => readFavorites().length);
  const headerRef = useRef(null),
    toggleRef = useRef(null),
    communityRef = useRef(null),
    accountRef = useRef(null);
  const {
    token,
    user
  } = session;
  const isModerator = user?.rol === "superadmin";
  const displayName = user?.nombre || user?.nombreCompleto || user?.email?.split("@")[0] || "Mi cuenta";
  const panelRoute = isModerator ? "/admin/comunidad" : "/admin/animales";
  const accountLinks = [...(isModerator ? [{
    to: "/admin/avisos",
    label: "Revisar avisos",
    icon: ShieldCheck
  }, {
    to: "/admin/comunidad",
    label: "Organizaciones",
    icon: Building2
  }] : []), ...(!isModerator || user?.organizacionId ? [{
    to: "/admin/animales",
    label: "Mis animales",
    icon: PawPrint
  }, {
    to: "/admin/solicitudes",
    label: "Solicitudes de adopción",
    icon: ClipboardList
  }] : []), ...(!isModerator ? [{
    to: "/admin/comunidad",
    label: "Mi organización",
    icon: Building2
  }] : [])];
  const closeAll = useCallback(() => {
    setMobileOpen(false);
    if (communityRef.current) communityRef.current.open = false;
    if (accountRef.current) accountRef.current.open = false;
  }, []);
  useEffect(() => {
    closeAll();
  }, [location.pathname, closeAll]);
  useEffect(() => {
    const sync = () => {
      setSession(readSession());
      setFavorites(readFavorites().length);
    };
    const syncFavorites = () => setFavorites(readFavorites().length);
    window.addEventListener("storage", sync);
    window.addEventListener("patitas-favorites", syncFavorites);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("patitas-favorites", syncFavorites);
    };
  }, []);
  useEffect(() => {
    const outside = event => {
      if (!headerRef.current?.contains(event.target)) closeAll();
    };
    const escape = event => {
      if (event.key !== "Escape") return;
      const activeDetails = [communityRef.current, accountRef.current].find(details => details?.open);
      if (activeDetails) {
        activeDetails.open = false;
        activeDetails.querySelector("summary")?.focus();
      } else if (mobileOpen) {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [closeAll, mobileOpen]);
  function toggleMobile() {
    if (communityRef.current) communityRef.current.open = false;
    if (accountRef.current) accountRef.current.open = false;
    setMobileOpen(value => !value);
  }
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("user");
    setSession({
      token: null,
      user: null
    });
    closeAll();
    navigate("/", {
      replace: true
    });
  }
  const communityActive = communityLinks.some(link => location.pathname.startsWith(link.to));
  return <header ref={headerRef} className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
    <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 xl:gap-7">
      <Link to="/" onClick={closeAll} aria-label="Patitas Felices, ir al inicio" className="flex shrink-0 items-center gap-2.5">
        <img src="/patitas.png" alt="" className="h-10 w-10 rounded-full object-contain sm:h-11 sm:w-11" />
        <span className="whitespace-nowrap text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Patitas <span className="text-green-700">Felices</span></span>
      </Link>

      <nav aria-label="Navegación principal" className="ml-auto hidden items-center gap-1 xl:flex">
        {primaryLinks.map(({
          to,
          label
        }) => <NavLink key={to} to={to} end={to === "/"} onClick={closeAll} className={desktopLink}>{label}</NavLink>)}
        <details ref={communityRef} name="patitas-navigation" className="group relative">
          <summary className={["flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors [&::-webkit-details-marker]:hidden", communityActive ? "bg-green-50 text-green-800" : "text-slate-600 hover:bg-slate-50"].join(" ")}>
            Comunidad<ChevronDown aria-hidden="true" size={15} className="transition-transform group-open:rotate-180" />
          </summary>
          <nav aria-label="Comunidad" className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-slate-100 bg-white p-2 shadow-lg shadow-slate-900/10">
            <p className="px-3 pb-2 pt-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Conectados por los animales</p>
            {communityLinks.map(item => <NavigationItem key={item.to} item={item} onClick={closeAll} />)}
          </nav>
        </details>
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-1.5 xl:ml-0 xl:gap-3 xl:border-l xl:border-slate-200 xl:pl-5">
        <NavLink to="/favoritos" onClick={closeAll} aria-label={favorites ? "Mis favoritos, " + favorites + " guardados" : "Mis favoritos"} title="Mis favoritos" className={({
          isActive
        }) => ["relative flex h-11 w-11 items-center justify-center rounded-full transition-colors", isActive ? "bg-rose-50 text-rose-700" : "text-slate-500 hover:bg-rose-50 hover:text-rose-700"].join(" ")}>
          <Heart aria-hidden="true" size={21} />{favorites > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-bold text-white">{favorites > 99 ? "99+" : favorites}</span>}
        </NavLink>
        <Link to="/donar" onClick={closeAll} className="hidden min-h-11 items-center gap-2 rounded-full bg-orange-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600 xl:inline-flex"><Heart aria-hidden="true" size={16} />Colaborar</Link>
        {token ? <details ref={accountRef} name="patitas-navigation" className="group relative hidden xl:block">
          <summary aria-label="Abrir opciones de mi cuenta" className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-xs font-bold uppercase text-green-800">{displayName.charAt(0)}</span><span>Mi cuenta</span><ChevronDown aria-hidden="true" size={14} className="transition-transform group-open:rotate-180" />
          </summary>
          <nav aria-label="Administración de mi cuenta" className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-100 bg-white p-2 shadow-lg shadow-slate-900/10">
            <div className="mb-2 border-b border-slate-100 px-3 pb-4 pt-3"><p className="truncate text-sm font-bold text-slate-900">{displayName}</p><p className="mt-1 truncate text-xs text-slate-500">{isModerator ? "Moderación de la comunidad" : "Administración de la organización"}</p></div>
            {accountLinks.map(item => <NavigationItem key={item.to} item={item} onClick={closeAll} />)}
            <div className="mt-2 border-t border-slate-100 pt-2"><button type="button" onClick={logout} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50"><LogOut aria-hidden="true" size={18} />Cerrar sesión</button></div>
          </nav>
        </details> : <Link to="/admin/login" onClick={closeAll} className="hidden min-h-11 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 xl:inline-flex"><User aria-hidden="true" size={17} />Ingresar</Link>}
        <button ref={toggleRef} type="button" onClick={toggleMobile} aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"} className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-50 xl:hidden">{mobileOpen ? <X aria-hidden="true" size={23} /> : <Menu aria-hidden="true" size={23} />}</button>
      </div>
    </div>

    {mobileOpen && <nav id="mobile-navigation" aria-label="Navegación móvil" className="absolute inset-x-0 top-full max-h-[calc(100dvh-80px)] overflow-y-auto overscroll-contain border-t border-slate-100 bg-white px-5 pb-6 pt-4 shadow-lg xl:hidden">
      <div className="mx-auto max-w-lg space-y-4">
        <div>{primaryLinks.map(item => <NavigationItem key={item.to} item={item} onClick={closeAll} />)}</div>
        <div className="border-t border-slate-100 pt-4"><p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Comunidad</p>{communityLinks.map(item => <NavigationItem key={item.to} item={item} onClick={closeAll} />)}</div>
        <Link to="/donar" onClick={closeAll} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white"><Heart aria-hidden="true" size={18} />Colaborar con Patitas</Link>
        <div className="border-t border-slate-100 pt-4">{token ? <><div className="mb-3 flex items-center gap-3 px-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 font-bold uppercase text-green-800">{displayName.charAt(0)}</span><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900">{displayName}</p><p className="text-xs text-slate-500">{isModerator ? "Moderación" : "Mi organización"}</p></div><Link to={panelRoute} onClick={closeAll} aria-label="Ir a mi panel" className="ml-auto rounded-lg p-2 text-green-700"><LayoutDashboard aria-hidden="true" size={20} /></Link></div>{accountLinks.map(item => <NavigationItem key={item.to} item={item} onClick={closeAll} />)}<button type="button" onClick={logout} className="mt-2 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50"><LogOut aria-hidden="true" size={19} />Cerrar sesión</button></> : <Link to="/admin/login" onClick={closeAll} className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"><User aria-hidden="true" size={19} />Ingresar al panel</Link>}</div>
      </div>
    </nav>}
  </header>;
}
