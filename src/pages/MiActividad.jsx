import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, RefreshCw, Plus, LoaderCircle } from 'lucide-react';
import { readActivity, activityLink, parseActivityLink, rememberActivity, forgetActivity } from '../lib/activity';
import { avisosRequest, caseLabels, noticeTitle } from '../service/avisos';
import { animalImage, statusLabel } from '../lib/adoption';
const reviewLabels = {
  pendiente: 'Pendiente de revisión',
  publicado: 'Publicado',
  rechazado: 'No publicado'
};
export default function MiActividad() {
  const [entries, setEntries] = useState(readActivity),
    [data, setData] = useState(null),
    [error, setError] = useState(''),
    [version, setVersion] = useState(0),
    [busy, setBusy] = useState(false),
    [link, setLink] = useState(''),
    [message, setMessage] = useState(''),
    [removed, setRemoved] = useState(null),
    [tab, setTab] = useState('todo');
  const signature = JSON.stringify(entries);
  useEffect(() => {
    const sync = () => setEntries(readActivity());
    window.addEventListener('storage', sync);
    window.addEventListener('patitas-activity', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('patitas-activity', sync);
    };
  }, []);
  useEffect(() => {
    const nodes = [['robots', 'noindex, nofollow'], ['referrer', 'no-referrer']].map(([name, content]) => {
      const node = document.createElement('meta');
      node.name = name;
      node.content = content;
      document.head.appendChild(node);
      return node;
    });
    return () => nodes.forEach(node => node.remove());
  }, []);
  useEffect(() => {
    const stored = JSON.parse(signature);
    if (!stored.length) {
      setData({
        avisos: [],
        solicitudes: []
      });
      setError('');
      return;
    }
    const controller = new AbortController();
    setError('');
    setData(null);
    avisosRequest('/api/mi-actividad', {
      method: 'POST',
      body: {
        avisos: stored.filter(item => item.kind === 'aviso').map(item => item.token),
        solicitudes: stored.filter(item => item.kind === 'solicitud').map(item => item.token)
      },
      signal: controller.signal
    }).then(value => {
      if (!controller.signal.aborted) setData(value);
    }).catch(e => {
      if (e.name !== 'AbortError') setError(e.message);
    });
    return () => controller.abort();
  }, [signature, version]);
  async function add(event) {
    event.preventDefault();
    if (busy) return;
    setMessage('');
    const parsed = parseActivityLink(link);
    if (!parsed) {
      setMessage('Pegá un enlace privado de gestión o de seguimiento de este sitio.');
      return;
    }
    setBusy(true);
    try {
      const item = await avisosRequest(parsed.kind === 'aviso' ? '/api/avisos/gestion/' + parsed.token : '/api/seguimiento/' + parsed.token);
      if (!rememberActivity(link, parsed.kind === 'aviso' ? noticeTitle(item) : 'Solicitud para ' + item.animal.nombre)) throw new Error('No se pudo guardar el acceso. La lista admite hasta 50 elementos y requiere almacenamiento del navegador.');
      setLink('');
      setMessage('Acceso privado agregado a tu actividad.');
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  function remove(item) {
    if (forgetActivity(item.kind, item.token)) {
      setRemoved(item);
      setMessage('Se quitó el acceso de este navegador. El aviso o la solicitud no se eliminaron.');
    } else setMessage('El navegador no permitió quitar el acceso.');
  }
  function undo() {
    if (removed && rememberActivity(activityLink(removed.kind, removed.token), removed.title)) {
      setRemoved(null);
      setMessage('Acceso restaurado.');
    }
  }
  const grouped = {
    aviso: entries.filter(item => item.kind === 'aviso'),
    solicitud: entries.filter(item => item.kind === 'solicitud')
  };
  const visible = entries.filter(item => tab === 'todo' || item.kind === tab);
  function details(entry) {
    const index = grouped[entry.kind].findIndex(item => item.token === entry.token);
    return (entry.kind === 'aviso' ? data?.avisos : data?.solicitudes)?.find(item => item.indice === index);
  }
  return <main className="mx-auto min-h-[70vh] max-w-5xl px-5 py-9 sm:py-12"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-semibold text-green-700">Tu espacio privado</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">Mis avisos y solicitudes</h1></div><button onClick={() => setVersion(value => value + 1)} disabled={!entries.length || !data && !error} className="inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold disabled:opacity-40"><RefreshCw size={17} />Actualizar</button></div><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">Acá se reúnen los accesos privados que guardaste en este navegador. No necesitás crear una cuenta. Para continuar en otro dispositivo, abrí allí tu enlace privado o agregalo abajo.</p>
    <div className="my-6 flex flex-wrap gap-2">{[['todo', 'Todo'], ['aviso', 'Mis avisos'], ['solicitud', 'Mis solicitudes']].map(([value, label]) => <button key={value} onClick={() => setTab(value)} aria-pressed={tab === value} className={`min-h-11 rounded-full border px-4 py-2 text-sm font-semibold ${tab === value ? 'border-green-700 bg-green-700 text-white' : 'bg-white text-slate-600'}`}>{label}</button>)}</div>
    {error ? <p role="alert" className="rounded-xl bg-red-50 p-5 text-red-800">{error}<button onClick={() => setVersion(value => value + 1)} className="ml-3 underline">Reintentar</button></p> : !data ? <p role="status" className="flex items-center justify-center gap-3 py-12"><LoaderCircle size={20} className="animate-spin" />Consultando tu actividad...</p> : !visible.length ? <div className="rounded-2xl border border-dashed p-8 text-center"><ClipboardList className="mx-auto mb-4 text-green-700" size={30} /><h2 className="text-xl font-bold">Todavía no hay accesos guardados en esta sección</h2><p className="mt-3 text-sm leading-6 text-slate-500">Los nuevos avisos y solicitudes se guardan acá automáticamente cuando usás este navegador. Si ya tenés un enlace privado, agregalo abajo.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><Link to="/avisos/nuevo" className="rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white">Publicar un aviso</Link><Link to="/adoptar" className="rounded-xl border px-4 py-3 text-sm font-semibold text-green-700">Conocer animales en adopción</Link></div></div> : <ul className="grid gap-5 md:grid-cols-2">{visible.map(entry => {
        const item = details(entry),
          notice = entry.kind === 'aviso',
          title = item ? notice ? noticeTitle(item) : 'Solicitud para ' + item.animal.nombre : entry.title || 'Acceso privado';
        return <li key={entry.kind + entry.token} className="overflow-hidden rounded-2xl border bg-white"><div className="flex gap-4 p-5">{item && <img src={animalImage(notice ? {
              imageUrl: item.imagen
            } : item.animal)} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />}<div className="min-w-0"><p className="text-xs font-semibold text-slate-500">{notice ? 'Aviso · ' + (item?.categoria === 'perdido' ? 'Mascota perdida' : 'Animal encontrado') : 'Adopción'}</p><h2 className="mt-1 text-lg font-bold text-slate-900">{title}</h2>{item ? <><p className="mt-2 text-sm font-semibold text-green-800">{notice ? item.estadoCaso === 'abierto' ? reviewLabels[item.estadoRevision] : caseLabels[item.estadoCaso] : statusLabel[item.estado]}</p>{notice && <p className="mt-2 text-sm text-slate-500">{item.localidad} · {item.mensajes} {item.mensajes === 1 ? 'mensaje recibido' : 'mensajes recibidos'}</p>}{notice && new Date(item.expiraPublicacion) <= new Date() && <p className="mt-2 text-xs text-amber-800">El aviso venció y ya no aparece públicamente.</p>}</> : <p className="mt-2 text-sm text-amber-800">Este enlace venció o ya no está disponible.</p>}</div></div><div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4">{item && <Link to={activityLink(entry.kind, entry.token)} className="rounded-xl bg-green-700 px-4 py-2.5 text-sm font-bold text-white">{notice ? 'Ver mensajes y gestionar' : 'Ver seguimiento'}</Link>}<button onClick={() => remove(entry)} className="min-h-11 text-xs text-slate-500 underline">Quitar de esta lista</button></div></li>;
      })}</ul>}
    {message && <p role="status" className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-900">{message}{removed && <button onClick={undo} className="ml-3 font-bold underline">Deshacer</button>}</p>}
    <form onSubmit={add} className="mt-8 space-y-4 rounded-2xl border bg-slate-50 p-5"><h2 className="text-lg font-bold">¿Ya tenés un aviso o una solicitud?</h2><label className="block text-sm text-slate-600">Pegá el enlace privado que recibiste por correo o guardaste al finalizar<input required type="url" value={link} onChange={event => setLink(event.target.value)} placeholder="Enlace privado de este sitio" autoComplete="off" className="mt-2 w-full rounded-xl border bg-white p-3 text-base" /></label><button disabled={busy} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-green-700 bg-white px-4 py-3 text-sm font-bold text-green-800 disabled:opacity-50"><Plus size={18} />{busy ? 'Comprobando enlace...' : 'Agregar a mi actividad'}</button><p className="text-xs leading-5 text-slate-500">Los enlaces son privados. No publiques esta lista ni compartas tus accesos. Borrar los datos del navegador también borra esta lista; tus avisos siguen guardados en el servidor.</p></form>
  </main>;
}
