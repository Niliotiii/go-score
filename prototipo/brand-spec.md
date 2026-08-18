# GoScore — Brand Spec

## System statement
Tech-utility foundation adapted for mobile sport scorekeeping: dense legibility meets dynamic energy. Dark scoreboard for focus; light shell for setup clarity.

---

## 1. Logo identity — Slash Shield

### Concept
The Slash Shield is an angular pentagonal shield containing two parallel diagonal strokes. It encodes the app's core mechanics: the shield shape conveys protection (reliable scorekeeping), the diagonals are tally marks (scoring) that also reference the upward swipe gesture (+3 points). No curves, no filigree — every edge is intentional.

### Geometry (32×32 viewBox)

```svg
<!-- Shield body: 5-point angular shape -->
<path d="M5 3h22l-2 22-9 4-9-4-2-22z"/>

<!-- Tally slashes: two parallel 45° strokes -->
<path d="M11.5 23l4.5-14" stroke-width="3" stroke-linecap="square"/>
<path d="M16.5 23l4.5-14" stroke-width="3" stroke-linecap="square"/>
```

**Construction notes:**
- Top edge: flat, 22px wide (points 5,3 → 27,3)
- Shoulders slope inward 2px over 22px vertical
- Base converges to center point (16,29)
- Slashes are stroke-based (not fills), 3px wide, squared caps
- Both slashes run lower-left → upper-right at ~72° from horizontal
- Spacing between slashes: 5px center-to-center

### Lockup

**Horizontal (primary):** Mark (36×36) + 10px gap + wordmark "GoScore"
- "Go" in var(--fg), "Score" in var(--accent)
- Font: system display stack, 34px, weight 700, letter-spacing -0.03em

**Stacked (secondary):** Mark centered above wordmark; use when width < 160px.

**Mark only:** Favicon, app icon, small UI contexts (< 24px available).

### Color variants

| Context | Shield fill | Slashes |
|---------|-------------|---------|
| Light background | var(--fg) `oklch(15% 0.01 240)` | var(--accent) `oklch(62% 0.22 145)` |
| Dark background | var(--fg-dark) `oklch(96% 0.003 240)` | var(--accent) `oklch(62% 0.22 145)` |
| Monochrome | currentColor | currentColor |
| Knockout (on accent bg) | #fff | #fff |

### Favicon

SVG data URI (32×32) — shield fill `#141414`, slashes `#40b85c`:
```
data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M5 3h22l-2 22-9 4-9-4-2-22z' fill='%23141414'/%3E%3Cpath d='M11.5 23l4.5-14' stroke='%2340b85c' stroke-width='3' stroke-linecap='square'/%3E%3Cpath d='M16.5 23l4.5-14' stroke='%2340b85c' stroke-width='3' stroke-linecap='square'/%3E%3C/svg%3E
```

---

## 2. Usage rules

### Do
- Minimum clear space: 25% of mark width on all sides
- Minimum size: 16×16px (mark only), 120px wide (horizontal lockup)
- Use on solid backgrounds only — never over photos or patterns
- Scale proportionally; never stretch or compress

### Don't
- Don't rotate the mark
- Don't apply gradients, shadows, or glow effects to the mark
- Don't rearrange lockup elements (mark must precede wordmark)
- Don't recolor the slashes independently from each other (always the same color)
- Don't use the mark inside another shape (circle badge, square app icon crop is ok)
- Don't add outlines or borders to the shield

---

## 3. Palette (OKLCh)

```css
:root {
  --bg:      oklch(98% 0.005 250);
  --surface: oklch(100% 0 0);
  --fg:      oklch(15% 0.01 240);
  --fg-secondary: oklch(35% 0.015 240);
  --muted:   oklch(55% 0.012 240);
  --border:  oklch(88% 0.006 240);
  --accent:  oklch(62% 0.22 145);   /* vibrant sport green */

  /* Scoreboard dark mode */
  --bg-dark:      oklch(10% 0.008 240);
  --surface-dark: oklch(15% 0.01 240);
  --fg-dark:      oklch(96% 0.003 240);
  --muted-dark:   oklch(55% 0.01 240);
  --border-dark:  oklch(22% 0.008 240);
}
```

### Accent discipline
- Max 2 visible accent instances per screen
- CTA fills + active feedback flash — no accent gradients
- When accent is background: text is always #fff

---

## 4. Typography

```css
:root {
  --font-display: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-body:    -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-mono:    'SF Mono', ui-monospace, 'Cascadia Mono', Menlo, monospace;
}
```

| Role | Size | Weight | Letter-spacing |
|------|------|--------|----------------|
| Logo wordmark | 34px | 700 | -0.03em |
| Score (display) | clamp(52px, 20vw, 96px) | 700 | -0.03em |
| H1 (screens) | 18px | 600 | -0.015em |
| Body | 15-16px | 400-500 | 0 |
| Label / caps | 11-12px | 600 | 0.06–0.08em |
| Timer (mono) | 18px | 600 | 0.02em |

---

## 5. Posture rules

1. **Scores in tabular-lining monospace** — large, centered, immediate
2. **Touch targets ≥ 44px** — entire team column is the tap zone
3. **No decorative gradients** — flat surfaces + border separation only
4. **Dark scoreboard** — reduces glare outdoors, maximizes contrast
5. **System fonts only** — zero webfont dependencies, instant load
6. **Angular geometry** — radiuses are functional (xs/sm/md/lg hierarchy), never pill-shaped
7. **Two-weight hierarchy** — 500 for UI, 600-700 for emphasis only

---

## 6. Image generation prompt (for future variations)

Use this prompt with `flux-pro-ultra` (1:1 aspect) to generate rendered logo mark variations or marketing assets featuring the Slash Shield:

```
Minimal geometric logo mark on solid pure black background. An angular
asymmetric shield shape (pentagonal, top-wide, pointed base, tilted subtly
right) rendered in flat matte dark charcoal gray (#1a1a1a), containing exactly
two bold parallel diagonal strokes from lower-left to upper-right in vibrant
sport green (#40b85c). The strokes are evenly spaced, with blunt squared ends —
they evoke both tally marks and an upward swipe gesture. No text, no 3D, no
gradients, no glow, no rounded corners — just the pure geometric mark. Logo
design, vector aesthetic, ultra-clean negative space, centered composition.
```

**Parameters:**
- Model: `flux-pro-ultra`
- Surface: `image`
- Aspect: `1:1` (mark only), `16:9` (for hero/banner with mark small-left)
- For light background variant: change "pure black background" to "pure white background" and "#1a1a1a" to "#f0f0f0" (light gray shield)
