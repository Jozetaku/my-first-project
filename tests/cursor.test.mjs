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
  assert.match(indexHtml, /\.zetaku-cursor\s*\{[^}]*width:\s*50px;[^}]*height:\s*50px;/s);
  assert.match(indexHtml, /\.zetaku-cursor__pulse\s*\{[^}]*width:\s*16px;[^}]*height:\s*16px;/s);
  assert.match(indexHtml, /\.zetaku-cursor__pulse::after\s*\{[^}]*inset:\s*-11px;/s);
});

test('cursor activates safely and supports passive touch follow with fade', () => {
  assert.match(indexHtml, /\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)/);
  assert.match(indexHtml, /prefers-reduced-motion:\s*reduce/);
  assert.match(indexHtml, /requestAnimationFrame/);
  assert.match(indexHtml, /classList\.add\('has-zetaku-cursor'\)/);
  assert.match(indexHtml, /cursor:\s*none\s*!important/);
  assert.match(indexHtml, /\.zetaku-cursor\.is-interactive\s+\.zetaku-cursor__pulse\s*\{[^}]*background:\s*rgb\(44 95 45 \/ 0\.18\)/s);
  assert.match(indexHtml, /cursorImage\.addEventListener\('load',\s*enableCursor/);
  assert.match(indexHtml, /cursorImage\.addEventListener\('error',\s*disableCursor/);
  assert.match(indexHtml, /document\.elementFromPoint\(touch\.clientX,\s*touch\.clientY\)/);
  assert.match(indexHtml, /updateCursorPosition\(touch\.clientX,\s*touch\.clientY\s*-\s*30,/);
  assert.match(indexHtml, /touchIdentifier\s*=\s*touch\.identifier/);
  assert.match(indexHtml, /clearTimeout\(fadeTimer\)/);
  assert.match(indexHtml, /window\.setTimeout\(finishTouchCursor,\s*500\)/);
  assert.match(indexHtml, /addEventListener\('touchstart',\s*handleTouchStart,\s*\{\s*passive:\s*true\s*\}\)/);
  assert.match(indexHtml, /addEventListener\('touchmove',\s*handleTouchMove,\s*\{\s*passive:\s*true\s*\}\)/);
  assert.match(indexHtml, /addEventListener\('touchend',\s*handleTouchEnd,\s*\{\s*passive:\s*true\s*\}\)/);
  assert.match(indexHtml, /addEventListener\('touchcancel',\s*handleTouchEnd,\s*\{\s*passive:\s*true\s*\}\)/);
  assert.match(indexHtml, /\.zetaku-cursor\.is-touch-fading\s*\{[^}]*transition-duration:\s*500ms;[^}]*opacity:\s*0;/s);
  assert.doesNotMatch(indexHtml, /addEventListener\('pointerup',\s*handleTouchEnd/);
});
