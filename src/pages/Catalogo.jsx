import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { PawPrint, Loader2 } from 'lucide-react';
import { obtenerAnimalesPublicos } from '../service/animalesServide';
import { animalImage, readFavorites } from '../lib/adoption';
import FavoriteButton from '../components/FavoriteButton';
export default function Catalogo() {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const favorites = location.pathname === '/favoritos';
  const [ids, setIds] = useState(readFavorites);
  const [result, setResult] = useState({
    items: [],
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [retry, setRetry] = useState(0);
  const [query, setQuery] = useState(params.get('q') || '');
  const page = Math.max(1, Number(params.get('page')) || 1);
  const queryString = params.toString();
  useEffect(() => {
    const sync = () => setIds(readFavorites());
    window.addEventListener('patitas-favorites', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('patitas-favorites', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  useEffect(() => {
    setQuery(params.get('q') || '');
  }, [queryString]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    let active = true;
    if (favorites && !ids.length) {
      setResult({
        items: [],
        total: 0,
        totalPages: 0
      });
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    const search = Object.fromEntries(new URLSearchParams(queryString));
    obtenerAnimalesPublicos({
      ...search,
      page,
      pageSize: 12,
      ...(favorites ? {
        ids: ids.join(',')
      } : {})
    }).then(data => {
      if (active) setResult(data);
    }).catch(err => {
      if (active) setError(err.message);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [queryString, page, favorites, ids, retry]);
  function update(key, value) {
    setParams(previous => {
      const next = new URLSearchParams(previous);
      if (value) next.set(key, value);else next.delete(key);
      if (key !== 'page') next.delete('page');
      return next;
    });
  }
  const options = [['tipo', 'Especie', [['perro', 'Perros'], ['gato', 'Gatos']]], ['tamanio', 'Tamaño', [['pequenio', 'Pequeño'], ['mediano', 'Mediano'], ['grande', 'Grande']]], ['edad', 'Edad', [['cachorro', 'Hasta 1 año'], ['adulto', '1 a 8 años'], ['mayor', '8 años o más']]], ['sexo', 'Sexo', [['macho', 'Macho'], ['hembra', 'Hembra']]]];
  return <main className="mx-auto min-h-[65vh] max-w-7xl px-5 py-10">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="font-semibold text-green-700">Una oportunidad para cambiar dos vidas</p><h1 className="mt-2 text-4xl font-black text-slate-900">{favorites ? 'Tus favoritos' : 'Encontrá a tu compañero'}</h1><p className="mt-3 max-w-xl text-slate-500">Cada animal tiene su historia. Conocé sus necesidades y consultá con su organización antes de adoptar.</p></div><Link className="font-semibold text-green-700 underline" to={favorites ? '/adoptar' : '/favoritos'}>{favorites ? 'Ver todos los animales' : 'Ver mis favoritos'}</Link></div>
    <form onSubmit={event => {
      event.preventDefault();
      const locality = event.currentTarget.elements.namedItem('localidad').value.trim();
      setParams(previous => {
        const next = new URLSearchParams(previous);
        if (query.trim()) next.set('q', query.trim());else next.delete('q');
        if (locality) next.set('localidad', locality);else next.delete('localidad');
        next.delete('page');
        return next;
      });
    }} className="mb-7 grid gap-4 rounded-2xl border bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-4">
      <label className="text-sm font-semibold">Buscar por nombre<div className="mt-2 flex gap-2"><input type="search" maxLength={100} value={query} onChange={e => setQuery(e.target.value)} className="min-w-0 w-full rounded-lg border bg-white p-2" /><button className="rounded-lg bg-green-700 px-3 text-white">Buscar</button></div></label>
      <label className="text-sm font-semibold">Localidad<input name="localidad" aria-label="Filtrar por localidad" placeholder="Ej.: Glew" defaultValue={params.get('localidad') || ''} key={params.get('localidad') || ''} onBlur={e => update('localidad', e.target.value.trim())} className="mt-2 w-full rounded-lg border bg-white p-2" /></label>
      {options.map(([key, label, values]) => <label key={key} className="text-sm font-semibold">{label}<select value={params.get(key) || ''} onChange={e => update(key, e.target.value)} className="mt-2 w-full rounded-lg border bg-white p-2"><option value="">Todas las opciones</option>{values.map(([v, text]) => <option key={v} value={v}>{text}</option>)}</select></label>)}
      <fieldset className="flex flex-wrap gap-4 text-sm sm:col-span-2 lg:col-span-3"><legend className="mb-2 font-semibold">Convivencia evaluada</legend>{[['compatibleNinios', 'Con niños'], ['compatiblePerros', 'Con perros'], ['compatibleGatos', 'Con gatos']].map(([key, label]) => <label key={key} className="flex items-center gap-2"><input type="checkbox" checked={params.get(key) === 'si'} onChange={e => update(key, e.target.checked ? 'si' : '')} />{label}</label>)}</fieldset>
      <button type="button" onClick={() => {
        setParams({});
        setQuery('');
      }} className="self-end rounded-lg border bg-white p-2 text-sm">Limpiar filtros</button>
      <p className="text-xs text-slate-500 sm:col-span-2 lg:col-span-4">Los filtros de edad y convivencia solo incluyen animales con esa información registrada. Los favoritos se guardan en este navegador.</p>
    </form>
    {error ? <div role="alert" className="rounded-xl bg-red-50 p-6 text-red-800">{error}<button className="ml-4 underline" onClick={() => setRetry(v => v + 1)}>Reintentar</button></div> : loading ? <div role="status" className="flex items-center justify-center gap-3 py-20"><Loader2 className="animate-spin" />Buscando compañeros...</div> : <><p role="status" className="mb-4 text-sm text-slate-500">{result.total} {result.total === 1 ? 'animal encontrado' : 'animales encontrados'}</p>{!result.items.length ? <div className="rounded-2xl border border-dashed p-12 text-center"><PawPrint className="mx-auto mb-4 text-green-700" /><h2 className="text-xl font-bold">{favorites ? 'Todavía no hay favoritos disponibles' : 'No encontramos animales con esos filtros'}</h2><p className="mt-2 text-slate-500">{favorites ? 'Guardá animales desde sus fichas. Los que ya fueron adoptados dejan de aparecer en esta lista.' : 'Probá ampliar la búsqueda o quitar algún filtro.'}</p></div> : <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{result.items.map(animal => <li key={animal.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm"><Link to={`/adoptar/${animal.id}`}><img src={animalImage(animal)} alt={animal.nombre} loading="lazy" className="aspect-[4/3] w-full object-cover" /></Link><div className="space-y-3 p-5"><Link to={`/adoptar/${animal.id}`} className="text-xl font-bold text-slate-900">{animal.nombre}</Link><p className="text-sm text-slate-500">{[animal.tipo, animal.edad, animal.localidad || animal.organizacion?.localidad].filter(Boolean).join(' · ')}</p><p className="text-xs font-medium text-green-800">{animal.organizacion?.nombre}{animal.organizacion?.verificada ? ' · Organización verificada' : ''}</p><div className="flex flex-wrap items-center justify-between gap-2"><FavoriteButton id={animal.id} /><Link to={`/adoptar/${animal.id}`} className="text-sm font-bold text-green-700 underline">Conocer su historia</Link></div></div></li>)}</ul>}{result.totalPages > 1 && <nav aria-label="Páginas de animales" className="mt-8 flex items-center justify-center gap-5"><button disabled={page <= 1} onClick={() => update('page', String(page - 1))} className="rounded-lg border px-4 py-2 disabled:opacity-40">Anterior</button><span>{page} de {result.totalPages}</span><button disabled={page >= result.totalPages} onClick={() => update('page', String(page + 1))} className="rounded-lg border px-4 py-2 disabled:opacity-40">Siguiente</button></nav>}</>}
  </main>;
}
