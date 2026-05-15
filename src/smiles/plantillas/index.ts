/* ── Catálogo de Plantillas AmorWii — Migrado de Lovewi parametros.js ─── */

export interface Musica {
  nombre: string;
  url: string;
}

export interface Plantilla {
  id: string;        // clave interna (amor, amistad, etc)
  carpeta: string;   // carpeta/slug URL
  icono: string;     // clase FA
  categoria: string; // Romántico | Amistad | Celebración
  color: string;     // color principal
  emoji: string;
  fondo: string;     // CSS gradient
  descripcion: string;
  ejemplo: string;
  musicaDefault: string;
  musicas: Musica[];
  img?: string;
}

const PLANTILLAS: Record<string, Plantilla> = {
  Amor: {
    id: "Amor", carpeta: "amor", icono: "fa-heart", categoria: "Romántico",
    color: "#ff6b8a", emoji: "💕",
    fondo: "linear-gradient(135deg,#ff6b8a,#ffb3c1,#fff0f3)",
    descripcion: "Perfecta para declaraciones de amor y San Valentín",
    ejemplo: "Eres mi todo, mi razón de sonreír cada día 💕",
    musicaDefault: "https://raw.githubusercontent.com/geluksee/nice/main/FloresAmarillas.mp3",
    musicas: [
      { nombre: "Flores Amarillas", url: "https://raw.githubusercontent.com/geluksee/nice/main/FloresAmarillas.mp3" },
      { nombre: "You Are Somebody", url: "https://raw.githubusercontent.com/geluksee/hopeee/main/You%20are%20Somebody%20Else%20by%20Flora%20Cash.mp3" },
      { nombre: "I Surrender", url: "https://raw.githubusercontent.com/geluksee/hopeee/main/I%20Surrender%20-%20Hillsong%20Worship.mp3" },
    ],
  },
  Amistad: {
    id: "Amistad", carpeta: "amistad", icono: "fa-user-group", categoria: "Amistad",
    color: "#6b8aff", emoji: "💙",
    fondo: "linear-gradient(135deg,#6b8aff,#b3c1ff,#f0f3ff)",
    descripcion: "Celebra la amistad verdadera con mensajes del corazón",
    ejemplo: "Gracias por estar siempre, por las risas y por ser mi mejor amigo 💙",
    musicaDefault: "", musicas: [],
  },
  Aniversario: {
    id: "Aniversario", carpeta: "aniversario", icono: "fa-calendar-heart", categoria: "Celebración",
    color: "#ffd700", emoji: "🥂",
    fondo: "linear-gradient(135deg,#ffd700,#ffed4e,#fff9db)",
    descripcion: "Celebra meses o años juntos con una dedicatoria inolvidable",
    ejemplo: "Un año más a tu lado, mil sonrisas compartidas 🥂",
    musicaDefault: "https://raw.githubusercontent.com/geluksee/nice/main/FloresAmarillas.mp3",
    musicas: [
      { nombre: "Flores Amarillas", url: "https://raw.githubusercontent.com/geluksee/nice/main/FloresAmarillas.mp3" },
      { nombre: "You Are Somebody", url: "https://raw.githubusercontent.com/geluksee/hopeee/main/You%20are%20Somebody%20Else%20by%20Flora%20Cash.mp3" },
      { nombre: "I Surrender", url: "https://raw.githubusercontent.com/geluksee/hopeee/main/I%20Surrender%20-%20Hillsong%20Worship.mp3" },
    ],
  },
  Carta: {
    id: "Carta", carpeta: "carta", icono: "fa-envelope-open-text", categoria: "Romántico",
    color: "#d4a574", emoji: "✉️",
    fondo: "linear-gradient(135deg,#d4a574,#e8c9a0,#faf0e6)",
    descripcion: "Una carta de amor digital elegante y nostálgica",
    ejemplo: "Querido amor, escribo estas líneas para recordarte lo mucho que significas ✉️",
    musicaDefault: "", musicas: [],
  },
  Declaracion: {
    id: "Declaracion", carpeta: "declaracion", icono: "fa-hand-holding-heart", categoria: "Romántico",
    color: "#e74c3c", emoji: "❤️",
    fondo: "linear-gradient(135deg,#e74c3c,#ff8a80,#fce4e4)",
    descripcion: "Declara tu amor con un mensaje valiente y emotivo",
    ejemplo: "No sabía que el amor verdadero existía hasta que te conocí ❤️",
    musicaDefault: "https://raw.githubusercontent.com/geluksee/nice/main/FloresAmarillas.mp3",
    musicas: [
      { nombre: "Flores Amarillas", url: "https://raw.githubusercontent.com/geluksee/nice/main/FloresAmarillas.mp3" },
      { nombre: "You Are Somebody", url: "https://raw.githubusercontent.com/geluksee/hopeee/main/You%20are%20Somebody%20Else%20by%20Flora%20Cash.mp3" },
      { nombre: "I Surrender", url: "https://raw.githubusercontent.com/geluksee/hopeee/main/I%20Surrender%20-%20Hillsong%20Worship.mp3" },
    ],
  },
  Saludo: {
    id: "Saludo", carpeta: "saludo", icono: "fa-sun", categoria: "Amistad",
    color: "#ff9a3c", emoji: "🌅",
    fondo: "linear-gradient(135deg,#ff9a3c,#ffcc02,#fff8e1)",
    descripcion: "Buenos días, buenas noches o saludos especiales",
    ejemplo: "Buenos días sol, que tu día esté lleno de sonrisas y bendiciones 🌅",
    musicaDefault: "", musicas: [],
  },
  Mujer: {
    id: "Mujer", carpeta: "mujer", icono: "fa-venus", categoria: "Celebración",
    color: "#8B5CF6", emoji: "💜",
    fondo: "linear-gradient(135deg,#8B5CF6,#C084FC,#F3E8FF)",
    descripcion: "Celebra el Día de la Mujer con un mensaje especial y personalizado",
    ejemplo: "Tu fuerza, tu luz y tu valentía inspiran al mundo entero 💜",
    musicaDefault: "https://raw.githubusercontent.com/geluksee/nice/main/FloresAmarillas.mp3",
    img: "https://i.postimg.cc/0PfGKG79/image.png",
    musicas: [
      { nombre: "Flores Amarillas", url: "https://raw.githubusercontent.com/geluksee/nice/main/FloresAmarillas.mp3" },
      { nombre: "You Are Somebody", url: "https://raw.githubusercontent.com/geluksee/hopeee/main/You%20are%20Somebody%20Else%20by%20Flora%20Cash.mp3" },
      { nombre: "I Surrender", url: "https://raw.githubusercontent.com/geluksee/hopeee/main/I%20Surrender%20-%20Hillsong%20Worship.mp3" },
    ],
  },
  Mujer1: {
    id: "Mujer1", carpeta: "mujer1", icono: "fa-venus", categoria: "Celebración",
    color: "#ff3849", emoji: "👸",
    fondo: "linear-gradient(135deg,#ff3849,#ff7a85,#ffccd1)",
    descripcion: "Día de la Mujer con estilo rosa vibrante",
    ejemplo: "Eres luz, fuerza e inspiración. Feliz día 🩷",
    musicaDefault: "https://raw.githubusercontent.com/geluksee/nice/main/FloresAmarillas.mp3",
    img: "https://i.postimg.cc/0PfGKG79/image.png",
    musicas: [
      { nombre: "Flores Amarillas", url: "https://raw.githubusercontent.com/geluksee/nice/main/FloresAmarillas.mp3" },
      { nombre: "You Are Somebody", url: "https://raw.githubusercontent.com/geluksee/hopeee/main/You%20are%20Somebody%20Else%20by%20Flora%20Cash.mp3" },
      { nombre: "I Surrender", url: "https://raw.githubusercontent.com/geluksee/hopeee/main/I%20Surrender%20-%20Hillsong%20Worship.mp3" },
    ],
  },
};

/* ── Helpers ────────────────────────────────────────────────── */
export const plantillas = PLANTILLAS;
export const nombres = () => Object.keys(PLANTILLAS);
export const categorias = () => [...new Set(Object.values(PLANTILLAS).map((p) => p.categoria))];
export const obtener = (nombre: string) => PLANTILLAS[nombre] ?? PLANTILLAS.Amor;
export const porCategoria = (cat: string) => Object.entries(PLANTILLAS).filter(([, p]) => p.categoria === cat);
export const porCarpeta = (carpeta: string) => Object.values(PLANTILLAS).find((p) => p.carpeta === carpeta) ?? PLANTILLAS.Amor;

/** Map carpeta → icono FA para uso rápido */
export const iconosPorCarpeta: Record<string, string> = Object.fromEntries(
  Object.values(PLANTILLAS).map((p) => [p.carpeta, p.icono]),
);
