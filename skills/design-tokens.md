# Design Tokens — TrustLineBiz.com

## Color Palette
```css
/* Navy (primary brand) */
--navy-dark:  #081426   /* Darkest — nav bg, hero bg, footer bg, CTA sections */
--navy:       #0d1f3c   /* Mid navy — cards, section backgrounds */
--navy-light: #162d55   /* Lighter navy — hero gradient end */

/* Gold (accent) */
--gold-dark:  #a8863a   /* Links, badge borders, icon strokes */
--gold:       #c9a84c   /* Primary accent — buttons, highlights */
--gold-light: #e0be72   /* Hover states */

/* Neutrals */
--white:      #ffffff
--off-white:  #f5f7fa   /* Alternating section backgrounds */
--gray:       #8a95a3   /* Muted text, labels, placeholders */
--text:       #1a2940   /* Default body text */
--border:     #dde3ea   /* Subtle borders */
```

## Typography
- Font: system font stack — `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif`
- No external font loading (performance optimization)
- Base size: 16px (browser default)
- Line height: 1.6 (body), 1.15 (headings), 1.7 (long-form text)

## Heading Scale
```
h1 (hero): clamp(2rem, 4vw, 3.25rem), weight 800, letter-spacing -1px
h2 (section): clamp(1.6rem, 3vw, 2.4rem), weight 800, letter-spacing -0.5px
h3 (card): 1.1–1.15rem, weight 700
```

## Spacing
- Section padding: `90px 5%` (vertical + horizontal)
- Card padding: `36–40px 28–34px`
- Gap between grid items: `28–32px`
- Max content width: `1100–1200px`

## Border Radius
- Large cards: `16–18px`
- Buttons: `8–10px`
- Badges/pills: `100px` (full round)
- Small elements: `6–8px`

## Button Patterns
```css
/* Primary CTA (gold) */
background: linear-gradient(135deg, var(--gold-dark), var(--gold));
color: var(--navy-dark);
font-weight: 800;
padding: 16–17px 34–40px;
border-radius: 10px;
box-shadow: 0 6px 20px rgba(201,168,76,0.4);

/* Hover */
transform: translateY(-2px);
box-shadow: 0 10–14px 28–32px rgba(201,168,76,0.5);
filter: brightness(1.05);
```

## Grid System
- 3-column section grids: `repeat(3, 1fr)`
- 2-column hero: `1fr 1fr`
- 5-column products: `repeat(5, 1fr)`
- All grids collapse to 1 column on mobile via `@media (max-width: 800–900px)`

## Section Alternation Pattern
Alternate between `--white` and `--off-white` backgrounds for visual rhythm:
1. Hero: navy gradient
2. What We Do: white
3. How It Works: navy-dark
4. Products: white
5. Testimonials: off-white
6. CTA Band: navy gradient
7. Footer: navy-dark

## Component Patterns

### Trust Strip
Semi-transparent navy cards with gold borders, uppercase labels, checkmark icons.

### Product/Benefit Cards
White bg, `--border` border, hover lifts 5–6px with gold bottom accent line animation.

### Step Cards (How It Works)
Dark navy bg, gold-bordered, numbered gold circles, muted body text.

### Testimonials
White card, gold stars, gray italic quote body, avatar initials circle.

### Proof Bar
Horizontal stats row with large gold numbers, gray uppercase labels.
