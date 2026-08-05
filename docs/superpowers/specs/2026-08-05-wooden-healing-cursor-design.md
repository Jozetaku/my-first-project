# Wooden Healing Cursor Design

## Goal

Add the exact approved Zetaku wooden healing cursor to `my-first-project` without changing the website's existing content, layout, links, or mobile behavior.

## Approved Approach

Use a self-contained copy of the proven cursor implementation. The repository will own the optimized wooden-tool image and all required CSS, markup, and JavaScript, so the site does not depend on another website remaining available.

## Visual and Interaction Specification

- Use the approved wooden-tool photograph from the Zetaku cursor implementation.
- Render the wooden tool at 42 by 42 CSS pixels.
- Position a two-ring indicator at the tool tip.
- Keep the inner ring gold and the outer ring green.
- Animate only the outer ring with the approved 1.9-second breathing cycle.
- On links, buttons, and other interactive controls, fill the inner ring with translucent green (`rgba(44, 95, 45, 0.18)`) while keeping the page visible beneath it.
- Suppress the browser's native cursor while the custom cursor is active, including over booking buttons and links, so the two cursors never overlap.

## Compatibility and Failure Handling

- Activate only when `(hover: hover) and (pointer: fine)` matches, which targets mouse and trackpad devices.
- Leave the native cursor unchanged on phones, tablets, and touch-first devices.
- Hide the native cursor only after the wooden-tool image has loaded successfully.
- If the image fails to load or JavaScript does not initialize, retain the native cursor.
- Respect `prefers-reduced-motion: reduce` by disabling the breathing animation.
- Keep the cursor layer non-interactive with `pointer-events: none` so it cannot block clicks.

## Integration Boundaries

- Add the optimized image at `assets/zetaku-wood-cursor.png`.
- Add scoped cursor styles to the existing `index.html` style block.
- Add one accessibility-hidden cursor element near the end of the document body.
- Add isolated initialization code to the existing script block.
- Do not alter existing service cards, navigation, WhatsApp links, social links, copy, pricing, or Tailwind behavior.

## Verification

- Automated checks confirm the image asset is a valid optimized PNG and the approved dimensions and safety rules remain present.
- Desktop browser testing confirms the custom cursor follows pointer movement, shows the correct rings, changes on interactive elements, and does not overlap the native cursor.
- Mobile emulation confirms the custom cursor stays disabled.
- Reduced-motion testing confirms the breathing animation is disabled.
- Asset-failure testing confirms the native cursor remains available.
- A final comparison confirms existing links and page content are unchanged.
- After publishing to `main`, verify GitHub Pages succeeds and the live page and cursor asset both return HTTP 200.

## Publishing

After all checks pass, commit the implementation, push `main` to `Jozetaku/my-first-project`, wait for GitHub Pages deployment, and verify the live custom domain configured by the repository.
