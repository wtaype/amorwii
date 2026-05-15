// INFORMACIÓN DEL APP 
export const id = 'amorwii'
export const app = 'AmorWii'
export const icon = 'fa-heartbeat'
export const titulo = 'Mensajes de Amor Personalizados para Parejas';
export const keywii = 'amor, mensajes de amor, cartas de amor, san valentín, aniversarios, amorwii';
export const descri = 'Crea mensajes de amor personalizados para San Valentín, aniversarios y fechas especiales. Dedicatorias románticas, cartas de amor.';
export const linkweb = 'https://amorwii.com'; // Sin slash (/), al final
export const lanzamiento = 2026;
export const by = 'Wilder Taype';
export const linkme = 'https://wtaype.github.io/';
export const ipdev = process.env.NEXT_PUBLIC_MIDEV;
export const version = "v16";

/** Actualizar main luego esto, pero si es mucho, solo esto. (1)
git tag v15 -m "Version v15" ; git push origin v15  

//  ACTUALIZACIÓN PRINCIPAL ONE DEV [START] (2)
git add . ; git commit -m "Actualizacion Principal v15.10.10" ; git push origin main

// En caso de emergencia, para actualizar el Tag existente. (3)
git tag -d v15 ; git tag v15 -m "Version v15 actualizada" ; git push origin v15 --force

 ACTUALIZACION TAG[END]  */