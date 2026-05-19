"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mensaje } from "@/components/Mensaje";

interface Solicitud {
  id: string;
  userId: string;
  usuario: string;
  nombre: string;
  apellidos: string;
  email: string;
  motivo: string;
  ejemplos: string;
  estado: "pendiente" | "aprobado" | "rechazado";
  respuesta: string | null;
  creado: string;
  actualizado: string;
}

interface AprobarProps {
  solicitudesIniciales: Solicitud[];
  perfil: any;
}

export default function Aprobar({ solicitudesIniciales, perfil }: AprobarProps) {
  // Lista de solicitudes en el estado local para actualización instantánea
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>(solicitudesIniciales);

  // Control de Pestañas ("pendientes" | "historial")
  const [pestaña, setPestaña] = useState<"pendientes" | "historial">("pendientes");

  // Buscador y Filtros Rápidos
  const [busqueda, setBusqueda] = useState("");
  const [filtroHistorial, setFiltroHistorial] = useState<"todos" | "aprobado" | "rechazado">("todos");

  // Procesamiento y Modales
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Modal de aprobación
  const [solicitudAAprobar, setSolicitudAAprobar] = useState<Solicitud | null>(null);

  // Caja de texto para rechazar (ID de solicitud activa de rechazo y mensaje)
  const [rechazoIdActivo, setRechazoIdActivo] = useState<string | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");

  // --- CALCULAR ESTADÍSTICAS EN TIEMPO REAL ---
  const totalPendientes = solicitudes.filter(s => s.estado === "pendiente").length;
  const totalAprobados = solicitudes.filter(s => s.estado === "aprobado").length;
  const totalRechazados = solicitudes.filter(s => s.estado === "rechazado").length;

  // --- BUSCADOR Y FILTRADO ---
  const solicitudesFiltradas = solicitudes.filter(sol => {
    // 1. Filtrar por buscador (nombre, apellido, usuario o correo)
    const matchesSearch =
      `${sol.nombre} ${sol.apellidos}`.toLowerCase().includes(busqueda.toLowerCase()) ||
      sol.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      sol.email.toLowerCase().includes(busqueda.toLowerCase());

    if (!matchesSearch) return false;

    // 2. Filtrar por pestaña y estado
    if (pestaña === "pendientes") {
      return sol.estado === "pendiente";
    } else {
      // Pestaña Historial
      if (filtroHistorial === "todos") {
        return sol.estado === "aprobado" || sol.estado === "rechazado";
      }
      return sol.estado === filtroHistorial;
    }
  });

  // --- ACCIÓN: APROBAR SOLICITUD ---
  const handleAprobar = async () => {
    if (!solicitudAAprobar) return;
    const sol = solicitudAAprobar;
    setSolicitudAAprobar(null);
    setLoadingId(sol.id);

    try {
      const respuestaAprobado = "¡Felicitaciones! Tu postulación ha sido aprobada con éxito. Ahora eres Editor de AmorWii. Escribe artículos llenos de amor y planifica hermosas sorpresas.";

      const { data, error } = await supabase
        .from("solicitudes")
        .update({
          estado: "aprobado",
          respuesta: respuestaAprobado
        })
        .eq("id", sol.id)
        .select()
        .single();

      if (error) {
        Mensaje("Ocurrió un error al aprobar la solicitud: " + error.message, "error");
      } else {
        // Actualizar lista en estado local instantáneamente
        setSolicitudes(prev => prev.map(s => s.id === sol.id ? { ...s, estado: "aprobado", respuesta: respuestaAprobado } : s));
        Mensaje(`¡Postulación de @${sol.usuario} aprobada con éxito! El usuario ha sido ascendido a Editor. 🎉`, "success");
      }
    } catch (err) {
      Mensaje("Error de red inesperado al procesar la aprobación.", "error");
    } finally {
      setLoadingId(null);
    }
  };

  // --- ACCIÓN: INICIAR RECHAZO (Desplegar caja) ---
  const toggleRechazoBox = (id: string) => {
    if (rechazoIdActivo === id) {
      setRechazoIdActivo(null);
      setMotivoRechazo("");
    } else {
      setRechazoIdActivo(id);
      setMotivoRechazo("");
    }
  };

  // --- ACCIÓN: CONFIRMAR RECHAZO ---
  const handleRechazar = async (sol: Solicitud) => {
    if (!motivoRechazo.trim()) {
      Mensaje("Por favor, escribe una retroalimentación para ayudar al Creador a mejorar.", "warning");
      return;
    }

    setLoadingId(sol.id);
    setRechazoIdActivo(null);

    try {
      const { error } = await supabase
        .from("solicitudes")
        .update({
          estado: "rechazado",
          respuesta: motivoRechazo
        })
        .eq("id", sol.id);

      if (error) {
        Mensaje("Ocurrió un error al rechazar la solicitud: " + error.message, "error");
      } else {
        // Actualizar lista en estado local
        setSolicitudes(prev => prev.map(s => s.id === sol.id ? { ...s, estado: "rechazado", respuesta: motivoRechazo } : s));
        Mensaje(`Se ha rechazado la postulación de @${sol.usuario} con retroalimentación formativa.`, "success");
      }
    } catch (err) {
      Mensaje("Error de red inesperado al procesar el rechazo.", "error");
    } finally {
      setLoadingId(null);
      setMotivoRechazo("");
    }
  };

  return (
    <div className="gestor_container">

      {/* ── ENCABEZADO DE LA CONSOLA ── */}
      <div className="gestor_header_section">
        <div className="gestor_title_box">
          <div className="gestor_badge">
            <i className="fa-solid fa-shield-halved" /> Consola de Moderación
          </div>
          <h1 className="gestor_title">Postulaciones a Editor</h1>
          <p className="gestor_subtitle">
            Hola, <strong>{perfil?.nombre || "Smile"}</strong>. Gestiona las solicitudes de ascenso a Editor del equipo Smiles.
          </p>
        </div>
      </div>

      {/* ── PANEL DE ESTADÍSTICAS ── */}
      <div className="gestor_stats_grid">
        <div className="gestor_stat_card">
          <div className="gestor_stat_icon pending">
            <i className="fa-solid fa-hourglass-half" />
          </div>
          <div className="gestor_stat_info">
            <span className="gestor_stat_label">Pendientes</span>
            <span className="gestor_stat_val">{totalPendientes}</span>
          </div>
        </div>

        <div className="gestor_stat_card">
          <div className="gestor_stat_icon approved">
            <i className="fa-solid fa-circle-check" />
          </div>
          <div className="gestor_stat_info">
            <span className="gestor_stat_label">Aprobadas</span>
            <span className="gestor_stat_val">{totalAprobados}</span>
          </div>
        </div>

        <div className="gestor_stat_card">
          <div className="gestor_stat_icon rejected">
            <i className="fa-solid fa-circle-xmark" />
          </div>
          <div className="gestor_stat_info">
            <span className="gestor_stat_label">Rechazadas</span>
            <span className="gestor_stat_val">{totalRechazados}</span>
          </div>
        </div>
      </div>

      {/* ── TABLA / CONSOLA DE CONTROL ── */}
      <div className="gestor_console_card">

        {/* Pestañas */}
        <div className="gestor_tabs_row">
          <button
            className={`gestor_tab_btn${pestaña === "pendientes" ? " active" : ""}`}
            onClick={() => { setPestaña("pendientes"); setBusqueda(""); }}
          >
            Pendientes <span className="gestor_tab_badge">{totalPendientes}</span>
          </button>
          <button
            className={`gestor_tab_btn${pestaña === "historial" ? " active" : ""}`}
            onClick={() => { setPestaña("historial"); setBusqueda(""); }}
          >
            Historial <span className="gestor_tab_badge">{totalAprobados + totalRechazados}</span>
          </button>
        </div>

        {/* Barra de Filtros y Buscador */}
        <div className="gestor_filters_bar">
          <div className="gestor_search_wrapper">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="text"
              className="gestor_search_input"
              placeholder="Buscar postulante por nombre, @usuario o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {pestaña === "historial" && (
            <div className="gestor_quick_filters">
              <button
                className={`gestor_filter_tag${filtroHistorial === "todos" ? " active" : ""}`}
                onClick={() => setFiltroHistorial("todos")}
              >
                Todos
              </button>
              <button
                className={`gestor_filter_tag${filtroHistorial === "aprobado" ? " active" : ""}`}
                onClick={() => setFiltroHistorial("aprobado")}
              >
                Aprobadas
              </button>
              <button
                className={`gestor_filter_tag${filtroHistorial === "rechazado" ? " active" : ""}`}
                onClick={() => setFiltroHistorial("rechazado")}
              >
                Rechazadas
              </button>
            </div>
          )}
        </div>

        {/* Contenido / Listado */}
        {solicitudesFiltradas.length === 0 ? (
          <div className="gestor_empty_state">
            <i className="fa-regular fa-folder-open" />
            <h3>No se encontraron solicitudes</h3>
            <p>
              {pestaña === "pendientes"
                ? "No hay postulaciones pendientes de revisión por ahora."
                : "No hay registros que coincidan con los filtros en el historial."}
            </p>
          </div>
        ) : (
          <>
            {/* VISTA DESKTOP (TABLA ESMERILADA) */}
            <div className="gestor_table_wrapper gestor_desktop_only">
              <table className="gestor_table">
                <thead>
                  <tr>
                    <th>Postulante</th>
                    <th>¿Por qué deseas ser Editor?</th>
                    <th>Temática Elegida</th>
                    <th>{pestaña === "pendientes" ? "Acciones" : "Resolución"}</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudesFiltradas.map((sol) => (
                    <tr key={sol.id}>
                      {/* Postulante */}
                      <td style={{ minWidth: '180px' }}>
                        <div className="gestor_user_info">
                          <span className="gestor_user_name">{sol.nombre} {sol.apellidos}</span>
                          <span className="gestor_user_sub">
                            <span>@{sol.usuario}</span>
                            <span>•</span>
                            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{sol.email}</span>
                          </span>
                        </div>
                      </td>

                      {/* Motivo */}
                      <td style={{ minWidth: '240px', maxWidth: '400px' }}>
                        <div className="gestor_text_block" style={{ maxHeight: '110px', overflowY: 'auto' }}>
                          {sol.motivo}
                        </div>
                      </td>

                      {/* Temática / Ejemplos */}
                      <td style={{ minWidth: '160px' }}>
                        <span className="gestor_badge" style={{ margin: 0, padding: '0.35rem 0.75rem', textTransform: 'none', background: 'rgba(255,193,7,0.08)', borderColor: 'rgba(255,193,7,0.15)', color: '#b7791f' }}>
                          {sol.ejemplos || "No seleccionada"}
                        </span>
                      </td>

                      {/* Acciones o Estado */}
                      <td>
                        {loadingId === sol.id ? (
                          <i className="fa-solid fa-circle-notch fa-spin" style={{ color: "#FF5C69" }} />
                        ) : pestaña === "pendientes" ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div className="gestor_actions_group">
                              <button
                                className="gestor_btn_action btn_approve"
                                title="Aprobar Solicitud"
                                onClick={() => setSolicitudAAprobar(sol)}
                              >
                                <i className="fa-solid fa-check" />
                              </button>
                              <button
                                className="gestor_btn_action btn_reject"
                                title="Rechazar Solicitud"
                                onClick={() => toggleRechazoBox(sol.id)}
                              >
                                <i className="fa-solid fa-xmark" />
                              </button>
                            </div>

                            {/* Desplegable de Rechazo */}
                            {rechazoIdActivo === sol.id && (
                              <div className="gestor_reject_box">
                                <span className="gestor_label_min">Comentarios de Rechazo *</span>
                                <textarea
                                  className="gestor_feedback_input"
                                  placeholder="Escribe el motivo del rechazo de forma constructiva para el Creador..."
                                  value={motivoRechazo}
                                  onChange={(e) => setMotivoRechazo(e.target.value)}
                                  maxLength={300}
                                />
                                <div className="gestor_reject_confirm_row">
                                  <button className="gestor_btn_sm btn_cancel" onClick={() => toggleRechazoBox(sol.id)}>Cancelar</button>
                                  <button className="gestor_btn_sm btn_confirm" onClick={() => handleRechazar(sol)}>Rechazar</button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <span className={`gestor_status_tag ${sol.estado}`}>
                              <i className={`fa-solid ${sol.estado === "aprobado" ? "fa-circle-check" : "fa-circle-xmark"}`} />
                              {sol.estado}
                            </span>
                            {sol.respuesta && (
                              <span style={{ fontSize: '0.8rem', color: '#718096', display: 'block', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={sol.respuesta}>
                                "{sol.respuesta}"
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* VISTA MÓVIL / RESPONSIVA (LISTA DE TARJETAS PARA PANTALLAS PEQUEÑAS) */}
            <div className="gestor_mobile_only">
              {solicitudesFiltradas.map((sol) => (
                <div key={sol.id} className="gestor_card_item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="gestor_user_info">
                      <span className="gestor_user_name">{sol.nombre} {sol.apellidos}</span>
                      <span className="gestor_user_sub">
                        <span>@{sol.usuario}</span>
                        <span>•</span>
                        <span>{sol.email}</span>
                      </span>
                    </div>
                    {pestaña === "historial" && (
                      <span className={`gestor_status_tag ${sol.estado}`}>
                        {sol.estado}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="gestor_label_min">¿Por qué deseas ser Editor?</span>
                    <div className="gestor_text_block">{sol.motivo}</div>
                  </div>

                  <div>
                    <span className="gestor_label_min">Temática Elegida</span>
                    <span className="gestor_badge" style={{ margin: 0, display: 'inline-flex', background: 'rgba(255,193,7,0.08)', borderColor: 'rgba(255,193,7,0.15)', color: '#b7791f', padding: '0.35rem 0.75rem', textTransform: 'none' }}>
                      {sol.ejemplos || "No seleccionada"}
                    </span>
                  </div>

                  {pestaña === "historial" && sol.respuesta && (
                    <div>
                      <span className="gestor_label_min">Respuesta de Moderación</span>
                      <div className="gestor_text_block" style={{ fontStyle: 'italic', background: 'rgba(0,0,0,0.01)' }}>
                        "{sol.respuesta}"
                      </div>
                    </div>
                  )}

                  {pestaña === "pendientes" && (
                    <div style={{ borderTop: '1px solid rgba(226, 232, 240, 0.4)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                      {loadingId === sol.id ? (
                        <div style={{ textAlign: 'center' }}>
                          <i className="fa-solid fa-circle-notch fa-spin" style={{ color: "#FF5C69", fontSize: '1.2rem' }} />
                        </div>
                      ) : (
                        <>
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                              className="gestor_btn_secondary"
                              style={{ flexGrow: 1, justifyContent: 'center', background: 'rgba(72, 187, 120, 0.1)', borderColor: 'rgba(72, 187, 120, 0.2)', color: '#38A169', padding: '0.6rem' }}
                              onClick={() => setSolicitudAAprobar(sol)}
                            >
                              <i className="fa-solid fa-check" /> Aprobar
                            </button>
                            <button
                              className="gestor_btn_secondary"
                              style={{ flexGrow: 1, justifyContent: 'center', background: 'rgba(245, 101, 101, 0.1)', borderColor: 'rgba(245, 101, 101, 0.2)', color: '#E53E3E', padding: '0.6rem' }}
                              onClick={() => toggleRechazoBox(sol.id)}
                            >
                              <i className="fa-solid fa-xmark" /> Rechazar
                            </button>
                          </div>

                          {rechazoIdActivo === sol.id && (
                            <div className="gestor_reject_box" style={{ marginTop: '1rem' }}>
                              <span className="gestor_label_min">Comentarios de Rechazo *</span>
                              <textarea
                                className="gestor_feedback_input"
                                placeholder="Escribe el motivo del rechazo de forma constructiva para el Creador..."
                                value={motivoRechazo}
                                onChange={(e) => setMotivoRechazo(e.target.value)}
                                maxLength={300}
                              />
                              <div className="gestor_reject_confirm_row">
                                <button className="gestor_btn_sm btn_cancel" onClick={() => toggleRechazoBox(sol.id)}>Cancelar</button>
                                <button className="gestor_btn_sm btn_confirm" onClick={() => handleRechazar(sol)}>Rechazar</button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── MODAL: CONFIRMAR APROBACIÓN ── */}
      {solicitudAAprobar && (
        <div className="gestor_modal_overlay" onClick={() => setSolicitudAAprobar(null)}>
          <div className="gestor_modal_card" onClick={(e) => e.stopPropagation()}>
            <h3 className="gestor_modal_title">Aprobar Postulante</h3>
            <p className="gestor_modal_text">
              ¿Estás seguro de que deseas aprobar a <strong>{solicitudAAprobar.nombre} {solicitudAAprobar.apellidos}</strong> (@{solicitudAAprobar.usuario}) como Editor de AmorWii?
              <br /><br />
              Esto ascenderá automáticamente al usuario y le otorgará permisos para escribir y programar blogs.
            </p>
            <div className="gestor_modal_actions">
              <button
                className="gestor_btn_secondary"
                onClick={() => setSolicitudAAprobar(null)}
              >
                Cancelar
              </button>
              <button
                className="gestor_submit_btn"
                onClick={handleAprobar}
              >
                Sí, Aprobar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos responsivos rápidos para clases condicionales */}
      <style jsx global>{`
        @media (min-width: 769px) {
          .gestor_mobile_only { display: none !important; }
        }
        @media (max-width: 768px) {
          .gestor_desktop_only { display: none !important; }
        }
      `}</style>
    </div>
  );
}
