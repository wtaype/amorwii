"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Mensaje } from "@/components/Mensaje";

interface BienvenidoProps {
  perfil: any;
}

export default function Bienvenido({ perfil }: BienvenidoProps) {
  const [totalPosts, setTotalPosts] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  
  // Modales interactivos para simular funciones de planificador y artículos
  const [mostrarPlanificador, setMostrarPlanificador] = useState(false);
  const [mostrarArticulos, setMostrarArticulos] = useState(false);

  // Cargar estadísticas reales del autor desde la tabla "blog"
  useEffect(() => {
    async function cargarEstadisticas() {
      if (!perfil?.id) return;
      try {
        const { count, error } = await supabase
          .from("blog")
          .select("*", { count: "exact", head: true })
          .eq("userId", perfil.id);

        if (!error && count !== null) {
          setTotalPosts(count);
        }
      } catch (err) {
        console.error("Error al cargar estadísticas del editor:", err);
      } finally {
        setLoadingStats(false);
      }
    }

    cargarEstadisticas();
  }, [perfil]);

  return (
    <div className="editor_container">
      
      {/* ── ENCABEZADO PERSONALIZADO DEL PORTAL ── */}
      <div className="editor_header_section">
        <div className="editor_title_box">
          <div className="editor_badge">
            <i className="fa-solid fa-pen-nib" /> Portal del Redactor Oficial
          </div>
          <h1 className="editor_title">
            ¡Bienvenido al Equipo, {perfil?.nombre || "Smile"}! ✍️💖
          </h1>
          <p className="editor_subtitle">
            Tus hermosas palabras e ideas románticas tienen el poder de inspirar a miles de Smiles. ¡Creemos magia literaria hoy!
          </p>
        </div>
      </div>

      {/* ── PANEL DE ESTADÍSTICAS DEL EDITOR ── */}
      <div className="editor_stats_grid">
        <div className="editor_stat_card">
          <div className="editor_stat_icon posts">
            <i className="fa-solid fa-book-open" />
          </div>
          <div className="editor_stat_info">
            <span className="editor_stat_label">Mis Artículos</span>
            <span className="editor_stat_val">
              {loadingStats ? <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '1rem', color: '#FF5C69' }} /> : totalPosts}
            </span>
          </div>
        </div>

        <div className="editor_stat_card">
          <div className="editor_stat_icon views">
            <i className="fa-solid fa-eye" />
          </div>
          <div className="editor_stat_info">
            <span className="editor_stat_label">Lecturas Totales</span>
            <span className="editor_stat_val">0</span>
          </div>
        </div>

        <div className="editor_stat_card">
          <div className="editor_stat_icon comments">
            <i className="fa-solid fa-comments" />
          </div>
          <div className="editor_stat_info">
            <span className="editor_stat_label">Comentarios</span>
            <span className="editor_stat_val">0</span>
          </div>
        </div>

        <div className="editor_stat_card">
          <div className="editor_stat_icon hearts">
            <i className="fa-solid fa-heart" />
          </div>
          <div className="editor_stat_info">
            <span className="editor_stat_label">Likes Recibidos</span>
            <span className="editor_stat_val">0</span>
          </div>
        </div>
      </div>

      {/* ── MENÚ DEDICADO DE ACCIONES RÁPIDAS (Glow Themes) ── */}
      <div className="editor_menu_grid">
        
        {/* TARJETA 1: CREAR NUEVA HISTORIA (RED GLOW) */}
        <Link href="/nuevo" className="editor_menu_card">
          <div className="editor_card_glow">
            <i className="fa-solid fa-pen-fancy" />
          </div>
          <h3 className="editor_card_title">Crear Nueva Historia</h3>
          <p className="editor_card_desc">
            Redacta un nuevo artículo de blog, comparte dedicatorias, reflexiones o cartas de amor a distancia utilizando el editor Markdown Pro.
          </p>
          <span className="editor_card_action_link">
            Escribir historia <i className="fa-solid fa-arrow-right-long" />
          </span>
        </Link>

        {/* TARJETA 2: ADMINISTRAR HISTORIAS (BLUE GLOW) */}
        <div 
          className="editor_menu_card blue_theme" 
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setMostrarArticulos(true);
            Mensaje("Estamos preparando tu suite de analíticas de lectura de artículos. ¡Muy pronto!", "info");
          }}
        >
          <div className="editor_card_glow">
            <i className="fa-solid fa-folder-open" />
          </div>
          <h3 className="editor_card_title">Mis Artículos Oficiales</h3>
          <p className="editor_card_desc">
            Edita, optimiza o destaca tus publicaciones de blog anteriores. Mantén tus artículos actualizados y atractivos para tus lectores.
          </p>
          <span className="editor_card_action_link">
            Administrar artículos <i className="fa-solid fa-arrow-right-long" />
          </span>
        </div>

        {/* TARJETA 3: PLANIFICADOR (PURPLE GLOW) */}
        <div 
          className="editor_menu_card purple_theme"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setMostrarPlanificador(true);
            Mensaje("El planificador interactivo de citas y cronogramas se habilitará en la Fase Detalles. 📅✨", "info");
          }}
        >
          <div className="editor_card_glow">
            <i className="fa-solid fa-gift" />
          </div>
          <h3 className="editor_card_title">Planificador de Detalles</h3>
          <p className="editor_card_desc">
            Organiza sorpresas de aniversario, dedicatorias y hermosas ideas de citas románticas para guiar a las parejas Smiles.
          </p>
          <span className="editor_card_action_link">
            Planificar sorpresas <i className="fa-solid fa-arrow-right-long" />
          </span>
        </div>

        {/* TARJETA 4: PERFIL DE AUTOR (GREEN GLOW) */}
        <Link href="/crear" className="editor_menu_card green_theme">
          <div className="editor_card_glow">
            <i className="fa-solid fa-user-gear" />
          </div>
          <h3 className="editor_card_title">Mi Firma de Autor</h3>
          <p className="editor_card_desc">
            Actualiza tu biografía literaria, foto de perfil Smiles y enlaces de contacto para que todos los lectores conozcan a la mente detrás del amor.
          </p>
          <span className="editor_card_action_link">
            Editar firma <i className="fa-solid fa-arrow-right-long" />
          </span>
        </Link>
      </div>

      {/* ── MODAL: MIS ARTÍCULOS DETALLES ── */}
      {mostrarArticulos && (
        <div className="gestor_modal_overlay" onClick={() => setMostrarArticulos(false)}>
          <div className="gestor_modal_card" onClick={(e) => e.stopPropagation()}>
            <h3 className="gestor_modal_title">Mis Artículos Oficiales</h3>
            <p className="gestor_modal_text">
              Actualmente has publicado <strong>{totalPosts}</strong> {totalPosts === 1 ? 'artículo' : 'artículos'} de blog oficiales.
              <br /><br />
              La suite de analíticas avanzadas, conteo de visitas, comentarios filtrados de Disqus y el listado de edición interactiva se están indexando. 
              Por el momento, puedes editar tus posts anteriores ingresando a la dirección del post y seleccionando "Editar" si tienes sesión iniciada como autor.
            </p>
            <div className="gestor_modal_actions">
              <button 
                className="gestor_submit_btn" 
                style={{ width: 'auto', padding: '0.65rem 1.5rem', margin: 0, boxShadow: 'none' }}
                onClick={() => setMostrarArticulos(false)}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: PLANIFICADOR DETALLES ── */}
      {mostrarPlanificador && (
        <div className="gestor_modal_overlay" onClick={() => setMostrarPlanificador(false)}>
          <div className="gestor_modal_card" onClick={(e) => e.stopPropagation()}>
            <h3 className="gestor_modal_title">Planificador de Detalles</h3>
            <p className="gestor_modal_text">
              ¡Hola, {perfil?.nombre}! El Planificador de Detalles es una herramienta exclusiva en desarrollo para que los Editores puedan diagramar calendarios interactivos de aniversario, plantillas de cartas de amor descargables y recomendaciones de citas físicas y virtuales.
              <br /><br />
              Esta sección se habilitará por completo durante la **Fase 3: Sorpresas Premium & Privacidad (Detalles)**. ¡Mantente atento!
            </p>
            <div className="gestor_modal_actions">
              <button 
                className="gestor_submit_btn" 
                style={{ width: 'auto', padding: '0.65rem 1.5rem', margin: 0, boxShadow: 'none' }}
                onClick={() => setMostrarPlanificador(false)}
              >
                ¡Excelente!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
