// INFORMACIÓN DEL APP 
export let id = 'amorwii';
export let app = 'AmorWii';
export let desc = 'Mensajes positivos para alegrar tu día';
export let lanzamiento = 2026;
export let by = '@wilder.taype';
export let linkme = 'https://wtaype.github.io/';
export let ipdev = import.meta.env.VITE_DEV;
export let version = 'v9';

/** ACTUALIZACIÓN PRINCIPAL ONE DEV [MAIN] (1)
git add . ; git commit -m "Actualizacion Principal v9.10.10" ; git push origin main

//  Actualizar versiones de seguridad [TAG NUEVO] (2)
git tag v9 -m "Version v9" ; git push origin v9

// Actualizar versiones de seguridad [TAG REMPLAZO] (3)
git tag -d v9 ; git tag v9 -m "Version v9 actualizada" ; git push origin v9 --force

// Actualizar versiones de seguridad [ELIMINAR CARPETA - ARCHIVO ONLINE] (4)
git rm --cached skills-lock.json ; git commit -m "Archivo Eliminado" ; git push origin main
git rm -r --cached .claude/ ; git commit -m "Carpeta Eliminada" ; git push origin main


 ACTUALIZACION TAG[END] */