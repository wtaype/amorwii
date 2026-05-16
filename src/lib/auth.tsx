"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { SmileNuevo } from "@/lib/tipos";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  perfil: SmileNuevo | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  perfil: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<SmileNuevo | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarPerfil = async (userEmail: string) => {
    const { data } = await supabase.from("smiles").select("*").eq("email", userEmail).maybeSingle();
    setPerfil(data || null);
  };

  useEffect(() => {
    // Verificar sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        cargarPerfil(session.user.email).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Escuchar cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        if (event === "SIGNED_IN") {
          await cargarPerfil(session.user.email);
        }
      } else {
        setPerfil(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, perfil, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
