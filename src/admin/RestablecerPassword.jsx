import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { API_URL } from '../lib/adoption';
export default function RestablecerPassword() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState(''),
    [confirm, setConfirm] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [done, setDone] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setError('');
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(`${API_URL}/auth/restablecer-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: params.get('token'),
          nuevaPassword: password
        }),
        referrerPolicy: 'no-referrer'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setDone(true);
      setPassword('');
      setConfirm('');
      window.history.replaceState({}, '', window.location.pathname);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return <main className="mx-auto min-h-[60vh] max-w-md px-5 py-12"><h1 className="text-3xl font-bold">Crear nueva contraseña</h1>{done ? <p role="status" className="mt-6 rounded-xl bg-green-50 p-5">Tu contraseña fue actualizada. <Link to="/admin/login" className="underline">Iniciar sesión</Link></p> : <form onSubmit={submit} className="mt-7 space-y-5"><p className="text-sm text-slate-500">El enlace vence en 30 minutos y solo se puede usar una vez.</p>{error && <p role="alert" className="text-red-700">{error}</p>}<label className="block">Nueva contraseña<input required type="password" autoComplete="new-password" minLength={8} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border p-3" /></label><label className="block">Repetir contraseña<input required type="password" autoComplete="new-password" minLength={8} maxLength={128} value={confirm} onChange={e => setConfirm(e.target.value)} className="mt-2 w-full rounded-xl border p-3" /></label><button disabled={busy || !params.get('token')} className="rounded-xl bg-green-700 px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? 'Guardando...' : 'Guardar contraseña'}</button></form>}</main>;
}
