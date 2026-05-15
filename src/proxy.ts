import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(req: NextRequest) {
  return updateSession(req);
}

export const config = {
  matcher: ["/smile/:path*", "/perfil/:path*", "/editor/:path*", "/admin/:path*"],
};
