# Find-a-Film — Design System
**Version 0.1** · Blue Hour · Cinematic Minimalism · Light + Dark

> Forked from Civic Ink v1.5. All spatial rules, grid logic, border conventions, and accessibility requirements carry over unchanged. This file documents only what's different: palette, typography, and the addition of a third accent role (Peach) for the app's emotional layer.

---

## Philosophy

Cinematic minimalism. The confidence of a festival poster, the restraint of an A24 title card, the warmth of a repertory cinema at dusk. Every visual decision earns its place — but unlike Civic Ink's editorial brutalism, this system has an emotional register. It's a film discovery app built around mood, and the palette reflects that: cool surfaces with warm punctuation, like a golden dress against a twilight sky.

The system inherits Civic Ink's structural discipline (8pt grid, earned accents, no decoration for decoration's sake) but trades its civic directness for something more atmospheric. The interface should feel like it was designed by someone who cares about film, not someone who read a brief about film.

---

## Color System

### Three Accents — Three Jobs

This system extends Civic Ink's two-accent model with a third role: mood. The three accents are not interchangeable.

| Accent | Color | Hex | Job |
|---|---|---|---|
| **Golden** | Warm gold | `#DBAA20` | Action, CTAs, selected/active states |
| **Periwinkle** | Soft blue-violet | `#7B8FD4` | Links, information, navigation, category tags |
| **Peach** | Warm salmon-pink | `#D4907A` | Mood, feeling, recommendation surfaces, emotional register |

Golden is the dress in the frame — one dominant use per screen. Periwinkle is navigational — it tells you "there's more here." Peach is the color unique to this app — it represents the emotional layer that Civic Ink doesn't need and find-a-film can't exist without.

---

### Light Mode Palette: Screen

| Token | Name | Hex | Usage |
|---|---|---|---|
| `--color-ink` | Twilight | `#0E1228` | Primary text, borders, dominant surfaces |
| `--color-paper` | Screen | `#F3F1F6` | Default background |
| `--color-golden` | Golden | `#C49A1C` | Action, CTAs, selected states |
| `--color-periwinkle` | Periwinkle | `#4A55A0` | Links, information, category tags |
| `--color-peach` | Peach | `#B07060` | Mood surfaces, recommendation cards, feeling |
| `--color-rule` | Haze | `#D8D5E2` | Subtle borders, dividers, secondary backgrounds |
| `--color-muted` | Dusk | `#555775` | Secondary text, muted UI elements |
| `--color-alarm` | Alarm | `#DC2626` | Error states, destructive actions, validation failures |

```css
:root {
  --color-ink:         #0E1228;
  --color-paper:       #F3F1F6;
  --color-golden:      #C49A1C;
  --color-periwinkle:  #4A55A0;
  --color-peach:       #B07060;
  --color-rule:        #D8D5E2;
  --color-muted:       #555775;
  --color-alarm:       #DC2626;
  --color-alarm-bg:    #FDF5F5;
}
```

---

### Dark Mode Palette: Twilight

Dark mode is the primary mode. This is a film app — it lives at night. The twilight surface is a deep warm-tinted indigo, not a cold black. Accents brighten to stay electric against it.

| Token | Name | Hex | Usage |
|---|---|---|---|
| `--color-ink` | Off-white | `#E8E4F0` | Primary text |
| `--color-paper` | Twilight | `#0E1228` | Default background |
| `--color-golden` | Golden | `#DBAA20` | Unchanged — hits harder on dark |
| `--color-periwinkle` | Periwinkle | `#7B8FD4` | Lightened for dark surface contrast |
| `--color-peach` | Peach | `#D4907A` | Lightened for dark surface contrast |
| `--color-rule` | Deep Blue | `#252845` | Subtle borders, dividers |
| `--color-muted` | Dusk | `#8B8DB0` | Secondary text, muted UI |
| `--color-alarm` | Alarm | `#F87171` | Error states — lightened for dark surface legibility |

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-ink:         #E8E4F0;
    --color-paper:       #0E1228;
    --color-golden:      #DBAA20;
    --color-periwinkle:  #7B8FD4;
    --color-peach:       #D4907A;
    --color-rule:        #252845;
    --color-muted:       #8B8DB0;
    --color-alarm:       #F87171;
    --color-alarm-bg:    #1C0A0A;
  }
}
```

---

### Color Usage Rules

- **Golden is earned.** One dominant use per screen. Never decorative.
- **Periwinkle is navigational.** Links, tags, states that mean "there is more to know here."
- **Peach is emotional.** Mood result cards, recommendation surfaces, feeling indicators. Not action, not navigation — atmosphere.
- **Never Golden as text color on Screen.** Contrast ratio fails. Golden is always a background or border with Ink text on top.
- **Never Periwinkle on Twilight background** in light mode — use the darkened light-mode value (`#4A55A0`). In dark mode, use `#7B8FD4`.
- **No gradients.** Ever. The twilight gradient lives in the source image, not in the interface.
- **No opacity on Ink.** If you need lighter, use a token.
- **Golden and Periwinkle never appear on the same element.** They can coexist on a screen — they cannot share a component.
- **Peach and Golden never appear on the same element.** Peach and Periwinkle may coexist on a screen but not on a single component.
- **Dark mode is primary.** Design for Twilight first, adapt to Screen second. This is a film app — it lives at night.

---

## Typography

### Typefaces

| Role | Typeface | Weight(s) | When to Use |
|---|---|---|---|
| **Display (impact)** | Syne | 500, 600, 700 | Headlines, section headers, mood labels, hero text |
| **Body (dominant)** | Figtree | 400, 500, 600 | All UI text, body copy, labels, navigation, captions |

Syne was designed at the Atelier National de Recherche Typographique in France. It has geometric letterforms with subtly unusual proportions — distinctive without being unreadable. It signals taste without announcing it. Figtree has slightly rounded terminals and open letterforms — warm without being soft. Together: a festival program on coated stock.

### Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Syne:wght@400;500;600;700&display=swap');
```

### Type Scale (8pt base)

All sizes are multiples of 8 or 4 (half-step).

```css
:root {
  /* Display — Syne */
  --text-display-xl:  56px;   /* Hero, primary headline */
  --text-display-lg:  40px;   /* Section openers, major headers */
  --text-display-md:  28px;   /* Subheadings, mood labels, pull quotes */

  /* Body — Figtree */
  --text-body-xl:     24px;   /* Large intros, lead paragraphs */
  --text-body-lg:     20px;   /* Section subheadings */
  --text-body-md:     16px;   /* Default body copy */
  --text-body-sm:     14px;   /* Captions, labels, metadata */
  --text-body-xs:     12px;   /* Legal, footnotes, timestamps */

  /* Line height */
  --leading-tight:    1.08;   /* Display type only */
  --leading-normal:   1.5;    /* Body copy default */
  --leading-loose:    1.75;   /* Long-form reading */

  /* Letter spacing */
  --tracking-tight:  -0.03em; /* Large display text */
  --tracking-normal:  0;      /* Body */
  --tracking-wide:    0.08em; /* All-caps labels, tags */
  --tracking-wider:   0.15em; /* Eyebrow text */
}
```

### Font Stacks

```css
:root {
  --font-display: 'Syne', 'Helvetica Neue', 'Helvetica', sans-serif;
  --font-body:    'Figtree', 'Helvetica Neue', 'Helvetica', sans-serif;
  --font-mono:    'Courier New', 'Courier', monospace;
}
```

### Typography Rules

- **Never use Arial.** At any size. For any reason. Non-negotiable.
- **Syne is for impact moments only.** Headlines, mood labels, hero text. If you're reaching for it on a label or caption, stop.
- **Syne display weight is 700.** Not 800. It runs visually large — 700 gives it room to breathe.
- **Syne display max is 56px** (`--text-display-xl`). Syne's wide letterforms and high x-height make larger sizes feel like shouting. 56px is confident; 72px is aggressive.
- **Eyebrow labels** are always: Figtree, 12px, 600 weight, all-caps, `--tracking-wider`, `--color-muted`.
- **Pull quotes** use Syne 700, `--text-display-md`, 4px left border in `--color-peach`.
- **Links** are always `--color-periwinkle`, underlined on hover, never decorated at rest.
- **No centered body text** longer than two lines. Centered display text is fine.

---

## Spacing — 8pt Grid

Inherited from Civic Ink unchanged. Everything lives on multiples of 8px. Half-steps (4px) are for tight component internals only.

```css
:root {
  --space-1:   4px;   /* Half-step: tight internal padding only */
  --space-2:   8px;   /* Base unit: icon gaps, tight padding */
  --space-3:  16px;   /* Component padding, small gaps */
  --space-4:  24px;   /* Card padding, section internal spacing */
  --space-5:  32px;   /* Between components */
  --space-6:  48px;   /* Section breathing room */
  --space-7:  64px;   /* Major section breaks */
  --space-8:  96px;   /* Page-level vertical rhythm */
  --space-9: 128px;   /* Hero padding, large whitespace moments */
}
```

### Spacing Rules

- **Start with more space than you think you need.** Cinematic minimalism earns its atmosphere through confident whitespace.
- **Padding inside components:** `--space-3` (16px) minimum. Never less.
- **Between related elements** (label + field, icon + text): `--space-2` (8px).
- **Between unrelated sections:** `--space-7` or `--space-8`. Make the break felt.
- **If you can't name the token, you shouldn't use the value.**

---

## Layout

### Grid

```css
:root {
  --grid-columns:      12;
  --grid-gutter:       24px;   /* --space-4 */
  --grid-margin:       32px;   /* --space-5, scales up at breakpoints */
  --container-max:    1200px;
  --container-narrow:  720px;  /* Film details, long-form content */
}
```

### Breakpoints

```css
:root {
  --bp-sm:  480px;   /* Large mobile */
  --bp-md:  768px;   /* Tablet */
  --bp-lg: 1024px;   /* Desktop */
  --bp-xl: 1280px;   /* Wide desktop */
}
```

### Layout Rules

- **Narrow container for reading.** Film descriptions and details never exceed `--container-narrow` (720px).
- **Mood input is centerstage.** The text input for mood should dominate the viewport — it's the entire interaction model.
- **Film result cards** use a responsive grid: single column on mobile, 2-up on tablet, 3-up on desktop.

---

## Borders & Rules

Inherited from Civic Ink. Borders are structural, not decorative.

```css
:root {
  --border-thin:           0.5px solid var(--color-ink);
  --border-mid:              1px solid var(--color-ink);
  --border-heavy:            2px solid var(--color-ink);
  --border-rule:             1px solid var(--color-rule);
  --border-accent-golden:    4px solid var(--color-golden);
  --border-accent-peri:      4px solid var(--color-periwinkle);
  --border-accent-peach:     4px solid var(--color-peach);

  --radius-sm:   4px;    /* All rectangular elements */
  --radius-pill: 100px;  /* Pills only: mood chips, status tags */
}
```

### Border Rules

- **Default border-radius is `4px` (`--radius-sm`)** on all rectangular elements.
- **Pills only** use `--radius-pill` — mood chips, status indicators.
- **Never use values between 4px and 100px.** Two settings: subtle and pill.
- **`--border-accent-golden`** — primary selected states, active nav.
- **`--border-accent-peri`** — informational callouts, detail panels.
- **`--border-accent-peach`** — mood result cards, recommendation surfaces.

---

## Component Patterns

### Buttons

```css
/* Primary — Golden hover */
.btn-primary {
  font-family:    var(--font-body);
  font-size:      var(--text-body-sm);
  font-weight:    600;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  background:     var(--color-ink);
  color:          var(--color-paper);
  padding:        var(--space-2) var(--space-4);
  border:         var(--border-mid);
  border-radius:  var(--radius-sm);
  cursor:         pointer;
  transition:     background 100ms ease, color 100ms ease;
}

.btn-primary:hover {
  background:   var(--color-golden);
  color:        var(--color-ink);
  border-color: var(--color-golden);
}

/* Secondary / Ghost */
.btn-secondary {
  font-family:    var(--font-body);
  font-size:      var(--text-body-sm);
  font-weight:    600;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  background:     transparent;
  color:          var(--color-ink);
  padding:        var(--space-2) var(--space-4);
  border:         var(--border-mid);
  border-radius:  var(--radius-sm);
  cursor:         pointer;
  transition:     background 100ms ease;
}

.btn-secondary:hover {
  background: var(--color-rule);
}

/* Info / Periwinkle variant */
.btn-info {
  background:   var(--color-periwinkle);
  color:        var(--color-paper);
  border-color: var(--color-periwinkle);
}

.btn-info:hover {
  background:   transparent;
  color:        var(--color-periwinkle);
  border-color: var(--color-periwinkle);
}
```

### Tags / Labels

```css
.tag {
  font-family:    var(--font-body);
  font-size:      var(--text-body-xs);
  font-weight:    600;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  display:        inline-block;
  padding:        var(--space-1) var(--space-2);
  border:         var(--border-thin);
  border-radius:  var(--radius-sm);
  color:          var(--color-ink);
  background:     transparent;
}

/* Golden = selected/active */
.tag--active {
  background:   var(--color-golden);
  border-color: var(--color-golden);
  color:        var(--color-ink);
}

/* Periwinkle = category/informational */
.tag--info {
  background:   var(--color-periwinkle);
  border-color: var(--color-periwinkle);
  color:        var(--color-paper);
}

/* Peach = mood/feeling */
.tag--mood {
  background:   var(--color-peach);
  border-color: var(--color-peach);
  color:        var(--color-ink);
}
```

### Cards

```css
.card {
  background:    var(--color-paper);
  border:        var(--border-mid);
  padding:       var(--space-4);
  border-radius: var(--radius-sm);
}

/* Golden accent — primary/featured */
.card--accent-golden {
  border-left: var(--border-accent-golden);
}

/* Periwinkle accent — informational */
.card--accent-peri {
  border-left: var(--border-accent-peri);
}

/* Peach accent — mood/recommendation */
.card--accent-peach {
  border-left: var(--border-accent-peach);
}
```

### Mood Result Card

The primary content surface of the app. Uses a tinted background derived from Peach to create warmth against the Twilight surface.

```css
.mood-card {
  background:    #2A1E24;  /* Dark: warm-tinted surface */
  border-left:   var(--border-accent-peach);
  padding:       var(--space-4);
  border-radius: var(--radius-sm);
}

.mood-card__label {
  font-family:   var(--font-display);
  font-size:     var(--text-body-xl);
  font-weight:   700;
  color:         var(--color-peach);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--space-2);
}

.mood-card__desc {
  font-family:   var(--font-body);
  font-size:     var(--text-body-md);
  font-weight:   400;
  color:         var(--color-ink);
  line-height:   var(--leading-normal);
  margin-bottom: var(--space-3);
}

.mood-card__films {
  font-family:    var(--font-body);
  font-size:      var(--text-body-xs);
  font-weight:    500;
  letter-spacing: var(--tracking-wide);
  color:          var(--color-muted);
}

@media (prefers-color-scheme: light) {
  .mood-card {
    background: #F5EEEB;  /* Light: warm-tinted surface */
  }
}
```

### Pull Quote

```css
.pull-quote {
  font-family:  var(--font-display);
  font-size:    var(--text-display-md);
  font-weight:  700;
  line-height:  var(--leading-tight);
  color:        var(--color-ink);
  border-left:  var(--border-accent-peach);
  padding-left: var(--space-4);
  margin:       var(--space-6) 0;
}
```

### Eyebrow Label

```css
.eyebrow {
  font-family:    var(--font-body);
  font-size:      12px;
  font-weight:    600;
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color:          var(--color-muted);
  margin-bottom:  var(--space-2);
}
```

### Callout / Info Block

```css
.callout {
  border-left:   var(--border-accent-peri);
  background:    var(--color-rule);
  padding:       var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
}

.callout p {
  font-size:   var(--text-body-sm);
  color:       var(--color-ink);
  margin:      0;
  line-height: var(--leading-normal);
}
```

---

## Links

```css
a {
  color:           var(--color-periwinkle);
  text-decoration: none;
  transition:      text-decoration-color 100ms ease;
}

a:hover {
  text-decoration:       underline;
  text-decoration-color: var(--color-periwinkle);
  text-underline-offset: 3px;
}

a:visited {
  color: var(--color-periwinkle);
  opacity: 0.75;
}
```

---

## Interaction States

```css
/* Focus — always visible, never hidden */
:focus-visible {
  outline:        2px solid var(--color-golden);
  outline-offset: 2px;
}

/* Active / selected — Golden */
.is-active {
  border-left: var(--border-accent-golden);
}

/* Info state */
.is-active--info {
  border-left: var(--border-accent-peri);
}

/* Mood state */
.is-active--mood {
  border-left: var(--border-accent-peach);
}

/* Disabled */
[disabled] {
  opacity:        0.4;
  cursor:         not-allowed;
  pointer-events: none;
}
```

---

## Iconography

- **Library:** Tabler Icons, outline style only. Never filled variants.
- **Sizes:** always a multiple of 8: `16px`, `24px`, `32px`.
- **Icons never stand alone** on critical actions — always pair with a visible label or `aria-label`.
- **Color:** inherits from parent by default. For emphasis, use `--color-golden`, `--color-periwinkle`, or `--color-peach` explicitly.

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
```

---

## Motion

Inherited from Civic Ink. Animation is functional or it doesn't exist.

```css
:root {
  --duration-fast:  100ms;
  --duration-mid:   200ms;
  --duration-slow:  350ms;
  --ease-sharp:     cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out:       cubic-bezier(0, 0, 0.2, 1);
}
```

### Motion Rules

- **No bounce, no spring, no elastic.**
- **State changes** (hover, active, focus): `--duration-fast`, `--ease-sharp`.
- **Page transitions / reveals:** `--duration-slow`, `--ease-out`.
- **No animation purely for delight.** If it doesn't communicate something, cut it.
- **Always respect `prefers-reduced-motion`:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration:  0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Accessibility

- **Color alone never conveys meaning.** Golden, Periwinkle, and Peach are accents, not solo status indicators.
- **Minimum contrast:** 4.5:1 for body text, 3:1 for large text and UI components.
- **Dusk muted text:** `#8B8DB0` on Twilight passes AA (~5.7:1). `#555775` on Screen passes AA (~6.3:1). Do not swap values between modes.
- **Focus styles are never removed.** If it's ugly, redesign it — don't hide it.
- **Touch targets minimum 44×44px.** Always.
- **Alt text is content, not description.** Write what the image communicates, not what it depicts.
- **Plain language first.**

---

## Voice & Tone

Inherited from Civic Ink with one addition: this app has an emotional register.

- **Direct.** Say the thing.
- **Cinematic, not precious.** The copy should feel like someone who loves film, not someone performing love of film.
- **Dry wit is allowed.** Forced friendliness is not.
- **Mood prompts are invitations, not instructions.** "Tell me how you feel" not "Enter your mood."
- **Error messages are honest.** Tell users what happened and what to do.
- **CTA copy is action-first.** "Find something," not "Submit." "View details," not "Learn more."

---

## Anti-Patterns

| Don't | Instead |
|---|---|
| Use Arial | Use Figtree |
| Use gradients | Use flat color |
| Use border-radius values other than 4px or 100px | Use `--radius-sm` or `--radius-pill` only |
| Use Golden as text color | Use Golden as background or border only |
| Use light-mode Periwinkle (`#4A55A0`) in dark mode | Use dark-mode Periwinkle (`#7B8FD4`) |
| Put Golden and Periwinkle on the same element | One accent per element, always |
| Put Golden and Peach on the same element | One accent per element, always |
| Use Peach for action or navigation | Peach is mood/feeling only |
| Hide focus states | Redesign them to look intentional |
| Use magic number spacing | Use a named token from the 8pt scale |
| Use icons without labels on critical actions | Pair icon + text or add `aria-label` |
| Animate for delight | Animate to communicate |
| Use "Submit" as button copy | Use a specific action verb |
| Center long body text | Left-align everything longer than 2 lines |
| Use Syne above 56px | 56px is the ceiling — Syne runs large |
| Use Syne at weight 800 | 700 is the display weight — 800 overwhelms |
| Design light mode first | Dark mode is primary — this is a film app |
| Use Alarm for anything other than errors | Alarm is semantic — errors and destructive actions only |
| Use asterisks for required fields | Label optional fields with `(optional)` instead |
| Write "Required" as an error message | Say what's wrong and how to fix it |
| Use placeholder text as a label | Always use a visible `<label>` element |
| Disable the submit button to prevent errors | Let users submit, then show inline errors |

---

## Form Elements

Inherited from Civic Ink v1.5. All conventions carry over — required-by-default labeling, `(optional)` parenthetical, `novalidate` + inline validation, Alarm-only errors, specific CTA copy. The only changes are color token references: focus states use Periwinkle (informational moment), error states use Alarm, selected checkboxes/radios use Golden (active state).

See Civic Ink v1.5 Form Elements section for full CSS patterns. Swap token names as follows:

| Civic Ink Token | Find-a-Film Token |
|---|---|
| `--color-acid` | `--color-golden` |
| `--color-cobalt` | `--color-periwinkle` |
| `--color-ink` | `--color-ink` (unchanged name, different hex) |
| `--color-paper` | `--color-paper` (unchanged name, different hex) |
| `--color-charcoal` | `--color-muted` |
| `--color-warm-rule` | `--color-rule` |

---

## Quick Reference

```
DARK MODE (primary)
  Background:   #0E1228  (Twilight)
  Text:         #E8E4F0  (Off-white)
  Accent 1:     #DBAA20  (Golden)    → action, CTAs, selected
  Accent 2:     #7B8FD4  (Periwinkle)→ links, info, categories
  Accent 3:     #D4907A  (Peach)     → mood, feeling, recommendations
  Border:       #252845  (Deep Blue)
  Muted text:   #8B8DB0  (Dusk)
  Error:        #F87171  (Alarm)

LIGHT MODE
  Background:   #F3F1F6  (Screen)
  Text:         #0E1228  (Twilight)
  Accent 1:     #C49A1C  (Golden)    → darkened for light surface
  Accent 2:     #4A55A0  (Periwinkle)→ darkened for light surface
  Accent 3:     #B07060  (Peach)     → darkened for light surface
  Border:       #D8D5E2  (Haze)
  Muted text:   #555775  (Dusk)
  Error:        #DC2626  (Alarm)

FONTS
  Display: Syne 500/600/700
  Body:    Figtree 400/500/600
  Mono:    Courier New

SPACING
  4 · 8 · 16 · 24 · 32 · 48 · 64 · 96 · 128px
```

---

## Relationship to Civic Ink

This system is a **fork, not a branch.** It shares Civic Ink's structural DNA (grid, spacing, borders, accessibility, component logic) but has its own palette, typography, and a third accent role that Civic Ink doesn't define. Changes to Civic Ink do not automatically propagate here. If Civic Ink's structural rules update (spacing scale, border conventions, form patterns), evaluate whether they apply and adopt manually.

---

*Version 0.1 · July 2026 · Find-a-Film · Blue Hour palette · Syne + Figtree*
