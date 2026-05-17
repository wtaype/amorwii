"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Mensaje } from "@/components/Mensaje";
import { mdAHtml } from "../_lib/conversorMd";
import "./nuevo.css";

function NuevoPostContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Detectar si estamos en modo edición
  const editSlug = searchParams.get("edit");

  const [cargando, setCargando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [vista, setVista] = useState<"edit" | "prev">("edit");
  
  // Estado del Formulario
  const [form, setForm] = useState({
    titulo: "",
    slug: "",
    resumen: "",
    keywords: "",
    contenidoMd: "",
    categoria: "",
    imagen: "",
    imagenTop: "",
    activo: true,
    pin: false
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInp, setTagInp] = useState("");

  // FASE EDICIÓN: Cargar datos del post existente si ?edit=slug está presente
  useEffect(() => {
    async function cargarPost() {
      if (!editSlug) return;
      setCargandoDatos(true);
      try {
        const { data, error } = await supabase
          .from("blog")
          .select("*")
          .eq("slug", editSlug)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setForm({
            titulo: data.titulo || "",
            slug: data.slug || "",
            resumen: data.resumen || "",
            keywords: data.keywords || "",
            contenidoMd: data.contenidoMd || "",
            categoria: data.categoria || "",
            imagen: data.imagen || "",
            imagenTop: data.imagenTop || "",
            activo: data.activo ?? true,
            pin: data.pin ?? false
          });
          setTags(data.tags || []);
        } else {
          Mensaje("No se encontró la historia para editar", "warning");
        }
      } catch (err: any) {
        console.error("Error al cargar post para edición:", err);
        Mensaje("Error al cargar los datos del post", "error");
      } finally {
        setCargandoDatos(false);
      }
    }
    cargarPost();
  }, [editSlug]);

  // Generar Slug automáticamente desde el título (Solo cuando estamos CREANDO un post nuevo)
  useEffect(() => {
    if (!editSlug && form.titulo) {
      const slug = form.titulo
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "_")
        .slice(0, 50);
      setForm(p => ({ ...p, slug }));
    }
  }, [form.titulo, editSlug]);

  // Manejar cambios en inputs
  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm(p => ({ ...p, [id.replace("nu_", "")]: val }));
  };

  // Manejar Tags
  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const t = tagInp.trim().toLowerCase().replace(/\s+/g, "_");
      if (t && !tags.includes(t) && tags.length < 8) {
        setTags([...tags, t]);
        setTagInp("");
      }
    }
  };

  const removeTag = (index: number) => setTags(tags.filter((_, i) => i !== index));

  // PUBLICAR O GUARDAR CAMBIOS
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cargando) return;
    
    if (!form.titulo || !form.slug || !form.contenidoMd || !form.categoria) {
      Mensaje("Completa los campos obligatorios", "warning");
      return;
    }

    setCargando(true);
    try {
      const html = mdAHtml(form.contenidoMd);
      const { data: { user } } = await supabase.auth.getUser();

      const datosPost = {
        ...form,
        contenido: html,
        tags,
        autor: user?.user_metadata?.nombre || "Admin",
        usuario: user?.id,
        email: user?.email,
        tiempoLectura: `${Math.max(1, Math.ceil(form.contenidoMd.split(/\s+/).length / 200))} min`,
        actualizado: new Date().toISOString()
      };

      if (editSlug) {
        // MODO EDICIÓN: UPDATE
        const { error } = await supabase
          .from("blog")
          .update(datosPost)
          .eq("slug", editSlug);
        
        if (error) throw error;
        Mensaje("¡Historia actualizada con éxito! 🐾✨", "success");
      } else {
        // MODO NUEVO: INSERT
        const { error } = await supabase
          .from("blog")
          .insert({
            ...datosPost,
            creado: new Date().toISOString()
          });
        
        if (error) throw error;
        Mensaje("¡Historia publicada con éxito! 🐾✨", "success");
      }

      // Redireccionar al post limpio en la raíz
      router.push(`/${form.slug}`);
      
    } catch (err: any) {
      Mensaje(err.message || "Error al guardar la historia", "error");
    } finally {
      setCargando(false);
    }
  };

  if (cargandoDatos) {
    return (
      <div className="nu_wrap dpvc" style={{ minHeight: "60vh", gap: "2vh" }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "3rem", color: "var(--mco)" }}></i>
        <h3>Cargando datos de la historia...</h3>
      </div>
    );
  }

  return (
    <div className="nu_wrap">
      <div className="nu_head">
        <div className="nu_head_left">
          <h1>
            <i className={`fa-solid ${editSlug ? "fa-pen-to-square" : "fa-pen-fancy"}`}></i>{" "}
            {editSlug ? "Editar historia" : "Nueva historia"}
          </h1>
          <p>
            {editSlug 
              ? "Modifica tu contenido para que siga inspirando a la comunidad" 
              : "Crea contenido que inspire a la comunidad AmorWii"}
          </p>
        </div>
        <div className="nu_head_right">
          <button type="submit" form="nu_form" className="nu_btn_submit" disabled={cargando}>
            <i className={`fa-solid ${cargando ? "fa-spinner fa-spin" : "fa-paper-plane"}`}></i>
            {cargando ? "Guardando..." : editSlug ? "Guardar cambios" : "Publicar ahora"}
          </button>
        </div>
      </div>

      <form id="nu_form" onSubmit={enviar} className="nu_layout">
        <div className="nu_left">
          {/* Título y Enlace */}
          <div className="nu_card">
            <div className="nu_card_title"><i className="fa-solid fa-heading"></i> Título y Enlace</div>
            <input 
              id="nu_titulo" 
              type="text" 
              className="nu_titulo_inp" 
              placeholder="Escribe un título impactante..." 
              value={form.titulo}
              onChange={change}
              required
            />
            <div className="nu_slug_box">
              <span className="nu_slug_label"><i className="fa-solid fa-link"></i> amorwii.com/</span>
              <input id="nu_slug" type="text" value={form.slug} onChange={change} placeholder="url_amigable" required />
            </div>
          </div>

          {/* SEO Grid */}
          <div className="nu_grid_seo">
            <div className="nu_card">
              <div className="nu_card_title"><i className="fa-solid fa-align-left"></i> Resumen (SEO)</div>
              <textarea id="nu_resumen" value={form.resumen} onChange={change} rows={3} placeholder="Describe brevemente la historia..." maxLength={160} required />
              <div className="nu_counter">{form.resumen.length}/160</div>
            </div>
            <div className="nu_card">
              <div className="nu_card_title"><i className="fa-solid fa-search"></i> Keywords</div>
              <textarea id="nu_keywords" value={form.keywords} onChange={change} rows={3} placeholder="amor, fe, esperanza..." />
            </div>
          </div>

          {/* Editor Markdown */}
          <div className="nu_card nu_card_editor">
            <div className="nu_card_title_row">
              <span><i className="fa-solid fa-code"></i> Contenido Markdown</span>
              <div className="nu_editor_tabs">
                <button type="button" className={`nu_tab ${vista === "edit" ? "active" : ""}`} onClick={() => setVista("edit")}>Editor</button>
                <button type="button" className={`nu_tab ${vista === "prev" ? "active" : ""}`} onClick={() => setVista("prev")}>Vista Previa</button>
              </div>
            </div>
            
            {vista === "edit" ? (
              <textarea 
                id="nu_contenidoMd" 
                className="nu_code" 
                value={form.contenidoMd} 
                onChange={change} 
                rows={15} 
                placeholder="Escribe usando Markdown... ## Título, **Negrita**, [Link](url)" 
                required
              />
            ) : (
              <div className="nu_html_prev po_contenido" dangerouslySetInnerHTML={{ __html: mdAHtml(form.contenidoMd) }} />
            )}
          </div>
        </div>

        <div className="nu_right">
          {/* Publicación */}
          <div className="nu_card nu_card_publish">
            <div className="nu_card_title"><i className="fa-solid fa-rocket"></i> Publicación</div>
            <div className="nu_publish_opts">
              <label className="nu_check_l">
                <input id="nu_activo" type="checkbox" checked={form.activo} onChange={change} />
                <span><i className="fa-solid fa-globe"></i> Público</span>
              </label>
              <label className="nu_check_l">
                <input id="nu_pin" type="checkbox" checked={form.pin} onChange={change} />
                <span><i className="fa-solid fa-thumbtack"></i> Destacar</span>
              </label>
            </div>
          </div>

          {/* Categoría y Tags */}
          <div className="nu_card">
            <div className="nu_card_title"><i className="fa-solid fa-folder"></i> Categoría</div>
            <input id="nu_categoria" type="text" value={form.categoria} onChange={change} placeholder="Ej: Amor, Fe..." required />
          </div>

          <div className="nu_card">
            <div className="nu_card_title"><i className="fa-solid fa-tags"></i> Tags</div>
            <input 
              type="text" 
              value={tagInp} 
              onChange={(e) => setTagInp(e.target.value)} 
              onKeyDown={addTag} 
              placeholder="Presiona coma o enter..." 
            />
            <div className="nu_tags_box">
              {tags.map((t, i) => (
                <span key={i} className="nu_tag_chip">
                  #{t} <i className="fa-solid fa-xmark nu_tag_rm" onClick={() => removeTag(i)}></i>
                </span>
              ))}
            </div>
          </div>

          {/* Imágenes */}
          <div className="nu_card">
            <div className="nu_card_title"><i className="fa-solid fa-image"></i> Imágenes (URLs)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5vh" }}>
              <div>
                <label className="nu_hint">Miniatura (Blog)</label>
                <input id="nu_imagen" type="url" value={form.imagen} onChange={change} placeholder="https://..." required />
              </div>
              <div>
                <label className="nu_hint">Imagen Top (Banner)</label>
                <input id="nu_imagenTop" type="url" value={form.imagenTop} onChange={change} placeholder="https://..." />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function NuevoPostPage() {
  return (
    <Suspense fallback={
      <div className="nu_wrap dpvc" style={{ minHeight: "60vh", gap: "2vh" }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "3rem", color: "var(--mco)" }}></i>
        <h3>Cargando editor inteligente...</h3>
      </div>
    }>
      <NuevoPostContent />
    </Suspense>
  );
}
