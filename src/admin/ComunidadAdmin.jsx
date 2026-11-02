import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../service/api';
export default function ComunidadAdmin() {
  const [org, setOrg] = useState(null),
    [organizations, setOrganizations] = useState(null),
    [error, setError] = useState(''),
    [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    let user;
    try {
      user = JSON.parse(localStorage.getItem('usuario') || 'null');
    } catch {
      user = null;
    }
    const moderation = user?.rol === 'superadmin';
    api.get(moderation ? '/api/admin/organizaciones' : '/api/admin/organizacion').then(({
      data
    }) => {
      if (active) {
        if (moderation) setOrganizations(data);else setOrg(data);
      }
    }).catch(e => {
      if (active) setError(e.message);
    });
    return () => {
      active = false;
    };
  }, []);
  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const {
        data
      } = await api.patch('/api/admin/organizacion', org);
      setOrg(data);
      setMessage('Perfil guardado.');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function moderate(id, estado, verificada) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const {
        data
      } = await api.patch(`/api/admin/organizaciones/${id}`, {
        estado,
        verificada
      });
      setOrganizations(previous => previous.map(item => item.id === id ? {
        ...item,
        ...data
      } : item));
      setMessage('Organización actualizada.');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return <main className="mx-auto min-h-[60vh] max-w-4xl px-5 py-10"><Link to="/admin/animales" className="text-green-700 underline">Volver al panel</Link>{organizations&&<Link to="/admin/avisos" className="ml-5 inline-block rounded-xl border px-4 py-2 font-semibold text-green-700">Revisar avisos encontrados</Link>}<h1 className="mt-4 text-3xl font-black">Organizaciones de la comunidad</h1>{error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}{message && <p role="status" className="mt-5 rounded-xl bg-green-50 p-4 text-green-800">{message}</p>}{!error && !org && !organizations && <p role="status" className="mt-7">Cargando...</p>}{organizations && <><p className="my-6 text-slate-500">Revisá la identidad y los datos de contacto antes de aprobar. La verificación se otorga por separado y no garantiza cada adopción.</p><ul className="space-y-4">{organizations.map(item => <li key={item.id} className="space-y-3 rounded-2xl border p-5"><h2 className="text-xl font-bold">{item.nombre}</h2><p>{item.email} · {item.localidad}</p><p className="text-sm">Estado: {item.estado} {item.verificada ? ' · Verificada' : ''}</p><div className="flex flex-wrap gap-3"><button disabled={busy} onClick={() => moderate(item.id, 'activa', false)} className="rounded-lg border px-3 py-2">Aprobar</button><button disabled={busy} onClick={() => moderate(item.id, 'activa', true)} className="rounded-lg bg-green-700 px-3 py-2 text-white">Aprobar y verificar</button><button disabled={busy} onClick={() => moderate(item.id, 'suspendida', false)} className="rounded-lg border px-3 py-2 text-red-700">Suspender</button></div></li>)}</ul></>}{org && <form onSubmit={save} className="mt-7 space-y-5 rounded-2xl border p-6"><h2 className="text-2xl font-bold">{org.nombre}</h2><p className="text-sm text-slate-500">Este perfil se muestra públicamente. No ingreses domicilios privados de hogares de tránsito.</p>{[['descripcion', 'Sobre la organización'], ['telefono', 'Teléfono público'], ['localidad', 'Localidad'], ['provincia', 'Provincia'], ['instagram', 'Instagram (HTTPS)'], ['facebook', 'Facebook (HTTPS)']].map(([key, label]) => <label key={key} className="block text-sm font-semibold">{label}<input value={org[key] || ''} onChange={e => setOrg(previous => ({
          ...previous,
          [key]: e.target.value
        }))} type={['instagram', 'facebook'].includes(key) ? 'url' : 'text'} maxLength={2000} className="mt-2 w-full rounded-xl border p-3" /></label>)}<fieldset className="space-y-4 border-t pt-5"><legend className="font-bold">Ubicación pública en el mapa</legend><p className="text-sm text-slate-500">Solo activala para una sede que recibe público, con autorización. Podés usar un punto de encuentro público.</p><label className="flex gap-3"><input type="checkbox" checked={org.mostrarUbicacion} onChange={e => setOrg(previous => ({
            ...previous,
            mostrarUbicacion: e.target.checked
          }))} />Autorizo mostrar este punto en el mapa</label><div className="grid gap-4 sm:grid-cols-2">{[['latitud', -90, 90], ['longitud', -180, 180]].map(([key, min, max]) => <label key={key} className="capitalize">{key}<input type="number" step="any" min={min} max={max} value={org[key] ?? ''} required={org.mostrarUbicacion} onChange={e => setOrg(previous => ({
              ...previous,
              [key]: e.target.value
            }))} className="mt-2 w-full rounded-xl border p-3" /></label>)}</div></fieldset><button disabled={busy} className="rounded-xl bg-green-700 px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? 'Guardando...' : 'Guardar perfil'}</button><Link to={`/organizaciones/${org.id}`} className="ml-4 text-green-700 underline">Ver perfil público</Link></form>}</main>;
}
