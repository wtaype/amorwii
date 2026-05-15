import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { linkweb } from "@/smiles/wii";

export type EfectoFlotante = "corazones" | "flores" | "estrellas" | "brillos";

export interface CreatorFormState {
  de: string;
  para: string;
  msg: string;
  efecto: EfectoFlotante;
  fondoId: string;
  musicaUrl: string;
  slug: string;
}

export type SlugStatus = "none" | "checking" | "ok" | "error";

function limpiarSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 32);
}

function crearSlugBase(value: string) {
  return limpiarSlug(value.trim().replace(/\s+/g, "-")).replace(/^-|-$/g, "").slice(0, 18);
}

export function useCreator() {
  const [loading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [origin, setOrigin] = useState(linkweb);
  const [urlCorta, setUrlCorta] = useState("");
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("none");
  
  const [form, setForm] = useState<CreatorFormState>({
    de: "",
    para: "",
    msg: "",
    efecto: "corazones",
    fondoId: "1",
    musicaUrl: "",
    slug: "",
  });

  const autoInProgress = useRef(false);

  useEffect(() => {
    setOrigin(window.location.origin);
    supabase().auth.getUser().then(({ data }) => setIsAuth(!!data.user));
  }, []);

  const setField = <K extends keyof CreatorFormState>(key: K, value: CreatorFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  // Generación en tiempo real del link largo (basado en la URL)
  const urlLarga = useMemo(() => {
    if (!form.para.trim() && !form.msg.trim()) return "";
    // Conservamos la compatibilidad con el sistema actual, asumiendo plantilla 'Amor' por defecto
    let url = `${origin}/?Amor`;
    if (form.para.trim()) url += `&para=${encodeURIComponent(form.para.trim())}`;
    if (form.de.trim()) url += `&de=${encodeURIComponent(form.de.trim())}`;
    if (form.msg.trim()) url += `&msg=${encodeURIComponent(form.msg.trim())}`;
    if (form.musicaUrl.trim()) url += `&musica=${encodeURIComponent(form.musicaUrl.trim())}`;
    
    // Podemos inyectar efecto y fondo como params adicionales
    if (form.efecto !== "corazones") url += `&efecto=${form.efecto}`;
    if (form.fondoId !== "1") url += `&fondo=${form.fondoId}`;
    
    return url;
  }, [form.de, form.msg, form.musicaUrl, form.para, origin, form.efecto, form.fondoId]);

  // Autogenerar slug
  useEffect(() => {
    if (autoInProgress.current || form.slug || form.para.trim().length < 3) return;

    const timer = window.setTimeout(async () => {
      const base = crearSlugBase(form.para);
      if (base.length < 3) return;

      autoInProgress.current = true;
      const hash = Date.now().toString(36).slice(-3);
      const db = supabase();

      for (let i = 0; i < 14; i++) {
        const attempt = i === 0 ? base : i < 6 ? `${base}${i}` : `${base}-${hash}${i}`;
        const { count } = await db.from("mensajes").select("id", { count: "exact", head: true }).eq("slug", attempt);
        if (count === 0) {
          setForm((current) => (current.slug ? current : { ...current, slug: attempt }));
          break;
        }
      }

      autoInProgress.current = false;
    }, 700);

    return () => window.clearTimeout(timer);
  }, [form.para, form.slug]);

  // Validar slug ingresado por usuario
  useEffect(() => {
    if (!form.slug) {
      setSlugStatus("none");
      return;
    }

    const clean = limpiarSlug(form.slug);
    if (clean !== form.slug) {
      setField("slug", clean);
      return;
    }

    if (clean.length < 3) {
      setSlugStatus("none");
      return;
    }

    const timer = window.setTimeout(async () => {
      setSlugStatus("checking");
      try {
        const { count } = await supabase().from("mensajes").select("id", { count: "exact", head: true }).eq("slug", clean);
        setSlugStatus(count === 0 ? "ok" : "error");
      } catch {
        setSlugStatus("none");
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [form.slug]);

  const copiar = async (value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  };

  const guardar = async () => {
    if (!form.para.trim()) {
      alert("Primero escribe el nombre de la persona especial.");
      return;
    }
    if (form.slug && slugStatus === "error") {
      alert("Ese link ya está ocupado. Prueba otro nombre.");
      return;
    }

    setLoading(true);
    try {
      const db = supabase();
      const user = isAuth ? (await db.auth.getUser()).data.user : null;
      const finalSlug = form.slug || `${crearSlugBase(form.para)}-${Date.now().toString(36).slice(-4)}`;
      
      const payload = {
        slug: finalSlug,
        plantilla: "amor", // base compatibility
        nombre: "Amor", // base compatibility
        para: form.para.trim(),
        de: form.de.trim(),
        msg: form.msg.trim(),
        musica: form.musicaUrl,
        emoji: "❤️", // base compatibility
        publico: true,
        user_id: user?.id ?? null,
      };

      const { data, error } = await db.from("mensajes").insert(payload as never).select().single();
      if (error) throw error;

      const savedSlug = (data as { slug: string }).slug;
      setUrlCorta(`${origin}/${savedSlug}`);
      setSlugStatus("ok");
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar. Revisa la conexión o intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setField,
    loading,
    isAuth,
    urlLarga,
    urlCorta,
    slugStatus,
    guardar,
    copiar,
    origin
  };
}
