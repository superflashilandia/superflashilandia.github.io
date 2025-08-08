document.addEventListener("DOMContentLoaded", () => {
  // --- Utils ---
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const contentEl = $("#content");

  function getTagFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("tag") || "home";
  }

  function setActiveButton(tag) {
    $$(".filter-button").forEach(btn => {
      const isActive = btn.dataset.filter === tag;
      btn.classList.toggle("filter-button-active", isActive);
    });
  }

  function clearContent() {
    if (contentEl) contentEl.innerHTML = "";
    const gallery = $("#gallery");
    if (gallery) gallery.innerHTML = ""; // por si tu galería depende del tag
  }

  function makeLink(url_text, url) {
    const a = document.createElement("a");
    a.innerText = url_text;
    a.href = url;
    a.className = "contentLinks";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
  }

  function renderSection(section, container) {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "content-section";

    // Título principal (H1)
    if (section.title) {
      const h1 = document.createElement("h1");
      h1.innerText = section.title;
      sectionDiv.appendChild(h1);
    }

    // Formato con items (CV, Premios, etc.)
    if (section.items && Array.isArray(section.items)) {
      section.items.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "content-item";

        if (item.subtitle) {
          const h2 = document.createElement("h2");
          h2.innerText = item.subtitle;
          itemDiv.appendChild(h2);
        }

        if (item.description) {
          const desc = document.createElement("div");
          desc.innerHTML = item.description; // permite HTML
          itemDiv.appendChild(desc);
        }

        if (item.image) {
          const img = document.createElement("img");
          img.src = item.image;
          itemDiv.appendChild(img);
        }

        if (item.links && Array.isArray(item.links)) {
          const linksWrap = document.createElement("div");
          linksWrap.className = "links";
          item.links.forEach(link => {
            linksWrap.appendChild(makeLink(link.url_text, link.url));
          });
          itemDiv.appendChild(linksWrap);
        }

        sectionDiv.appendChild(itemDiv);
      });
    } else {
      // Formato simple (Home y similares)
      if (section.description) {
        const desc = document.createElement("div");
        desc.innerHTML = section.description; // permite HTML
        sectionDiv.appendChild(desc);
      }

      if (section.image) {
        const img = document.createElement("img");
        img.src = section.image;
        sectionDiv.appendChild(img);
      }

      if (section.links && Array.isArray(section.links)) {
        const linksWrap = document.createElement("div");
        linksWrap.className = "links";
        section.links.forEach(link => {
          linksWrap.appendChild(makeLink(link.url_text, link.url));
        });
        sectionDiv.appendChild(linksWrap);
      }
    }

    container.appendChild(sectionDiv);
  }

  async function loadTag(tag) {
    try {
      clearContent();
      setActiveButton(tag);

      const res = await fetch(`data/${tag}.json`);
      const data = await res.json();

      // Render de todas las secciones del array
      data.forEach((section, idx) => {
        renderSection(section, contentEl);
        // Separador visual entre secciones si hay varias
        if (data.length > 1 && idx < data.length - 1) {
          const hr = document.createElement("hr");
          hr.className = "section-separator";
          contentEl.appendChild(hr);
        }
      });
    } catch (err) {
      console.error("Error cargando la sección:", err);
      if (contentEl) {
        contentEl.innerHTML = "<p>Hubo un problema cargando el contenido.</p>";
      }
    }
  }

  // --- Navegación por botones (tabs) ---
  $$(".filter-button").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const tag = btn.dataset.filter || "home";

      // actualizar URL sin recargar
      const newUrl = `${window.location.pathname}?tag=${encodeURIComponent(tag)}`;
      history.pushState({ tag }, "", newUrl);

      loadTag(tag);
    });
  });

  // Soporte para back/forward del navegador
  window.addEventListener("popstate", (e) => {
    const tag = (e.state && e.state.tag) || getTagFromURL();
    loadTag(tag);
  });

  // --- Carga inicial ---
  const initialTag = getTagFromURL();
  setActiveButton(initialTag);
  loadTag(initialTag);
});
