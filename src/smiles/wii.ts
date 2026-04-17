export const id = "amorwii";
export const app = "AmorWii";
export const desc =
  "Crea mensajes de amor en segundos. Diseno limpio, enlaces por slug y experiencia rapida.";
export const lanzamiento = 2026;
export const by = "Wilder Taype";
export const linkme = "https://wtaype.me";
export const linkweb = "https://amorwii.vercel.app";
export const ipdev = process.env.NEXT_PUBLIC_MIDEV ?? "";
export const version = "v13";

/** Actualizar main luego esto, pero si es mucho, solo esto. (1)
git tag v13 -m "Version v13" ; git push origin v13  

//  ACTUALIZACIÓN PRINCIPAL ONE DEV [START] (2)
git add . ; git commit -m "Actualizacion Principal v13.10.10" ; git push origin main

// En caso de emergencia, para actualizar el Tag existente. (3)
git tag -d v13 ; git tag v13 -m "Version v13 actualizada" ; git push origin v13 --force
 ACTUALIZACION TAG[END]  */