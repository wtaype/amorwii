# Plan 1: Optimización de Edición y Creación de Posts del Blog

Este plan detalla las mejoras para la experiencia del creador en el blog (en `nuevo.tsx`) y las sugerencias de SEO para el próximo artículo.

---

## 🛠️ FASE 1: Corrección de Estados de Carga y Redirección de Seguridad
**Objetivo:** Eliminar el bloqueo de pantalla inicial y proteger el acceso al editor de forma elegante.

1. **Evitar el parpadeo del formulario en edición:**
   - En `nuevo.tsx`, inicializar `cargandoDatos` a `true` si existe `editSlug`:
     ```typescript
     const [cargandoDatos, setCargandoDatos] = useState(!!editSlug);
     ```
     Esto evita mostrar el formulario vacío antes de cargar los datos de Supabase.
2. **Redirección si el usuario no está logueado:**
   - Agregar un `useEffect` que verifique si `loading` es `false` y `user` es `null`, redirigiendo al login:
     ```typescript
     useEffect(() => {
         if (!loading && !user) {
             Mensaje("Debes iniciar sesión para publicar historias. ⚠️", "warning");
             router.push("/login?redirect=/nuevo");
         }
     }, [user, loading, router]);
     ```

---

## ⚡ FASE 2: Optimización al Publicar (Evitar bloqueos)
**Objetivo:** Redirigir instantáneamente tras guardar sin que el botón se quede en "Guardando...".

1. **Ejecución asíncrona de revalidación:**
   - Al guardar o editar en `nuevo.tsx`, remover el `await` de la llamada a la API de revalidación. Esto hace que la purga de caché ocurra en segundo plano y redirija inmediatamente:
     ```typescript
     // Sin await para redirección instantánea
     fetch("/api/revalidate?path=/").catch(err => console.warn("Error revalidando:", err));
     ```
2. **Validaciones en Caliente:**
   - Asegurar que el estado `cargando` se limpie correctamente en el bloque `finally` para evitar cualquier bloqueo visual.

---

## ✍️ FASE 3: Sugerencia de Contenido y 5 Títulos SEO (según `seo.md`)
Basado en las pautas y límites estrictos de `seo.md` (Título: 35-47 caracteres, Slug: 11-32 caracteres, Meta Description: 100-150 caracteres, Keywords: 3-5 palabras), proponemos los siguientes temas y títulos optimizados:

1. **Título:** `Cartas de amor: 5 frases para enamorar hoy` *(43 caracteres)*
   - **Slug:** `cartas-de-amor-frases-enamorar`
   - **Keywords:** `cartas de amor, frases para enamorar, detalles romanticos`
2. **Título:** `Mensajes para mi novio: Dedicatorias cortas` *(43 caracteres)*
   - **Slug:** `mensajes-para-mi-novio-cortas`
   - **Keywords:** `mensajes para mi novio, dedicatorias cortas, frases de amor`
3. **Título:** `Cartas románticas: Escribe lo que sientes` *(41 caracteres)*
   - **Slug:** `cartas-romanticas-escribe-sentimientos`
   - **Keywords:** `cartas romanticas, expresar sentimientos, cartas de amor`
4. **Título:** `Detalles de amor: Cómo sorprender a tu pareja` *(45 caracteres)*
   - **Slug:** `detalles-de-amor-sorprender-pareja`
   - **Keywords:** `detalles de amor, sorprender pareja, ideas romanticas`
5. **Título:** `Cartas para mi novio: Expresa tu amor eterno` *(44 caracteres)*
   - **Slug:** `cartas-para-mi-novio-amor-eterno`
   - **Keywords:** `cartas para mi novio, amor eterno, dedicatorias romanticas`
