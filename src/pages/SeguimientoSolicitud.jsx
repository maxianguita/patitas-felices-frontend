import { rememberActivity } from '../lib/activity';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL, statusLabel } from '../lib/adoption';
export default function SeguimientoSolicitud() {
  const {
    token
  } = useParams();
  const [data, setData] = useState(null),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(true),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    const robot = document.createElement('meta');
    robot.name = 'robots';
    robot.content = 'noindex, nofollow';
    document.head.appendChild(robot);
    const referrer = document.createElement('meta');
    referrer.name = 'referrer';
    referrer.content = 'no-referrer';
    document.head.appendChild(referrer);
    return () => {
      robot.remove();
      referrer.remove();
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    fetch(`${API_URL}/api/seguimiento/${token}`, {
      signal: controller.signal,
      referrerPolicy: 'no-referrer',
      cache: 'no-store'
    }).then(async response => {
      const value = await response.json();
      if (!response.ok) throw new Error(value.message);
      if (!controller.signal.aborted) {
        rememberActivity('/mi-solicitud/' + token, 'Solicitud para ' + value.animal.nombre);
        setData(value);
      }
    }).catch(err => {
      if (err.name !== 'AbortError') setError(err.message);
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [token, retry]);
  return <main className="mx-auto min-h-[60vh] max-w-2xl px-5 py-12"><p className="font-semibold text-green-700">Un paso más cerca de una familia</p><h1 className="mt-2 text-3xl font-black">Tu solicitud de adopción</h1><p className="mt-3 text-slate-500">Este enlace es privado. Guardalo para consultar novedades y no lo publiques.</p>{loading ? <p role="status" className="mt-8">Consultando tu solicitud...</p> : error ? <p role="alert" className="mt-8 rounded-xl bg-red-50 p-5 text-red-800">{error}<button onClick={() => setRetry(v => v + 1)} className="ml-3 underline">Reintentar</button></p> : data && <section className="mt-8 space-y-5 rounded-2xl border p-7"><p className="text-xl font-bold">{data.animal.nombre}</p><p className="rounded-xl bg-green-50 p-4 font-bold text-green-800">{statusLabel[data.estado] || 'En evaluación'}</p><p>Organización responsable: {data.organizacion?.nombre || 'Consultar con Patitas Glew'}</p><p className="text-sm text-slate-500">Última actualización: {new Date(data.fechaActualizacion).toLocaleString('es-AR')}</p><p className="text-sm">La organización coordina la entrevista, el encuentro y los requisitos de adopción. Una solicitud recibida no implica una adopción confirmada.</p>{data.organizacion?.email && <a className="block font-semibold text-green-700 underline" href={`mailto:${data.organizacion.email}`}>Contactar a la organización</a>}<button onClick={() => setRetry(v => v + 1)} className="rounded-xl border px-4 py-2">Actualizar estado</button></section>}<Link to="/mi-actividad" className="mt-5 block text-green-700 underline">Mis avisos y solicitudes</Link><Link to="/adoptar" className="mt-7 inline-block text-green-700 underline">Volver a los animales</Link></main>;
}
