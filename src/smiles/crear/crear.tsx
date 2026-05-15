"use client";

import Link from "next/link";
import { useCreator } from "./useCreator";
import "./crear.css";

export function CrearForm() {
  const { form, setField, loading, urlLarga, urlCorta, guardar, copiar } = useCreator();

  return (
    <section className="cr_new">
      <div className="cr_intro">
        <h1>Personaliza tu AmorWii</h1>
        <p>Rellena los detalles para crear una experiencia romántica única.</p>
      </div>

      <div className="cr_builder">
        {/* Lado izquierdo (60%) */}
        <div className="cr_form_col">
          {/* Tarjeta 1 */}
          <div className="cr_card">
            <div className="cr_card_header">
              <div className="cr_card_title">
                <i className="fas fa-pen-nib" aria-hidden="true"></i>
                <h2>Prepara el detalle</h2>
              </div>
              <span className="cr_badge_outline"><i className="far fa-heart" aria-hidden="true"></i> Plantilla Amor</span>
            </div>
            <div className="cr_grid2 mt-3">
              <label className="cr_field">
                <span>Tu nombre</span>
                <input placeholder="Ej: Mateo" value={form.de} onChange={(e) => setField("de", e.target.value)} />
              </label>
              <label className="cr_field">
                <span>Su nombre</span>
                <input placeholder="Ej: Sofía" value={form.para} onChange={(e) => setField("para", e.target.value)} />
              </label>
            </div>
            <label className="cr_field mt-3">
              <span>Tu mensaje de amor</span>
              <textarea placeholder="Escribe algo desde el corazón..." value={form.msg} onChange={(e) => setField("msg", e.target.value)} rows={4}></textarea>
            </label>
          </div>

          {/* Tarjeta 2 */}
          <div className="cr_card">
            <div className="cr_card_title mb-3">
              <i className="fas fa-wand-magic-sparkles" aria-hidden="true"></i>
              <h2>Diseño y Efectos</h2>
            </div>
            <span className="cr_label">¿Qué quieres que flote?</span>
            <div className="cr_effects_grid">
              <button type="button" className={`cr_effect_btn ${form.efecto === "corazones" ? "active" : ""}`} onClick={() => setField("efecto", "corazones")}>
                <i className="fas fa-heart" aria-hidden="true"></i> Corazones
              </button>
              <button type="button" className={`cr_effect_btn ${form.efecto === "flores" ? "active" : ""}`} onClick={() => setField("efecto", "flores")}>
                <i className="fas fa-fan" aria-hidden="true"></i> Flores
              </button>
              <button type="button" className={`cr_effect_btn ${form.efecto === "estrellas" ? "active" : ""}`} onClick={() => setField("efecto", "estrellas")}>
                <i className="fas fa-star" aria-hidden="true"></i> Estrellas
              </button>
              <button type="button" className={`cr_effect_btn ${form.efecto === "brillos" ? "active" : ""}`} onClick={() => setField("efecto", "brillos")}>
                <i className="fas fa-sparkles" aria-hidden="true"></i> Brillos
              </button>
            </div>

            <span className="cr_label mt-4">Selecciona una Imagen</span>
            <div className="cr_images_grid">
              <button type="button" className={`cr_img_btn ${form.fondoId === "1" ? "active" : ""}`} onClick={() => setField("fondoId", "1")}>
                <div className="cr_img_bg bg_1"></div>
                {form.fondoId === "1" && <div className="cr_img_check"><i className="fas fa-check-circle" aria-hidden="true"></i></div>}
              </button>
              <button type="button" className={`cr_img_btn ${form.fondoId === "2" ? "active" : ""}`} onClick={() => setField("fondoId", "2")}>
                <div className="cr_img_bg bg_2"></div>
                {form.fondoId === "2" && <div className="cr_img_check"><i className="fas fa-check-circle" aria-hidden="true"></i></div>}
              </button>
              <button type="button" className={`cr_img_btn ${form.fondoId === "3" ? "active" : ""}`} onClick={() => setField("fondoId", "3")}>
                <div className="cr_img_bg bg_3"></div>
                {form.fondoId === "3" && <div className="cr_img_check"><i className="fas fa-check-circle" aria-hidden="true"></i></div>}
              </button>
            </div>
          </div>

          {/* Tarjeta 3 */}
          <div className="cr_card">
            <div className="cr_card_title mb-3">
              <i className="fas fa-music" aria-hidden="true"></i>
              <h2>Selecciona Musica</h2>
            </div>
            <label className="cr_field">
              <span>Enlace de música</span>
              <input placeholder="Pega el enlace de YouTube o Spotify aquí" value={form.musicaUrl} onChange={(e) => setField("musicaUrl", e.target.value)} />
            </label>
          </div>

          {/* Tarjeta 4 */}
          <div className="cr_card">
            <div className="cr_card_header">
              <div className="cr_card_title">
                <i className="fas fa-link" aria-hidden="true"></i>
                <h2>Enlaces</h2>
              </div>
              <button type="button" className="cr_btn_primary" onClick={guardar} disabled={loading || !form.para.trim()}>
                <i className="fas fa-bolt" aria-hidden="true"></i> {loading ? "Generando..." : "Generar y copiar Links"}
              </button>
            </div>

            <div className="cr_link_row mt-4">
              <span className="cr_label">Link largo</span>
              <div className="cr_link_input_group">
                <div className="cr_input_with_prefix disabled_bg">
                  <span>amorwii.com/</span>
                  <input readOnly value={urlLarga ? urlLarga.replace("http://localhost:3000/?", "") : ""} placeholder="para-sofia-mensaje..." />
                </div>
                <button type="button" className="cr_icon_btn" onClick={() => copiar(urlLarga)} disabled={!urlLarga}><i className="fas fa-copy" aria-hidden="true"></i></button>
                <Link href={urlLarga || "#"} target="_blank" className={`cr_icon_btn ${!urlLarga ? "disabled" : ""}`}><i className="fas fa-external-link-alt" aria-hidden="true"></i></Link>
              </div>
            </div>

            <div className="cr_link_row mt-3">
              <span className="cr_label">Link corto</span>
              <div className="cr_link_input_group">
                <div className="cr_input_with_prefix">
                  <span>amw.li/</span>
                  <input value={form.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="para-sofia" />
                </div>
                <button type="button" className="cr_icon_btn" onClick={() => copiar(urlCorta)} disabled={!urlCorta}><i className="fas fa-copy" aria-hidden="true"></i></button>
                <Link href={urlCorta || "#"} target="_blank" className={`cr_icon_btn ${!urlCorta ? "disabled" : ""}`}><i className="fas fa-external-link-alt" aria-hidden="true"></i></Link>
              </div>
              <p className="cr_help_text mt-2">Estos serán los links que compartirás con esa persona especial.</p>
            </div>
          </div>
        </div>

        {/* Lado derecho (40%) - Vista Previa */}
        <div className="cr_preview_col">
          <div className="cr_phone_container">
            <div className={`cr_phone bg_${form.fondoId}`}>
              <div className="cr_notch"></div>
              <div className="cr_phone_content">
                <div className="cr_phone_header">
                  <i className="fas fa-chevron-left" aria-hidden="true"></i>
                  <i className="far fa-heart" aria-hidden="true"></i>
                </div>
                
                <div className="cr_phone_body">
                  <div className="cr_phone_hero">
                    <i className="far fa-heart cr_big_icon" aria-hidden="true"></i>
                    <h2>Para {form.para || "Sofía"}</h2>
                  </div>
                  
                  <p className="cr_phone_msg">"{form.msg || "Cada día que pasa me doy cuenta de lo afortunado que soy de tenerte a mi lado. Esta pequeña sorpresa es solo un reflejo de lo mucho que te amo."}"</p>
                  
                  <div className="cr_phone_footer">
                    <i className="far fa-heart cr_small_icon" aria-hidden="true"></i>
                    <div className="cr_play_btn">
                      <i className="fas fa-play" aria-hidden="true"></i>
                    </div>
                    <span className="cr_music_label">MÚSICA SELECCIONADA</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="cr_preview_label">
              <i className="fas fa-eye" aria-hidden="true"></i> Vista previa en tiempo real
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
