import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Camera, LoaderCircle } from 'lucide-react';
import { animalImage } from '../lib/adoption';
import { avisosRequest, caseLabels,noticeTitle } from '../service/avisos';
export default function AvisosInicio() {
  const [items, setItems] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true,
      controller;
    async function load() {
      controller?.abort();
      controller = new AbortController();
      const request = controller;
      try {
        const response = await avisosRequest('/api/avisos', {
          signal: request.signal
        });
        if (active && !request.signal.aborted) {
          setItems(response.items.slice(0, 3));
          setError('');
        }
      } catch (err) {
        if (active && !request.signal.aborted) setError(err.message);
      } finally {
        if (active && !request.signal.aborted) setLoading(false);
      }
    }
    const refresh = () => {
      if (document.visibilityState === 'visible') load();
    };
    load();
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    const timer = setInterval(refresh, 30000);
    return () => {
      active = false;
      controller?.abort();
      clearInterval(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [retry]);
  return <section aria-labelledby="avisos-inicio-title" className="border-y border-orange-100 bg-orange-50/50 px-5 py-12 sm:py-16">
    <div className="mx-auto max-w-7xl">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-5"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-wide text-orange-700">Avisos de la comunidad</p><h2 id="avisos-inicio-title" className="mt-2 text-3xl font-black text-slate-900">Perdidos y encontrados</h2><p className="mt-3 leading-7 text-slate-600">¿Lo reconocés o podés ayudar? Estos avisos buscan reunir animales con sus familias o coordinar ayuda.</p></div><Link to="/avisos" className="min-h-11 rounded-xl border border-orange-200 bg-white px-5 py-3 font-bold text-green-800">Ver todos los avisos</Link></div>
      {loading ? <p role="status" className="flex items-center justify-center gap-3 rounded-2xl border bg-white p-8 text-slate-600"><LoaderCircle className="animate-spin" size={20} />Cargando avisos de la comunidad...</p> : error ? <div role="alert" className="rounded-2xl border bg-white p-6"><p className="text-slate-600">No pudimos actualizar los avisos de la comunidad.</p><button type="button" onClick={() => setRetry(value => value + 1)} className="mt-3 font-semibold text-green-700 underline">Volver a intentar</button></div> : items.length ? <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map(aviso => <li key={aviso.id} className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm"><Link to={`/avisos/${aviso.id}`} className="block"><img src={animalImage({
              imageUrl: aviso.imagen
            })} alt={noticeTitle(aviso)} loading="lazy" className="aspect-[4/3] w-full object-cover" /><div className="space-y-3 p-5"><p className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${aviso.estadoCaso === 'abierto' ? 'bg-orange-50 text-orange-800' : 'bg-green-50 text-green-800'}`}>{aviso.estadoCaso==='abierto'&&aviso.categoria==='perdido'?'Mascota perdida':caseLabels[aviso.estadoCaso]}</p><h3 className="text-xl font-bold text-slate-900">{noticeTitle(aviso)}</h3><p className="flex items-start gap-2 text-sm text-slate-600"><MapPin size={17} className="mt-0.5 shrink-0" />{aviso.localidad} · {aviso.zona}</p><p className="line-clamp-3 text-sm leading-6 text-slate-600">{aviso.descripcion}</p><span className="inline-block font-bold text-green-700 underline">Ver el aviso y ayudar</span></div></Link></li>)}</ul> : <div className="rounded-2xl border border-dashed border-orange-200 bg-white p-7 text-center"><h3 className="text-lg font-bold text-slate-800">Todavía no hay avisos aprobados para mostrar</h3><p className="mt-2 text-sm leading-6 text-slate-500">Los avisos nuevos aparecen acá después de que el equipo los revise.</p></div>}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><p className="max-w-2xl text-xs leading-5 text-slate-500">Encontrar un animal no significa que esté abandonado o disponible para adoptar. Los datos de contacto de quien publica son privados.</p><Link to="/avisos/nuevo" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white"><Camera size={18} />Encontré un animal</Link></div>
    </div>
  </section>;
}
