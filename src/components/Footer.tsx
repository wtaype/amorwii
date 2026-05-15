import Link from 'next/link';
import * as wii from '@/app/wii';

export default function Footer() {
  return (
    <footer className="foo">
      <div className="foo_inner">
        <div className="foo_left">
          <div className="foo_brand">
            <span className="foo_app">{wii.app}</span>
            <span className="foo_ver">{wii.version}</span>
          </div>
          <div className="foo_links">
            <Link href="/contacto" className="foo_link">Contacto</Link>
            <Link href="/" className="foo_link">Términos y Privacidad</Link>
          </div>
        </div>
        <div className="foo_right">
          <span>&copy; {wii.lanzamiento} Creado por <a href={wii.linkme} target="_blank" rel="noreferrer">{wii.by}</a></span>
        </div>
      </div>
    </footer>
  );
}
