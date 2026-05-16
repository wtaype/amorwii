"use client";

import { useState } from "react";
import Link from "next/link";
import Showi from "@/components/Showi";
import { PLANTILLAS, getCategorias, getNombres } from "../data";
import { linkweb } from "@/app/wii";
import "./plantillas.css";

export function Plantillas() {
  const cats = getCategorias();
  const nombres = getNombres();
  const [filtro, setFiltro] = useState("Todas");

  const cards = nombres.filter(n => filtro === "Todas" || PLANTILLAS[n].k === filtro);

  return (
    <div className="plantilla">
      <div className="pl_hero">
        <Showi>
          <div className="pl_hero_contenido">
            <h1 className="pl_titulo">
              <i className="fas fa-palette" /> Nuestras <span className="gradiente">Plantillas</span>
            </h1>
            <p className="pl_subtitulo">Elige el estilo perfecto para expresar lo que sientes. Cada plantilla está diseñada para emocionar.</p>
            <div className="pl_stats">
              <div className="stat"><i className="fas fa-layer-group" /> {nombres.length} plantillas</div>
              <div className="stat"><i className="fas fa-tags" /> {cats.length} categorías</div>
              <div className="stat"><i className="fas fa-music" /> Con música</div>
            </div>
          </div>
        </Showi>
      </div>

      <div className="pl_galeria">
        <div className="pl_filtros">
          <button 
            className={`pl_filtro ${filtro === "Todas" ? "active" : ""}`} 
            onClick={() => setFiltro("Todas")}
          >
            <i className="fas fa-border-all" /> Todas
          </button>
          {cats.map(c => (
            <button 
              key={c}
              className={`pl_filtro ${filtro === c ? "active" : ""}`} 
              onClick={() => setFiltro(c)}
            >
              <i className="fas fa-tag" /> {c}
            </button>
          ))}
        </div>

        <div className="pl_grid">
          {cards.map(n => {
            const p = PLANTILLAS[n];
            const isMusica = !!p.musicas?.length;
            const previewUrl = `/?${n}&de=AmorWii&para=Alguien+especial&msg=${encodeURIComponent(p.ej)}${isMusica ? `&musica=1` : ''}`;

            return (
              <Showi key={n}>
                <div className="pl_card">
                  <div className="pl_card_preview" style={{ background: p.b }}>
                    {isMusica && <div className="pl_card_music"><i className="fas fa-music" /></div>}
                    <i className={`fas ${p.i} pl_card_icono`} />
                    <div className="pl_card_mini">
                      <span className="pl_mini_label">Para ti</span>
                      <span className="pl_mini_nombre">{n}</span>
                      <span className="pl_mini_emoji">{p.e}</span>
                    </div>
                  </div>
                  <div className="pl_card_contenido">
                    <div className="pl_card_header">
                      <h3><i className={`fas ${p.i}`} style={{ color: p.x }} /> {n}</h3>
                      <span className="pl_card_badge">{p.k}</span>
                    </div>
                    <p className="pl_card_desc">{p.d}</p>
                    <div className="pl_card_ejemplo">
                      <i className="fas fa-quote-left" />
                      <p>{p.ej}</p>
                    </div>
                    <div className="pl_card_footer">
                      <Link href={`/crear`} className="pl_btn_usar" onClick={() => sessionStorage.setItem('wiPlantilla', n)}>
                        <i className="fas fa-plus" /> Usar
                      </Link>
                      <Link href={previewUrl} target="_blank" className="pl_btn_preview" title="Vista previa">
                        <i className="fas fa-eye" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Showi>
            );
          })}
        </div>
      </div>

      <Showi>
        <div className="pl_cta">
          <div className="pl_cta_contenido">
            <span className="pl_cta_icono">💌</span>
            <h2>¿Listo para emocionar?</h2>
            <p>Elige tu plantilla favorita y crea un mensaje inolvidable en segundos</p>
            <Link href="/crear" className="pl_cta_btn">
              <i className="fas fa-wand-magic-sparkles" /> Crear mensaje
            </Link>
          </div>
        </div>
      </Showi>
    </div>
  );
}
