# I don't know what to watch

So often I turn on my TV without knowing what to watch. The watchlists I've created don't always mesh with whatever I'm feeling, so I've built an app that uses what I'm feeling to suggest films and tv shows. 

It's easy. You write a paragraph about how you're feeling, pick your
streaming services, and get back titles that fit the mood — verified to actually be
streamable on those services.

## How it works

One flow, one screen: mood paragraph → service checkboxes → results replace nothing (the
form stays visible so people can revise their paragraph against the results — that
revision loop is the core interaction).

**The mechanic: Claude does the empathy, TMDB does the facts.**
`POST /api/find` sends the paragraph + services to Claude (candidates + a "why this
fits" line each), then verifies every candidate against TMDB — does it exist, and is it
on one of the user's services (US region, subscription + free tiers)? Only survivors
reach the screen. This is the hallucination guard; never ship model output about titles
or availability without the TMDB verification step.

## Running it

```
node server.js        # serves the app + API on http://localhost:4173
```

No build step, no framework. `server.js` is a plain Node http server; the only
dependency is `@anthropic-ai/sdk`. Keys live in `.env` (gitignored):
`ANTHROPIC_API_KEY`, `TMDB_READ_TOKEN` (used for requests), `TMDB_API_KEY` (unused, kept
for reference).

## Design decisions (deliberate — don't "fix" these)

- **Copy is the design.** The page was written as words before any layout. The h1 is the
  user's own thought ("I don't know what to watch"); the textarea placeholder
  demonstrates what a real answer looks like. Plain language throughout; no jargon.
- **The voice rule (2026-07-10): the headline, tagline, and headings are the user's
  inner monologue, first person** ("I don't know what to watch" → "Briefly wax
  philosophical about whatever it is I'm feeling right now" → "How am I feeling right
  now?", "Where can I stream?"). The app speaks only in the small helper text beneath
  the headings, and it answers — it never instructs. Don't flip any heading to second
  person, and don't give the app an imperative line.
- **The "Why this fits" line is the star of the result card** — above the poster in
  priority. The poster is small and on the right, subordinate. Every other app leads
  with the poster wall; this one leads with the reason, because the written mood is the
  input mechanic.
- **Results are sectioned into Movies / TV shows** — "two hours or one episode?" is the
  first fork in the decision, so it gets structure, not a badge.
- **Styling is Blue Hour** (2026-07-10, supersedes the Civic Ink adaptation) — the
  app's own design system, forked from Civic Ink v1.5. **`design-system.md` is the
  source of truth**; `public/tokens.css` implements it in two layers (layer 1 Blue Hour
  primitives verbatim, layer 2 `--ff-*` theme aliases — `styles.css` references only
  the theme layer). Three accents, three jobs: Golden = action/CTAs/selected,
  Periwinkle = links/info, Peach = mood/recommendation surfaces. Never two accents on
  one element (this is why service badges inside the peach result cards stay neutral).
  Dark mode ("Twilight") is primary — it's a film app, it lives at night. Syne for
  display, Figtree for body. Result cards use the mood-card pattern: warm-tinted
  surface + 4px Peach left border. Form-field focus is Periwinkle, button/link focus
  is Golden. 4px radius, 8pt grid, no exceptions.
- **No dark patterns, no engagement mechanics.** The app's job is to end the session
  with a decision, not extend it.

## Gotchas

- TMDB watch-provider IDs: one service can have several (ad tiers, rebrands). The map
  lives in `server.js` (`PROVIDERS`) — e.g. Netflix is 8 + 1796, Prime is 9/119/2100,
  HBO Max is 1899 + 384. If a service's titles stop matching, check for a new provider
  ID before touching anything else.
- TMDB often has no runtime for TV (`episode_run_time` empty); the card omits it
  gracefully. Known rough edge, not a bug.
- A search takes a while (Claude call + ~12 TMDB verifications). The loading copy
  carries the wait; if it needs improving, stream results in — don't shorten the
  candidate list.
