import { useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { animalImage, shareAnimalUrl } from '../lib/adoption';
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}
export default function AnimalExtras({
  animal
}) {
  const qrRef = useRef(null);
  const [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false);
  const shareUrl = shareAnimalUrl(animal.id);
  async function share() {
    try {
      if (navigator.share) await navigator.share({
        title: animal.nombre,
        text: `Conocé la historia de ${animal.nombre}`,
        url: shareUrl
      });else {
        await navigator.clipboard.writeText(shareUrl);
        setMessage('Enlace copiado.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') setMessage('No pudimos compartir. Copiá el enlace de abajo.');
    }
  }
  async function poster() {
    setBusy(true);
    setMessage('');
    let qrUrl;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#f7faf7';
      ctx.fillRect(0, 0, 1080, 1350);
      ctx.fillStyle = '#166534';
      ctx.font = 'bold 46px sans-serif';
      ctx.fillText('PATITAS GLEW', 70, 95);
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText(animal.adoptado ? '¡Una nueva familia!' : 'Busco una familia', 70, 180);
      let photoMissing = false;
      try {
        const photo = await loadImage(animalImage(animal));
        const scale = Math.max(940 / photo.width, 650 / photo.height);
        ctx.save();
        ctx.beginPath();
        ctx.rect(70, 225, 940, 650);
        ctx.clip();
        ctx.drawImage(photo, 70 + (940 - photo.width * scale) / 2, 225 + (650 - photo.height * scale) / 2, photo.width * scale, photo.height * scale);
        ctx.restore();
      } catch {
        photoMissing = true;
        ctx.fillStyle = '#dcfce7';
        ctx.fillRect(70, 225, 940, 650);
        ctx.fillStyle = '#166534';
        ctx.font = 'bold 52px sans-serif';
        ctx.fillText('Conocé mi historia', 160, 540);
      }
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText(animal.nombre.slice(0, 24), 70, 975, 690);
      ctx.fillStyle = '#475569';
      ctx.font = '32px sans-serif';
      ctx.fillText((animal.localidad || animal.organizacion?.localidad || 'Adopción responsable').slice(0, 40), 70, 1040, 690);
      ctx.font = '26px sans-serif';
      ctx.fillText('Escaneá el QR para conocer mi historia', 70, 1120, 680);
      ctx.fillText('Compartir también ayuda.', 70, 1170);
      const svg = qrRef.current.querySelector('svg');
      qrUrl = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], {
        type: 'image/svg+xml;charset=utf-8'
      }));
      const qr = await loadImage(qrUrl);
      ctx.fillStyle = 'white';
      ctx.fillRect(805, 950, 220, 220);
      ctx.drawImage(qr, 820, 965, 190, 190);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `patitas-${animal.id}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      setMessage(photoMissing ? 'Cartel descargado sin foto: el origen de la imagen no permitió exportarla.' : 'Cartel descargado. Podés compartirlo en WhatsApp o Instagram.');
    } catch {
      setMessage('No pudimos generar el cartel. Podés compartir el enlace.');
    } finally {
      if (qrUrl) URL.revokeObjectURL(qrUrl);
      setBusy(false);
    }
  }
  const labels = {
    si: 'Sí, evaluado por su organización',
    no: 'No recomendado',
    sin_evaluar: 'Todavía sin evaluar'
  };
  return <section className="space-y-6 rounded-2xl border bg-white p-5 sm:p-7">
    {!!animal.fotos?.length && <div><h2 className="mb-4 text-xl font-bold">Más sobre {animal.nombre}</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{animal.fotos.map((src, index) => <a href={animalImage({
          imageUrl: src
        })} key={src} target="_blank" rel="noopener noreferrer"><img src={animalImage({
            imageUrl: src
          })} alt={`${animal.nombre}, foto ${index + 2}`} loading="lazy" className="aspect-square w-full rounded-xl object-cover" /></a>)}</div></div>}
    {animal.videoUrl && /^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//.test(animal.videoUrl) && <a href={animal.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-block rounded-xl border px-5 py-3 font-semibold text-green-800">Ver su video</a>}
    <div><h2 className="mb-3 text-xl font-bold">Convivencia</h2><dl className="grid gap-4 text-sm sm:grid-cols-3">{[['compatibleNinios', 'Con niños'], ['compatiblePerros', 'Con perros'], ['compatibleGatos', 'Con gatos']].map(([key, label]) => <div key={key}><dt className="font-semibold">{label}</dt><dd className="mt-1 text-slate-500">{labels[animal[key]] || labels.sin_evaluar}</dd></div>)}</dl><p className="mt-3 text-xs text-slate-500">Cada adaptación es diferente. Coordiná una presentación acompañada por la organización.</p></div>
    {animal.adoptado && animal.historiaAdopcion && <div><h2 className="text-xl font-bold">Su nueva vida</h2><p className="mt-3 whitespace-pre-line text-slate-600">{animal.historiaAdopcion}</p></div>}
    <div className="border-t pt-5"><h2 className="text-xl font-bold">Compartir también cambia vidas</h2><div className="my-4 flex flex-wrap gap-3"><button onClick={share} className="rounded-xl bg-green-700 px-5 py-3 font-bold text-white">Compartir su ficha</button><button disabled={busy} onClick={poster} className="rounded-xl border px-5 py-3 disabled:opacity-50">{busy ? 'Preparando cartel...' : 'Descargar cartel con QR'}</button></div><a href={shareUrl} className="break-all text-xs text-green-700 underline">{shareUrl}</a>{message && <p role="status" className="mt-3 text-sm text-slate-600">{message}</p>}<span ref={qrRef} className="sr-only"><QRCode value={shareUrl} size={190} /></span></div>
  </section>;
}
