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
