"use client";

import { useEffect, useState } from "react";

export default function Saludo({ nombre }: { nombre?: string }) {
  const [saludo, setSaludo] = useState("");

  useEffect(() => {
    const hrs = new Date().getHours();
    setSaludo(
      hrs >= 5 && hrs < 12 ? "Buenos días, " : hrs >= 12 && hrs < 18 ? "Buenas tardes, " : "Buenas noches, "
    );
  }, []);

  return (
    <span className="wi_saludo">
      {saludo}
      {nombre && <strong>{nombre}</strong>}
    </span>
  );
}
