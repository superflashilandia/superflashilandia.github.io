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

  // Helpers para imágenes
  function appendSingleImage(src, container) {
    if (!src) return;
    const img = document.createElement("img");
    img.src = src;
    container.appendChild(img);
  }

  function appendImagesArray(images, container) {
    if (!images) return;

    // normalizo: aceptar string o array
    const list = Array.isArray(images) ? images : [images];
    if (list.length === 0) return;

    // salto de línea ANTES del bloque de imágenes múltiples
    container.appendChild(document.createElement("br"));

    const wrap = document.createElement("div");
    wrap.className = "extra-images";
    container.appendChild(wrap);

    list.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      wrap.appendChild(img);
    });
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

    // Formato con items (CV, Premios, Discografía, etc.)
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

        // Imagen simple del item
        if (item.image) {
          appendSingleImage(item.image, itemDiv);
        }

        // MÚLTIPLES imágenes del item (con salto de línea antes)
        if (item.images) {
          appendImagesArray(item.images, itemDiv);
        }

        if (item.links && Array.isArray(item.links)) {
          const linksWrap = document.createElement("div");
          linksWrap.className = "links";
          item.links.forEach(link => {
            linksWrap.appendChild(makeLink(link.url_text, link.url));
          });
          itemDiv.appendChild(linksWrap);

          // 🔹 Separador regulable después de los links
          const spacer = document.createElement("div");
          spacer.className = "item-spacer";
          itemDiv.appendChild(spacer);
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

      // Imagen simple de la sección
      if (section.image) {
        appendSingleImage(section.image, sectionDiv);
      }

      // MÚLTIPLES imágenes de la sección (con salto de línea antes)
      if (section.images) {
        appendImagesArray(section.images, sectionDiv);
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

  // -----------------------------
  // Instagram helpers
  // -----------------------------
  function loadInstagramScriptOnce(callback) {
    if (window.instgrm && window.instgrm.Embeds) {
      callback?.();
      return;
    }
    if (document.getElementById("instagram-embed-js")) {
      const tryProcess = () => {
        if (window.instgrm && window.instgrm.Embeds) {
          callback?.();
        } else {
          setTimeout(tryProcess, 150);
        }
      };
      tryProcess();
      return;
    }
    const s = document.createElement("script");
    s.id = "instagram-embed-js";
    s.src = "https://www.instagram.com/embed.js";
    s.async = true;
    s.onload = () => callback?.();
    document.body.appendChild(s);
  }

  function wrapInstagramEmbedsInGrid() {
    if (!contentEl) return;

    const alreadyWrapped = contentEl.querySelector(".instagram-grid");
    const embeds = Array.from(contentEl.querySelectorAll("blockquote.instagram-media"));
    if (embeds.length === 0) return;
    if (alreadyWrapped) return;

    const grid = document.createElement("div");
    grid.className = "instagram-grid";
    contentEl.appendChild(grid);

    embeds.forEach(bq => {
      if (bq.parentElement !== grid) {
        grid.appendChild(bq);
      }
    });
  }

  function processInstagramEmbeds() {
    loadInstagramScriptOnce(() => {
      if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === "function") {
        window.instgrm.Embeds.process();
      }
    });
  }

  async function loadTag(tag) {
    try {
      clearContent();
      setActiveButton(tag);

      const res = await fetch(`data/${tag}.json`);
      const data = await res.json();

      data.forEach((section, idx) => {
        renderSection(section, contentEl);
        if (data.length > 1 && idx < data.length - 1) {
          const hr = document.createElement("hr");
          hr.className = "section-separator";
          contentEl.appendChild(hr);
        }
      });

      wrapInstagramEmbedsInGrid();
      processInstagramEmbeds();

    } catch (err) {
      console.error("Error cargando la sección:", err);
      if (contentEl) {
        contentEl.innerHTML = "<p>Hubo un problema cargando el contenido.</p>";
      }
    }
  }

  $$(".filter-button").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const tag = btn.dataset.filter || "home";
      const newUrl = `${window.location.pathname}?tag=${encodeURIComponent(tag)}`;
      history.pushState({ tag }, "", newUrl);
      loadTag(tag);
    });
  });

  window.addEventListener("popstate", (e) => {
    const tag = (e.state && e.state.tag) || getTagFromURL();
    loadTag(tag);
  });

  const initialTag = getTagFromURL();
  setActiveButton(initialTag);
  loadTag(initialTag);
});
