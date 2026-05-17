import { Suspense } from "react";
import NuevoBlog from "./nuevo";
import "./nuevo.css";

export const metadata = {
  title: "Nuevo Post - AmorWii",
  description: "Crea contenido increíble para la comunidad."
};

export default function NuevoPostPage() {
  return (
    <Suspense fallback={
      <div className="nu_wrap dpvc" style={{ minHeight: "60vh", gap: "2vh" }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "3rem", color: "var(--mco)" }}></i>
        <h3>Cargando editor inteligente...</h3>
      </div>
    }>
      <NuevoBlog />
    </Suspense>
  );
}
