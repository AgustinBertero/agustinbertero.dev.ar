---
name: Agustin Bertero — Portfolio
description: Personal developer portfolio built as a printed technical dossier.
colors:
  paper: "#e9e7de"
  paper-deep: "#dedbcf"
  ink: "#14161a"
  ink-soft: "#4a4e55"
  rule: "#c3bfaf"
  institution: "#17395c"
  institution-deep: "#0f2740"
  stamp: "#a83828"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 8.06vw, 8rem)"
    fontWeight: 600
    lineHeight: 0.88
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.4vw, 3.25rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
  lede:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.55vw, 1.4375rem)"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Courier Prime, ui-monospace, Courier New, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    letterSpacing: "0.08em"
rounded:
  none: "0"
spacing:
  gutter: "clamp(1.25rem, 3.9vw, 3.5rem)"
  section: "clamp(3.5rem, 7vw, 6.5rem)"
  row: "0.5rem 0"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0.875rem"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.875rem"
  fact-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "{spacing.row}"
---

## Overview

The portfolio presents Agustin Bertero as a full stack developer who also runs the servers his code lives on. The visual world is a printed technical dossier: cool archival paper, hairline rules, monospaced annotations, section numbers and one red stamp. The first viewport is the profile sheet, not a marketing hero.

Everything on the page belongs to that dossier. Sections are portfolio parts (projects, experience, stack, about, contact), not generic blocks. The tone is direct and technical; no gradients, no glass, no decorative chrome.

## Colors

- **Paper `#e9e7de`** is the page ground. **Paper deep `#dedbcf`** is the only tonal layer: hover rows, project sheets, the seal's reverse side.
- **Ink `#14161a`** carries text, rules and the primary button. **Ink soft `#4a4e55`** is for secondary text and annotations.
- **Rule `#c3bfaf`** is the hairline between table rows and index columns. It is a warm grey, never a shadow.
- **Institution `#17395c`** is the institutional blue: kicker, hover states, focus, caret. **Institution deep `#0f2740`** is its pressed/deep pair.
- **Stamp `#a83828`** is reserved for the availability seal, section numbers and status stamps. It is an accent, not a text color.

Contrast targets: body and small mono text on paper stay at or above 4.5:1. Stamp red is for the seal, section numbers and status stamps; it passes AA at small sizes but is never body copy.

## Typography

Archivo is the document's voice: the name at display scale, section titles, body copy and buttons. Courier Prime is the machine's voice: reference codes, labels, section numbers, table headers and the seal. The pairing is deliberate — one humanist sans, one typewriter face — and no third family is introduced.

- **Display** is only for the name in the profile sheet, two lines, tight tracking. Do not reuse it for section titles.
- **Title** is for section headings, set solid and left-aligned.
- **Lede** is the profile role paragraph and section intros.
- **Body** is 1rem with generous line height; measure caps at 68ch.
- **Label** is 0.6875rem uppercase Courier with wide tracking. It labels data; it never decorates a heading.

## Layout

The page is a single column of full-width document bands inside a 1440px shell with a fluid gutter. The profile sheet is the exception: its masthead and index rules bleed to the viewport edge, while its content keeps the gutter. The footer rule returns to the shell inset.

- Profile sheet: two columns — identity and actions left, professional data table and seal right. The table is `clamp(17.5rem, 26.4vw, 23.75rem)` wide. Below 900px the columns stack and the seal becomes a static block.
- Sections: a three-column head (number, title, note) over a single content column. Entries are two-column rows (date/meta, body) that collapse to one column on small screens.
- The index band is three equal columns with dot leaders; it becomes a stacked list on mobile.
- Rhythm: section padding is `clamp(3.5rem, 7vw, 6.5rem)` above and zero below, so rules, not margins, separate bands.
- Breakpoints are structural, not decorative: 900px for the profile sheet and section heads, 560px for masthead/footer trimming.

## Elevation & Depth

There is no elevation. The page is flat printed paper: no box shadows, no blur, no glass, no z-axis tricks. Depth comes from rule weight, tonal paper, and overlap (the seal sits over the table). If a new element needs separation, use a 1px rule or a paper-deep fill before reaching for a shadow.

## Shapes

Zero radius. Buttons, tables, cards and stamps are hard-edged rectangles or circles. The only circular forms are the seal and the status stamps. Borders are 1px, except the seal's 3px double rule and the section rules that mark a section boundary. No rounded corners, no pills, no soft cards.

## Components

- **Button primary**: ink fill, paper text, 0.875rem padding, 1px ink border, hard corners. Hover deepens to institution; active nudges 1px down.
- **Button outline**: paper fill, ink text, 1px top/bottom rules only on the profile sheet, no side borders. Hover fills paper-deep.
- **Fact table**: 1px rule under each row, mono uppercase labels in a fixed 7.5rem column, tabular numerals in values. This is the data primitive for the profile, projects and CV.
- **Project card**: paper-deep sheet, 1px rules, tag row with project number and status, title, summary, links, fact table and a rotated status stamp.
- **Index row**: number, name, dot leader, section number. Hover and active use paper-deep; the active section is tracked by `Motion.tsx`.
- **Section head**: number in stamp red, title in Archivo, note in ink-soft. The rule above is the section boundary.
- **Seal**: 10.75rem circle, 3px double stamp-red rule, rotated -9deg, Courier caps, availability state. It is the signature element; do not duplicate it elsewhere.

## Do's and Don'ts

- Do keep the paper/ink/stamp palette and the two-family type system. Do not add a third accent or a new font.
- Do use rules, section numbers and mono labels to structure content. Do not add cards, shadows, gradients or rounded corners.
- Do keep the profile sheet's measured geometry: name scale, CTA strip, data table, seal and index band are a single composition.
- Do preserve full interaction states (`hover`, `active`, `focus-visible`, `disabled`) and a visible focus ring in institution blue.
- Do keep the document legible without JavaScript; reveals are opt-in and content is visible by default.
- Don't reuse the display size outside the profile sheet, don't put the stamp red in body copy, and don't turn the kicker into a generic eyebrow on new sections.
- Don't publish the phone number or invent metrics, clients or testimonials.
