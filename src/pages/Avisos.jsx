import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Camera, MapPin } from 'lucide-react';
import { animalImage } from '../lib/adoption';
import { avisosRequest, caseLabels, noticeTitle } from '../service/avisos';
export default function Avisos() {
  const [params, setParams] = useSearchParams(),
    [result, setResult] = useState(null),
    [error, setError] = useState(''),
    [retry, setRetry] = useState(0);
  const search = params.toString();
  useEffect(() => {
    const controller = new AbortController();
    setError('');
    setResult(null);
    avisosRequest('/api/avisos?' + search, {
      signal: controller.signal
    }).then(setResult).catch(e => {
      if (e.name !== 'AbortError') setError(e.message);
    });
    return () => controller.abort();
  }, [search, retry]);
  function filter(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const next = new URLSearchParams(Object.fromEntries([...values.entries()].filter(([, value]) => value)));
    if (params.get('categoria')) next.set('categoria', params.get('categoria'));
    setParams(next);
  }
  return <main className="mx-auto min-h-[65vh] max-w-6xl px-5 py-9 sm:py-12">
    <div className="flex flex-wrap items-end justify-between gap-5"><div className="max-w-2xl"><p className="font-semibold text-green-700">La comunidad puede hacer la diferencia</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">Perdidos y encontrados</h1><p className="mt-4 leading-7 text-slate-600">Buscá a tu mascota o ayudá a que un animal encontrado vuelva con su familia. Publicá una foto y una zona de referencia.</p></div><div className="flex flex-wrap gap-3"><Link to="/avisos/nuevo?categoria=perdido" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-green-700 bg-white px-5 py-3 font-bold text-green-800">Perdí a mi mascota</Link><Link to="/avisos/nuevo" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 font-bold text-white"><Camera size={20} />Publicar un aviso</Link></div></div>
    <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">Estos avisos son de mascotas perdidas y animales encontrados o que necesitan ayuda. No significan que estén disponibles para adoptar. Si hay peligro o una urgencia, contactá a un servicio veterinario o de rescate local; esta sección no es un servicio de emergencias.</p>
    <div className="mt-6 flex flex-wrap gap-2">{[['', 'Todos'], ['perdido', 'Mascotas perdidas'], ['encontrado', 'Animales encontrados']].map(([value, label]) => <button type="button" key={value} aria-pressed={(params.get('categoria') || '') === value} onClick={() => setParams(previous => {
        const next = new URLSearchParams(previous);
        if (value) next.set('categoria', value);else next.delete('categoria');
        next.delete('page');
        return next;
      })} className={"min-h-11 rounded-full border px-4 py-2 text-sm font-semibold " + ((params.get('categoria') || '') === value ? 'border-green-700 bg-green-700 text-white' : 'bg-white text-slate-600')}>{label}</button>)}</div>
    <form onSubmit={filter} className="my-7 grid gap-4 rounded-2xl border bg-slate-50 p-5 sm:grid-cols-[1fr_1fr_auto]"><label className="text-sm font-semibold">Localidad<input name="localidad" defaultValue={params.get('localidad') || ''} maxLength={120} placeholder="Ej.: Glew" className="mt-2 w-full rounded-xl border p-3" /></label><label className="text-sm font-semibold">Animal<select name="tipo" defaultValue={params.get('tipo') || ''} className="mt-2 w-full rounded-xl border bg-white p-3"><option value="">Perros y gatos</option><option value="perro">Perros</option><option value="gato">Gatos</option></select></label><button className="min-h-12 self-end rounded-xl bg-green-700 px-5 py-3 font-bold text-white">Buscar avisos</button></form>
    {error ? <p role="alert" className="rounded-xl bg-red-50 p-5 text-red-800">{error}<button onClick={() => setRetry(v => v + 1)} className="ml-3 underline">Reintentar</button></p> : !result ? <p role="status" className="py-10 text-center">Cargando avisos...</p> : !result.items.length ? <div className="rounded-2xl border border-dashed p-10 text-center"><h2 className="text-xl font-bold">No hay avisos publicados con esos filtros</h2><p className="mt-3 text-slate-500">Los avisos nuevos aparecen después de su revisión.</p></div> : <><p className="mb-4 text-sm text-slate-500">{result.total} {result.total === 1 ? 'aviso publicado' : 'avisos publicados'}</p><ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{result.items.map(aviso => <li key={aviso.id} className="overflow-hidden rounded-2xl border bg-white"><Link to={`/avisos/${aviso.id}`}><img src={animalImage({
              imageUrl: aviso.imagen
            })} alt={noticeTitle(aviso)} loading="lazy" className="aspect-[4/3] w-full object-cover" /><div className="space-y-3 p-5"><span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${aviso.estadoCaso === 'abierto' ? 'bg-orange-50 text-orange-800' : 'bg-green-50 text-green-800'}`}>{aviso.estadoCaso === 'abierto' && aviso.categoria === 'perdido' ? 'Mascota perdida' : caseLabels[aviso.estadoCaso]}</span><h2 className="text-xl font-bold">{noticeTitle(aviso)}</h2><p className="flex items-center gap-2 text-sm text-slate-600"><MapPin size={16} />{aviso.localidad} · {aviso.zona}</p><p className="line-clamp-3 text-sm leading-6 text-slate-600">{aviso.descripcion}</p><span className="inline-block font-semibold text-green-700 underline">Ver cómo ayudar</span></div></Link></li>)}</ul>{result.totalPages > 1 && <nav aria-label="Páginas de avisos" className="mt-7 flex items-center justify-center gap-4">{[['Anterior', -1], ['Siguiente', 1]].map(([label, delta]) => <button key={label} disabled={result.page + delta < 1 || result.page + delta > result.totalPages} onClick={() => setParams(previous => {
          const next = new URLSearchParams(previous);
          next.set('page', String(result.page + delta));
          return next;
        })} className="rounded-xl border px-4 py-3 disabled:opacity-40">{label}</button>)}</nav>}</>}
  </main>;
}
