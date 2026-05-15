"use client";

import { useRef, useState } from "react";
import type { Mensaje } from "@/lib/supabase/types";
import { obtener } from "./index";

export function VisorPlantilla({ mensaje }: { mensaje: Mensaje }) {
  const pData = obtener(mensaje.nombre || "Amor");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  return (
    <main className="love_view" style={{ "--love-bg": pData.fondo, "--love-color": pData.color } as React.CSSProperties}>
      <style
        dangerouslySetInnerHTML={{
          __html: `html,body{margin:0}body{font-family:Poppins,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;overflow-x:hidden}.love_view{min-height:100dvh;display:grid;place-items:center;padding:4vh 4vw;background:var(--love-bg);position:relative;overflow:hidden;box-sizing:border-box}.love_view::before,.love_view::after{content:"";position:absolute;width:34vh;height:34vh;border-radius:50%;background:rgba(255,255,255,.24);filter:blur(6px)}.love_view::before{top:-12vh;right:-10vh}.love_view::after{bottom:-14vh;left:-12vh}.love_card{position:relative;z-index:1;width:min(560px,100%);text-align:center;color:#fff;padding:clamp(3vh,7vw,7vh) clamp(2.2vh,5vw,5vh);border-radius:2.2vh;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.18);box-shadow:0 3vh 8vh rgba(0,0,0,.16);backdrop-filter:blur(16px);box-sizing:border-box}.love_badge{display:inline-flex;align-items:center;justify-content:center;padding:.8vh 1.6vh;border-radius:50px;background:rgba(0,0,0,.16);border:1px solid rgba(255,255,255,.22);font-size:.78rem;font-weight:900;text-transform:uppercase;letter-spacing:.18em}.love_emoji{font-size:clamp(4rem,12vh,7rem);margin:2vh 0 1vh;filter:drop-shadow(0 1vh 2vh rgba(0,0,0,.2));animation:crBeat 1.7s ease-in-out infinite}.love_para{margin:0;color:rgba(255,255,255,.82);font-weight:900;text-transform:uppercase;letter-spacing:.35em;font-size:.74rem}.love_card h1{color:#fff;font-size:clamp(2.6rem,10vw,5.6rem);line-height:.95;font-weight:900;margin:.7vh 0 2.5vh;text-shadow:0 1vh 2.5vh rgba(0,0,0,.2);overflow-wrap:anywhere}.love_img{width:100%;max-height:320px;object-fit:cover;border-radius:1.4vh;border:1px solid rgba(255,255,255,.3);margin-bottom:2vh}.love_msg{color:rgba(255,255,255,.96);font-size:clamp(1rem,2.3vw,1.28rem);line-height:1.8;white-space:pre-wrap;margin:0 auto 2.5vh;max-width:40ch;font-weight:650}.love_de{color:rgba(255,255,255,.88);font-size:clamp(.95rem,2vw,1.15rem);margin:0 0 2vh}.love_de strong{color:#fff;font-weight:900}.love_music{display:inline-flex;align-items:center;justify-content:center;gap:1vh;min-height:5.2vh;padding:0 2.2vh;border:0;border-radius:50px;background:#fff;color:var(--love-color);font:inherit;font-weight:900;box-shadow:0 1vh 2.5vh rgba(0,0,0,.16);cursor:pointer}@keyframes crBeat{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}`,
        }}
      />
      <div className="love_card">
        <span className="love_badge">{mensaje.nombre || pData.id}</span>
        <div className="love_emoji">{mensaje.emoji || pData.emoji}</div>
        <p className="love_para">Para</p>
        <h1>{mensaje.para || "Alguien especial"}</h1>
        {mensaje.img && <img src={mensaje.img} alt="Recuerdo del mensaje" className="love_img" />}
        <p className="love_msg">{mensaje.msg || "Un mensaje especial creado con AmorWii."}</p>
        {mensaje.de && <p className="love_de">Con amor, <strong>{mensaje.de}</strong></p>}
        {mensaje.musica && (
          <>
            <button type="button" className="love_music" onClick={toggleAudio}>
              <i className={`fas fa-${isPlaying ? "pause" : "play"}`} aria-hidden="true"></i>
              {isPlaying ? "Pausar musica" : "Reproducir musica"}
            </button>
            <audio ref={audioRef} src={mensaje.musica} loop onPause={() => setIsPlaying(false)} />
          </>
        )}
      </div>
    </main>
  );
}
