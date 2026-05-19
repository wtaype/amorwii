"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Mensaje } from "@/components/Mensaje";
import MarkdownPro from "../_components/MarkdownPro";
import Witip from "@/components/Witip";
import { useAuth } from "@/lib/auth";
import "./nuevo.css";

// Hook de persistencia "PRO" compatible con Next.js (Hydration-Safe)
function useBorrador<T>(key: string, valorInicial: T, enabled = true) {
    const [estado, setEstado] = useState<T>(valorInicial);
    const [hidratado, setHidratado] = useState(false);

    useEffect(() => {
        if (!enabled) {
            setHidratado(true);
            return;
        }
        try {
            const guardado = localStorage.getItem(key);
            if (guardado) {
                setEstado(JSON.parse(guardado));
            }
        } catch (e) {
            console.error("Error al cargar borrador:", e);
        }
        setHidratado(true);
    }, [key, enabled]);

    useEffect(() => {
        if (enabled && hidratado) {
            try {
                localStorage.setItem(key, JSON.stringify(estado));
            } catch (e) {
                console.error("Error al guardar borrador:", e);
            }
        }
    }, [key, estado, hidratado, enabled]);

    return [estado, setEstado, hidratado] as const;
}

// Calcular estadísticas del contenido (palabras y tiempo de lectura a 200 ppm)
function getContenidoStats(mdText: string) {
    const text = mdText.trim();
    if (!text) return { words: 0, min: 0 };
    const cleanText = text
        .replace(/!\[.*?\]\(.*?\)/g, "") // Remover imágenes md
        .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Conservar texto del link
        .replace(/[*#_`>~-]/g, "") // Quitar caracteres de estilo md
        .trim();

    const words = cleanText ? cleanText.split(/\s+/).length : 0;
    const min = Math.max(1, Math.ceil(words / 200));
    return { words, min };
}

export default function NuevoBlog() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, perfil, loading } = useAuth();

    // Detectar si estamos en modo edición
    const editSlug = searchParams.get("edit");

    const [cargando, setCargando] = useState(false);
    const [cargandoDatos, setCargandoDatos] = useState(false);
    const [vista, setVista] = useState<"edit" | "prev">("edit");
    const [hoveredTool, setHoveredTool] = useState<string | null>(null);
    const [slugStatus, setSlugStatus] = useState<"libre" | "ocupado" | "corto" | "largo" | "buscando" | null>(null);
    const [focusedField, setFocusedField] = useState<"titulo" | "slug" | "descripcion" | "keywords" | null>(null);
    const [hoveredField, setHoveredField] = useState<"titulo" | "slug" | "descripcion" | "keywords" | null>(null);

    // Estado del Formulario (con persistencia inteligente useBorrador)
    const [form, setForm] = useBorrador("amorwii_blog_form", {
        titulo: "",
        slug: "",
        descripcion: "", // Antes resumen
        keywords: "", // Solo para UI, se guardará en metaSEO
        contenidoMD: "", // camelCase
        categoria: "",
        imagen: "",
        imagenTop: "",
        activo: true,
        pin: false
    }, !editSlug);

    const [tags, setTags] = useBorrador<string[]>("amorwii_blog_tags", [], !editSlug);
    const [tagInp, setTagInp] = useState("");

    // Calcular estadísticas en tiempo real
    const stats = getContenidoStats(form.contenidoMD);

    // Ref para el textarea (para insertar texto en el cursor)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // FASE EDICIÓN: Cargar datos del post existente si ?edit=slug está presente
    useEffect(() => {
        async function cargarPost() {
            if (!editSlug) return;
            if (loading) return; // Esperar a que la sesión esté completamente hidratada
            
            setCargandoDatos(true);
            try {
                const { data, error } = await supabase
                    .from("blog")
                    .select("*")
                    .eq("slug", editSlug)
                    .maybeSingle();

                if (error) throw error;

                if (data) {
                    // VERIFICACIÓN DOBLE SEGURO DE PROPIEDAD
                    // El usuario debe ser el autor legítimo (por ID o email) o tener rol administrativo (gestor/admin)
                    const esAdminOGestor = perfil?.rol === "admin" || perfil?.rol === "gestor";
                    const esDuenio = user?.id === data.userId || user?.email === data.email;
                    if (!esAdminOGestor && !esDuenio) {
                        Mensaje("No tienes permisos para editar esta historia. ⚠️", "error");
                        router.push("/editor/bienvenido");
                        return;
                    }

                    setForm({
                        titulo: data.titulo || "",
                        slug: data.slug || "",
                        descripcion: data.descripcion || "",
                        keywords: data.metaSEO?.keywords || "",
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
    }, [editSlug, loading, user, perfil]);

    // Validar disponibilidad del slug en tiempo real con debounce y auto-limpieza
    useEffect(() => {
        if (!form.slug) {
            setSlugStatus(null);
            return;
        }

        const limpio = form.slug
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9_-]/g, "")
            .replace(/\s+/g, "_");

        if (limpio !== form.slug) {
            setForm(p => ({ ...p, slug: limpio }));
        }

        if (limpio.length < 11) {
            setSlugStatus("corto");
            return;
        }

        if (limpio.length > 32) {
            setSlugStatus("largo");
            return;
        }

        if (editSlug && limpio === editSlug) {
            setSlugStatus("libre");
            return;
        }

        setSlugStatus("buscando");

        const timer = setTimeout(async () => {
            try {
                const { data, error } = await supabase
                    .from("blog")
                    .select("slug")
                    .eq("slug", limpio)
                    .maybeSingle();

                if (error) throw error;

                if (data) {
                    setSlugStatus("ocupado");
                } else {
                    setSlugStatus("libre");
                }
            } catch (err) {
                console.error("Error al validar slug:", err);
                setSlugStatus(null);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [form.slug, editSlug, setForm]);

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

    // Configuración de herramientas de la barra Markdown
    const tools = [
        {
            id: "bold",
            tip: "Negrita",
            icon: <span style={{ fontWeight: 800 }}>B</span>,
            action: () => insertAtCursor("**Negrita**")
        },
        {
            id: "italic",
            tip: "Cursiva",
            icon: <span style={{ fontStyle: "italic" }}>I</span>,
            action: () => insertAtCursor("*Cursiva*")
        },
        {
            id: "h2",
            tip: "Título H2",
            icon: "H2",
            action: () => insertAtCursor("## ")
        },
        {
            id: "ul",
            tip: "Lista con viñetas",
            icon: <i className="fa-solid fa-list-ul"></i>,
            action: () => insertAtCursor("\n- Item\n")
        },
        {
            id: "ol",
            tip: "Lista numerada",
            icon: <i className="fa-solid fa-list-ol"></i>,
            action: () => insertAtCursor("\n1. Item\n")
        },
        {
            id: "check",
            tip: "Lista de tareas",
            icon: <i className="fa-solid fa-square-check"></i>,
            action: () => insertAtCursor("\n- [ ] Tarea\n")
        },
        {
            id: "minus",
            tip: "Línea separadora",
            icon: <i className="fa-solid fa-minus"></i>,
            action: () => insertAtCursor("\n---\n")
        },
        {
            id: "image",
            tip: "Insertar Imagen",
            icon: <i className="fa-solid fa-image"></i>,
            action: () => insertAtCursor("![AltTexto](url_imagen)")
        },
        {
            id: "link",
            tip: "Insertar Enlace",
            icon: <i className="fa-solid fa-link"></i>,
            action: () => insertAtCursor("[Texto_Link](https://)")
        },
        {
            id: "quote",
            tip: "Insertar Cita",
            icon: <i className="fa-solid fa-quote-left"></i>,
            action: () => insertAtCursor("\n> Cita importante...\n")
        },
        {
            id: "table",
            tip: "Insertar Tabla",
            icon: <i className="fa-solid fa-table"></i>,
            action: () => insertAtCursor("\n| Columna 1 | Columna 2 |\n| --------- | --------- |\n| Fila 1    | Fila 2    |\n")
        },
        {
            id: "code",
            tip: "Código en bloque",
            icon: <i className="fa-solid fa-file-code"></i>,
            action: () => insertAtCursor("\n```javascript\n// Código aquí\n```\n")
        },
        {
            id: "witip",
            tip: "Caja de consejo (WiTip)",
            icon: <i className="fa-solid fa-lightbulb"></i>,
            action: () => insertAtCursor("\n<witip tipo=\"info\">\nEscribe tu consejo aquí...\n</witip>\n")
        },
        {
            id: "modal",
            tip: "Contenido desplegable (Modal)",
            icon: <i className="fa-solid fa-circle-play"></i>,
            action: () => insertAtCursor("\n<modal titulo=\"Ver contenido oculto\">\nContenido secreto...\n</modal>\n")
        }
    ];

    // Manejar Tags (Separación automática por comas estilo Wiihope)
    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const inputs = tagInp.toLowerCase().split(",");
            const nuevosTags: string[] = [];

            inputs.forEach((part) => {
                const t = part
                    .trim()
                    .replace(/\s+/g, "_")
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");
                if (t && !tags.includes(t) && !nuevosTags.includes(t)) {
                    nuevosTags.push(t);
                }
            });

            if (nuevosTags.length > 0) {
                setTags(prev => [...prev, ...nuevosTags].slice(0, 8));
            }
            setTagInp("");
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
            const metaSEO = {
                keywords: form.keywords,
                alt: form.titulo
            };

            const autorNombre = perfil ? perfil.nombre : (user?.user_metadata?.nombre || "Autor");

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
                autor: autorNombre,
                userId: user?.id || null,
                email: perfil?.email || user?.email || "",
                usuario: perfil?.usuario || "",
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
                // Revalidar caché del servidor al instante
                await fetch("/api/revalidate?path=/").catch(err => console.warn("Error revalidando:", err));
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
                // Revalidar caché del servidor al instante
                await fetch("/api/revalidate?path=/").catch(err => console.warn("Error revalidando:", err));
                Mensaje("¡Historia publicada con éxito! 🐾✨", "success");
            }

            // Limpiar borrador de localStorage al publicar con éxito
            if (!editSlug) {
                localStorage.removeItem("amorwii_blog_form");
                localStorage.removeItem("amorwii_blog_tags");
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
                        <Witip
                            show={(focusedField === "titulo" || hoveredField === "titulo") && form.titulo.length > 0}
                            tipo={
                                form.titulo.length < 35 ? "warning" : "success"
                            }
                            msg={
                                form.titulo.length < 35 ? `Te faltan ${35 - form.titulo.length} para tener un título ideal (Mínimo: 35)` :
                                    `Excelente título de ${form.titulo.length}/47`
                            }
                        >
                            <input
                                id="nu_titulo"
                                type="text"
                                className="nu_titulo_inp"
                                placeholder="Escribe un título impactante... (Mínimo: 35, Máximo: 47 caracteres)"
                                value={form.titulo}
                                onChange={change}
                                onFocus={() => setFocusedField("titulo")}
                                onBlur={() => setFocusedField(null)}
                                onMouseEnter={() => setHoveredField("titulo")}
                                onMouseLeave={() => setHoveredField(null)}
                                maxLength={47}
                                required
                            />
                        </Witip>
                        <Witip
                            show={
                                (focusedField === "slug" || hoveredField === "slug") &&
                                !!slugStatus
                            }
                            tipo={
                                slugStatus === "buscando" ? "mco" :
                                    slugStatus === "libre" ? "success" :
                                        slugStatus === "corto" ? "warning" : "error"
                            }
                            msg={
                                slugStatus === "buscando" ? "Validando disponibilidad..." :
                                    slugStatus === "libre" ? `Excelente enlace de ${form.slug.length}/32` :
                                        slugStatus === "corto" ? `Te faltan ${11 - form.slug.length} para tener un enlace ideal (Mínimo: 11)` :
                                            slugStatus === "largo" ? `Te pasaste por ${form.slug.length - 32}. Máximo: 32` :
                                                slugStatus === "ocupado" ? "Este enlace ya está en uso. Elige otro." : ""
                            }
                        >
                            <div className="nu_slug_box">
                                <span className="nu_slug_label"><i className="fa-solid fa-link"></i> amorwii.com/</span>
                                <input
                                    id="nu_slug"
                                    type="text"
                                    value={form.slug}
                                    onChange={change}
                                    onFocus={() => setFocusedField("slug")}
                                    onBlur={() => setFocusedField(null)}
                                    onMouseEnter={() => setHoveredField("slug")}
                                    onMouseLeave={() => setHoveredField(null)}
                                    placeholder="mi_historia_de_amor (Mínimo: 11, Máximo: 32 caracteres)"
                                    maxLength={32}
                                    required
                                />
                            </div>
                        </Witip>
                        <div className="nu_slug_status">
                            {slugStatus === "libre" && (
                                <span className="libre">
                                    <i className="fa-solid fa-circle-check"></i> ¡Enlace disponible y listo para brillar! ✨
                                </span>
                            )}
                        </div>
                    </div>

                    {/* SEO Grid */}
                    <div className="nu_grid_seo">
                        <div className="nu_card">
                            <div className="nu_card_title"><i className="fa-solid fa-align-left"></i> Descripción (SEO)</div>
                            <Witip
                                show={(focusedField === "descripcion" || hoveredField === "descripcion") && form.descripcion.length > 0}
                                tipo={
                                    form.descripcion.length < 100 ? "warning" :
                                        form.descripcion.length <= 150 ? "success" : "error"
                                }
                                msg={
                                    form.descripcion.length < 100 ? `Te faltan ${100 - form.descripcion.length} para tener una descripción ideal (Mínimo: 100)` :
                                        form.descripcion.length <= 150 ? `Excelente descripción de ${form.descripcion.length}/150` :
                                            `Te pasaste por ${form.descripcion.length - 150}. Máximo: 150`
                                }
                            >
                                <textarea
                                    id="nu_descripcion"
                                    value={form.descripcion}
                                    onChange={change}
                                    onFocus={() => setFocusedField("descripcion")}
                                    onBlur={() => setFocusedField(null)}
                                    onMouseEnter={() => setHoveredField("descripcion")}
                                    onMouseLeave={() => setHoveredField(null)}
                                    rows={3}
                                    placeholder="Describe la historia... (Mínimo: 100, Máximo: 150 caracteres)"
                                    maxLength={150}
                                    required
                                />
                            </Witip>
                        </div>
                        <div className="nu_card">
                            <div className="nu_card_title"><i className="fa-solid fa-search"></i> Metadatos (Keywords)</div>
                            {(() => {
                                const cleanKeywords = form.keywords
                                    ? Array.from(new Set(form.keywords.split(",").map(k => k.trim()).filter(Boolean)))
                                    : [];
                                const count = cleanKeywords.length;
                                return (
                                    <Witip
                                        show={(focusedField === "keywords" || hoveredField === "keywords") && form.keywords.length > 0}
                                        tipo={
                                            count < 3 ? "warning" :
                                                count <= 5 ? "success" : "error"
                                        }
                                        msg={
                                            count < 3 ? `Te faltan ${3 - count} para tener una densidad ideal (Mínimo: 3)` :
                                                count <= 5 ? `Excelente densidad de ${count}/5` :
                                                    `Te pasaste por ${count - 5}. Máximo: 5`
                                        }
                                    >
                                        <textarea
                                            id="nu_keywords"
                                            value={form.keywords}
                                            onChange={change}
                                            onFocus={() => setFocusedField("keywords")}
                                            onBlur={() => setFocusedField(null)}
                                            onMouseEnter={() => setHoveredField("keywords")}
                                            onMouseLeave={() => setHoveredField(null)}
                                            rows={3}
                                            placeholder="ej: amor, pareja, consejos (Mínimo: 3, Máximo: 5 palabras clave)"
                                            maxLength={100}
                                        />
                                    </Witip>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Editor Markdown Tabs */}
                    <div className="nu_card nu_card_editor">
                        <div className="nu_card_title_row">
                            <span><i className="fa-solid fa-code"></i> {vista === 'edit' ? 'Contenido Markdown' : 'Contenido Preview'}</span>
                            <div className="nu_editor_tabs">
                                <button type="button" onClick={() => setVista('edit')} className={`nu_tab ${vista === 'edit' ? 'active' : ''}`}><i className="fa-solid fa-code"></i> Editor</button>
                                <button type="button" onClick={() => setVista('prev')} className={`nu_tab ${vista === 'prev' ? 'active' : ''}`}><i className="fa-solid fa-eye"></i> Preview</button>
                            </div>
                        </div>

                        {/* Toolbar - Oculta en Preview */}
                        {vista === 'edit' && (
                            <div className="nu_toolbar">
                                {tools.map((t) => (
                                    <Witip key={t.id} show={hoveredTool === t.id} msg={t.tip} tipo="mco">
                                        <button
                                            type="button"
                                            className="nu_tool"
                                            onClick={t.action}
                                            onMouseEnter={() => setHoveredTool(t.id)}
                                            onMouseLeave={() => setHoveredTool(null)}
                                        >
                                            {t.icon}
                                        </button>
                                    </Witip>
                                ))}
                            </div>
                        )}

                        {vista === 'edit' ? (
                            <textarea
                                id="nu_contenidoMD"
                                ref={textareaRef}
                                className="nu_code"
                                value={form.contenidoMD}
                                onChange={change}
                                placeholder="Escribe tu historia aquí usando Markdown y los atajos mágicos... ✨"
                                rows={18}
                                required
                            />
                        ) : (
                            <div className="nu_html_prev po_contenido">
                                {form.contenidoMD ? (
                                    <MarkdownPro contenido={form.contenidoMD} />
                                ) : (
                                    <div style={{ textAlign: "center", opacity: 0.3, marginTop: "5vh" }}>
                                        <i className="fa-solid fa-pen-nib" style={{ fontSize: "3rem", marginBottom: "1vh" }}></i>
                                        <p>Empieza a escribir para ver la magia...</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Footer de Estadísticas en tiempo real */}
                        <div className="nu_content_footer">
                            <span>
                                <i className="fa-solid fa-font"></i> {stats.words} {stats.words === 1 ? 'palabra' : 'palabras'}
                            </span>
                            <span>
                                <i className="fa-solid fa-clock"></i> {stats.min} {stats.min === 1 ? 'minuto' : 'minutos'} de lectura
                            </span>
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
                        <div className="nu_card_title"><i className="fa-solid fa-images"></i> Imágenes</div>
                        <div className="nu_img_container">
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5vh" }}>
                                <label htmlFor="nu_imagen"><i className="fa-solid fa-compress"></i> Miniatura (Inicio-Blog)</label>
                                <input id="nu_imagen" type="url" value={form.imagen} onChange={change} placeholder="https://... (Sugerido: 334x208px)" required />
                                {form.imagen && form.imagen.startsWith("http") && (
                                    <div className="nu_img_prev">
                                        <img src={form.imagen} alt="Miniatura Blog" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                        <button type="button" className="nu_img_clear" onClick={() => setForm(p => ({ ...p, imagen: "" }))} title="Quitar Miniatura">
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5vh" }}>
                                <label htmlFor="nu_imagenTop"><i className="fa-solid fa-image"></i> ImagenTop (Post)</label>
                                <input id="nu_imagenTop" type="url" value={form.imagenTop} onChange={change} placeholder="https://... (Sugerido: 1180x425px u horizontal)" />
                                {form.imagenTop && form.imagenTop.startsWith("http") && (
                                    <div className="nu_img_prev">
                                        <img src={form.imagenTop} alt="Imagen Top Banner" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                        <button type="button" className="nu_img_clear" onClick={() => setForm(p => ({ ...p, imagenTop: "" }))} title="Quitar Imagen Top">
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
