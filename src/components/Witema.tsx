"use client";

import { useEffect, useState } from "react";
import * as wii from "@/app/wii";

export default function Witema({ themes }: { themes: { name: string; color: string }[] }) {
    const [activeTheme, setActiveTheme] = useState(wii.color);

    useEffect(() => {
        const savedTheme = localStorage.getItem("wiTema");
        let name = wii.color;
        let color = themes.find(t => t.name === wii.color)?.color || "#FF5C69";

        if (savedTheme) {
            const parts = savedTheme.split("|");
            name = parts[0];
            color = parts[1] || color;
        }

        setActiveTheme(name);
        
        // Sincronizar y restaurar el tema en el DOM para corregir la hidratación
        document.documentElement.setAttribute("data-theme", name);
        
        // Sincronizar el color del navegador móvil
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            metaTheme = document.createElement("meta");
            metaTheme.setAttribute("name", "theme-color");
            document.head.appendChild(metaTheme);
        }
        metaTheme.setAttribute("content", color);
    }, [themes]);

    const applyTheme = (name: string, color: string) => {
        setActiveTheme(name);
        
        // Guardar en localStorage
        localStorage.setItem("wiTema", `${name}|${color}`);
        
        // Actualizar el DOM
        document.documentElement.setAttribute("data-theme", name);
        
        // Actualizar el meta theme-color para móviles
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            metaTheme = document.createElement("meta");
            metaTheme.setAttribute("name", "theme-color");
            document.head.appendChild(metaTheme);
        }
        metaTheme.setAttribute("content", color);
    };

    return (
        <div id="wiTema">
            {themes.map((t) => (
                <div
                    key={t.name}
                    className={`tema ${activeTheme === t.name ? "mtha" : ""}`}
                    data-ths={`${t.name}|${t.color}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Tema ${t.name}`}
                    onClick={() => applyTheme(t.name, t.color)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            applyTheme(t.name, t.color);
                        }
                    }}
                />
            ))}
        </div>
    );
}
