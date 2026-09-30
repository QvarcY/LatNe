import "./styles.css"
import registry from "../../../packages/valoda/data/termini.json"

type Term = typeof registry.terms[number]

function getApp(): HTMLDivElement {
  const app = document.querySelector<HTMLDivElement>("#app")

  if (!app) {
    throw new Error("Trūkst app konteinera")
  }

  return app
}

const app = getApp()

let selectedId = registry.terms[0]?.id ?? ""
let search = ""

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function visibleTerms(): Term[] {
  const needle = search.trim().toLocaleLowerCase("lv")

  if (!needle) {
    return registry.terms
  }

  return registry.terms.filter(term =>
    term.source.toLocaleLowerCase("lv").includes(needle) ||
    term.kind.toLocaleLowerCase("lv").includes(needle) ||
    term.category.toLocaleLowerCase("lv").includes(needle)
  )
}

function selectedTerm(): Term | undefined {
  return registry.terms.find(term => term.id === selectedId)
}

function render(): void {
  const terms = visibleTerms()

  if (!terms.some(term => term.id === selectedId)) {
    selectedId = terms[0]?.id ?? ""
  }

  const selected = selectedTerm()

  const list = terms
    .map(term => `
      <button
        class="term ${term.id === selectedId ? "active" : ""}"
        data-id="${escapeHtml(term.id)}"
      >
        <span>${escapeHtml(term.source)}</span>
        <small>${escapeHtml(term.status)}</small>
      </button>
    `)
    .join("")

  app.innerHTML = `
    <main class="shell">
      <header class="header">
        <div>
          <div class="eyebrow">LatNe</div>
          <h1>Vārdu kalve</h1>
          <p>Kanoniskais terminoloģijas reģistrs</p>
        </div>

        <div class="summary">
          <strong>${registry.terms.length}</strong>
          <span>kandidāti</span>
        </div>
      </header>

      <section class="workspace">
        <aside class="sidebar">
          <input
            id="search"
            type="search"
            placeholder="Meklēt"
            value="${escapeHtml(search)}"
          >

          <div class="count">
            ${terms.length} no ${registry.terms.length}
          </div>

          <div class="terms">
            ${list || '<div class="empty">Nekas nav atrasts</div>'}
          </div>
        </aside>

        <section class="detail">
          ${
            selected
              ? `
                <div class="position">
                  ${selected.order} / ${registry.terms.length}
                </div>

                <h2>${escapeHtml(selected.source)}</h2>

                <div class="badges">
                  <span>${escapeHtml(selected.kind)}</span>
                  <span>${escapeHtml(selected.category)}</span>
                  ${selected.layers
                    .map(layer => `<span>${escapeHtml(layer)}</span>`)
                    .join("")}
                </div>

                <dl>
                  <div>
                    <dt>Statuss</dt>
                    <dd>${escapeHtml(selected.status)}</dd>
                  </div>

                  <div>
                    <dt>Latviskais variants</dt>
                    <dd>${escapeHtml(selected.latvian || "nav izvēlēts")}</dd>
                  </div>

                  <div>
                    <dt>Piezīmes</dt>
                    <dd>${escapeHtml(selected.notes || "nav")}</dd>
                  </div>
                </dl>

                <div class="readonly">
                  Tikai lasīšanas režīms
                </div>
              `
              : `
                <div class="empty">
                  Nav termina ko rādīt
                </div>
              `
          }
        </section>
      </section>
    </main>
  `

  bindEvents()
}

function bindEvents(): void {
  document.querySelector<HTMLInputElement>("#search")
    ?.addEventListener("input", event => {
      search = (event.target as HTMLInputElement).value
      render()
    })

  document.querySelectorAll<HTMLButtonElement>("[data-id]")
    .forEach(button => {
      button.addEventListener("click", () => {
        selectedId = button.dataset.id ?? ""
        render()
      })
    })
}

render()
