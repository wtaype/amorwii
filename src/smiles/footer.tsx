import Link from "next/link";
import { app, by, lanzamiento, linkme, version } from "./wii";

const LINKS = [
  { href: "/acerca", label: "Acerca" },
  { href: "/terminos", label: "Términos" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/cookies", label: "Cookies" },
  { href: "/contacto", label: "Contacto" },
];

export function WiFooter() {
  const ahora = new Date().getFullYear();

  return (
    <footer className="foo" aria-label="Informacion del sitio">
      <div className="foo_inner">
        <div className="foo_left">
          <div className="foo_brand">
            <span className="foo_app">{app}</span>
            <span className="foo_ver">{version}</span>
          </div>
          <div className="foo_links">
            {LINKS.map((lk) => (
              <Link key={lk.href} href={lk.href} className="foo_link">
                {lk.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="foo_right">
          <span>
            © {lanzamiento}–{ahora}{" "}
            <Link href={linkme} target="_blank" rel="noopener noreferrer">
              {by}
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
