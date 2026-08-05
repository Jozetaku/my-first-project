import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import test from 'node:test';

const cursorAsset = new URL('../assets/zetaku-wood-cursor.png', import.meta.url);

test('approved wooden cursor asset is an optimized PNG', () => {
  const bytes = readFileSync(cursorAsset);

  assert.deepEqual(
    [...bytes.subarray(0, 8)],
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  );
  assert.ok(statSync(cursorAsset).size < 50 * 1024);
});

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('cursor markup and approved dimensions are present', () => {
  assert.match(indexHtml, /data-zetaku-cursor/);
  assert.match(indexHtml, /assets\/zetaku-wood-cursor\.png/);
  assert.match(indexHtml, /\.zetaku-cursor\s*\{[^}]*width:\s*42px;[^}]*height:\s*42px;/s);
  assert.match(indexHtml, /\.zetaku-cursor__pulse\s*\{[^}]*width:\s*16px;[^}]*height:\s*16px;/s);
  assert.match(indexHtml, /\.zetaku-cursor__pulse::after\s*\{[^}]*inset:\s*-11px;/s);
});

test('cursor activates safely and supports desktop and persistent touch input', () => {
  assert.match(indexHtml, /\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)/);
  assert.match(indexHtml, /prefers-reduced-motion:\s*reduce/);
  assert.match(indexHtml, /requestAnimationFrame/);
  assert.match(indexHtml, /classList\.add\('has-zetaku-cursor'\)/);
  assert.match(indexHtml, /cursor:\s*none\s*!important/);
  assert.match(indexHtml, /\.zetaku-cursor\.is-interactive\s+\.zetaku-cursor__pulse\s*\{[^}]*background:\s*rgb\(44 95 45 \/ 0\.18\)/s);
  assert.match(indexHtml, /cursorImage\.addEventListener\('load',\s*enableCursor/);
  assert.match(indexHtml, /cursorImage\.addEventListener\('error',\s*disableCursor/);
  assert.match(indexHtml, /event\.pointerType\s*!==\s*'touch'/);
  assert.match(indexHtml, /touchMoved\s*=\s*Math\.hypot\([^;]+\)\s*>\s*10/);
  assert.match(indexHtml, /addEventListener\('pointerup',\s*handleTouchEnd/);
  assert.match(indexHtml, /updateCursorPosition\(event\.clientX,\s*event\.clientY,\s*touchTarget\)/);
});
