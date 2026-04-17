/**
 * build-css.mjs
 * Lee src/smiles/wi.css → minifica con LightningCSS → genera src/smiles/wicss.ts
 * Se ejecuta automáticamente como "prebuild" antes de cada `npm run build`.
 * Para regenerar manualmente: npm run build:css
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'lightningcss';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const cssPath = join(root, 'src', 'smiles', 'wi.css');
const outPath = join(root, 'src', 'smiles', 'wicss.ts');

const raw = readFileSync(cssPath, 'utf8');
const rawBytes = Buffer.byteLength(raw, 'utf8');

const { code } = transform({
  filename: 'wi.css',
  code: Buffer.from(raw, 'utf8'),
  minify: true,
  sourceMap: false,
  // Targets: últimos 2 Chrome/Firefox/Safari/Edge — sin polyfills legacy
  targets: {
    chrome:  104 << 16,
    firefox: 102 << 16,
    safari:   16 << 16,
    edge:    104 << 16,
  },
});

const minified = code.toString('utf8');
const minBytes = Buffer.byteLength(minified, 'utf8');
const saving = (((rawBytes - minBytes) / rawBytes) * 100).toFixed(1);

const output = `// ⚠️  AUTO-GENERADO por scripts/build-css.mjs — NO editar manualmente.
// Para actualizar: editar src/smiles/wi.css y ejecutar npm run build:css
// Fuente: ${rawBytes} bytes → Minificado: ${minBytes} bytes (−${saving}%)
export const WI_CSS = ${JSON.stringify(minified)};
`;

writeFileSync(outPath, output, 'utf8');

console.log(`✅ wicss.ts generado`);
console.log(`   Fuente:     ${rawBytes.toLocaleString()} bytes  (wi.css)`);
console.log(`   Minificado: ${minBytes.toLocaleString()} bytes  (wicss.ts)`);
console.log(`   Ahorro:     ${(rawBytes - minBytes).toLocaleString()} bytes  (−${saving}%)`);
