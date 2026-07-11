const form = document.querySelector(".finder");
const results = document.querySelector(".results");
const button = document.querySelector(".find-button");

function card(r) {
  const runtime = r.runtime ? ` · ${r.runtime}` : "";
  const badges = r.services
    .map((s) => `<span class="service-badge">${s}</span>`)
    .join(" ");
  const poster = r.poster
    ? `<img class="result-poster" src="${r.poster}" alt="Poster for ${r.title}" loading="lazy">`
    : "";
  return `
    <article class="result-card">
      <div class="result-body">
        <header class="result-header">
          <h3 class="result-title">${r.title} <span class="result-meta">(${r.year})${runtime}</span></h3>
        </header>
        <p class="result-why"><strong>Why this fits:</strong> ${r.why}</p>
        <p class="result-availability">Available on: ${badges}</p>
      </div>
      ${poster}
    </article>`;
}

function section(heading, items) {
  if (items.length === 0) return "";
  return `<h2 class="results-section-heading">${heading}</h2>` + items.map(card).join("");
}

results.addEventListener("click", (event) => {
  if (!event.target.closest(".start-over")) return;
  form.reset();
  results.innerHTML = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
  form.mood.focus();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const mood = form.mood.value.trim();
  const services = [...form.querySelectorAll("input[name=services]:checked")].map(
    (el) => el.value
  );

  if (!mood) {
    results.innerHTML = `<p class="results-note">Tell us what you're in the mood for first — that's the whole trick.</p>`;
    form.mood.focus();
    return;
  }
  if (services.length === 0) {
    results.innerHTML = `<p class="results-note">Pick at least one streaming service so we only suggest things you can watch.</p>`;
    return;
  }

  button.disabled = true;
  button.textContent = "Reading the room…";
  results.innerHTML = `<p class="results-note">Finding things that fit. This takes a moment — we double-check every title is really on your services.</p>`;

  try {
    const res = await fetch("/api/find", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, services }),
    });
    const data = await res.json();

    if (!res.ok) {
      results.innerHTML = `<p class="results-note results-note--error">${data.error ?? "Something went wrong. Try again in a moment."}</p>`;
      return;
    }
    if (data.results.length === 0) {
      results.innerHTML = `<p class="results-note">Nothing on your services quite fit that mood. Try adding a service, or tell us a little more about how you're feeling.</p>`;
      return;
    }
    const movies = data.results.filter((r) => r.media_type === "movie");
    const shows = data.results.filter((r) => r.media_type === "tv");
    results.innerHTML =
      `<div class="results-header">
        <p class="results-heading">Here's what fits</p>
        <button type="button" class="start-over">Start over</button>
      </div>` +
      section("Movies", movies) +
      section("TV shows", shows);
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch {
    results.innerHTML = `<p class="results-note results-note--error">Couldn't reach the server. Check your connection and try again.</p>`;
  } finally {
    button.disabled = false;
    button.textContent = "Find me something";
  }
});
