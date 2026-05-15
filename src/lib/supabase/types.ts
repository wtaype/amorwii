/* ── Tipos de Base de Datos — Supabase AmorWii ────────────────── */

export type Rol = "smile" | "editor" | "admin";

export interface Perfil {
  id: string;
  usuario: string;
  email: string;
  nombre: string;
  apellidos: string;
  rol: Rol;
  tema: string;
  terminos: boolean;
  created_at: string;
  updated_at: string;
}

export interface Mensaje {
  id: string;
  slug: string;
  plantilla: string;
  nombre: string;
  de: string;
  para: string;
  msg: string;
  musica: string;
  emoji: string;
  img: string;
  vistas: number;
  publico: boolean;
  user_id: string | null;
  email: string;
  usuario: string;
  created_at: string;
  updated_at: string;
}

export interface WiMensaje {
  id: string;
  mensaje: string;
  email: string;
  usuario: string;
  created_at: string;
}

export interface WiAudio {
  id: string;
  email: string;
  titulo: string;
  src: string;
  created_at: string;
}

export interface WiImagen {
  id: string;
  email: string;
  titulo: string;
  src: string;
  created_at: string;
}

/* ── Database type map para Supabase ──────────────────────────── */
export interface Database {
  public: {
    Tables: {
      mensajes: { Row: Mensaje; Insert: Partial<Mensaje> & Pick<Mensaje, "slug" | "msg">; Update: Partial<Mensaje>; Relationships: [] };
      perfiles: { Row: Perfil; Insert: Partial<Perfil> & Pick<Perfil, "id" | "usuario" | "email">; Update: Partial<Perfil>; Relationships: [] };
      wi_mensajes: { Row: WiMensaje; Insert: Partial<WiMensaje> & Pick<WiMensaje, "mensaje" | "email">; Update: Partial<WiMensaje>; Relationships: [] };
      wi_audios: { Row: WiAudio; Insert: Partial<WiAudio> & Pick<WiAudio, "email" | "titulo" | "src">; Update: Partial<WiAudio>; Relationships: [] };
      wi_imagenes: { Row: WiImagen; Insert: Partial<WiImagen> & Pick<WiImagen, "email" | "titulo" | "src">; Update: Partial<WiImagen>; Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: {
      incrementar_vistas: {
        Args: { mensaje_id: string };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
