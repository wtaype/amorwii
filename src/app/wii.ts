// INFORMACIÓN DEL APP 
export const id = 'amorwii'
export const app = 'AmorWii'
export const icon = 'fa-heartbeat'
export const color = 'Dulce' // Cielo / Dulce / Paz / Oro / Mora / Futuro
export const titulo = 'Mensajes de Amor Personalizado Gratis';
export const keywii = 'crear mensajes de amor, cartas de amor, dedicatorias de amor, cartas para mi novio, mensajes de amor';
export const descri = 'Crea mensajes de amor personalizados para San Valentín, aniversarios y fechas especiales. Dedicatorias románticas, cartas y música de YouTube de fondo.';
export const linkweb = 'https://amorwii.com';
export const lanzamiento = 2026;
export const by = 'Wilder Taype';
export const linkme = 'https://wtaype.github.io/';
export const ipdev = process.env.NEXT_PUBLIC_MIDEV;
export const version = "v29";

/** Actualizar main luego esto, pero si es mucho, solo esto. (1)
git tag v29 -m "Version v29" ; git push origin v29  

//  ACTUALIZACIÓN PRINCIPAL ONE DEV [START] (2)
git add . ; git commit -m "Actualizacion Principal v29.10.10" ; git push origin main

// En caso de emergencia, para actualizar el Tag existente. (3)
git tag -d v29 ; git tag v29 -m "Version v29 actualizada" ; git push origin v29 --force

 ACTUALIZACION TAG[END]  */