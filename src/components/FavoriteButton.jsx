import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { readFavorites } from '../lib/adoption';
export default function FavoriteButton({
  id
}) {
  const [saved, setSaved] = useState(() => readFavorites().includes(id));
  const [error, setError] = useState('');
  useEffect(() => {
    const sync = () => setSaved(readFavorites().includes(id));
    window.addEventListener('storage', sync);
    window.addEventListener('patitas-favorites', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('patitas-favorites', sync);
    };
  }, [id]);
  function toggle() {
    const current = readFavorites();
    if (!current.includes(id) && current.length >= 100) {
      setError('Podés guardar hasta 100 favoritos.');
      return;
    }
    try {
      localStorage.setItem('patitas-favoritos', JSON.stringify(current.includes(id) ? current.filter(value => value !== id) : [...current, id]));
      setError('');
      window.dispatchEvent(new Event('patitas-favorites'));
    } catch {
      setError('Tu navegador no permitió guardar el favorito.');
    }
  }
  return <span><button type="button" aria-pressed={saved} onClick={toggle} title={saved ? 'Quitar de favoritos' : 'Guardar favorito'} className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-sm text-rose-700"><Heart size={18} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Guardado' : 'Guardar'}</button>{error && <span role="alert" className="block text-xs text-red-700">{error}</span>}</span>;
}
