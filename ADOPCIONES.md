# Adopciones: mejoras locales

Rama: `feature/adopciones-completas`. No se hizo push ni deploy.

En esta PC quedó disponible la versión nueva en `http://localhost:5178`, conectada al backend del puerto 5001. Para volver a levantarla: `npm run dev:local` en este proyecto y `npm run start:local` en `patitas-glew-api`. Los ajustes están en archivos `.env.local` ignorados por Git. La versión anterior del puerto 5000 y el proyecto que ocupa el 5173 no se cerraron.

```powershell
npm install
npm run dev
```

En `.env` configurar `VITE_API_URL=http://localhost:5000`. Para producción usar el origen público del backend y volver a compilar. Las variables `VITE_` son públicas: no cargar contraseñas ni secretos.

Recorridos principales:

- `/adoptar`: filtros, resultados paginados y acceso a cada ficha.
- `/favoritos`: animales guardados en este navegador.
- `/adoptar/:id`: ficha, solicitud real, galería, video, convivencia, compartir y cartel PNG con QR.
- `/mi-solicitud/:token`: seguimiento privado del proceso.
- `/historias`: adopciones que sus organizaciones autorizaron publicar.
- `/organizaciones/:id`: perfil público y contacto para adoptar, colaborar o ofrecer tránsito.
- `/necesidades`: necesidades reales, sin importes ni casos de demostración.
- `/admin/comunidad`: perfil de la organización o moderación para superadministradores.
- `/admin/animales/nuevo` y edición: información ampliada y galería. Las necesidades se gestionan desde la edición.

Antes de usar estas pantallas se debe actualizar el backend y aplicar su migración. Las instrucciones completas de variables, moderadores, correo y almacenamiento persistente están en `../patitas-glew-api/ADOPCIONES.md`.

Los filtros por edad y convivencia requieren completar esos datos en los animales existentes. Ninguna organización existente se marcó automáticamente como verificada. No se enviaron correos reales durante las pruebas.

La sección **Encontrados** agrega `/avisos`, `/avisos/nuevo`, `/avisos/:id` y `/avisos/gestion/:token`. Permite publicar desde cámara o galería, con zona aproximada, revisión previa y contacto privado. El panel `/admin/avisos` requiere una cuenta superadministradora. No convierte hallazgos en publicaciones de adopción.

El inicio muestra los tres avisos públicos más recientes en el bloque “Animales encontrados”, debajo de la presentación principal. Comparte las reglas de visibilidad de `/avisos`: no muestra pendientes, rechazados, retirados ni vencidos. Se actualiza al volver a la pestaña y cada 30 segundos mientras esté visible. Sin aprobados, explica que los avisos nuevos requieren revisión.

También se debe aplicar la migración `20261102010000_found_animals` en el backend. Ya se aplicó en la base local. El comando `npm run production:check` del backend muestra lo que falta configurar antes de publicar.

Ahora también se pueden publicar mascotas perdidas desde `/avisos/nuevo?categoria=perdido`, con nombre, foto, última fecha/zona y características. La sección “Perdidos y encontrados” permite filtrar ambos tipos de aviso. El botón “Creo que lo vi” lleva al formulario de contacto privado. Requiere aplicar la migración `20261102020000_lost_pets`, ya aplicada en la base local.

“Mis avisos y solicitudes” está en Comunidad y en `/mi-actividad`. Guarda hasta 50 accesos privados en este navegador, permite consultar estados y mensajes, importar enlaces anteriores y quitar un acceso con opción de deshacer. No elimina el aviso del servidor ni requiere registro. Los datos no se sincronizan automáticamente entre dispositivos: allí hay que abrir o importar el enlace privado. Los avisos anteriores se incorporan de esa misma forma.

```powershell
npm run lint
npm run build -- --configLoader runner
```
