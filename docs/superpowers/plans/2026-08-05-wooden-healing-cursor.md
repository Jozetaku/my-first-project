# Wooden Healing Cursor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the exact approved Zetaku wooden healing cursor to `my-first-project` without changing existing content, links, layout, mobile behavior, or cursor fallback safety.

**Architecture:** Keep this static site dependency-free. Copy the proven optimized PNG into the repository, add one decorative cursor element plus scoped inline CSS and JavaScript to `index.html`, and activate it only on fine-pointer devices after the image loads. Use Node's built-in test runner for source and asset contracts, then verify the finished behavior locally and on GitHub Pages.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, PNG, Tailwind CDN, Node.js 24 built-in `node:test`, GitHub Pages

## Global Constraints

- Use the approved wooden-tool photograph without redrawing, bending, recoloring, or stylizing it.
- Render the wooden tool at exactly `42px` by `42px`.
- Use a `16px` by `16px` gold inner ring.
- Position the green outer ring `11px` outside the inner ring on every side.
- Animate only the outer ring with a `1.9s ease-in-out` breathing cycle from scale `1` to `1.28` and opacity `0.78` to `0.32`.
- On links, buttons, and other interactive controls, fill the inner ring with `rgb(44 95 45 / 0.18)` and retain a green border.
- Activate only when `(hover: hover) and (pointer: fine)` matches.
- Hide the native cursor only after the custom cursor image loads successfully.
- Keep the native cursor and ordinary tap behavior on touch-first phones and tablets.
- Disable breathing under `prefers-reduced-motion: reduce`.
- Add no runtime dependency, cursor library, canvas renderer, or animation framework.
- Preserve all existing copy, layout, prices, WhatsApp URLs, social links, Tailwind behavior, and smooth scrolling.

---

## File Map

- Create `assets/zetaku-wood-cursor.png`: approved optimized wooden-tool bitmap copied from the deployed Zetaku implementation.
- Create `tests/cursor.test.mjs`: dependency-free asset and source contract tests.
- Modify `index.html`: scoped cursor CSS, decorative markup, and pointer controller.

### Task 1: Add and validate the approved cursor asset

**Files:**
- Create: `assets/zetaku-wood-cursor.png`
- Create: `tests/cursor.test.mjs`

**Interfaces:**
- Consumes: `C:\Users\v-bes\Documents\Ai System\Zetaku\assets\zetaku-wood-cursor.png`
- Produces: `assets/zetaku-wood-cursor.png`, referenced by `index.html`

- [ ] **Step 1: Write the failing asset contract test**

Create `tests/cursor.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the test and confirm the missing asset fails**

Run: `node --test tests/cursor.test.mjs`

Expected: FAIL with `ENOENT` for `assets/zetaku-wood-cursor.png`.

- [ ] **Step 3: Copy the approved transparent image into the repository**

Run:

```powershell
New-Item -ItemType Directory -Force -Path assets | Out-Null
Copy-Item -LiteralPath '..\Zetaku\assets\zetaku-wood-cursor.png' -Destination 'assets\zetaku-wood-cursor.png'
```

- [ ] **Step 4: Run the asset contract test**

Run: `node --test tests/cursor.test.mjs`

Expected: one test passes and the PNG remains below 50 KB.

- [ ] **Step 5: Commit the validated asset**

```powershell
git add assets/zetaku-wood-cursor.png tests/cursor.test.mjs
git commit -m "test: add approved wooden cursor asset"
```

### Task 2: Implement the cursor and Healing Pulse

**Files:**
- Modify: `tests/cursor.test.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: `assets/zetaku-wood-cursor.png`
- Produces: `[data-zetaku-cursor]`, `.has-zetaku-cursor`, `.is-visible`, and `.is-interactive`

- [ ] **Step 1: Extend the source contract tests**

Append to `tests/cursor.test.mjs`:

```js
const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('cursor markup and approved dimensions are present', () => {
  assert.match(indexHtml, /data-zetaku-cursor/);
  assert.match(indexHtml, /assets\/zetaku-wood-cursor\.png/);
  assert.match(indexHtml, /\.zetaku-cursor\s*\{[^}]*width:\s*42px;[^}]*height:\s*42px;/s);
  assert.match(indexHtml, /\.zetaku-cursor__pulse\s*\{[^}]*width:\s*16px;[^}]*height:\s*16px;/s);
  assert.match(indexHtml, /\.zetaku-cursor__pulse::after\s*\{[^}]*inset:\s*-11px;/s);
});

test('cursor activates safely and respects user input preferences', () => {
  assert.match(indexHtml, /\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)/);
  assert.match(indexHtml, /prefers-reduced-motion:\s*reduce/);
  assert.match(indexHtml, /requestAnimationFrame/);
  assert.match(indexHtml, /classList\.add\('has-zetaku-cursor'\)/);
  assert.match(indexHtml, /cursor:\s*none\s*!important/);
  assert.match(indexHtml, /\.zetaku-cursor\.is-interactive\s+\.zetaku-cursor__pulse\s*\{[^}]*background:\s*rgb\(44 95 45 \/ 0\.18\)/s);
  assert.match(indexHtml, /cursorImage\.addEventListener\('load',\s*enableCursor/);
  assert.match(indexHtml, /cursorImage\.addEventListener\('error',\s*disableCursor/);
});
```

- [ ] **Step 2: Run the tests and confirm the two source tests fail**

Run: `node --test tests/cursor.test.mjs`

Expected: the asset test passes; both source tests fail because `index.html` does not yet contain the cursor.

- [ ] **Step 3: Add the scoped cursor CSS before `</style>`**

Insert:

```css
        .zetaku-cursor {
            display: none;
        }

        .zetaku-cursor,
        .zetaku-cursor * {
            box-sizing: border-box;
        }

        @media (hover: hover) and (pointer: fine) {
            html.has-zetaku-cursor,
            html.has-zetaku-cursor * {
                cursor: none !important;
            }

            .zetaku-cursor {
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                width: 42px;
                height: 42px;
                z-index: 9999;
                opacity: 0;
                pointer-events: none;
                transform: translate3d(-100px, -100px, 0);
                transition: opacity 150ms ease;
                will-change: transform;
            }

            .zetaku-cursor.is-visible {
                opacity: 1;
            }

            .zetaku-cursor__tool {
                position: absolute;
                top: -1px;
                left: -1px;
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter: drop-shadow(1px 1.5px 1px rgb(35 23 12 / 0.4));
            }

            .zetaku-cursor__pulse {
                position: absolute;
                top: 1px;
                left: 1px;
                width: 16px;
                height: 16px;
                border: 1px solid #C5A46E;
                border-radius: 50%;
                background: rgb(197 164 110 / 0.14);
                box-shadow: 0 0 20px 8px rgb(197 164 110 / 0.22);
                transform: translate(-50%, -50%);
                transition: border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
            }

            .zetaku-cursor__pulse::after {
                content: "";
                position: absolute;
                inset: -11px;
                border: 1px solid rgb(44 95 45 / 0.32);
                border-radius: 50%;
                animation: zetaku-cursor-breathe 1.9s ease-in-out infinite;
            }

            .zetaku-cursor.is-interactive .zetaku-cursor__pulse {
                border-color: #2C5F2D;
                background: rgb(44 95 45 / 0.18);
                box-shadow: 0 0 22px 9px rgb(197 164 110 / 0.28);
            }

            .zetaku-cursor.is-interactive .zetaku-cursor__pulse::after {
                border-color: rgb(44 95 45 / 0.55);
            }
        }

        @keyframes zetaku-cursor-breathe {
            0%, 100% {
                transform: scale(1);
                opacity: 0.78;
            }
            50% {
                transform: scale(1.28);
                opacity: 0.32;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .zetaku-cursor__pulse::after {
                animation: none;
            }
        }
```

- [ ] **Step 4: Add decorative markup before the existing `<script>`**

```html
    <div class="zetaku-cursor" data-zetaku-cursor aria-hidden="true">
        <img
            class="zetaku-cursor__tool"
            src="assets/zetaku-wood-cursor.png"
            alt=""
            width="256"
            height="256"
            decoding="async">
        <span class="zetaku-cursor__pulse"></span>
    </div>
```

- [ ] **Step 5: Add the pointer controller after the smooth-scroll setup**

```js
        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
        const customCursor = document.querySelector('[data-zetaku-cursor]');

        if (customCursor && finePointer.matches) {
            const cursorImage = customCursor.querySelector('.zetaku-cursor__tool');
            const interactiveSelector = 'a, button, input, textarea, select, summary, [role="button"], [data-cursor-interactive]';
            let pointerX = -100;
            let pointerY = -100;
            let animationFrame = 0;
            let enabled = false;

            const renderCursor = () => {
                customCursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
                animationFrame = 0;
            };

            const handlePointerMove = (event) => {
                pointerX = event.clientX;
                pointerY = event.clientY;
                customCursor.classList.add('is-visible');
                customCursor.classList.toggle(
                    'is-interactive',
                    Boolean(event.target.closest(interactiveSelector)),
                );

                if (!animationFrame) {
                    animationFrame = requestAnimationFrame(renderCursor);
                }
            };

            const hideCursor = () => {
                customCursor.classList.remove('is-visible', 'is-interactive');
            };

            const enableCursor = () => {
                if (enabled || !cursorImage.naturalWidth) return;
                enabled = true;
                document.documentElement.classList.add('has-zetaku-cursor');
                document.addEventListener('pointermove', handlePointerMove, { passive: true });
                document.documentElement.addEventListener('mouseleave', hideCursor);
            };

            const disableCursor = () => {
                document.documentElement.classList.remove('has-zetaku-cursor');
                hideCursor();
            };

            cursorImage.addEventListener('load', enableCursor, { once: true });
            cursorImage.addEventListener('error', disableCursor, { once: true });

            if (cursorImage.complete) {
                enableCursor();
            }
        }
```

- [ ] **Step 6: Run automated checks**

Run:

```powershell
node --test tests/cursor.test.mjs
git diff --check
```

Expected: all three tests pass and `git diff --check` prints nothing.

- [ ] **Step 7: Confirm the page change is cursor-only**

Run:

```powershell
git diff -- index.html tests/cursor.test.mjs
git diff HEAD~1 -- index.html | Select-String -Pattern 'wa.me|instagram.com|facebook.com'
```

Expected: the first diff contains only cursor code and tests; the second command shows no changed link lines.

- [ ] **Step 8: Commit the cursor implementation**

```powershell
git add index.html tests/cursor.test.mjs
git commit -m "feat: add wooden healing cursor"
```

### Task 3: Verify desktop, mobile, accessibility, and fallback behavior

**Files:**
- Verify: `index.html`
- Verify: `assets/zetaku-wood-cursor.png`

**Interfaces:**
- Consumes: completed implementation from Task 2
- Produces: a verified release candidate; code changes occur only if verification exposes a defect

- [ ] **Step 1: Start a local static server**

Run: `npx --yes serve@14.2.4 . --listen 4173`

Expected: the site becomes available at `http://localhost:4173`.

- [ ] **Step 2: Verify desktop behavior with a fine pointer**

Check all of the following at `http://localhost:4173`:

1. The supplied wooden tool renders at 42px by 42px.
2. The rounded upper-left tip follows and defines the click point.
3. The inner gold ring remains stable.
4. Only the outer green ring breathes.
5. Hovering any link changes the inner ring to translucent green.
6. No native arrow or hand overlaps the custom cursor, including on WhatsApp booking links.

Expected: all six checks pass.

- [ ] **Step 3: Verify existing interactions**

Hover and activate the main booking link, each service booking link, `View Services`, and the social links. Compare all `href` attributes against `git show HEAD~2:index.html`.

Expected: the cursor never blocks clicks, smooth scrolling still works, and every existing URL remains byte-for-byte unchanged.

- [ ] **Step 4: Verify touch and reduced-motion behavior**

Use phone emulation with a touch-first pointer, then emulate `prefers-reduced-motion: reduce` on desktop.

Expected: touch mode has no custom cursor; reduced-motion mode shows the cursor without breathing; keyboard focus and link activation remain normal.

- [ ] **Step 5: Verify asset-failure fallback and console health**

Temporarily block `assets/zetaku-wood-cursor.png` in the browser, reload, then remove the block and reload again.

Expected: the native cursor remains available when the PNG fails; the custom cursor returns after restoration; the browser console has no new errors.

- [ ] **Step 6: Run final local verification**

Run:

```powershell
node --test tests/cursor.test.mjs
git diff --check
git status --short --branch
```

Expected: all three tests pass, `git diff --check` is silent, and the working tree is clean on `main` ahead of `origin/main` only by intentional cursor commits.

### Task 4: Publish and verify GitHub Pages

**Files:**
- Publish: committed repository state on `main`
- Verify: configured GitHub Pages URL from repository metadata

**Interfaces:**
- Consumes: verified local `main`
- Produces: deployed cursor on the repository's live GitHub Pages site

- [ ] **Step 1: Reconfirm local and remote commit state**

Run:

```powershell
git status --short --branch
git log --oneline origin/main..main
```

Expected: a clean working tree and only the approved design, asset/test, and cursor implementation commits ahead of `origin/main`.

- [ ] **Step 2: Push the verified main branch**

Run: `git push origin main`

Expected: Git reports `main -> main` with no rejected updates.

- [ ] **Step 3: Wait for GitHub Pages deployment**

Run:

```powershell
$run = gh run list --repo Jozetaku/my-first-project --workflow pages-build-deployment --limit 1 --json databaseId,status,conclusion | ConvertFrom-Json
gh run watch $run.databaseId --repo Jozetaku/my-first-project --exit-status
```

Expected: build and deploy jobs complete successfully.

- [ ] **Step 4: Verify the live page and cursor asset**

Run:

```powershell
$pages = gh api repos/Jozetaku/my-first-project/pages | ConvertFrom-Json
$site = $pages.html_url -replace '^http:', 'https:'
$page = Invoke-WebRequest -Uri $site -UseBasicParsing
$asset = Invoke-WebRequest -Uri ($site.TrimEnd('/') + '/assets/zetaku-wood-cursor.png') -UseBasicParsing
[PSCustomObject]@{
    PageStatus = $page.StatusCode
    CursorMarkup = $page.Content -match 'data-zetaku-cursor'
    WoodSize42 = $page.Content -match 'width:\s*42px'
    AssetStatus = $asset.StatusCode
    AssetType = $asset.Headers['Content-Type']
}
```

Expected: `PageStatus=200`, `CursorMarkup=True`, `WoodSize42=True`, `AssetStatus=200`, and `AssetType=image/png`.
