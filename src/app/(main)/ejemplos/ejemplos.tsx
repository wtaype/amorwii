"use client";

import { useState } from "react";
import Link from "next/link";
import Showi from "@/components/Showi";
import { PLANTILLAS, EJEMPLOS, getCategorias, getNombres } from "../data";
import "./ejemplos.css";

export function Ejemplos() {
  const cats = getCategorias();
  const nombres = getNombres();
  const [filtro, setFiltro] = useState("Todas");
  const [copiado, setCopiado] = useState<string | null>(null);

  const copiar = (msg: string) => {
    navigator.clipboard.writeText(msg);
    setCopiado(msg);
    setTimeout(() => setCopiado(null), 1500);
  };

  const usar = (pl: string, msg: string, de: string, para: string) => {
    sessionStorage.setItem('wiPlantilla', pl);
    sessionStorage.setItem('wiMsg', msg);
    sessionStorage.setItem('wiDe', de);
    sessionStorage.setItem('wiPara', para);
  };

  return (
    <div className="ejemplos">
      <div className="ej_hero">
        <Showi>
          <div className="ej_hero_contenido">
            <h1 className="ej_titulo">
              <i className="fas fa-lightbulb" /> <span className="gradiente">Inspiración</span> para tu mensaje
            </h1>
            <p className="ej_subtitulo">Descubre ejemplos reales por categoría. Copia, edita y envía el que más te guste.</p>
            <div className="ej_stats">
              <div className="stat"><i className="fas fa-pen-fancy" /> {nombres.length} plantillas</div>
              <div className="stat"><i className="fas fa-tags" /> {cats.length} categorías</div>
              <div className="stat"><i className="fas fa-bolt" /> Listos para usar</div>
            </div>
          </div>
        </Showi>
      </div>

      <div className="ej_body">
        <div className="ej_filtros">
          <button 
            className={`ej_filtro ${filtro === "Todas" ? "active" : ""}`} 
            onClick={() => setFiltro("Todas")}
          >
            <i className="fas fa-border-all" /> Todas
          </button>
          {cats.map(c => (
            <button 
              key={c}
              className={`ej_filtro ${filtro === c ? "active" : ""}`} 
              onClick={() => setFiltro(c)}
            >
              <i className="fas fa-tag" /> {c}
            </button>
          ))}
        </div>

        <div className="ej_lista">
          {nombres.map(n => {
            const p = PLANTILLAS[n];
            if (filtro !== "Todas" && p.k !== filtro) return null;

            const msgs = EJEMPLOS[n] || [{ de: 'AmorWii', para: 'Tú', msg: p.ej }];

            return (
              <Showi key={n}>
                <div className="ej_seccion">
                  <div className="ej_sec_header">
                    <div className="ej_sec_icono" style={{ background: p.b }}>
                      <i className={`fas ${p.i}`} />
                    </div>
                    <div className="ej_sec_info">
                      <h2>{p.e} {n}</h2>
                      <span className="ej_sec_badge">{p.k}</span>
                    </div>
                  </div>
                  
                  <div className="ej_sec_grid">
                    {msgs.map((m, i) => {
                      const isMusica = !!p.musicas?.length;
                      const previewUrl = `/?${n}&de=${encodeURIComponent(m.de)}&para=${encodeURIComponent(m.para)}&msg=${encodeURIComponent(m.msg)}${isMusica ? `&musica=1` : ''}`;

                      return (
                        <div className="ej_card" key={i}>
                          <div className="ej_card_accent" style={{ background: p.b }} />
                          <div className="ej_card_body">
                            <div className="ej_card_cab">
                              <span className="ej_card_emoji">{p.e}</span>
                              <span className="ej_card_tipo">{n}</span>
                            </div>
                            <p className="ej_card_msg">{m.msg}</p>
                            <div className="ej_card_meta">
                              <span><i className="fas fa-user" /> {m.de}</span>
                              <span><i className="fas fa-heart" /> {m.para}</span>
                            </div>
                          </div>
                          <div className="ej_card_footer">
                            <button 
                              className="ej_btn_copiar" 
                              onClick={() => copiar(m.msg)}
                              title="Copiar texto"
                            >
                              <i className={`fas ${copiado === m.msg ? "fa-check" : "fa-copy"}`} />
                            </button>
                            <Link 
                              href="/crear" 
                              className="ej_btn_usar" 
                              onClick={() => usar(n, m.msg, m.de, m.para)}
                            >
                              <i className="fas fa-paper-plane" /> Usar
                            </Link>
                            <Link href={previewUrl} target="_blank" className="ej_btn_ver" title="Vista previa">
                              <i className="fas fa-eye" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Showi>
            );
          })}
        </div>
      </div>

      <Showi>
        <div className="ej_cta">
          <div className="ej_cta_contenido">
            <span className="ej_cta_icono">✨</span>
            <h2>¿Te gustó alguno?</h2>
            <p>Personalízalo con tu nombre y envíalo a esa persona especial</p>
            <Link href="/crear" className="ej_cta_btn">
              <i className="fas fa-wand-magic-sparkles" /> Crear mi mensaje
            </Link>
          </div>
        </div>
      </Showi>
    </div>
  );
}
