export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
export function animalImage(animal) {
  const image = animal?.imageUrl || animal?.imagen;
  if (!image) return '/patitas.png';
  if (/^https?:\/\//.test(image)) return image;
  return `${API_URL}${image.startsWith('/') ? image : `/uploads/${image}`}`;
}
export const shareAnimalUrl = id => `${API_URL}/compartir/animales/${id}`;
export const statusLabel = {
  pendiente: 'Solicitud recibida',
  en_contacto: 'En contacto',
  encuentro: 'Encuentro en preparación',
  aprobada: 'Solicitud aprobada',
  rechazada: 'Proceso finalizado',
  adopcion_concretada: 'Adopción concretada'
};
export function readFavorites() {
  try {
    const value = JSON.parse(localStorage.getItem('patitas-favoritos') || '[]');
    return Array.isArray(value) ? value.filter(id => Number.isSafeInteger(id) && id > 0).slice(0, 100) : [];
  } catch {
    return [];
  }
}
