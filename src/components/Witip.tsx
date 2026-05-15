import React from 'react';

export type TipoTip = "success" | "error" | "warning" | "info" | "mco";

type WitipProps = {
  show: boolean;
  msg: string;
  tipo?: TipoTip;
  children: React.ReactNode;
};

export default function Witip({ show, msg, tipo = "error", children }: WitipProps) {
  const color = { 
    success: 'var(--success)', error: 'var(--error)', 
    warning: 'var(--warning)', info: 'var(--info)', mco: 'var(--mco)' 
  }[tipo] || 'var(--mco)';

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {show && msg && (
        <div style={{
          position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-5px)',
          background: color, color: 'var(--txa)', padding: '.6vh 1.2vh', borderRadius: '.6vh',
          fontSize: 'var(--fz_s4)', fontWeight: 500, whiteSpace: 'nowrap', zIndex: 10,
          boxShadow: '0 .4vh 1.2vh rgba(0,0,0,.2)', animation: 'liEntrar 0.2s cubic-bezier(.4,0,.2,1)',
          marginBottom: '5px', pointerEvents: 'none', backdropFilter: 'blur(.4vh)'
        }}>
          <span dangerouslySetInnerHTML={{ __html: msg }} />
          <div style={{
            position: 'absolute', top: '100%', left: '50%', marginLeft: '-5px',
            border: '5px solid transparent', borderTopColor: color
          }} />
        </div>
      )}
      {children}
    </div>
  );
}
