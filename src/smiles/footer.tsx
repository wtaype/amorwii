import Link from "next/link";
import { app, by, lanzamiento, linkme, version } from "./wii";
import { WiIcono } from "./widev/icono";

export function WiFooter() {
  const fecha = new Date();
  const ahora = fecha.getFullYear();
  const actualizado = new Intl.DateTimeFormat("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(fecha);

  return (
    <footer className="foo" aria-label="Informacion del sitio">
      <span className="foo_item">
        Creado con <WiIcono name="heart" /> by{" "}
        <Link className="lkme" href={linkme} target="_blank" rel="noopener noreferrer">
          {by}
        </Link>
      </span>
      <span className="foo_item">
        {lanzamiento} - {ahora}
      </span>
      <span className="foo_item">
        | {app} {version} | actualizado: <time dateTime={fecha.toISOString()}>{actualizado}</time>
      </span>
    </footer>
  );
}
