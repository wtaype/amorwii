"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Mensaje } from "@/components/Mensaje";
import MarkdownPro from "../_components/MarkdownPro";
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
    descripcion: "", // Antes resumen
    keywords: "", // Solo para UI, se guardará en metaSEO
    imgAlt: "", // Solo para UI, se guardará en metaSEO
    contenidoMD: "", // camelCase
    categoria: "",
    imagen: "",
    imagenTop: "",
    activo: true,
    pin: false
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInp, setTagInp] = useState("");

  // Ref para el textarea (para insertar texto en el cursor)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

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
            descripcion: data.descripcion || "",
            keywords: data.metaSEO?.keywords || "",
            imgAlt: data.metaSEO?.alt || "",
            contenidoMD: data.contenidoMD || "",
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

  // Función para insertar texto en el cursor
  const insertAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = form.contenidoMD;

    const newText = text.substring(0, start) + textToInsert + text.substring(end);
    setForm(p => ({ ...p, contenidoMD: newText }));

    // Devolver el foco y mover el cursor después del texto insertado
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 0);
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

    if (!form.titulo || !form.slug || !form.contenidoMD || !form.categoria) {
      Mensaje("Completa los campos obligatorios", "warning");
      return;
    }

    if (form.slug.trim().length < 11) {
      Mensaje("El slug del artículo de blog debe tener como mínimo 11 y maximo 35 caracteres. ⚠️", "warning");
      return;
    }

    setCargando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const metaSEO = {
        keywords: form.keywords,
        alt: form.imgAlt || form.titulo
      };

      const datosPost = {
        titulo: form.titulo,
        slug: form.slug,
        descripcion: form.descripcion,
        contenidoMD: form.contenidoMD,
        categoria: form.categoria,
        imagen: form.imagen,
        imagenTop: form.imagenTop,
        activo: form.activo,
        pin: form.pin,
        metaSEO: metaSEO,
        tags,
        autor: user?.user_metadata?.nombre || "Admin",
        userId: user?.id,
        lecturaTM: `${Math.max(1, Math.ceil(form.contenidoMD.split(/\s+/).length / 200))} min`,
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
              <input id="nu_slug" type="text" value={form.slug} onChange={change} placeholder="url_amigable (mínimo 11 caracteres)" required />
            </div>
          </div>

          {/* SEO Grid */}
          <div className="nu_grid_seo">
            <div className="nu_card">
              <div className="nu_card_title"><i className="fa-solid fa-align-left"></i> Descripción (SEO)</div>
              <textarea id="nu_descripcion" value={form.descripcion} onChange={change} rows={3} placeholder="Describe la historia... (Mínimo: 50, Máximo: 160 caracteres)" maxLength={160} required />
              <div className="nu_counter">{form.descripcion.length}/160</div>
            </div>
            <div className="nu_card">
              <div className="nu_card_title"><i className="fa-solid fa-search"></i> Metadatos</div>
              <input id="nu_keywords" type="text" value={form.keywords} onChange={change} placeholder="ej: amor, pareja, consejos (Mínimo: 3, Máximo: 5 palabras)" style={{ marginBottom: "1vh" }} />
              <input id="nu_imgAlt" type="text" value={form.imgAlt} onChange={change} placeholder="Alt Imagen (ej: Pareja feliz)" />
            </div>
          </div>

          {/* Editor Markdown Tabs */}
          <div className="nu_card nu_card_editor" style={{ gridColumn: "1 / -1" }}>
            <div className="nu_card_title_row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span><i className="fa-solid fa-code"></i> {vista === 'edit' ? 'Contenido Markdown' : 'Contenido Preview'}</span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="button" onClick={() => setVista('edit')} className="po_like_btn" style={{ padding: "6px 15px", background: vista === 'edit' ? 'var(--wa)' : 'rgba(255,255,255,0.05)' }}><i className="fa-solid fa-code"></i> Editor</button>
                <button type="button" onClick={() => setVista('prev')} className="po_like_btn" style={{ padding: "6px 15px", background: vista === 'prev' ? 'var(--wa)' : 'rgba(255,255,255,0.05)' }}><i className="fa-solid fa-eye"></i> Preview</button>
              </div>
            </div>

            {/* Toolbar - Oculta en Preview */}
            {vista === 'edit' && (
              <div style={{ display: "flex", gap: "10px", padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "12px 12px 0 0", borderBottom: "1px solid rgba(255,255,255,0.1)", flexWrap: "wrap" }}>
                <button type="button" className="po_like_btn" style={{ padding: "5px 12px", fontSize: "0.85rem" }} onClick={() => insertAtCursor("**Negrita**")}><b>B</b></button>
                <button type="button" className="po_like_btn" style={{ padding: "5px 12px", fontSize: "0.85rem" }} onClick={() => insertAtCursor("*Cursiva*")}><i>I</i></button>
                <button type="button" className="po_like_btn" style={{ padding: "5px 12px", fontSize: "0.85rem" }} onClick={() => insertAtCursor("## ")}>H2</button>
                <button type="button" className="po_like_btn" style={{ padding: "5px 12px", fontSize: "0.85rem" }} onClick={() => insertAtCursor("![AltTexto](url_imagen)")}><i className="fa-solid fa-image"></i></button>
                <button type="button" className="po_like_btn" style={{ padding: "5px 12px", fontSize: "0.85rem" }} onClick={() => insertAtCursor("[Texto_Link](https://)")}><i className="fa-solid fa-link"></i></button>
                <button type="button" className="po_like_btn" style={{ padding: "5px 12px", fontSize: "0.85rem", background: "rgba(59, 130, 246, 0.2)", color: "#60A5FA" }} onClick={() => insertAtCursor("\n<witip tipo=\"info\">\nEscribe tu consejo aquí...\n</witip>\n")}><i className="fa-solid fa-lightbulb"></i> WiTip</button>
                <button type="button" className="po_like_btn" style={{ padding: "5px 12px", fontSize: "0.85rem", background: "rgba(255, 92, 105, 0.2)", color: "#FF5C69" }} onClick={() => insertAtCursor("\n<modal titulo=\"Ver contenido oculto\">\nContenido secreto...\n</modal>\n")}><i className="fa-solid fa-eye"></i> Modal</button>
              </div>
            )}

            <div style={{ display: "flex", gap: "20px", padding: "15px", flexDirection: "column" }}>
              {vista === 'edit' ? (
                <textarea
                  id="nu_contenidoMD"
                  ref={textareaRef}
                  className="nu_code"
                  value={form.contenidoMD}
                  onChange={change}
                  style={{ width: "100%", minHeight: "500px", borderRadius: "0 0 12px 12px", borderTop: "none" }}
                  placeholder="Escribe tu historia aquí usando Markdown y los atajos mágicos... ✨"
                  required
                />
              ) : (
                <div style={{ width: "100%", background: "rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "30px", minHeight: "500px" }}>
                  {form.contenidoMD ? (
                    <MarkdownPro contenido={form.contenidoMD} />
                  ) : (
                    <div style={{ textAlign: "center", opacity: 0.3, marginTop: "100px" }}>
                      <i className="fa-solid fa-pen-nib" style={{ fontSize: "3rem", marginBottom: "10px" }}></i>
                      <p>Empieza a escribir para ver la magia...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
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
