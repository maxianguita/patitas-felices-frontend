import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL, animalImage } from '../lib/adoption';
import { avisosRequest, caseLabels, noticeTitle } from '../service/avisos';
export default function DetalleAviso() {
  const {
      id
    } = useParams(),
    [aviso, setAviso] = useState(null),
    [error, setError] = useState(''),
    [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false),
    [shared, setShared] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setAviso(null);
    setError('');
    avisosRequest('/api/avisos/' + id, {
      signal: controller.signal
    }).then(setAviso).catch(e => {
      if (e.name !== 'AbortError') setError(e.message);
    });
    return () => controller.abort();
  }, [id]);
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage('');
    const form = event.currentTarget,
      body = Object.fromEntries(new FormData(form));
    body.aceptaContacto = true;
    try {
      const data = await avisosRequest(`/api/avisos/${id}/contacto`, {
        method: 'POST',
        body
      });
      setMessage(data.message);
      form.reset();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function share() {
    const url = API_URL + '/compartir/avisos/' + id;
    try {
      if (navigator.share) await navigator.share({
        title: 'Ayudemos a este animal',
        text: noticeTitle(aviso, true),
        url
      });else {
        await navigator.clipboard.writeText(url);
        setShared('Enlace copiado para compartir.');
      }
    } catch (e) {
      if (e.name !== 'AbortError') setShared('Podés copiar el enlace de esta página para compartir el aviso.');
    }
  }
  return <main className="mx-auto min-h-[65vh] max-w-4xl px-5 py-9"><Link to="/avisos" className="font-semibold text-green-700 underline">Volver a los avisos</Link>{error ? <p role="alert" className="mt-7 rounded-xl bg-red-50 p-5">{error}</p> : !aviso ? <p role="status" className="mt-7">Cargando aviso...</p> : <><div className="mt-6 grid gap-7 md:grid-cols-2"><img src={animalImage({
          imageUrl: aviso.imagen
        })} alt={noticeTitle(aviso)} className="max-h-[560px] w-full rounded-2xl object-contain bg-slate-50" /><section className="space-y-4"><p className="inline-block rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-800">{caseLabels[aviso.estadoCaso]}</p><h1 className="text-3xl font-black">{noticeTitle(aviso, true)}</h1><p className="font-semibold">Zona: {aviso.localidad} · {aviso.zona}</p><p className="text-sm text-slate-500">{aviso.categoria === 'perdido' ? 'Última vez vista el' : 'Visto el'} {new Date(aviso.fechaAvistamiento).toLocaleString('es-AR')}</p><p className="rounded-xl bg-orange-50 p-4 text-sm">{aviso.categoria === 'perdido' ? 'Su familia la está buscando. Si la viste, contá la fecha y la zona por mensaje privado.' : aviso.situacion === 'en_resguardo' ? 'La persona informó que lo tiene resguardado.' : 'La persona informó que lo vio en la calle. La ubicación puede haber cambiado.'}</p><p className="whitespace-pre-line leading-7 text-slate-600">{aviso.descripcion}</p>{(aviso.color || aviso.tamanio || aviso.sexo) && <p className="text-sm text-slate-500">{[aviso.color, {
              pequenio: 'Pequeño',
              mediano: 'Mediano',
              grande: 'Grande'
            }[aviso.tamanio], {
              macho: 'Macho',
              hembra: 'Hembra',
              desconocido: 'Sexo no confirmado'
            }[aviso.sexo]].filter(Boolean).join(' · ')}</p>}<Link to={'/avisos?categoria=' + (aviso.categoria === 'perdido' ? 'encontrado' : 'perdido') + '&localidad=' + encodeURIComponent(aviso.localidad)} className="inline-block text-sm font-semibold text-green-700 underline">{aviso.categoria === 'perdido' ? 'Ver animales encontrados en la zona' : 'Ver mascotas perdidas en la zona'}</Link><button onClick={share} className="min-h-12 rounded-xl border px-5 py-3 font-bold text-green-800">Compartir para ayudar</button>{aviso.categoria === 'perdido' && aviso.estadoCaso === 'abierto' && <a href="#contactar-aviso" className="ml-3 inline-block rounded-xl bg-green-700 px-5 py-3 font-bold text-white">Creo que lo vi</a>}{shared && <p role="status" className="text-sm">{shared}</p>}<p className="text-xs leading-5 text-slate-500">Este es un aviso de la comunidad, no una publicación de adopción. Evitá transferir dinero a desconocidos o acercarte a domicilios privados.</p></section></div>{aviso.estadoCaso === 'abierto' ? <section id="contactar-aviso" className="mt-9 scroll-mt-24 rounded-2xl border p-5 sm:p-7"><h2 className="text-2xl font-bold">{aviso.categoria === 'perdido' ? '¿Lo viste o sabés dónde está?' : '¿Lo reconocés o podés ayudar?'}</h2><p className="my-4 text-sm leading-6 text-slate-600">Dejá un mensaje para quien publicó. Tus datos se comparten solamente con esa persona. Si creés que es tu animal, coordiná en privado cómo demostrarlo.</p><form onSubmit={submit} className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Tu nombre<input required name="nombre" autoComplete="name" maxLength={120} className="mt-2 w-full rounded-xl border p-3 text-base" /></label><label className="text-sm font-semibold">Correo electrónico<input required name="email" type="email" autoComplete="email" maxLength={254} className="mt-2 w-full rounded-xl border p-3 text-base" /></label><label className="text-sm font-semibold sm:col-span-2">Mensaje<textarea required name="mensaje" minLength={10} maxLength={2000} rows={4} className="mt-2 w-full rounded-xl border p-3 text-base" /></label><label className="hidden" aria-hidden="true">Dejar vacío<input name="website" tabIndex={-1} autoComplete="off" /></label><label className="flex gap-3 text-sm leading-6 sm:col-span-2"><input required type="checkbox" className="mt-1 h-5 w-5 shrink-0" />Acepto compartir estos datos con quien publicó para coordinar ayuda.</label><button disabled={busy} className="min-h-12 rounded-xl bg-green-700 px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? 'Guardando mensaje...' : 'Enviar mensaje privado'}</button>{message && <p role="status" className="text-sm sm:col-span-2">{message}</p>}</form></section> : <p className="mt-8 rounded-xl bg-green-50 p-5 text-green-900">Este caso fue cerrado y ya no recibe mensajes. Gracias por ayudar a difundir.</p>}</>}</main>;
}
