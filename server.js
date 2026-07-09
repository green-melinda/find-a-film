import http from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const ROOT = path.dirname(fileURLToPath(import.meta.url));

// Load .env (no dependency needed for three variables)
if (existsSync(path.join(ROOT, ".env"))) {
  for (const line of readFileSync(path.join(ROOT, ".env"), "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && m[2] && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const TMDB_TOKEN = process.env.TMDB_READ_TOKEN;
const anthropic = new Anthropic();

// Our service ids → TMDB watch-provider ids (US region).
// Some services have multiple provider entries (ad tiers, rebrands).
const PROVIDERS = {
  netflix: { label: "Netflix", ids: [8, 1796] },
  prime: { label: "Prime Video", ids: [9, 119, 2100] },
  disney: { label: "Disney+", ids: [337] },
  max: { label: "HBO Max", ids: [1899, 384] },
  hulu: { label: "Hulu", ids: [15] },
  appletv: { label: "Apple TV+", ids: [350] },
  paramount: { label: "Paramount+", ids: [531, 582] },
  peacock: { label: "Peacock", ids: [386, 387] },
  criterion: { label: "Criterion Channel", ids: [258] },
  tubi: { label: "Tubi", ids: [73] },
};

const CANDIDATE_SCHEMA = {
  type: "object",
  properties: {
    candidates: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          year: { type: "integer" },
          media_type: { type: "string", enum: ["movie", "tv"] },
          why: { type: "string" },
        },
        required: ["title", "year", "media_type", "why"],
        additionalProperties: false,
      },
    },
  },
  required: ["candidates"],
  additionalProperties: false,
};

async function getCandidates(mood, serviceLabels) {
  const response = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system:
      "You help people find something to watch based on how they're feeling. " +
      "The user writes a short paragraph about their mood; read it closely — tone matters " +
      "as much as content. Propose 12 movie or TV candidates that fit the mood. " +
      "Favor titles likely to be on the user's streaming services, and mix obvious picks " +
      "with a few less-expected ones. For each, write one warm, specific sentence " +
      "explaining why it fits — written back to their mood, not a generic synopsis. " +
      "Plain language, no film-critic jargon.",
    output_config: { format: { type: "json_schema", schema: CANDIDATE_SCHEMA } },
    messages: [
      {
        role: "user",
        content: `Mood: ${mood}\n\nStreaming services available: ${serviceLabels.join(", ")}`,
      },
    ],
  });
  const text = response.content.find((b) => b.type === "text");
  return JSON.parse(text.text).candidates;
}

async function tmdb(pathname, params = {}) {
  const url = new URL(`https://api.themoviedb.org/3${pathname}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TMDB_TOKEN}`, accept: "application/json" },
  });
  if (!res.ok) throw new Error(`TMDB ${res.status} on ${pathname}`);
  return res.json();
}

// Verify one candidate: does it exist, and is it on one of the user's services?
async function verifyCandidate(candidate, services) {
  const isMovie = candidate.media_type === "movie";
  const search = await tmdb(`/search/${candidate.media_type}`, {
    query: candidate.title,
    ...(isMovie ? { year: candidate.year } : { first_air_date_year: candidate.year }),
  });
  const hit = search.results?.[0];
  if (!hit) return null;

  const details = await tmdb(`/${candidate.media_type}/${hit.id}`, {
    append_to_response: "watch/providers",
  });
  const us = details["watch/providers"]?.results?.US;
  const streamable = [...(us?.flatrate ?? []), ...(us?.free ?? [])];

  const availableOn = services.filter((s) =>
    streamable.some((p) => PROVIDERS[s]?.ids.includes(p.provider_id))
  );
  if (availableOn.length === 0) return null;

  const runtimeMin = isMovie ? details.runtime : details.episode_run_time?.[0];
  return {
    title: isMovie ? details.title : details.name,
    year: (details.release_date || details.first_air_date || "").slice(0, 4),
    media_type: candidate.media_type,
    runtime: runtimeMin
      ? `${Math.floor(runtimeMin / 60) ? `${Math.floor(runtimeMin / 60)}h ` : ""}${runtimeMin % 60}m`
      : null,
    why: candidate.why,
    services: availableOn.map((s) => PROVIDERS[s].label),
    poster: details.poster_path
      ? `https://image.tmdb.org/t/p/w342${details.poster_path}`
      : null,
  };
}

async function handleFind(body) {
  const mood = (body.mood ?? "").trim().slice(0, 500);
  const services = (body.services ?? []).filter((s) => s in PROVIDERS);
  if (!mood) return { status: 400, json: { error: "Tell us what you're in the mood for first." } };
  if (services.length === 0) return { status: 400, json: { error: "Pick at least one streaming service." } };

  const candidates = await getCandidates(mood, services.map((s) => PROVIDERS[s].label));
  const verified = await Promise.all(
    candidates.map((c) => verifyCandidate(c, services).catch(() => null))
  );
  return { status: 200, json: { results: verified.filter(Boolean).slice(0, 8) } };
}

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/api/find") {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      const { status, json } = await handleFind(JSON.parse(raw || "{}"));
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(json));
      return;
    }
    const file = req.url === "/" ? "/index.html" : req.url.split("?")[0];
    const filePath = path.join(ROOT, path.normalize(file));
    if (!filePath.startsWith(ROOT) || !existsSync(filePath)) {
      res.writeHead(404).end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] ?? "application/octet-stream" });
    res.end(await readFile(filePath));
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Something went wrong on our end. Try again in a moment." }));
  }
});

server.listen(4173, () => console.log("find-a-film running on http://localhost:4173"));
