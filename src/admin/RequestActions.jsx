import { useState } from 'react';
import api from '../service/api';
export default function RequestActions({
  id,
  onUpdated,
  estado
}) {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(''),
    [error, setError] = useState('');
  async function send(action) {
    setBusy(true);
    setMessage('');
    setError('');
    try {
      const {
        data
      } = await (action === 'link' ? api.post(`/api/admin/solicitudes/${id}/seguimiento`, {}) : api.patch(`/api/admin/solicitudes/${id}/estado`, {
        estado: action
      }));
      setMessage(data.message || 'Estado actualizado.');
      if (action !== 'link') await onUpdated?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return <section className="my-5 rounded-xl border bg-white p-5"><h2 className="font-bold">Seguimiento del proceso</h2><div className="mt-3 flex flex-wrap gap-3">{!['rechazada', 'adopcion_concretada'].includes(estado) && <><button disabled={busy} onClick={() => send('en_contacto')} className="rounded-lg border px-3 py-2 text-sm">Marcar en contacto</button><button disabled={busy} onClick={() => send('encuentro')} className="rounded-lg border px-3 py-2 text-sm">Coordinar encuentro</button></>}<button disabled={busy} onClick={() => send('link')} className="rounded-lg border px-3 py-2 text-sm">Enviar enlace privado al solicitante</button></div>{message && <p role="status" className="mt-3 text-sm text-green-800">{message}</p>}{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}</section>;
}
