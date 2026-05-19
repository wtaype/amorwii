# Plan 2: Mejoras Premium de /crear (Auth y Tabla Detalles)

Este plan detalla las mejoras funcionales y de diseño para la página de creación de sorpresas (`/crear` en `crear.tsx`), potenciando el uso de la tabla `detalles` para usuarios registrados.

---

## 🔒 FASE 1: Validación de Enlaces (Slugs) en Tiempo Real y Robustez del PIN
**Objetivo:** Evitar que el usuario intente enviar el formulario y reciba un error de base de datos debido a enlaces repetidos o datos inválidos.

1. **Validador de Slug con Debounce (500ms):**
   - Implementar un chequeo dinámico de disponibilidad de slug en la base de datos mientras el usuario escribe:
     - Si está autenticado (`isAuth`), consulta en la tabla `detalles`.
     - Si es anónimo, consulta en la tabla `sorpresas`.
   - Mostrar un indicador visual instantáneo bajo el input (por ejemplo: "✨ ¡Enlace disponible!" en verde, o "❌ Este enlace ya está en uso" en rojo).
2. **Validación en caliente del PIN de 4 dígitos:**
   - Si se ingresa un PIN, validar en caliente que contenga exactamente 4 dígitos numéricos antes de habilitar el botón "Generar y Guardar". Muestra un feedback visual de seguridad ("PIN listo 🔒").

---

## 🎵 FASE 2: Interfaz Premium & Reproductor de Audio Integrado
**Objetivo:** Ofrecer una experiencia visual sofisticada e interactiva para los usuarios.

1. **Badge de Plan Activo:**
   - Mostrar en la cabecera del creador un badge dinámico con estilos dorados/degradados premium basados en el plan del usuario recuperado de Supabase:
     - `"Plan: PRO ✨"` o `"Plan: VIP 👑"`.
2. **Previsualizador de Música en Vivo:**
   - Incorporar un elemento `<audio>` oculto en el componente.
   - Al costado de cada opción de música (`Flores Amarillas`, `You Are Somebody`, etc.), añadir un pequeño botón de `Play/Pause`. El usuario podrá escuchar la canción seleccionada de inmediato en la misma pantalla para saber exactamente cómo sonará su sorpresa.
3. **Diseño Glassmorphism Premium:**
   - Aplicar estilos CSS avanzados a las tarjetas del formulario (`cr_sec`), utilizando fondos semitransparentes, desenfoque de fondo (`backdrop-filter: blur()`), bordes finos con degradados y sombras suaves para una apariencia de alta gama.

---

## 🎁 FASE 3: Modal de Éxito, Copiado Inteligente y Código QR
**Objetivo:** Impresionar al usuario final una vez que su sorpresa romántica ha sido guardada con éxito.

1. **Modal de Éxito Premium:**
   - Reemplazar la alerta genérica de JavaScript por un modal emergente animado con efectos de confeti/corazones flotantes que diga: *"¡Tu Sorpresa Romántica está Lista! 🎉"*.
2. **Integración de Código QR Dinámico:**
   - Generar un código QR de la sorpresa en vivo utilizando la API gratuita:
     `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data={URL_SORPRESA}`
   - Mostrar el QR dentro del modal de éxito para que el usuario pueda guardarlo, imprimirlo o escanearlo directamente con su móvil.
3. **Copiado Rápido con Feedback Visual:**
   - Un botón grande de copiado dentro del modal que cambie a "¡Copiado! ✓" con una microanimación.
