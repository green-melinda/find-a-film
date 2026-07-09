# find-a-film

A mood-based movie/TV finder. You write a paragraph about how you're feeling, pick your
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
- **The "Why this fits" line is the star of the result card** — above the poster in
  priority. The poster is small and on the right, subordinate. Every other app leads
  with the poster wall; this one leads with the reason, because the written mood is the
  input mechanic.
- **Results are sectioned into Movies / TV shows** — "two hours or one episode?" is the
  first fork in the decision, so it gets structure, not a badge.
- **One accent color** (olive), used only for focus rings, the submit button, and the
  "Start over" link. Type does the hierarchy.
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
