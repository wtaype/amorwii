"use client";

import { useEffect, useState } from "react";
import { cx } from "./clase";
import { WI_TEMAS, type WiTema } from "./temas";
import { cambiarTema, iniciarTema } from "./witema";

export function WiTemaPicker() {
  const [tema, setTema] = useState<WiTema>("Dulce");

  useEffect(() => {
    setTema(iniciarTema());
  }, []);

  return (
    <div id="wiTema" role="group" aria-label="Selector de tema">
      {WI_TEMAS.map((t) => (
        <button
          key={t.nombre}
          type="button"
          className={cx("tema", tema === t.nombre && "mtha")}
          data-ths={`${t.nombre}|${t.color}`}
          aria-label={`Tema ${t.nombre}`}
          title={`Tema ${t.nombre}`}
          onClick={() => {
            cambiarTema(t.nombre);
            setTema(t.nombre);
          }}
        />
      ))}
    </div>
  );
}
