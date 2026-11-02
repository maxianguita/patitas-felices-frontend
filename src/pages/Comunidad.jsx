import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL, animalImage } from '../lib/adoption';
function usePublicData(path) {
  const [data, setData] = useState(null),
    [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setData(null);
    setError('');
    fetch(API_URL + path).then(async r => {
      if (!r.ok) throw new Error('No pudimos cargar esta información.');
      return r.json();
    }).then(d => {
      if (active) setData(d);
    }).catch(e => {
      if (active) setError(e.message);
    });
    return () => {
      active = false;
    };
  }, [path]);
  return {
    data,
    error
  };
}
export function Historias() {
  const {
    data,
    error
  } = usePublicData('/api/historias');
  return <main className="mx-auto min-h-[60vh] max-w-6xl px-5 py-12"><p className="font-semibold text-green-700">Finales que abren nuevos comienzos</p><h1 className="mt-2 text-4xl font-black">Ya encontraron una familia</h1><p className="mt-4 max-w-2xl text-slate-500">Historias publicadas por sus organizaciones, sin exponer datos de quienes adoptaron.</p>{error ? <p role="alert" className="mt-8">{error}</p> : !data ? <p role="status" className="mt-8">Cargando historias...</p> : !data.length ? <p className="mt-8 rounded-2xl border p-8">Todavía no hay historias publicadas. Cada adopción merece su tiempo para contarse.</p> : <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.map(animal => <li key={animal.id} className="overflow-hidden rounded-2xl border"><img src={animalImage(animal)} alt={animal.nombre} className="aspect-[4/3] w-full object-cover" loading="lazy" /><div className="space-y-3 p-5"><h2 className="text-xl font-bold">{animal.nombre}</h2><p className="whitespace-pre-line text-sm text-slate-600">{animal.historiaAdopcion || 'Su organización confirmó una nueva familia.'}</p><Link className="text-green-700 underline" to={`/adoptar/${animal.id}`}>Conocer su historia</Link></div></li>)}</ul>}</main>;
}
export function Organizacion() {
  const {
    id
  } = useParams();
  const {
    data: org,
    error
  } = usePublicData(`/api/organizaciones/${id}`);
  return <main className="mx-auto min-h-[60vh] max-w-3xl px-5 py-12">{error ? <p role="alert">{error}</p> : !org ? <p role="status">Cargando organización...</p> : <><p className="font-semibold text-green-700">{org.verificada ? 'Organización verificada' : 'Organización de la comunidad'}</p><h1 className="mt-3 text-4xl font-black">{org.nombre}</h1><p className="mt-3 text-slate-500">{[org.localidad, org.provincia].filter(Boolean).join(', ')}</p><p className="my-7 whitespace-pre-line leading-7">{org.descripcion || 'Contactá a la organización para conocer su trabajo y cómo colaborar.'}</p><div className="flex flex-wrap gap-5"><Link to={`/adoptar?organizacion=${org.id}`} className="rounded-xl bg-green-700 px-5 py-3 font-bold text-white">Ver sus animales</Link><a href={`mailto:${org.email}`} className="rounded-xl border px-5 py-3">Escribir a la organización</a></div><p className="mt-8 rounded-xl bg-orange-50 p-5 text-sm">¿Podés ofrecer tránsito, transporte o voluntariado? Escribile a esta organización indicando tu localidad y disponibilidad. Tu dirección y tus datos se coordinan en privado.</p></>}</main>;
}
export function NecesidadesReales() {
  const {
    data,
    error
  } = usePublicData('/api/necesidades');
  return <main className="mx-auto min-h-[60vh] max-w-5xl px-5 py-12"><h1 className="text-4xl font-black">Necesidades de la comunidad</h1><p className="mt-4 max-w-2xl text-slate-500">Pedidos publicados por las organizaciones para sus animales. Coordiná la ayuda directamente con la responsable de cada caso.</p><p className="mt-4 rounded-xl bg-orange-50 p-4 text-sm">Las donaciones de la sección “Donar” sostienen la plataforma. Para ayudar a un animal de esta lista, contactá a su organización. Los montos son objetivos informados, no una recaudación verificada.</p>{error ? <p role="alert" className="mt-8">{error}</p> : !data ? <p role="status" className="mt-8">Cargando necesidades...</p> : !data.length ? <div className="mt-8 rounded-2xl border p-8">Todavía no hay necesidades publicadas. También podés ofrecer tránsito o voluntariado desde <Link to="/contacto" className="text-green-700 underline">Contacto</Link>.</div> : <ul className="mt-8 grid gap-6 md:grid-cols-2">{data.map(need => <li key={need.id} className="space-y-3 rounded-2xl border p-6"><h2 className="text-xl font-bold">Ayudá a {need.animal.nombre}</h2><p className="whitespace-pre-line">{need.descripcion}</p>{need.montoNecesario != null && <p className="font-semibold">Objetivo informado: {new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0
          }).format(need.montoNecesario)}</p>}<p className="text-sm text-slate-500">Responsable: {need.animal.organizacion.nombre}</p><Link className="inline-block font-bold text-green-700 underline" to={`/organizaciones/${need.animal.organizacion.id}`}>Coordinar ayuda</Link></li>)}</ul>}</main>;
}
