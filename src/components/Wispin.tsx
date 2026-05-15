import React from 'react';

type WispinProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  cargando: boolean;
  textoCarga?: string;
  ico?: string;
};

export default function Wispin({ cargando, textoCarga = "Procesando...", ico, children, className, disabled, ...props }: WispinProps) {
  return (
    <button className={`${className || ""} ${cargando ? "inactivo" : ""}`.trim()} disabled={cargando || disabled} {...props}>
      {cargando ? (
        <i className="fas fa-circle-notch fa-spin" />
      ) : (
        ico && <i className={`fas ${ico}`} />
      )}
      {cargando ? ` ${textoCarga}` : ` ${children}`}
    </button>
  );
}
