"use client";

import React from "react";

interface WiTipProps {
  children: React.ReactNode;
  tipo?: "info" | "warning" | "love";
}

export default function WiTip({ children, tipo = "info" }: WiTipProps) {
  // Colores según el tipo
  const configs = {
    info: { icon: "💡", bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.3)", color: "#60A5FA" },
    warning: { icon: "⚠️", bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.3)", color: "#FBBF24" },
    love: { icon: "❤️", bg: "rgba(255, 92, 105, 0.1)", border: "rgba(255, 92, 105, 0.3)", color: "#FF5C69" },
  };

  const c = configs[tipo] || configs.info;

  return (
    <div style={{
      display: "flex",
      gap: "15px",
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: "16px",
      padding: "20px",
      margin: "25px 0",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
    }}>
      <div style={{ fontSize: "1.8rem", flexShrink: 0 }}>
        {c.icon}
      </div>
      <div style={{
        color: "var(--tx)", 
        fontSize: "0.95rem", 
        lineHeight: "1.6",
        opacity: 0.9
      }}>
        {/* Usamos un span oscuro para títulos si existen, o simplemente el contenido */}
        <strong style={{ color: c.color, display: "block", marginBottom: "5px", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "1px" }}>
          Consejo Especial
        </strong>
        {children}
      </div>
    </div>
  );
}
