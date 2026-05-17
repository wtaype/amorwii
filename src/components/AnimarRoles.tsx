"use client";

import { useState, useEffect } from "react";

interface AnimarRolesProps {
  roles: string[];
}

export default function AnimarRoles({ roles }: AnimarRolesProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % roles.length);
    }, 2800); // Cambia de palabra cada 2.8 segundos

    return () => clearInterval(interval);
  }, [roles]);

  return (
    <div className="hero_roles" style={{ position: 'relative', overflow: 'hidden', height: '4.5vh' }}>
      {roles.map((role, i) => (
        <span
          key={role}
          className={`role ${i === index ? "active" : ""}`}
          style={{
            position: 'absolute',
            left: 0,
            width: '100%',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: i === index ? 1 : 0,
            transform: i === index ? 'translateY(0)' : i < index ? 'translateY(-100%)' : 'translateY(100%)',
            fontSize: 'var(--fz_m5)',
            fontWeight: 800,
            color: 'var(--mco)'
          }}
        >
          {role}
        </span>
      ))}
    </div>
  );
}
