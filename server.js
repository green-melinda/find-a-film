// Local dev server. In production (Vercel), api/find.js serves the endpoint
// and public/ is served statically; both use the same lib/find.js.
import http from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(ROOT, "public");

// Load .env (no dependency needed for three variables)
if (existsSync(path.join(ROOT, ".env"))) {
  for (const line of readFileSync(path.join(ROOT, ".env"), "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && m[2] && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const { handleFind } = await import("./lib/find.js");

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
    const filePath = path.join(PUBLIC, path.normalize(file));
    if (!filePath.startsWith(PUBLIC) || !existsSync(filePath)) {
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
