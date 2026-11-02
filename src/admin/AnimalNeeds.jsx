import { useEffect, useState } from 'react';
import api from '../service/api';
export default function AnimalNeeds({
  animalId
}) {
  const [items, setItems] = useState([]),
    [description, setDescription] = useState(''),
    [amount, setAmount] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    api.get(`/api/admin/animales/${animalId}`).then(({
      data
    }) => {
      if (active) setItems(data.necesidades || []);
    }).catch(e => {
      if (active) setError(e.message);
    }).finally(() => {
      if (active) setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [animalId]);
  async function add() {
    setError('');
    if (!description.trim()) {
      setError('Describí qué necesita el animal.');
      return;
    }
    setBusy(true);
    try {
      const {
        data
      } = await api.post(`/api/admin/animales/${animalId}/necesidades`, {
        descripcion: description,
        montoNecesario: amount
      });
      setItems(previous => [...previous, data]);
      setDescription('');
      setAmount('');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function complete(item) {
    setBusy(true);
    setError('');
    try {
      const {
        data
      } = await api.patch(`/api/admin/necesidades/${item.id}`, {
        completada: !item.completada
      });
      setItems(previous => previous.map(value => value.id === item.id ? data : value));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return <section className="mt-7 space-y-4 rounded-2xl border bg-white p-6"><h2 className="text-xl font-bold">Necesidades de este animal</h2><p className="text-sm text-slate-500">Informá pedidos reales. El monto es un objetivo, no una recaudación comprobada. Las personas coordinan la colaboración con tu organización.</p>{error && <p role="alert" className="text-red-700">{error}</p>}{!loaded ? <p>Cargando necesidades...</p> : <ul className="space-y-3">{items.map(item => <li key={item.id} className="rounded-xl bg-slate-50 p-4"><p>{item.descripcion}</p><button disabled={busy} type="button" onClick={() => complete(item)} className="mt-2 text-sm text-green-700 underline">{item.completada ? 'Cubierta · Volver a publicar' : 'Marcar como cubierta'}</button></li>)}</ul>}<label className="block text-sm font-semibold">Nuevo pedido<textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={2000} rows={3} className="mt-2 w-full rounded-xl border p-3" /></label><label className="block text-sm font-semibold">Objetivo en pesos (opcional)<input type="number" min={1} step={1} max={2147483647} value={amount} onChange={e => setAmount(e.target.value)} className="mt-2 w-full rounded-xl border p-3" /></label><button type="button" disabled={busy} onClick={add} className="rounded-xl border px-4 py-2 disabled:opacity-50">{busy ? 'Guardando...' : 'Publicar necesidad'}</button></section>;
}
