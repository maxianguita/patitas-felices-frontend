import { rememberActivity } from '../lib/activity';
import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Camera, ImagePlus, LoaderCircle } from 'lucide-react';
import { avisosRequest, preparePhoto } from '../service/avisos';
const inputClass = 'mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white p-3 text-base';
export default function PublicarAviso() {
  const [params] = useSearchParams();
  const [categoria, setCategoria] = useState(() => params.get('categoria') === 'perdido' ? 'perdido' : 'encontrado');
  const [accessSaved, setAccessSaved] = useState(true);
  const isLost = categoria === 'perdido';
  const [photo, setPhoto] = useState(null),
    [preview, setPreview] = useState(''),
    [preparing, setPreparing] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [result, setResult] = useState(null);
  const photoVersion = useRef(0),
    formRef = useRef(null);
  useEffect(() => {
    if (!photo) {
      setPreview('');
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);
  useEffect(() => () => {
    photoVersion.current++;
  }, []);
  async function choose(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const version = ++photoVersion.current;
    setPreparing(true);
    setPhoto(null);
    setError('');
    try {
      const processed = await preparePhoto(file);
      if (version === photoVersion.current) setPhoto(processed);
    } catch (e) {
      if (version === photoVersion.current) setError(e.message);
    } finally {
      if (version === photoVersion.current) setPreparing(false);
      event.target.value = '';
    }
  }
  async function submit(event) {
    event.preventDefault();
    if (busy || preparing) return;
    setError('');
    if (!photo) {
      setError('Agregá una foto para que puedan reconocer al animal.');
      return;
    }
    setBusy(true);
    try {
      const body = new FormData(event.currentTarget);
      body.delete('fotoCamara');
      body.delete('fotoGaleria');
      body.set('imagen', photo);
      body.set('categoria', categoria);
      body.set('aceptaContacto', 'true');
      body.set('aceptaPublicacion', 'true');
      const date = new Date(body.get('fechaAvistamiento'));
      body.set('fechaAvistamiento', date.toISOString());
      const data = await avisosRequest('/api/avisos', {
        method: 'POST',
        body
      });
      setAccessSaved(rememberActivity(data.gestionUrl, isLost ? 'Buscamos a ' + body.get('nombreAnimal') : 'Aviso de animal encontrado'));
      setResult(data);
      setPhoto(null);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (e) {
      setError(e.message.includes('demoró demasiado') ? 'No pudimos confirmar la respuesta del servidor. El aviso puede haberse guardado: revisá tu correo antes de volver a enviarlo.' : e.message);
    } finally {
      setBusy(false);
    }
  }
  return <main className="mx-auto min-h-[70vh] max-w-2xl px-5 py-9"><Link to="/avisos" className="text-sm font-semibold text-green-700 underline">Volver a los avisos</Link><h1 className="mt-5 text-3xl font-black">{isLost ? 'Perdí a mi mascota' : 'Encontré un animal'}</h1>{result ? <section role="status" className="mt-7 space-y-5 rounded-2xl border border-green-200 bg-green-50 p-6"><h2 className="text-xl font-bold text-green-900">Recibimos tu aviso</h2><p>Está pendiente de revisión. Todavía no aparece públicamente.</p>{accessSaved ? <Link to="/mi-actividad" className="block font-semibold text-green-800 underline">Ver mis avisos y solicitudes</Link> : <p className="text-sm text-amber-900">El navegador no permitió guardar este acceso en tu actividad. Conservá el enlace privado de esta pantalla.</p>}<a href={result.gestionUrl} className="inline-block rounded-xl bg-green-700 px-5 py-3 font-bold text-white">Gestionar mi aviso</a><p className="break-all rounded-xl border bg-white p-3 text-sm">{result.gestionUrl}</p><p className="text-sm">Guardá este enlace privado para ver mensajes y cerrar el caso. No lo compartas.</p>{result.correoEntregado ? <p className="text-sm">También enviamos el enlace al correo que ingresaste.</p> : <p className="text-sm text-amber-900">No se pudo entregar el correo. Guardá el enlace de esta pantalla: es tu acceso al aviso.</p>}</section> : <form ref={formRef} onSubmit={submit} className="mt-6 space-y-6">
      <p className="leading-7 text-slate-600">{isLost ? 'Una foto clara, sus características y la última zona donde la viste pueden ayudar a encontrarla. Tu contacto se mantiene privado.' : 'Una foto clara y una zona de referencia pueden ayudar a que vuelva con su familia. Si lo viste suelto, no supongas que fue abandonado.'}</p>
      <fieldset disabled={busy} className="grid grid-cols-2 gap-3"><legend className="mb-3 text-sm font-semibold">¿Qué querés publicar?</legend>{[['encontrado', 'Encontré un animal'], ['perdido', 'Perdí a mi mascota']].map(([value, label]) => <label key={value} className={inputClass + ' flex cursor-pointer items-center gap-2 ' + (categoria === value ? 'border-green-700 bg-green-50 text-green-800' : '')}><input type="radio" name="categoria" value={value} checked={categoria === value} onChange={() => setCategoria(value)} /><span className="text-sm font-semibold">{label}</span></label>)}</fieldset>
      <fieldset disabled={busy} className="space-y-6 disabled:opacity-60"><legend className="sr-only">Datos del animal y del hallazgo</legend><div className="space-y-4 rounded-2xl border bg-slate-50 p-5"><h2 className="font-bold">1. Agregá una foto</h2><div className="grid grid-cols-2 gap-3"><label className="flex min-h-16 cursor-pointer items-center justify-center gap-2 rounded-xl border bg-white p-3 font-semibold text-green-800"><Camera size={21} />Sacar foto<input name="fotoCamara" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" disabled={preparing} onChange={choose} className="sr-only" /></label><label className="flex min-h-16 cursor-pointer items-center justify-center gap-2 rounded-xl border bg-white p-3 font-semibold text-green-800"><ImagePlus size={21} />Elegir foto<input name="fotoGaleria" type="file" accept="image/jpeg,image/png,image/webp" disabled={preparing} onChange={choose} className="sr-only" /></label></div>{preparing && <p role="status" className="flex items-center gap-2 text-sm"><LoaderCircle className="animate-spin" size={18} />Preparando foto...</p>}{preview && <img src={preview} alt="Foto del animal que vas a publicar" className="max-h-80 w-full rounded-xl object-contain" />}<p className="text-xs leading-5 text-slate-500">La foto se adapta para subirla desde el celular y se eliminan sus metadatos de ubicación. Evitá incluir rostros, patentes o datos personales visibles.</p></div>
      {isLost && <label className="block text-sm font-semibold">Nombre de tu mascota<input name="nombreAnimal" required maxLength={80} placeholder="Ej.: Luna" className={inputClass} /></label>}<div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Animal<select name="tipo" required className={inputClass}><option value="perro">Perro</option><option value="gato">Gato</option></select></label>{isLost ? <input type="hidden" name="situacion" value="perdido" /> : <label className="text-sm font-semibold">Situación<select name="situacion" required className={inputClass}><option value="visto">Lo vi en la calle</option><option value="en_resguardo">Lo tengo resguardado</option></select></label>}<label className="text-sm font-semibold">Localidad<input name="localidad" required maxLength={120} autoComplete="address-level2" placeholder="Ej.: Glew" className={inputClass} /></label><label className="text-sm font-semibold">{isLost ? 'Fecha y hora de la última vez que la viste' : 'Fecha y hora del hallazgo'}<input name="fechaAvistamiento" required type="datetime-local" className={inputClass} /></label></div>
      <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Color o señas particulares<input name="color" maxLength={100} placeholder="Ej.: blanco y negro, mancha en la oreja" className={inputClass} /></label><label className="text-sm font-semibold">Tamaño<select name="tamanio" className={inputClass}><option value="">Sin especificar</option><option value="pequenio">Pequeño</option><option value="mediano">Mediano</option><option value="grande">Grande</option></select></label><label className="text-sm font-semibold">Sexo<select name="sexo" className={inputClass}><option value="">Sin especificar</option><option value="macho">Macho</option><option value="hembra">Hembra</option><option value="desconocido">No lo sé</option></select></label></div>
      <label className="block text-sm font-semibold">Zona pública o calles de referencia<input name="zona" required maxLength={160} placeholder="Ej.: cerca de la plaza, por Av. Espora" className={inputClass} /><span className="mt-2 block text-xs font-normal leading-5 text-slate-500">Indicá una esquina o zona aproximada. No publiques el domicilio donde resguardás al animal.</span></label>
      <label className="block text-sm font-semibold">{isLost ? '¿Cómo es y qué pasó cuando se perdió?' : '¿Cómo es y qué ayuda necesita?'}<textarea name="descripcion" required minLength={15} maxLength={2000} rows={5} placeholder="Color, tamaño, collar, estado general y lo que observaste. Evitá teléfonos y direcciones privadas." className={inputClass} /></label>
      <div className="space-y-4 rounded-2xl border p-5"><h2 className="font-bold">Tus datos de contacto son privados</h2><label className="block text-sm font-semibold">Tu nombre<input name="nombreContacto" autoComplete="name" required maxLength={120} className={inputClass} /></label><label className="block text-sm font-semibold">Correo electrónico<input name="emailContacto" type="email" autoComplete="email" required maxLength={254} className={inputClass} /></label><label className="block text-sm font-semibold">Teléfono (opcional)<input name="telefonoContacto" type="tel" autoComplete="tel" maxLength={40} className={inputClass} /></label><p className="text-xs leading-5 text-slate-500">No mostramos estos datos en el aviso. Las personas pueden dejarte un mensaje y vos decidís cómo responder.</p></div>
      <label className="hidden" aria-hidden="true">Dejar vacío<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" required className="mt-1 h-5 w-5 shrink-0" />Acepto que revisen el aviso y me contacten para coordinar ayuda.</label><label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" required className="mt-1 h-5 w-5 shrink-0" />Autorizo publicar esta foto, descripción y zona. Confirmo que no incluyen datos personales sin permiso.</label>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}<button disabled={busy || preparing || !photo} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-4 font-bold text-white disabled:opacity-50">{busy ? <><LoaderCircle size={20} className="animate-spin" />Enviando aviso...</> : 'Enviar para revisión'}</button></fieldset>
    </form>}</main>;
}
