import { handleFind } from "../lib/find.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const { status, json } = await handleFind(req.body ?? {});
    res.status(status).json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong on our end. Try again in a moment." });
  }
}
