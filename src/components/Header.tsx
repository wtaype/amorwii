import Link from 'next/link';
import * as wii from '@/app/wii';

export default function Header() {
  return (
    <header className="wiheader">
      <div className="nv_left">
        <Link href="/" className="wilogo">
          <i className={`fa-solid ${wii.icon}`}></i> {wii.app}
        </Link>
        <nav className="winav">
          <Link href="/" className="nv_item active">
            <i className="fa-solid fa-home"></i> <span>Inicio</span>
          </Link>
          <Link href="/contacto" className="nv_item">
            <i className="fa-solid fa-envelope"></i> <span>Contacto</span>
          </Link>
        </nav>
      </div>
      <div className="nv_right">
        <button className="bt_auth">
          <i className="fa-solid fa-user"></i> <span>Ingresar</span>
        </button>
      </div>
    </header>
  );
}
