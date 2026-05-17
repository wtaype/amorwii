"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Mensaje } from "@/components/Mensaje";
import { mdAHtml } from "../../_lib/conversorMd";
import "../../nuevo/nuevo.css"; // Reutilizamos los mismos estilos

export default function EditarPostPage() {
  const router = useRouter();
  const { slug: currentSlug } = useParams();
  const [cargando, setCargando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [vista, setVista] = useState<"edit" | "prev">("edit");
  
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

  // Cargar datos actuales del post
  useEffect(() => {
    async function cargarPost() {
      const { data, error } = await supabase
        .from("blog")
        .select("*")
        .eq("slug", currentSlug)
        .single();

      if (error || !data) {
        Mensaje("No se pudo cargar el post", "error");
        router.push("/blog");
        return;
      }

      setForm({
        titulo: data.titulo,
        slug: data.slug,
        resumen: data.resumen || "",
        keywords: data.keywords || "",
        contenidoMd: data.contenidoMd || "",
        categoria: data.categoria || "",
        imagen: data.imagen || "",
        imagenTop: data.imagenTop || "",
        activo: data.activo,
        pin: data.pin
      });
      setTags(data.tags || []);
      setCargandoDatos(false);
    }
    cargarPost();
  }, [currentSlug, router]);

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm(p => ({ ...p, [id.replace("nu_", "")]: val }));
  };

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

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cargando) return;

    setCargando(true);
    try {
      const html = mdAHtml(form.contenidoMd);
      
      const { error } = await supabase
        .from("blog")
        .update({
          ...form,
          contenido: html,
          tags,
          actualizado: new Date().toISOString()
        })
        .eq("slug", currentSlug);

      if (error) throw error;

      Mensaje("¡Historia actualizada! 🐾✨", "success");
      router.push(`/blog/${form.slug}`);
      router.refresh();
      
    } catch (err: any) {
      Mensaje(err.message || "Error al guardar", "error");
    } finally {
      setCargando(false);
    }
  };

  const borrar = async () => {
    if (!confirm("¿Seguro que quieres eliminar esta historia? Esta acción no se puede deshacer. 🐾")) return;
    
    setCargando(true);
    try {
      const { error } = await supabase
        .from("blog")
        .delete()
        .eq("slug", currentSlug);

      if (error) throw error;

      Mensaje("Historia eliminada correctamente", "success");
      router.push("/blog");
      router.refresh();
    } catch (err: any) {
      Mensaje(err.message || "Error al eliminar", "error");
    } finally {
      setCargando(false);
    }
  };

  if (cargandoDatos) return <div className="nu_err dpvc"><i className="fa-solid fa-spinner fa-spin"></i><p>Cargando historia...</p></div>;

  return (
    <div className="nu_wrap">
      <div className="nu_head">
        <div className="nu_head_left">
          <h1><i className="fa-solid fa-pen"></i> Editar historia</h1>
          <p>Mejora tu contenido para la comunidad</p>
        </div>
        <div className="nu_head_right">
          <button type="button" onClick={borrar} className="nu_btn_outline" disabled={cargando} style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>
            <i className="fa-solid fa-trash"></i> Eliminar
          </button>
          <button type="submit" form="nu_form" className="nu_btn_submit" disabled={cargando}>
            <i className={`fa-solid ${cargando ? "fa-spinner fa-spin" : "fa-save"}`}></i>
            {cargando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>

      <form id="nu_form" onSubmit={guardar} className="nu_layout">
        <div className="nu_left">
          <div className="nu_card">
            <div className="nu_card_title"><i className="fa-solid fa-heading"></i> Título y Enlace</div>
            <input id="nu_titulo" type="text" className="nu_titulo_inp" value={form.titulo} onChange={change} required />
            <div className="nu_slug_box">
              <span className="nu_slug_label"><i className="fa-solid fa-link"></i> amorwii.com/blog/</span>
              <input id="nu_slug" type="text" value={form.slug} readOnly />
            </div>
          </div>

          <div className="nu_grid_seo">
            <div className="nu_card">
              <div className="nu_card_title"><i className="fa-solid fa-align-left"></i> Resumen (SEO)</div>
              <textarea id="nu_resumen" value={form.resumen} onChange={change} rows={3} maxLength={160} required />
              <div className="nu_counter">{form.resumen.length}/160</div>
            </div>
            <div className="nu_card">
              <div className="nu_card_title"><i className="fa-solid fa-search"></i> Keywords</div>
              <textarea id="nu_keywords" value={form.keywords} onChange={change} rows={3} />
            </div>
          </div>

          <div className="nu_card nu_card_editor">
            <div className="nu_card_title_row">
              <span><i className="fa-solid fa-code"></i> Contenido Markdown</span>
              <div className="nu_editor_tabs">
                <button type="button" className={`nu_tab ${vista === "edit" ? "active" : ""}`} onClick={() => setVista("edit")}>Editor</button>
                <button type="button" className={`nu_tab ${vista === "prev" ? "active" : ""}`} onClick={() => setVista("prev")}>Vista Previa</button>
              </div>
            </div>
            
            {vista === "edit" ? (
              <textarea id="nu_contenidoMd" className="nu_code" value={form.contenidoMd} onChange={change} rows={15} required />
            ) : (
              <div className="nu_html_prev po_contenido" dangerouslySetInnerHTML={{ __html: mdAHtml(form.contenidoMd) }} />
            )}
          </div>
        </div>

        <div className="nu_right">
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

          <div className="nu_card">
            <div className="nu_card_title"><i className="fa-solid fa-folder"></i> Categoría</div>
            <input id="nu_categoria" type="text" value={form.categoria} onChange={change} required />
          </div>

          <div className="nu_card">
            <div className="nu_card_title"><i className="fa-solid fa-tags"></i> Tags</div>
            <input type="text" value={tagInp} onChange={(e) => setTagInp(e.target.value)} onKeyDown={addTag} placeholder="Presiona coma..." />
            <div className="nu_tags_box">
              {tags.map((t, i) => (
                <span key={i} className="nu_tag_chip">
                  #{t} <i className="fa-solid fa-xmark nu_tag_rm" onClick={() => removeTag(i)}></i>
                </span>
              ))}
            </div>
          </div>

          <div className="nu_card">
            <div className="nu_card_title"><i className="fa-solid fa-image"></i> Imágenes (URLs)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5vh" }}>
              <input id="nu_imagen" type="url" value={form.imagen} onChange={change} required />
              <input id="nu_imagenTop" type="url" value={form.imagenTop} onChange={change} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
