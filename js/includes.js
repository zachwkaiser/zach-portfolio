/** Load HTML partials from data-include placeholders (fetch + inject). */

export async function loadIncludes(root = document) {
  const nodes = [...root.querySelectorAll("[data-include]")];
  if (!nodes.length) return;

  await Promise.all(
    nodes.map(async (el) => {
      const url = el.getAttribute("data-include");
      if (!url) return;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to load partial: ${url} (${res.status})`);
      }

      const html = await res.text();
      const frag = document.createRange().createContextualFragment(html);
      el.replaceWith(frag);
    })
  );

  // Support nested includes if partials contain further data-include slots
  if (document.querySelector("[data-include]")) {
    await loadIncludes(document);
  }
}
