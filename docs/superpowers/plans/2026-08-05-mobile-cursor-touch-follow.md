# Mobile Cursor Touch Follow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the published persistent last-touch mobile cursor with an iPhone-friendly cursor that follows the first active fingertip 30px above it and fades out over 500ms after release.

**Architecture:** Keep the existing desktop cursor, PNG, markup, and visual ring styling intact. Replace only the touch-first controller with passive Touch Events, update visual position through the existing `requestAnimationFrame` renderer, derive hover state with `document.elementFromPoint`, and use one cancellable timer for the release fade.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js 24 built-in `node:test`, Playwright browser verification, GitHub Pages

## Global Constraints

- Preserve the approved desktop cursor behavior exactly.
- Preserve the approved 42px wooden-tool image, 16px gold inner ring, outer-ring geometry, and 1.9-second breathing animation.
- Keep the mobile cursor hidden before the first touch.
- Position the mobile cursor exactly 30 CSS pixels above the first active fingertip.
- Follow `touchstart` and `touchmove` through `requestAnimationFrame` without calling `preventDefault`.
- Register all mobile `touchstart`, `touchmove`, `touchend`, and `touchcancel` listeners with `{ passive: true }`.
- Use `document.elementFromPoint(touch.clientX, touch.clientY)` for the interactive ring state.
- Fade for exactly 500 milliseconds after `touchend` or `touchcancel`, then hide off-screen.
- Cancel an active fade immediately when a new first touch begins.
- Track only the first active touch identifier and ignore subsequent fingers until it ends.
- Under `prefers-reduced-motion: reduce`, disable ring breathing and hide immediately after release.
- Preserve native scrolling, tapping, link activation, and pinch-to-zoom.
- Preserve all existing copy, layout, prices, WhatsApp URLs, social links, Tailwind behavior, and smooth scrolling.
- Add no runtime dependency.

---

## File Map

- Modify `tests/cursor.test.mjs`: replace persistent-touch source contracts with touch-follow, passive-listener, offset, fade, and multi-touch contracts.
- Modify `index.html`: add the touch-fade CSS state and replace only the mobile pointer controller with a passive Touch Events controller.

### Task 1: Replace persistent touch behavior using TDD

**Files:**
- Modify: `tests/cursor.test.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: existing `[data-zetaku-cursor]`, `updateCursorPosition(x, y, target)`, and desktop `handlePointerMove(event)`
- Produces: `handleTouchStart(event)`, `handleTouchMove(event)`, `handleTouchEnd(event)`, `finishTouchCursor()`, and `.is-touch-fading`

- [ ] **Step 1: Replace the persistent-touch source contract with a failing touch-follow contract**

Replace the third test in `tests/cursor.test.mjs` with:

```js
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
```

- [ ] **Step 2: Run the suite and verify the new contract fails for the expected reason**

Run: `node --test tests/cursor.test.mjs`

Expected: the PNG and dimension tests pass; the third test fails because `document.elementFromPoint`, Touch Event listeners, 30px offset, and 500ms fade are absent.

- [ ] **Step 3: Add the mobile fade CSS state**

Insert immediately after `.zetaku-cursor.is-visible`:

```css
        .zetaku-cursor.is-touch-fading {
            transition-duration: 500ms;
            opacity: 0;
        }
```

Extend the existing reduced-motion rule to:

```css
        @media (prefers-reduced-motion: reduce) {
            .zetaku-cursor {
                transition-duration: 0ms;
            }

            .zetaku-cursor__pulse::after {
                animation: none;
            }
        }
```

- [ ] **Step 4: Replace the persistent pointer-state variables**

Replace:

```js
            let touchPointerId = null;
            let touchStartX = 0;
            let touchStartY = 0;
            let touchMoved = false;
            let touchTarget = null;
```

with:

```js
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            let touchIdentifier = null;
            let fadeTimer = 0;
```

- [ ] **Step 5: Replace the persistent touch handlers with touch-follow handlers**

Replace `hideCursor`, `resetTouch`, `handleTouchStart`, `handleTouchMove`, `handleTouchEnd`, and `handleTouchCancel` with:

```js
            const finishTouchCursor = () => {
                customCursor.classList.remove('is-visible', 'is-interactive', 'is-touch-fading');
                customCursor.style.transform = 'translate3d(-100px, -100px, 0)';
                fadeTimer = 0;
            };

            const cancelTouchFade = () => {
                if (fadeTimer) {
                    clearTimeout(fadeTimer);
                    fadeTimer = 0;
                }
                customCursor.classList.remove('is-touch-fading');
            };

            const hideCursor = () => {
                cancelTouchFade();
                finishTouchCursor();
            };

            const findTrackedTouch = (touches) => (
                Array.from(touches).find((touch) => touch.identifier === touchIdentifier)
            );

            const updateTouchCursor = (touch) => {
                const target = document.elementFromPoint(touch.clientX, touch.clientY);
                updateCursorPosition(touch.clientX, touch.clientY - 30, target);
            };

            const handleTouchStart = (event) => {
                if (touchIdentifier !== null) return;
                const touch = event.changedTouches[0];
                if (!touch) return;

                touchIdentifier = touch.identifier;
                cancelTouchFade();
                updateTouchCursor(touch);
            };

            const handleTouchMove = (event) => {
                const touch = findTrackedTouch(event.touches);
                if (touch) updateTouchCursor(touch);
            };

            const handleTouchEnd = (event) => {
                const touch = findTrackedTouch(event.changedTouches);
                if (!touch) return;

                touchIdentifier = null;
                if (reducedMotion.matches) {
                    finishTouchCursor();
                    return;
                }

                customCursor.classList.add('is-touch-fading');
                fadeTimer = window.setTimeout(finishTouchCursor, 500);
            };
```

- [ ] **Step 6: Replace mobile Pointer Event registration with passive Touch Event registration**

Replace the four mobile listener lines with:

```js
                document.addEventListener('touchstart', handleTouchStart, { passive: true });
                document.addEventListener('touchmove', handleTouchMove, { passive: true });
                document.addEventListener('touchend', handleTouchEnd, { passive: true });
                document.addEventListener('touchcancel', handleTouchEnd, { passive: true });
```

- [ ] **Step 7: Run automated checks and verify green**

Run:

```powershell
node --test tests/cursor.test.mjs
git diff --check
```

Expected: all three tests pass and `git diff --check` prints nothing.

- [ ] **Step 8: Verify scope and existing links**

Run:

```powershell
git diff -- index.html tests/cursor.test.mjs
$before=((git show HEAD:index.html) -join "`n")
$after=Get-Content -Raw index.html
$pattern='href="([^"]*)"'
$beforeLinks=[regex]::Matches($before,$pattern) | ForEach-Object {$_.Groups[1].Value}
$afterLinks=[regex]::Matches($after,$pattern) | ForEach-Object {$_.Groups[1].Value}
Compare-Object $beforeLinks $afterLinks -SyncWindow 100
```

Expected: the diff contains only the mobile controller, fade CSS, and contract changes; `Compare-Object` prints nothing.

- [ ] **Step 9: Commit the behavior replacement**

```powershell
git add index.html tests/cursor.test.mjs
git commit -m "feat: make mobile cursor follow touch"
```

### Task 2: Verify mobile behavior and desktop regressions in a real browser

**Files:**
- Verify: `index.html`
- Verify: `assets/zetaku-wood-cursor.png`

**Interfaces:**
- Consumes: touch-follow controller from Task 1
- Produces: verified release candidate; no code changes unless a failing browser scenario is reproduced with a test

- [ ] **Step 1: Start the static site with an available local server**

Use the `webapp-testing` skill and its server helper. Use the bundled Node runtime for the static server because the bundled Python `http.server` is known to leave an unusable orphan on this Windows environment.

Expected: `http://127.0.0.1:4173/` returns `index.html` and `assets/zetaku-wood-cursor.png` with HTTP 200.

- [ ] **Step 2: Verify desktop behavior remains identical**

Automate a 1440px desktop Chromium context and verify:

1. The cursor activates only for `(hover: hover) and (pointer: fine)`.
2. The tool remains 42px and the inner ring remains 16px.
3. The outer ring keeps the 1.9-second breathing animation.
4. Hovering a booking link gives `rgba(44, 95, 45, 0.18)` after the 180ms color transition.
5. The native cursor remains hidden over links.
6. Smooth scrolling and keyboard focus still work.

Expected: all six checks pass with no page errors.

- [ ] **Step 3: Verify iPhone touch-follow behavior**

Automate a 390 by 844 touch-enabled mobile context and verify:

1. The cursor starts hidden.
2. `touchstart` at `(120, 300)` produces `translate3d(120px, 270px, 0)` and shows the cursor.
3. `touchmove` to `(150, 420)` produces `translate3d(150px, 390px, 0)` while native page scrolling remains possible.
4. Moving over a booking control gives the translucent green interactive state using the control beneath the fingertip.
5. A second simultaneous touch does not replace the first touch identifier.
6. `touchend` adds the fade state, retains the cursor during the transition, and hides it after 500ms.
7. A new `touchstart` during the fade removes the fade state and follows immediately.

Expected: all seven checks pass.

- [ ] **Step 4: Verify landscape, reduced motion, and failure fallback**

Verify:

1. An 844 by 390 touch context has no horizontal overflow and follows touch with the same 30px offset.
2. Under reduced motion, the outer ring animation is `none` and the cursor hides immediately after release.
3. When the PNG request is blocked, desktop keeps its native cursor and mobile shows no custom cursor.
4. The cursor layer keeps `pointer-events: none` in every context.

Expected: all four checks pass with no browser console errors.

- [ ] **Step 5: Run final local verification**

Run:

```powershell
node --test tests/cursor.test.mjs
git diff --check
git status --short --branch
```

Expected: all three tests pass, `git diff --check` is silent, and the feature branch is clean.

### Task 3: Merge, publish, and verify GitHub Pages

**Files:**
- Publish: verified commits on `main`
- Verify: `https://joemassage.no/`

**Interfaces:**
- Consumes: verified feature branch from Task 2
- Produces: touch-follow cursor deployed on the public site

- [ ] **Step 1: Finish the development branch**

Use `finishing-a-development-branch`, merge locally into `main`, rerun `node --test tests/cursor.test.mjs`, then clean the owned worktree and merged feature branch.

Expected: local `main` contains the touch-follow commit and the test suite passes after merge.

- [ ] **Step 2: Push verified `main`**

Run: `git push origin main`

Expected: Git reports `main -> main` without rejected updates.

- [ ] **Step 3: Wait for Pages deployment**

Run:

```powershell
$run=gh run list --repo Jozetaku/my-first-project --workflow pages-build-deployment --limit 1 --json databaseId,status,conclusion | ConvertFrom-Json
gh run watch $run.databaseId --repo Jozetaku/my-first-project --exit-status
```

Expected: build and deploy jobs complete successfully.

- [ ] **Step 4: Verify the live release**

Run:

```powershell
$page=Invoke-WebRequest -Uri 'https://joemassage.no/' -UseBasicParsing
$asset=Invoke-WebRequest -Uri 'https://joemassage.no/assets/zetaku-wood-cursor.png' -UseBasicParsing
[PSCustomObject]@{
    PageStatus=$page.StatusCode
    CursorMarkup=$page.Content -match 'data-zetaku-cursor'
    TouchFollow=$page.Content -match "addEventListener\('touchmove',\s*handleTouchMove"
    Offset30=$page.Content -match 'touch\.clientY\s*-\s*30'
    Fade500=$page.Content -match 'setTimeout\(finishTouchCursor,\s*500\)'
    AssetStatus=$asset.StatusCode
    AssetType=$asset.Headers['Content-Type']
}
```

Expected: page and asset status are 200; `CursorMarkup`, `TouchFollow`, `Offset30`, and `Fade500` are true; asset type is `image/png`.
