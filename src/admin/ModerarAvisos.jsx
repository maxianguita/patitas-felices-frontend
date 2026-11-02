import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../service/api';
import { animalImage } from '../lib/adoption';
export default function ModerarAvisos() {
  const [items, setItems] = useState(null),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [filter, setFilter] = useState('pendiente'),
    [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setItems(null);
    setError('');
    api.get('/api/admin/avisos', {
      params: {
        estado: filter
      }
    }).then(({
      data
    }) => {
      if (active) setItems(data);
    }).catch(e => {
      if (active) setError(e.message);
    });
    return () => {
      active = false;
    };
  }, [filter, version]);
  async function moderate(event, item) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget,
      data = Object.fromEntries(new FormData(form));
    data.estadoRevision = event.nativeEvent.submitter.value;
    setBusy(true);
    setError('');
    try {
      await api.patch('/api/admin/avisos/' + item.id, data);
      setVersion(v => v + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return <main className="mx-auto min-h-[65vh] max-w-5xl px-5 py-9"><Link to="/admin/comunidad" className="font-semibold text-green-700 underline">Organizaciones</Link><h1 className="mt-5 text-3xl font-black">Revisar avisos de la comunidad</h1><p className="my-5 rounded-xl bg-amber-50 p-4 text-sm leading-6">Revisá que la foto y el texto no revelen rostros, teléfonos, patentes ni domicilios privados. Podés corregir el texto y dejar una zona aproximada antes de publicar. Un aviso no confirma abandono ni disponibilidad para adoptar.</p><label className="text-sm font-semibold">Mostrar<select value={filter} onChange={e => setFilter(e.target.value)} className="ml-3 rounded-xl border bg-white p-3"><option value="pendiente">Pendientes</option><option value="publicado">Publicados</option><option value="rechazado">Rechazados</option></select></label>{error && <p role="alert" className="my-5 rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}{!items && !error ? <p role="status" className="mt-7">Cargando avisos...</p> : items && !items.length ? <p className="mt-7 rounded-xl border p-6">No hay avisos en esta lista.</p> : items && <ul className="mt-7 space-y-7">{items.map(item => <li key={item.id} className="grid gap-6 rounded-2xl border p-5 md:grid-cols-[230px_1fr]"><div><img src={animalImage({
            imageUrl: item.imagen
          })} alt="Foto enviada para revisión" className="max-h-80 w-full rounded-xl object-contain" /><p className="mt-3 text-sm">{item.categoria==='perdido'?'Mascota perdida: '+item.nombreAnimal:'Animal encontrado'} · {item.tipo} · {item.estadoCaso}</p><p className="mt-3 break-all text-xs text-slate-500">Contacto privado: {item.nombreContacto} · {item.emailContacto}</p></div><form onSubmit={event => moderate(event, item)} className="space-y-4">{item.categoria==='perdido'&&<label className="block text-sm font-semibold">Nombre público de la mascota<input name="nombreAnimal" defaultValue={item.nombreAnimal||''} required maxLength={80} className="mt-2 w-full rounded-xl border p-3"/></label>}<label className="block text-sm font-semibold">Localidad<input name="localidad" defaultValue={item.localidad} required maxLength={120} className="mt-2 w-full rounded-xl border p-3" /></label><label className="block text-sm font-semibold">Zona pública<input name="zona" defaultValue={item.zona} required maxLength={160} className="mt-2 w-full rounded-xl border p-3" /></label><label className="block text-sm font-semibold">Descripción pública<textarea name="descripcion" defaultValue={item.descripcion} required maxLength={2000} rows={4} className="mt-2 w-full rounded-xl border p-3" /></label><label className="block text-sm font-semibold">Observación privada para quien publicó<input name="motivoModeracion" defaultValue={item.motivoModeracion || ''} maxLength={500} className="mt-2 w-full rounded-xl border p-3" /></label><div className="flex flex-wrap gap-3"><button value="publicado" disabled={busy || item.estadoCaso !== 'abierto'} className="rounded-xl bg-green-700 px-5 py-3 font-bold text-white disabled:opacity-40">Aprobar publicación</button><button value="rechazado" disabled={busy} className="rounded-xl border px-5 py-3 font-semibold text-red-800 disabled:opacity-40">Rechazar o retirar</button></div></form></li>)}</ul>}</main>;
}
