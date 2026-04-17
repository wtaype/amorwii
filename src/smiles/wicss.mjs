import { transform } from 'lightningcss';
import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';

// Rutas asumiendo que este comando se corre desde la raíz del proyecto (c:\midev\miweb\amorwii)
const cssFile = path.resolve('src/smiles/wi.css');
const tsFile = path.resolve('src/smiles/wicss.ts');

const buildCSS = () => {
  try {
    const css = fs.readFileSync(cssFile);
    const { code } = transform({
      filename: 'wi.css',
      code: css,
      minify: true,
    });
    // Inyectamos el CSS comprimido directamente a la variable de Typescript
    fs.writeFileSync(tsFile, `export const WI_CSS = \`${code.toString()}\`;`);
    console.log('⚡ [LightningCSS] CSS Compilado a wicss.ts');
  } catch (err) {
    console.error('❌ Error compilando CSS:', err.message);
  }
};

// 1. Compilar obligatoriamente al arrancar el script
buildCSS();

// 2. Modos de Ejecución
if (process.argv.includes('--dev')) {
  console.log('👀 Vigilando cambios en src/smiles/wi.css...');
  // Watcher nativo de Node.js ultra-ligero
  fs.watchFile(cssFile, { interval: 300 }, (curr, prev) => {
    buildCSS();
  });
  
  // Lanzar Next.js Servidor Local de forma concurrente
  spawn('npx', ['next', 'dev'], { stdio: 'inherit', shell: true });
} else if (process.argv.includes('--build')) {
  // Lanzar Next.js Build (Producción en Vercel)
  const worker = spawn('npx', ['next', 'build'], { stdio: 'inherit', shell: true });
  worker.on('exit', (code) => process.exit(code));
}
