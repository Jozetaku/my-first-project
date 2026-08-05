# Wooden Cursor 50px Design

**Date:** 2026-08-05

## Goal

Make the approved wooden-tool cursor easier to see during real use by increasing the tool image from 42px to 50px on both desktop and mobile.

## Approved Design

- Set the wooden cursor container to exactly `50px` by `50px` at every viewport size.
- Keep the supplied PNG, its aspect ratio, and its existing rendering behavior.
- Keep the inner and outer ring sizes, breathing animation, colors, opacity, and interactive green state unchanged.
- Keep the desktop pointer tracking and mobile touch-follow behavior unchanged, including the 30px mobile vertical offset and 500ms fade.
- Keep native cursors suppressed over interactive elements so the custom cursor is not overlapped.

## Implementation

Update the existing cursor dimension contract test from 42px to 50px, verify that it fails against the current CSS, then change only the cursor container width and height in `index.html`.

## Validation

- The source contract test requires a 50px-by-50px cursor.
- The complete cursor test suite passes.
- Desktop and mobile behavior remains unchanged apart from the larger wooden tool.
- GitHub Pages deploys successfully and the live HTML contains the 50px dimensions.

## Out of Scope

- Resizing or redesigning either ring.
- Changing cursor position, hotspot geometry, animation timing, colors, or touch behavior.
- Replacing or editing the approved PNG.
