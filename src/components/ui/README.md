# UI primitives

Presentational building blocks with no knowledge of the app: no i18n, no data files, no Next.js
imports. Feature components (`components/{layout,home,research,professional,hobbies,blog}`) compose
them with content. They are the seed of a future design system package.

## Conventions

- **One primitive per file**, PascalCase (`Button.tsx`), with its styles in a colocated
  `Button.module.css`. Related pieces share a file (`Button`, `ButtonLink`, `ButtonGroup`).
- **Import by path** (`@/components/ui/Button`). There is deliberately no `index.ts` barrel:
  importing a barrel pulls every primitive's CSS into every route's stylesheet, and it would mix
  `"use client"` modules into server imports.
- **Props**: typed, `className` is always passed through (merged with `cx`), and the remaining
  native props are spread onto the root element. Elements that vary take `as`
  (`<Card as="article">`, `<ButtonLink as={Link}>`) via `PolymorphicProps`.
- **Variants are props, not classes**: `variant`, `tone`, `size`, `spacing`, `direction`. Add a
  variant to the primitive rather than overriding it from outside.
- **Server-first**: primitives have no `"use client"` unless they need state, effects or DOM event
  logic of their own (`ChipGroup`, `Dialog`, `Toast`). Plain ones (Button…)
  accept `onClick` but work in server components too.
- **Strings come in as props.** Primitives never call `t()`; callers pass resolved labels.

### Styling rules

- Values come from the tokens in `src/styles/tokens.css` (`var(--trail)`, `var(--s-2)`,
  `var(--radius)`, `var(--ease-out)`). `src/styles/tokens.ts` mirrors them for TS consumers and a
  unit test keeps the two in sync.
- Global CSS is limited to `styles/base.css`: reset, element defaults, focus ring, `.sr-only`,
  `.mono`, the `.view` page-enter animation and view transitions.
- CSS Module stylesheets load in an order the bundler decides. So **never rely on source order
  between two modules**: when a consumer adjusts a primitive through `className`, either touch
  properties the primitive doesn't set (margins, grid placement) or use a selector with more
  specificity (`.row .menuBtn` beats `.iconBtn`). Within one module, order is reliable.
- Keyframes are declared in the module that uses them (CSS Modules scope their names).

### Accessibility rules

- Icon-only controls require `aria-label` (enforced by `IconButton`'s type). Icons are
  `aria-hidden`; label the control, not the icon.
- Toggles use `aria-pressed` (`ChipGroup`, theme toggle); disclosures use `aria-expanded`; a set of
  links where one is the current option (language switch) marks it with `aria-current="true"`.
- Decorative glyphs in text (`→`, `·`, the pressed `✓`) are `aria-hidden` or use CSS alt text
  (`content:"✓" / ""`) so they never change an accessible name. Put a space or an `.sr-only`
  separator between adjacent pieces of text so they are not read as one word.
- Filtered lists pair a `ChipGroup`/`Select` with a `ResultCount` (polite live region).
- Pages have exactly one `<h1>`, rendered by `PageHeader` (or the home hero).
- Mixed-language content gets `lang` (`titleLang`, `ChipOption.lang`, or `lang` on the element).
- Target sizes: 44px for header controls and link chips, ≥24px for every other control or
  standalone link (WCAG 2.5.8); selected states stay visible under `forced-colors: active`.

### Motion

Restrained and functional: motion confirms an action or shows how things connect, never carries
meaning on its own. Rules:

- **Durations** are tokens: `--d-1` 120ms (micro: colour, small fades), `--d-2` 200ms (hover and
  state changes), `--d-3` 320ms (entrances, panels). Presses are 80ms. Image/screenshot moves may
  run to ~.45s; nothing interactive is slower. Easing is `--ease-out` (`--ease-io` for draws).
- **Hover = focus.** Whatever hover does, keyboard focus does too: `:is(:hover,:focus-visible)` on
  link cards, `:has(:focus-visible)` (or `:focus-within`) on article cards with inner links.
  `Card interactive` does this (2px lift, `--trail` border, shadow); consumers repeat the selector
  list for their own details (arrow nudge, ripple, screenshot lift).
- **Press**: buttons, chips, icon buttons and the lightbox/pause controls dip on `:active`
  (`translateY(1px) scale(.98)`, 80ms in, `--d-2` back).
- **Arrows**: a link's trailing "→" is `<Arrow/>`; it nudges 3px on hover/focus.
- **Zoom** is for gallery thumbnails only (≤1.03). Elsewhere things lift, they don't scale.
- **Self-running animation** (draw-on-enter, page rise, hero entrance, GPS replay) lives inside
  `@media (prefers-reduced-motion: no-preference)`; scroll-driven ones also inside
  `@supports (animation-timeline: view())` with a time-based (or JS) fallback under
  `@supports not`. Scroll timelines need the document as their scroller: use `overflow:clip`, not
  `hidden`, on a card that clips (hidden makes it a scroll container), or a named
  `view-timeline` on an ancestor outside a scroller (AscentProfile).
- Under `reduce` there are **zero** animations (an e2e test checks `document.getAnimations()`), and
  `base.css` collapses transition durations. JS motion checks the media query too.
- **Never hidden at rest.** Content is visible without JS and is never parked at opacity 0 waiting
  for an observer. Entrances start at opacity `.001` (still counts as painted for LCP); only
  decorative `aria-hidden` pieces may start hidden, and only inside the motion media query. The
  home `<h1>` never animates; a `.view` child marked `data-enter="self"` skips the page rise.
- **View transitions** are scoped so they never mix (base.css): the theme toggle's circle reveal
  (`html.vt-theme`), filter re-flows (`filterTransition` sets `html[data-vt="filter"]`; only then
  do `vtItem` elements get their `view-transition-name`), and the EN↔PT cross-document fade
  (`lang-switch` type). For a filtered list: give each item `{...vtItem(scope, key)}` (unique per
  page) and wrap the state update in `filterTransition(() => setX(v))`.
- **Popovers and toasts** animate in with `@starting-style` and out with
  `transition-behavior: allow-discrete` on `display`/`overlay`; move with `translate`/`scale`
  when `transform` already positions the element.

## Inventory

| Primitive | API | Notes |
|---|---|---|
| `Container` | `<Container as? className?>` | Max `--wrap` column with safe-area side gutters (16px, 32px ≥720px). |
| `Section` | `<Section flush?="top">` | Container + vertical rhythm; `flush="top"` after a page header. |
| `PageHeader` | `<PageHeader eyebrow? title titleLang? lede? spacing?="default"\|"tight" fill?>{extras}</PageHeader>` | The page's `<h1>`. `fill` = ≥50vh, centred (404). |
| `SectionHeader` | `<SectionHeader title>{aside}</SectionHeader>` | `<h2>` with an optional right-hand link/label/meta. |
| `Label` | `<Label as?="span" tabular?>` | Small uppercase mono text. |
| `Eyebrow` | `<Eyebrow symbol? tabular?>text</Eyebrow>` | Label above a title, optional map symbol (▲ △ ◆ ✎). |
| `Button` | `<Button variant?="default"\|"primary"\|"inverse" size?="md"\|"sm">` | `type="button"` by default; inverse is for dark panels. |
| `ButtonLink` | `<ButtonLink as?={Link} href variant? size?>` | Link styled as a button. `buttonClass()` for other elements. |
| `ButtonGroup` | `<ButtonGroup>` | Wrapping row, 10px gap. |
| `IconButton` | `<IconButton aria-label ...>` | 44×44 round control for one icon. Accepts `ref`. |
| `Chip` | `<Chip as?="span"\|"a"\|"li">` | Static keyword; as a link it is a 44px chip, and `aria-current="true"` fills it with a check (language switch). |
| `ChipList` | `<ChipList><Chip as="li"/>…</ChipList>` | Unstyled `<ul>` of chips. |
| `ChipGroup` | `<ChipGroup label options={[{value,label,lang?}]} value onChange>` | Single-select filter: labelled `role="group"` of `aria-pressed` buttons. Client. |
| `Select` | `<Select id>` | Native select styled as a pill; pair with `<Label as="label" htmlFor>`. |
| `FilterBar` | `<FilterBar>` | Row holding filters. |
| `ResultCount` | `<ResultCount>Showing n of t</ResultCount>` | `role="status"` + `aria-live="polite"`. |
| `Pill` | `<Pill>` | Filled mono tag. |
| `Badge` | `<Badge variant="outline"\|"dashed"\|"label" tone?="neutral"\|"forest"\|"trail">` | Language code, status ("Sample"), category ("Journal"). |
| `Card` | `<Card as? interactive?>` | Surface + border + radius; with `interactive`, hover and keyboard focus lift it 2px. Sets no padding/layout. |
| `StatList` | `<StatList items={[{value,label}]}>` | Big numbers with captions. |
| `Meta` | `<Meta as? direction?="row"\|"column">` | Muted mono line of facts. |
| `Notice` | `<Notice>` | Dashed page-level caveat. |
| `Dialog` | `<Dialog open onClose closeOnBackdrop?>` | Controlled native modal `<dialog>`; unstyled. Client. |
| `Toaster` / `showToast` / `ToastButton` | `<Toaster/>` once; `showToast(msg)`; `<ToastButton message variant? size?>` | One toast outlet: a permanent visually hidden `role="status"` region (each toast is a new keyed node, so repeats are announced) plus an `aria-hidden` visual pill. Client. |
| `Arrow` | `<a>Text <Arrow/></a>` | Decorative trailing "→" (`aria-hidden`) that nudges 3px on hover/focus of its link. |
| icons | `<ArrowRight/>`, `Download`, `MenuIcon`, `Sun`, `Moon`, `Close`, `ChevronLeft/Right`, `GitHub`, `LinkedIn`, `Wikiloc`, `Instagram`, `Orcid`, `Scholar` | 24×24 `currentColor` SVGs, `aria-hidden`. |
| `cx` | `cx(...classNames)` | Joins truthy class names. |
