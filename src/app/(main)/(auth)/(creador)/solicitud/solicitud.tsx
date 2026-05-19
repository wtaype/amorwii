"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface SolicitudProps {
  perfil: any;
}

const CATEGORIAS_OPCIONES = [
  "Amor a distancia y cómo mantener viva la chispa",
  "Consejos prácticos para preparar detalles románticos",
  "Cartas, dedicatorias y hermosos mensajes de aniversario",
  "Planes creativos para citas y escapadas de fin de semana",
  "Historias reales inspiradoras y reflexiones del amor",
  "Otros temas apasionantes del amor"
];

export default function Solicitud({ perfil }: SolicitudProps) {
  // Form fields
  const [nombre] = useState(perfil?.nombre || "");
  const [apellidos] = useState(perfil?.apellidos || "");
  const [email] = useState(perfil?.email || "");
  const [usuario] = useState(perfil?.usuario || "");
  const [motivo, setMotivo] = useState("");
  
  // Categoría seleccionada por defecto con la primera opción del amor
  const [categoriaInteres, setCategoriaInteres] = useState("Amor a distancia y cómo mantener viva la chispa");

  // States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [solicitudActiva, setSolicitudActiva] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Cargar estado de la solicitud en base de datos al iniciar
  useEffect(() => {
    async function chequearEstado() {
      // FIX INMEDIATO PARA EVITAR EL BUCLE INFINITO DE CARGA: 
      // Si el perfil no se ha cargado en el primer render, apagamos el loading de inmediato
      if (!perfil?.id) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("solicitudes")
          .select("*")
          .eq("userId", perfil.id)
          .order("creado", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error al obtener solicitud anterior:", error);
        } else if (data) {
          if (data.estado === "pendiente") {
            setSolicitudActiva(data);
          } else if (data.estado === "rechazado") {
            setSolicitudActiva(data);
          }
        }
      } catch (err) {
        console.error("Error inesperado de red:", err);
      } finally {
        setLoading(false);
      }
    }

    chequearEstado();
  }, [perfil]);

  // Contar palabras escritas en el motivo
  const obtenerPalabras = () => {
    return motivo.trim().split(/\s+/).filter(word => word.length > 0);
  };

  const palabrasArray = obtenerPalabras();
  const totalPalabras = palabrasArray.length;

  // Cálculo dinámico de progreso interactivo
  const calcularProgreso = () => {
    let puntos = 20; // Inicial (prefilados)
    
    // Motivo textarea basado en cantidad de palabras (Max 40 puntos)
    if (totalPalabras >= 1) puntos += 10;
    if (totalPalabras >= 2) puntos += 15;
    if (totalPalabras >= 3) puntos += 15;
    
    // Categoría de interés seleccionada por defecto (Max 40 puntos)
    if (categoriaInteres !== "") puntos += 40;

    return Math.min(puntos, 100);
  };

  const progreso = calcularProgreso();
  
  // Validación de mínimo 3 palabras
  const esValido = totalPalabras >= 3 && categoriaInteres !== "";

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!esValido || submitting) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase
        .from("solicitudes")
        .insert({
          userId: perfil.id,
          usuario: perfil.usuario,
          nombre,
          apellidos,
          email,
          motivo,
          ejemplos: categoriaInteres, // Guardamos la categoría en la columna ejemplos
          estado: "pendiente"
        })
        .select()
        .single();

      if (error) {
        setErrorMsg(error.message || "Error al procesar la solicitud. Revisa tu conexión.");
      } else {
        setSuccess(true);
        setSolicitudActiva(data);
      }
    } catch (err: any) {
      setErrorMsg("Ocurrió un error inesperado al enviar tu postulación.");
    } finally {
      setSubmitting(false);
    }
  };

  // Botón para re-intentar postulación si fue rechazado
  const habilitarNuevaPostulacion = () => {
    setSolicitudActiva(null);
    setMotivo("");
    setCategoriaInteres("Amor a distancia y cómo mantener viva la chispa");
    setSuccess(false);
  };

  if (loading) {
    return (
      <div className="creador_container">
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: "3rem", color: "#FF5C69" }}></i>
          <h3 style={{ color: "#718096" }}>Analizando historial de postulaciones...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="creador_container">
      <div className="creador_card">
        {/* COLUMNA IZQUIERDA: IMAGEN MOTIVACIONAL SPLIT (55%) */}
        <div 
          className="creador_left_img" 
          style={{ backgroundImage: "url('https://i.postimg.cc/RCbYJ2nc/Amorwii174.webp')" }}
        >
          <div className="creador_left_overlay">
            <div className="creador_quote_box">
              <i className="fa-solid fa-quote-left quote_ico" />
              <p className="creador_quote_text">
                "El amor no tiene fronteras, y tus palabras tienen el poder infinito de inspirar a miles de corazones a celebrar el amor."
              </p>
              <span className="creador_quote_author">— Equipo AmorWii</span>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: CONTENIDO Y FORMULARIO (45%) */}
        <div className="creador_right_content">
          
          {/* CASO A: SOLICITUD PENDIENTE ACTIVA */}
          {solicitudActiva && solicitudActiva.estado === "pendiente" ? (
            <div className="creador_pending_state">
              <div className="creador_pending_icon_wrapper">
                <i className="fa-solid fa-hourglass-half" />
                <div className="creador_pulse" />
              </div>
              <h2 className="creador_pending_title">¡Postulación en Revisión!</h2>
              <p className="creador_pending_text">
                Hola, <strong>{perfil?.nombre || "Smile"}</strong>. Recibimos con alegría tu propuesta para ascender a Editor. 
                Nuestros administradores la están evaluando detalladamente. ¡Pronto recibirás noticias maravillosas!
              </p>
              <div className="creador_alert pending">
                <div className="creador_alert_icon"><i className="fa-solid fa-circle-info" /></div>
                <div>
                  <div className="creador_alert_title">Detalles de Envío</div>
                  <div className="creador_alert_desc">
                    Enviada el <strong>{new Date(solicitudActiva.creado).toLocaleDateString("es-ES", { day: 'numeric', month: 'long', year: 'numeric' })}</strong> a las {new Date(solicitudActiva.creado).toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' })}.
                  </div>
                </div>
              </div>
              <Link href="/" className="creador_btn_secondary" style={{ marginTop: "1rem" }}>
                <i className="fa-solid fa-arrow-left" /> Volver al Dashboard
              </Link>
            </div>
          ) : success ? (
            /* CASO B: ÉXITO INMEDIATO AL ENVIAR */
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <i className="fa-solid fa-circle-check" style={{ fontSize: "4.5rem", color: "#FF5C69", marginBottom: "1.5rem" }} />
              <h2 className="creador_pending_title">¡Enviado Exitosamente!</h2>
              <p className="creador_pending_text" style={{ marginBottom: "2rem" }}>
                Tu postulación se ha registrado con total éxito. El equipo de administración revisará tus categorías seleccionadas y motivos muy pronto.
              </p>
              <Link href="/" className="creador_btn_secondary">
                <i className="fa-solid fa-house" /> Ir al Dashboard
              </Link>
            </div>
          ) : (
            /* CASO C: FORMULARIO ACTIVO (CON O SIN RECHAZO ANTERIOR) */
            <>
              <div className="creador_header">
                <div className="creador_badge">
                  <i className="fa-solid fa-wand-magic-sparkles" /> Creador a Editor
                </div>
                <h1 className="creador_title">Quiero ser Editor</h1>
                <p className="creador_subtitle">
                  Escribe blogs oficiales, planifica hermosas ideas románticas y ayuda a otros Smiles a celebrar el amor de forma única.
                </p>
              </div>

              {/* Alerta de Rechazo Histórico si existe */}
              {solicitudActiva && solicitudActiva.estado === "rechazado" && (
                <div className="creador_alert rejected">
                  <div className="creador_alert_icon"><i className="fa-solid fa-triangle-exclamation" /></div>
                  <div>
                    <div className="creador_alert_title">Tu postulación anterior requiere mejoras</div>
                    <div className="creador_alert_desc">
                      Retroalimentación del moderador: <br />
                      <em style={{ color: "#e53e3e", display: "block", marginTop: "0.25rem", fontWeight: 500 }}>
                        "{solicitudActiva.respuesta || "Por favor, expande un poco más tus motivos y enfoques."}"
                      </em>
                      <button 
                        onClick={habilitarNuevaPostulacion} 
                        className="creador_btn_secondary" 
                        style={{ marginTop: "1rem", padding: "0.5rem 1rem", fontSize: "0.82rem" }}
                      >
                        <i className="fa-solid fa-rotate-left" /> Intentar de nuevo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="creador_form_grid">
                  <div className="creador_group">
                    <label className="creador_label">Nombre completo</label>
                    <input 
                      type="text" 
                      className="creador_input" 
                      value={`${nombre} ${apellidos}`} 
                      disabled 
                    />
                  </div>
                  <div className="creador_group">
                    <label className="creador_label">Usuario Smiles</label>
                    <input 
                      type="text" 
                      className="creador_input" 
                      value={`@${usuario}`} 
                      disabled 
                    />
                  </div>
                </div>

                {/* Motivos TextArea */}
                <div className="creador_group">
                  <label className="creador_label">¿Por qué deseas ser Editor en AmorWii? *</label>
                  <textarea 
                    className="creador_textarea" 
                    placeholder="Escribe aquí (mínimo 3 palabras) por qué deseas ser Editor en AmorWii..."
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    maxLength={800}
                    required
                  />
                </div>

                {/* Selector Dropdown del tipo de contenido */}
                <div className="creador_group">
                  <label className="creador_label">¿Qué tipo de contenido te gustaría publicar? * (Selecciona al menos 1)</label>
                  <select 
                    className="creador_input" 
                    value={categoriaInteres}
                    onChange={(e) => setCategoriaInteres(e.target.value)}
                    required
                  >
                    {CATEGORIAS_OPCIONES.map((opcion, index) => (
                      <option key={index} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Barra de progreso interactiva */}
                <div className="creador_progress_container">
                  <span>Progreso de Postulación {progreso}%</span>
                  <div className="creador_progress_bar">
                    <div className="creador_progress_fill" style={{ width: `${progreso}%` }} />
                  </div>
                </div>

                {errorMsg && (
                  <div className="creador_alert rejected" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                    <div className="creador_alert_icon"><i className="fa-solid fa-triangle-exclamation" /></div>
                    <div>
                      <div className="creador_alert_title">Error al Guardar</div>
                      <div className="creador_alert_desc">{errorMsg}</div>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="creador_submit_btn" 
                  disabled={!esValido || submitting}
                  style={{ marginTop: "1rem", opacity: esValido ? 1 : 0.4 }}
                >
                  {submitting ? (
                    <>
                      <i className="fa-solid fa-circle-notch creador_spinner" /> Enviando Propuesta...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane" /> Enviar mi Postulación a Editor
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
