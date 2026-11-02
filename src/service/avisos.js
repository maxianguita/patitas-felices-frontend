import { API_URL } from '../lib/adoption';
export function noticeTitle(aviso,detail=false){
  if(aviso.categoria==='perdido')return 'Buscamos a '+(aviso.nombreAnimal||'esta mascota');
  const animal=aviso.tipo==='perro'?'Perro':'Gato';
  return detail?animal+' encontrado en '+aviso.localidad:animal+(aviso.situacion==='visto'?' visto en la calle':' resguardado');
}
export async function avisosRequest(path, {
  method = 'GET',
  body,
  signal
} = {}) {
  const controller = new AbortController(),
    timeout = setTimeout(() => controller.abort(), 25000);
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, {
    once: true
  });
  try {
    if (signal?.aborted) controller.abort();
    const response = await fetch(API_URL + path, {
      method,
      signal: controller.signal,
      referrerPolicy: 'no-referrer',
      cache: 'no-store',
      headers: body && !(body instanceof FormData) ? {
        'Content-Type': 'application/json'
      } : {},
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'No pudimos procesar el pedido.');
    return data;
  } catch (error) {
    if (error.name === 'AbortError' && !signal?.aborted) throw new Error('El servidor demoró demasiado. Revisá tu conexión e intentá nuevamente.');
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}
export const caseLabels = {
  abierto: 'Buscamos ayuda',
  reunido: 'Volvió con su familia',
  rescatado: 'Ya recibió ayuda',
  cerrado: 'Aviso cerrado'
};
export async function preparePhoto(file) {
  if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 25 * 1024 * 1024) throw new Error('Elegí una foto JPG, PNG o WEBP de hasta 25 MB.');
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('No pudimos leer esa foto. Probá con otra.'));
      img.src = url;
    });
    const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    if (!blob || blob.size > 5 * 1024 * 1024) throw new Error('La foto es demasiado grande. Probá con otra.');
    return new File([blob], 'animal-encontrado.jpg', {
      type: 'image/jpeg'
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
