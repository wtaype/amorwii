import type { Metadata } from "next";
import Login from "./login";
import "./login.css";

export const metadata: Metadata = {
  title: "Iniciar Sesión | AmorWii",
  description: "Inicia sesión o crea tu cuenta en AmorWii para crear mensajes de amor personalizados.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <Login />;
}
