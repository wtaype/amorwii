// ── TIPOS DE BASE DE DATOS ───────────────────────────────────────────────────
// Estructura de las tablas de Supabase en camelCase

// Tabla: smiles (usuarios)
export type Smile = {
  id: string;        // uuid PK linked to auth.users(id)
  usuario: string;   // username único
  email: string;     // unique
  nombre: string;
  apellidos: string;
  avatar: string;    // URL foto Google o vacío
  bio: string;
  estado: "activo" | "pendiente";
  plan: "free" | "pro";
  rol: "creador" | "editor" | "gestor" | "admin";
  segmento: "smile" | "empresa" | "negocios";
  tema: string;      // "Oro|#FFC107"
  terminos: boolean;
  verificado: boolean;
  registradoPor: "google" | "correo";
  // Campos adicionales para el perfil
  fechaNacimiento?: string;
  genero?: string;
  pais?: string;
  gustos?: string;
  creado: string;      // timestamptz
  actualizado: string; // timestamptz
};

// Tabla: sorpresas (páginas personalizadas)
export type Sorpresa = {
  id: string;   // uuid PK auto
  slug: string;   // unique — la URL personalizada
  usuario: string;   // FK → smiles.usuario
  titulo: string;
  mensaje: string;
  para: string;   // nombre del destinatario
  de: string;   // nombre del remitente
  plantilla: string;   // estilo visual
  color: string;   // color principal
  musica: string;   // URL audio (futuro)
  imagen: string;   // URL imagen (futuro)
  visitas: number;   // contador
  estado: "activo" | "borrador" | "eliminado";
  creado: string;   // timestamptz
};

// Datos para crear un nuevo Smile (sin 'creado' y 'actualizado' porque son auto)
export type SmileNuevo = Omit<Smile, "creado" | "actualizado">;

// Datos para crear una nueva Sorpresa (sin 'id' y 'creado')
export type SorpresaNueva = Omit<Sorpresa, "id" | "creado">;
