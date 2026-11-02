import { rememberActivity } from '../lib/activity';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { avisosRequest, caseLabels, noticeTitle } from '../service/avisos';
export default function GestionAviso() {
  const {
      token
    } = useParams(),
    [aviso, setAviso] = useState(null),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [version, setVersion] = useState(0);
  useEffect(() => {
    const nodes = [['robots', 'noindex, nofollow'], ['referrer', 'no-referrer']].map(([name, content]) => {
      const meta = document.createElement('meta');
      meta.name = name;
      meta.content = content;
      document.head.appendChild(meta);
      return meta;
    });
    return () => nodes.forEach(node => node.remove());
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setError('');
    avisosRequest('/api/avisos/gestion/' + token, {
      signal: controller.signal
    }).then(data => {
      if (!controller.signal.aborted) {
        rememberActivity('/avisos/gestion/' + token, noticeTitle(data));
        setAviso(data);
      }
    }).catch(e => {
      if (e.name !== 'AbortError') setError(e.message);
    });
    return () => controller.abort();
  }, [token, version]);
  async function close(event) {
    event.preventDefault();
    if (busy) return;
    const estadoCaso = new FormData(event.currentTarget).get('estadoCaso');
    setBusy(true);
    setError('');
    try {
      await avisosRequest('/api/avisos/gestion/' + token, {
        method: 'PATCH',
        body: {
          estadoCaso
        }
      });
      setVersion(v => v + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return <main className="mx-auto min-h-[65vh] max-w-3xl px-5 py-9"><p className="font-semibold text-green-700">Acceso privado</p><h1 className="mt-2 text-3xl font-black">{aviso?.categoria === 'perdido' ? 'Tu aviso de mascota perdida' : 'Tu aviso de un animal encontrado'}</h1><Link to="/mi-actividad" className="mt-4 inline-block text-sm font-semibold text-green-700 underline">Mis avisos y solicitudes</Link><p className="mt-4 text-sm leading-6 text-slate-500">Guardá este enlace y no lo compartas. Desde acá podés leer mensajes y avisar cuando el caso se resuelva.</p>{error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}{!aviso && !error ? <p role="status" className="mt-7">Cargando tu aviso...</p> : aviso && <><section className="mt-7 space-y-4 rounded-2xl border p-5"><p className="font-bold">{aviso.localidad} · {aviso.zona}</p><p>Revisión: <strong>{{
              pendiente: 'Pendiente de revisión',
              publicado: 'Publicado',
              rechazado: 'No publicado'
            }[aviso.estadoRevision]}</strong></p><p>Situación: {caseLabels[aviso.estadoCaso]}</p>{aviso.motivoModeracion && <p className="rounded-xl bg-orange-50 p-4 text-sm">Mensaje del equipo: {aviso.motivoModeracion}</p>}<p className="text-sm text-slate-500">El aviso deja de mostrarse públicamente el {new Date(aviso.expiraPublicacion).toLocaleDateString('es-AR')}.</p>{aviso.estadoRevision === 'publicado' && aviso.estadoCaso !== 'cerrado' && new Date(aviso.expiraPublicacion) > new Date() && <Link to={`/avisos/${aviso.id}`} className="inline-block font-semibold text-green-700 underline">Ver aviso público</Link>}{aviso.estadoCaso === 'abierto' && <form onSubmit={close} className="space-y-3 border-t pt-5"><label className="block font-semibold">¿Se resolvió el caso?<select name="estadoCaso" className="mt-2 w-full rounded-xl border bg-white p-3 text-base"><option value="reunido">Volvió con su familia</option><option value="rescatado">Ya recibió ayuda o fue rescatado</option><option value="cerrado">Quiero cerrar o retirar el aviso</option></select></label><button disabled={busy} className="min-h-12 rounded-xl bg-green-700 px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? 'Actualizando...' : 'Cerrar el caso'}</button><p className="text-xs text-slate-500">Al cerrar el caso deja de recibir mensajes. Si necesitás publicar otra situación, creá un nuevo aviso.</p></form>}</section><section className="mt-7"><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl font-bold">Mensajes privados</h2><button onClick={() => setVersion(v => v + 1)} className="min-h-11 rounded-xl border px-4 py-2">Actualizar</button></div>{!aviso.mensajes.length ? <p className="mt-5 rounded-xl bg-slate-50 p-5">Todavía no recibiste mensajes.</p> : <ul className="mt-5 space-y-4">{aviso.mensajes.map(mensaje => <li key={mensaje.id} className="space-y-3 rounded-2xl border p-5"><p className="font-bold">{mensaje.nombre}</p><p className="whitespace-pre-line leading-7">{mensaje.mensaje}</p><a href={`mailto:${encodeURIComponent(mensaje.email)}`} className="inline-block break-all font-semibold text-green-700 underline">Responder a {mensaje.email}</a><p className="text-xs text-slate-500">{new Date(mensaje.fechaCreacion).toLocaleString('es-AR')}</p></li>)}</ul>}</section></>}</main>;
}
