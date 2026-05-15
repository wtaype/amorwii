import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { app, by, linkme, lanzamiento } from "@/smiles/wii";
import { PlantillaView } from "@/smiles/plantilla";

type PolicyKey = "acerca" | "cookies" | "terminos" | "privacidad" | "contacto" | "feedback";

const policies: Record<PolicyKey, {
  title: string;
  description: string;
  icon: string;
  heroText?: string;
  render: () => React.ReactNode;
}> = {
  acerca: {
    title: `Acerca de ${app}`,
    description: `Conoce la historia, misión y valores de ${app}. Creada con amor para expresar sentimientos de forma única.`,
    icon: "fa-circle-info",
    heroText: `${app} nació en ${lanzamiento} con una misión simple: ayudar a las personas a expresar sus sentimientos de forma única, bonita y gratuita.`,
    render: () => (
      <div className="wi_grid">
        <div className="wi_card">
          <strong><i className="fas fa-bullseye" aria-hidden="true"></i> Misión</strong>
          <p>Democratizar las dedicatorias de amor. Que cualquier persona pueda crear un mensaje hermoso sin necesidad de saber diseño ni gastar dinero.</p>
        </div>
        <div className="wi_card">
          <strong><i className="fas fa-eye" aria-hidden="true"></i> Visión</strong>
          <p>Ser la plataforma #1 en Latinoamérica para mensajes de amor personalizados, con millones de dedicatorias compartidas.</p>
        </div>
        <div className="wi_card">
          <strong><i className="fas fa-code" aria-hidden="true"></i> Creador</strong>
          <p>Desarrollado por <Link href={linkme} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700 }}>{by}</Link>, con pasión por la tecnología y el amor.</p>
        </div>
      </div>
    )
  },
  contacto: {
    title: "Contacto",
    description: `Escríbenos con tus dudas, ideas o peticiones. El equipo de ${app} te responde.`,
    icon: "fa-envelope",
    heroText: "¿Tienes dudas, sugerencias o quieres reportar algo? Estamos para ayudarte.",
    render: () => (
      <div className="wi_grid">
        <div className="wi_card">
          <strong><i className="fas fa-envelope" aria-hidden="true"></i> Email</strong>
          <p>Escríbenos a <a href="mailto:contacto@amorwii.com">contacto@amorwii.com</a></p>
        </div>
        <div className="wi_card">
          <strong><i className="fab fa-github" aria-hidden="true"></i> GitHub</strong>
          <p>Reporta bugs o sugiere features en nuestro <a href="https://github.com/wtaype" target="_blank" rel="noopener noreferrer">repositorio</a>.</p>
        </div>
        <div className="wi_card">
          <strong><i className="fas fa-comment-dots" aria-hidden="true"></i> Feedback</strong>
          <p>Tu opinión nos importa. <a href="/feedback">Déjanos un comentario</a> para mejorar {app}.</p>
        </div>
      </div>
    )
  },
  cookies: {
    title: "Política de Cookies",
    description: `Conoce cómo ${app} usa cookies y cómo puedes gestionarlas desde tu navegador.`,
    icon: "fa-cookie-bite",
    heroText: "Última actualización: Mayo 2026",
    render: () => (
      <article style={{ maxWidth: 800, lineHeight: 1.8 }}>
        <h2>¿Qué son las cookies?</h2>
        <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo para mejorar tu experiencia.</p>
        <h2>Cookies que usamos</h2>
        <ul>
          <li><strong>Tema visual</strong> — Recordamos tu preferencia de color (localStorage)</li>
          <li><strong>Sesión</strong> — Mantener tu sesión activa si inicias sesión (httpOnly cookie)</li>
          <li><strong>Rendimiento</strong> — Flag para cargar recursos diferidos después de la primera visita</li>
        </ul>
        <h2>Cookies de terceros</h2>
        <p>Google Fonts y Font Awesome CDN pueden establecer cookies técnicas. Google AdSense puede usar cookies para personalización de anuncios.</p>
        <h2>Gestión</h2>
        <p>Puedes desactivar cookies desde la configuración de tu navegador. Algunas funciones pueden no funcionar correctamente sin cookies.</p>
      </article>
    )
  },
  terminos: {
    title: "Términos y Condiciones",
    description: `Términos y condiciones de uso de ${app}. Lee antes de crear tu cuenta o usar nuestros servicios.`,
    icon: "fa-file-contract",
    heroText: "Última actualización: Mayo 2026",
    render: () => (
      <article style={{ maxWidth: 800, lineHeight: 1.8 }}>
        <h2>1. Aceptación</h2>
        <p>Al usar {app} aceptas estos términos. Si no estás de acuerdo, no uses la plataforma.</p>
        <h2>2. Uso del servicio</h2>
        <p>{app} es gratuito para crear y compartir mensajes de amor. No está permitido el contenido ofensivo, ilegal o que viole derechos de terceros.</p>
        <h2>3. Cuentas de usuario</h2>
        <p>Puedes crear mensajes sin cuenta. Con cuenta puedes guardar, gestionar y obtener enlaces permanentes.</p>
        <h2>4. Contenido</h2>
        <p>Eres responsable del contenido que creas. {app} se reserva el derecho de eliminar contenido inapropiado.</p>
        <h2>5. Propiedad intelectual</h2>
        <p>El diseño, código y marca de {app} son propiedad de su creador. Los mensajes creados pertenecen a sus autores.</p>
        <h2>6. Limitación de responsabilidad</h2>
        <p>{app} se proporciona &quot;tal cual&quot;. No garantizamos disponibilidad ininterrumpida ni nos hacemos responsables de daños derivados del uso.</p>
        <h2>7. Modificaciones</h2>
        <p>Podemos actualizar estos términos en cualquier momento. Los cambios se publicarán en esta página.</p>
      </article>
    )
  },
  privacidad: {
    title: "Política de Privacidad",
    description: `Política de privacidad de ${app}. Conoce cómo protegemos y gestionamos tu información personal.`,
    icon: "fa-shield-halved",
    heroText: "Tu privacidad es importante para nosotros. Última actualización: Mayo 2026",
    render: () => (
      <article style={{ maxWidth: 800, lineHeight: 1.8 }}>
        <h2>1. Datos que recopilamos</h2>
        <p>Email y nombre de usuario al registrarte. Contenido de los mensajes que creas voluntariamente.</p>
        <h2>2. Uso de los datos</h2>
        <p>Usamos tu email para autenticación y recuperación de cuenta. Nunca vendemos ni compartimos datos con terceros.</p>
        <h2>3. Cookies</h2>
        <p>Usamos cookies técnicas para el tema visual y sesión de usuario. No usamos cookies de rastreo. Ver nuestra <a href="/cookies">política de cookies</a>.</p>
        <h2>4. Seguridad</h2>
        <p>Los datos se almacenan en Supabase con cifrado en tránsito y en reposo. Las contraseñas se hashean con bcrypt.</p>
        <h2>5. Tus derechos</h2>
        <p>Puedes solicitar la eliminación de tu cuenta y todos tus datos escribiéndonos a través de la página de <a href="/contacto">contacto</a>.</p>
        <h2>6. Menores</h2>
        <p>{app} no está dirigido a menores de 13 años. No recopilamos datos de menores intencionalmente.</p>
      </article>
    )
  },
  feedback: {
    title: "Feedback",
    description: `Compártenos tu opinión sobre ${app}. Tu feedback nos ayuda a mejorar.`,
    icon: "fa-comment-dots",
    render: () => (
      <PlantillaView
        etiqueta="Feedback"
        titulo="Tu opinión importa"
        descripcion={`Ayúdanos a hacer ${app} mejor cada día. Cuéntanos qué te gusta y qué podemos mejorar.`}
      >
        <div className="wi_btns">
          <span className="wi_btn primary">
            <i className="fas fa-paper-plane" aria-hidden="true"></i> Próximamente — Formulario de Feedback
          </span>
        </div>
      </PlantillaView>
    )
  }
};

type Props = {
  params: Promise<{ policy: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const policy = policies[resolvedParams.policy as PolicyKey];
  
  if (!policy) {
    return { title: "No encontrado" };
  }

  return {
    title: policy.title,
    description: policy.description,
  };
}

export function generateStaticParams() {
  return Object.keys(policies).map((policy) => ({ policy }));
}

export default async function PolicyDynamicPage({ params }: Props) {
  const resolvedParams = await params;
  const policyData = policies[resolvedParams.policy as PolicyKey];

  if (!policyData) {
    notFound();
  }

  // Feedback usa un layout diferente
  if (resolvedParams.policy === "feedback") {
    return policyData.render();
  }

  // Layout genérico para las demás páginas informativas
  return (
    <section className="wi_page">
      <div className="wi_hero">
        <span className="wi_tag">
          <i className={`fas ${policyData.icon}`} aria-hidden="true"></i>{" "}
          {resolvedParams.policy.charAt(0).toUpperCase() + resolvedParams.policy.slice(1)}
        </span>
        <h1>{policyData.title}</h1>
        {policyData.heroText && (
          <p dangerouslySetInnerHTML={{ __html: policyData.heroText.replace(new RegExp(app, "g"), `<strong>${app}</strong>`) }} />
        )}
      </div>
      {policyData.render()}
    </section>
  );
}
