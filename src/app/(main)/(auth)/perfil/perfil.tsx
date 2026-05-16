"use client";

import { useState } from "react";
import "./perfil.css";
import { supabase } from "@/lib/supabase";
import { Notificacion } from "@/components/Notificacion";
import type { Smile } from "@/lib/tipos";
import { useRouter } from "next/navigation";

interface PerfilProps {
  perfilInicial: Smile;
}

export default function Perfil({ perfilInicial }: PerfilProps) {
  const router = useRouter();
  const [perfil, setPerfil] = useState<Smile>(perfilInicial);
  const [loading, setLoading] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  // Estados del formulario
  const [nombre, setNombre] = useState(perfilInicial.nombre || "");
  const [apellidos, setApellidos] = useState(perfilInicial.apellidos || "");
  const [avatar, setAvatar] = useState(perfilInicial.avatar || "");
  const [fechaNacimiento, setFechaNacimiento] = useState(perfilInicial.fechaNacimiento || "");
  const [genero, setGenero] = useState(perfilInicial.genero || "");
  const [pais, setPais] = useState(perfilInicial.pais || "");
  const [gustos, setGustos] = useState(perfilInicial.gustos || "");
  const [bio, setBio] = useState(perfilInicial.bio || "");

  // Estados de contraseña
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    perfil.nombre + " " + perfil.apellidos
  )}&background=random&color=fff`;
  const imagen = perfil.avatar || defaultAvatar;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Desconocido";
    try {
      const d = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeStyle: 'short' }).format(d);
    } catch {
      return "Desconocido";
    }
  };

  const guardarCambios = async () => {
    if (!nombre.trim()) {
      Notificacion("Ingresa tu nombre", "error");
      return;
    }

    setLoading(true);
    const updates = {
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      avatar: avatar.trim(),
      fechaNacimiento,
      pais: pais.trim(),
      genero,
      gustos: gustos.trim(),
      bio: bio.trim(),
    };

    try {
      const { error } = await supabase
        .from("smiles")
        .update(updates)
        .eq("usuario", perfil.usuario);

      if (error) throw error;

      setPerfil((prev) => ({ ...prev, ...updates }));
      Notificacion("Perfil actualizado ✅", "success");

      // Actualiza la página padre para que el Header también reciba los nuevos datos
      router.refresh();
    } catch (e: any) {
      console.error(e);
      Notificacion("Error al guardar: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const actualizarPassword = async () => {
    if (!pass1 || pass1.length < 6) {
      Notificacion("Mínimo 6 caracteres", "error");
      return;
    }
    if (pass1 !== pass2) {
      Notificacion("Las contraseñas no coinciden", "error");
      return;
    }

    setLoadingPass(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pass1 });

      if (error) throw error;

      setPass1("");
      setPass2("");
      Notificacion("Contraseña actualizada correctamente ✅", "success");
    } catch (e: any) {
      console.error(e);
      Notificacion("Error al actualizar contraseña: " + e.message, "error");
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="prf_wrap">
      <div className="prf_hero">
        <div className="prf_av_wrap">
          <img
            src={imagen}
            alt={perfil.nombre}
            className="prf_av"
            onError={(e) => (e.currentTarget.src = "/smile.avif")}
          />
          <div className="prf_av_ring"></div>
        </div>
        <div className="prf_hero_info">
          <h1 className="prf_fullname">
            {perfil.nombre} {perfil.apellidos}
          </h1>
          <p className="prf_username">
            <i className="fas fa-at"></i> {perfil.usuario}
          </p>
          <span className="prf_rol_chip">
            <i className="fas fa-crown"></i> Plan {perfil.plan?.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="prf_grid">
        <div className="prf_card">
          <h2 className="prf_card_tit">
            <i className="fas fa-user-edit"></i> Editar perfil
          </h2>

          <div className="prf_form_2col">
            <div className="prf_form_grp">
              <label>Nombres</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tus nombres"
              />
            </div>
            <div className="prf_form_grp">
              <label>Apellidos</label>
              <input
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                placeholder="Tus apellidos"
              />
            </div>
          </div>

          <label>Enlace del Avatar (URL)</label>
          <input
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://tu-foto.com/imagen.jpg"
          />

          <div className="prf_form_2col">
            <div className="prf_form_grp">
              <label>Fecha de Nacimiento</label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
              />
            </div>
            <div className="prf_form_grp">
              <label>Género</label>
              <select value={genero} onChange={(e) => setGenero(e.target.value)}>
                <option value="" disabled>Selecciona tu género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              </select>
            </div>
          </div>

          <div className="prf_form_2col">
            <div className="prf_form_grp">
              <label>País</label>
              <input
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                placeholder="Ej. Perú, México, España..."
              />
            </div>
            <div className="prf_form_grp">
              <label>Gustos o intereses</label>
              <input
                value={gustos}
                onChange={(e) => setGustos(e.target.value)}
                placeholder="Ej. Fútbol, leer, viajar..."
              />
            </div>
          </div>

          <label>Biografía</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Cuéntanos un poco sobre ti..."
          />

          <button onClick={guardarCambios} disabled={loading} className="prf_btn">
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Guardando...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i> Guardar cambios
              </>
            )}
          </button>
        </div>

        <div className="prf_col_right">
          <div className="prf_card">
            <h2 className="prf_card_tit">
              <i className="fas fa-lock"></i> Actualizar contraseña
            </h2>
            <label>Nueva contraseña</label>
            <input
              type="password"
              value={pass1}
              onChange={(e) => setPass1(e.target.value)}
              placeholder="Ingresa tu nueva contraseña"
            />
            <label>Confirmar contraseña</label>
            <input
              type="password"
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
              placeholder="Confirma tu nueva contraseña"
            />
            <button
              onClick={actualizarPassword}
              disabled={loadingPass}
              className="prf_btn"
            >
              {loadingPass ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Actualizando...
                </>
              ) : (
                <>
                  <i className="fas fa-key"></i> Actualizar contraseña
                </>
              )}
            </button>
          </div>

          <div className="prf_card">
            <h2 className="prf_card_tit">
              <i className="fas fa-info-circle"></i> Datos de cuenta
            </h2>
            <div className="prf_row">
              <span className="prf_lbl">
                <i className="fas fa-envelope"></i> Email
              </span>
              <span className="prf_val em">{perfil.email}</span>
            </div>
            <div className="prf_row">
              <span className="prf_lbl">
                <i className="fas fa-crown"></i> Plan
              </span>
              <span className="prf_val" style={{ color: "var(--mco)", textTransform: "uppercase" }}>
                {perfil.plan}
              </span>
            </div>
            <div className="prf_row">
              <span className="prf_lbl">
                <i className="fas fa-signal"></i> Estado
              </span>
              <span className="prf_val" style={{ color: "var(--success)" }}>
                {perfil.estado}
              </span>
            </div>
            <div className="prf_row">
              <span className="prf_lbl">
                <i className="fas fa-calendar-alt"></i> Registro
              </span>
              <span className="prf_val">{formatDate(perfil.creado)}</span>
            </div>
            <div className="prf_row">
              <span className="prf_lbl">
                <i className="fas fa-user-tag"></i> Rol
              </span>
              <span className="prf_val" style={{ textTransform: "capitalize" }}>
                {perfil.rol}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
