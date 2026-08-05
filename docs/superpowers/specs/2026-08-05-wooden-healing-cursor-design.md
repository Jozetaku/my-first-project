# Wooden Healing Cursor Design

## Goal

Add the exact approved Zetaku wooden healing cursor to `my-first-project`, with the approved desktop interaction plus a persistent last-touch experience on mobile, without changing the website's existing content, layout, links, scrolling, or native touch behavior.

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

## Desktop Behavior

- Activate only when `(hover: hover) and (pointer: fine)` matches, which targets mouse and trackpad devices.
- Hide the native cursor only after the wooden-tool image has loaded successfully.
- If the image fails to load or JavaScript does not initialize, retain the native cursor.
- Keep the cursor layer non-interactive with `pointer-events: none` so it cannot block clicks.

## Mobile Persistent Last-Touch Behavior

- Keep the custom cursor hidden when the page first loads on a touch-first device.
- On the first tap, show the same 42 by 42 pixel wooden tool with its tip aligned to the tap coordinates.
- Keep the cursor visible at the most recently tapped position until the next tap or page reload.
- Update position only from a new tap; do not follow continuous touch movement or scrolling gestures.
- When the tapped target is a link, button, or other interactive control, retain the translucent green inner-ring state at that position.
- When the tapped target is non-interactive page content, retain the normal gold inner-ring state.
- Keep native touch behavior, tapping, scrolling, and link activation unchanged.
- Keep the cursor layer non-interactive with `pointer-events: none` so it cannot capture touches.

## Compatibility and Failure Handling

- If the cursor image fails to load or JavaScript does not initialize, show no custom mobile cursor and preserve all native interaction.
- Respect `prefers-reduced-motion: reduce` on desktop and mobile by disabling the breathing animation.
- Support iPhone portrait and landscape layouts without causing horizontal overflow.

## Integration Boundaries

- Add the optimized image at `assets/zetaku-wood-cursor.png`.
- Add scoped cursor styles to the existing `index.html` style block.
- Add one accessibility-hidden cursor element near the end of the document body.
- Add isolated initialization code to the existing script block.
- Do not alter existing service cards, navigation, WhatsApp links, social links, copy, pricing, or Tailwind behavior.

## Verification

- Automated checks confirm the image asset is a valid optimized PNG and the approved desktop, mobile, dimension, and safety rules remain present.
- Desktop browser testing confirms the custom cursor follows pointer movement, shows the correct rings, changes on interactive elements, and does not overlap the native cursor.
- Mobile emulation confirms the cursor starts hidden, appears at the first tap, stays at the last tapped position, does not follow scrolling gestures, preserves interactive and non-interactive ring states, and never blocks controls.
- Reduced-motion testing confirms the breathing animation is disabled.
- Asset-failure testing confirms the native cursor remains available.
- A final comparison confirms existing links and page content are unchanged.
- After publishing to `main`, verify GitHub Pages succeeds and the live page and cursor asset both return HTTP 200.

## Publishing

After all checks pass, commit the implementation, push `main` to `Jozetaku/my-first-project`, wait for GitHub Pages deployment, and verify the live custom domain configured by the repository.
