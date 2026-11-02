export default function AnimalFields({
  form,
  setForm
}) {
  const change = event => {
    const {
      name,
      value,
      type,
      checked
    } = event.target;
    setForm(previous => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const inputClass = 'mt-2 w-full rounded-xl border p-3';
  return <section className="space-y-5 rounded-2xl border p-5"><h2 className="text-xl font-bold">Información para una adopción responsable</h2><div className="grid gap-4 sm:grid-cols-2">{[['localidad', 'Localidad'], ['edad', 'Edad para mostrar (ej.: 2 años)'], ['raza', 'Raza o mestizo']].map(([key, label]) => <label key={key} className="text-sm font-semibold">{label}<input name={key} value={form[key] || ''} onChange={change} maxLength={100} className={inputClass} /></label>)}<label className="text-sm font-semibold">Edad aproximada en meses<input type="number" name="edadMeses" value={form.edadMeses ?? ''} min={0} max={600} onChange={change} className={inputClass} /></label>{[['sexo', 'Sexo', [['macho', 'Macho'], ['hembra', 'Hembra']]], ['tamanio', 'Tamaño', [['pequenio', 'Pequeño'], ['mediano', 'Mediano'], ['grande', 'Grande']]]].map(([key, label, options]) => <label key={key} className="text-sm font-semibold">{label}<select name={key} value={form[key] || ''} onChange={change} className={inputClass}><option value="">Sin especificar</option>{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>)}</div>
    {['personalidad', 'estadoSalud', 'requisitos'].map((key, index) => <label key={key} className="block text-sm font-semibold">{['Personalidad', 'Salud y tratamientos pendientes', 'Requisitos para adoptar'][index]}<textarea name={key} value={form[key] || ''} onChange={change} maxLength={5000} rows={3} className={inputClass} /></label>)}
    <fieldset><legend className="mb-3 text-sm font-semibold">Cuidados realizados y confirmados</legend><div className="flex flex-wrap gap-5">{[['vacunado', 'Vacunación'], ['castrado', 'Castración'], ['desparasitado', 'Desparasitación']].map(([key, label]) => <label key={key} className="flex gap-2 text-sm"><input type="checkbox" name={key} checked={!!form[key]} onChange={change} />{label}</label>)}</div><p className="mt-2 text-xs text-slate-500">Si no está confirmado, dejalo sin marcar y aclará los detalles de salud.</p></fieldset>
    <div className="grid gap-4 sm:grid-cols-3">{[['compatibleNinios', 'Con niños'], ['compatiblePerros', 'Con perros'], ['compatibleGatos', 'Con gatos']].map(([key, label]) => <label key={key} className="text-sm font-semibold">{label}<select name={key} value={form[key] || 'sin_evaluar'} onChange={change} className={inputClass}><option value="sin_evaluar">Sin evaluar</option><option value="si">Sí, evaluado</option><option value="no">No recomendado</option></select></label>)}</div>
    <label className="block text-sm font-semibold">Video (YouTube o Vimeo)<input type="url" name="videoUrl" value={form.videoUrl || ''} onChange={change} placeholder="https://..." className={inputClass} /></label>
    <label className="block text-sm font-semibold">Fotos adicionales (hasta 6, JPG/PNG/WEBP, 5 MB cada una)<input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={e => {
        const files = Array.from(e.target.files || []);
        if (files.length + (form.fotosExistentes?.length || 0) > 6 || files.some(file => file.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))) {
          e.target.setCustomValidity('Elegí hasta seis fotos válidas de 5 MB como máximo.');
          e.target.reportValidity();
          return;
        }
        e.target.setCustomValidity('');
        setForm(previous => ({
          ...previous,
          fotosNuevas: files
        }));
      }} className={inputClass} /></label>
    {!!form.fotosExistentes?.length && <ul className="space-y-2">{form.fotosExistentes.map((src, index) => <li key={src} className="flex items-center justify-between gap-3 text-sm"><span>Foto adicional {index + 1}</span><button type="button" onClick={() => setForm(previous => ({
          ...previous,
          fotosExistentes: previous.fotosExistentes.filter(value => value !== src)
        }))} className="text-red-700 underline">Quitar de la galería</button></li>)}</ul>}
    <div className="space-y-3 border-t pt-5"><label className="flex items-start gap-3 text-sm"><input type="checkbox" name="historiaPublica" checked={!!form.historiaPublica} onChange={change} className="mt-1" />Publicar su historia después de la adopción. Confirmo que el texto y las fotos no revelan datos personales sin permiso.</label><textarea name="historiaAdopcion" value={form.historiaAdopcion || ''} onChange={change} maxLength={5000} placeholder="Su nueva vida: contá la historia sin direcciones, teléfonos ni datos privados del adoptante." rows={3} className={inputClass} /></div>
  </section>;
}
