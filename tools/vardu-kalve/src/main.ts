import "./styles.css"
import registry from "../../../packages/valoda/data/termini.json"

type Term = typeof registry.terms[number]

type SaveResponse = {
  ok: boolean
  persisted?: boolean
  candidate?: Term
  error?: string
}

const statusLabels: Record<string, string> = {
  pending: "gaida",
  approved: "apstiprināts",
  rejected: "noraidīts",
  reserved: "rezervēts"
}

function getApp(): HTMLDivElement {
  const app = document.querySelector<HTMLDivElement>("#app")

  if (!app) {
    throw new Error("Trūkst app konteinera")
  }

  return app
}

const app = getApp()

let terms: Term[] = registry.terms.map(term => ({
  ...term
}))

let selectedId = terms[0]?.id ?? ""
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
    return terms
  }

  return terms.filter(term =>
    term.source.toLocaleLowerCase("lv").includes(needle) ||
    term.kind.toLocaleLowerCase("lv").includes(needle) ||
    term.category.toLocaleLowerCase("lv").includes(needle) ||
    (term.latvian ?? "")
      .toLocaleLowerCase("lv")
      .includes(needle)
  )
}

function selectedTerm(): Term | undefined {
  return terms.find(term => term.id === selectedId)
}

function renderShell(): void {
  app.innerHTML = `
    <main class="shell">
      <header class="header">
        <div>
          <div class="eyebrow">LatNe</div>
          <h1>Vārdu kalve</h1>
          <p>Kanoniskais terminoloģijas reģistrs</p>
        </div>

        <div class="summary">
          <strong>${terms.length}</strong>
          <span>kandidāti</span>
        </div>
      </header>

      <section class="workspace">
        <aside class="sidebar">
          <input
            id="search"
            type="search"
            placeholder="Meklēt"
          >

          <div id="count" class="count"></div>
          <div id="terms" class="terms"></div>
        </aside>

        <section id="detail" class="detail"></section>
      </section>
    </main>
  `

  document
    .querySelector<HTMLInputElement>("#search")
    ?.addEventListener("input", event => {
      search = (event.target as HTMLInputElement).value
      renderTermList()
      renderDetail()
    })
}

function renderTermList(): void {
  const visible = visibleTerms()
  const container =
    document.querySelector<HTMLDivElement>("#terms")
  const count =
    document.querySelector<HTMLDivElement>("#count")

  if (!container || !count) {
    return
  }

  if (!visible.some(term => term.id === selectedId)) {
    selectedId = visible[0]?.id ?? ""
  }

  count.textContent = `${visible.length} no ${terms.length}`

  container.innerHTML = visible
    .map(term => `
      <button
        class="term ${term.id === selectedId ? "active" : ""}"
        data-id="${escapeHtml(term.id)}"
      >
        <span>${escapeHtml(term.source)}</span>
        <small>
          ${escapeHtml(statusLabels[term.status] ?? term.status)}
        </small>
      </button>
    `)
    .join("")

  document
    .querySelectorAll<HTMLButtonElement>("[data-id]")
    .forEach(button => {
      button.addEventListener("click", () => {
        selectedId = button.dataset.id ?? ""
        renderTermList()
        renderDetail()
      })
    })
}

function renderDetail(message = ""): void {
  const container =
    document.querySelector<HTMLDivElement>("#detail")

  if (!container) {
    return
  }

  const term = selectedTerm()

  if (!term) {
    container.innerHTML =
      '<div class="empty">Nav termina ko rādīt</div>'
    return
  }

  container.innerHTML = `
    <div class="position">
      ${term.order} / ${terms.length}
    </div>

    <h2>${escapeHtml(term.source)}</h2>

    <div class="badges">
      <span>${escapeHtml(term.kind)}</span>
      <span>${escapeHtml(term.category)}</span>
      ${term.layers
        .map(layer => `<span>${escapeHtml(layer)}</span>`)
        .join("")}
    </div>

    <form id="term-form" class="editor-form">
      <label class="field">
        <span>Latviskais variants</span>
        <input
          id="latvian"
          type="text"
          maxlength="80"
          value="${escapeHtml(term.latvian ?? "")}"
          placeholder="Ievadi variantu"
        >
      </label>

      <label class="field">
        <span>Statuss</span>
        <select id="status">
          ${Object.entries(statusLabels)
            .map(([value, label]) => `
              <option
                value="${value}"
                ${term.status === value ? "selected" : ""}
              >
                ${label}
              </option>
            `)
            .join("")}
        </select>
      </label>

      <label class="field">
        <span>Piezīmes</span>
        <textarea
          id="notes"
          rows="5"
          maxlength="2000"
          placeholder="Pamatojums vai piezīmes"
        >${escapeHtml(term.notes ?? "")}</textarea>
      </label>

      <div class="actions">
        <button
          id="save"
          class="save-button"
          type="submit"
        >
          Saglabāt
        </button>

        <span
          id="feedback"
          class="feedback"
        >${escapeHtml(message)}</span>
      </div>
    </form>
  `

  document
    .querySelector<HTMLFormElement>("#term-form")
    ?.addEventListener("submit", saveSelectedTerm)
}

async function saveSelectedTerm(
  event: SubmitEvent
): Promise<void> {
  event.preventDefault()

  const term = selectedTerm()

  if (!term) {
    return
  }

  const latvian =
    document.querySelector<HTMLInputElement>("#latvian")

  const status =
    document.querySelector<HTMLSelectElement>("#status")

  const notes =
    document.querySelector<HTMLTextAreaElement>("#notes")

  const button =
    document.querySelector<HTMLButtonElement>("#save")

  const feedback =
    document.querySelector<HTMLSpanElement>("#feedback")

  if (!latvian || !status || !notes || !button) {
    return
  }

  button.disabled = true

  if (feedback) {
    feedback.textContent = "Saglabā..."
  }

  try {
    const response = await fetch(
      "/api/termini/save-change",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: term.id,
          changes: {
            latvian: latvian.value,
            status: status.value,
            notes: notes.value
          }
        })
      }
    )

    const result =
      await response.json() as SaveResponse

    if (!response.ok || !result.ok || !result.candidate) {
      throw new Error(
        result.error ?? "Saglabāšana neizdevās"
      )
    }

    terms = terms.map(item =>
      item.id === result.candidate?.id
        ? result.candidate
        : item
    )

    renderTermList()
    renderDetail("Saglabāts")
  }
  catch (error) {
    if (feedback) {
      feedback.textContent =
        error instanceof Error
          ? error.message
          : "Saglabāšana neizdevās"
    }

    button.disabled = false
  }
}

renderShell()
renderTermList()
renderDetail()
