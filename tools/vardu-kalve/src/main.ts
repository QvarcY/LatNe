import "./styles.css"
import registrs from "../../../packages/valoda/data/termini.json"

type Termins = typeof registrs.terms[number]

type SaveResponse = {
  ok: boolean
  persisted?: boolean
  candidate?: Termins
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

let termini: Termins[] = registrs.terms.map(termins => ({
  ...termins
}))

let selectedId = termini[0]?.id ?? ""
let search = ""

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function redzamieTermini(): Termins[] {
  const needle = search.trim().toLocaleLowerCase("lv")

  if (!needle) {
    return termini
  }

  return termini.filter(termins =>
    termins.source.toLocaleLowerCase("lv").includes(needle) ||
    termins.kind.toLocaleLowerCase("lv").includes(needle) ||
    termins.category.toLocaleLowerCase("lv").includes(needle) ||
    (termins.latvian ?? "")
      .toLocaleLowerCase("lv")
      .includes(needle)
  )
}

function izveletaisTermins(): Termins | undefined {
  return termini.find(termins => termins.id === selectedId)
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
          <strong>${termini.length}</strong>
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
          <div id="termini" class="termini"></div>
        </aside>

        <section id="detail" class="detail"></section>
      </section>
    </main>
  `

  document
    .querySelector<HTMLInputElement>("#search")
    ?.addEventListener("input", event => {
      search = (event.target as HTMLInputElement).value
      atteloTerminuSarakstu()
      renderDetail()
    })
}

function atteloTerminuSarakstu(): void {
  const visible = redzamieTermini()
  const container =
    document.querySelector<HTMLDivElement>("#termini")
  const count =
    document.querySelector<HTMLDivElement>("#count")

  if (!container || !count) {
    return
  }

  if (!visible.some(termins => termins.id === selectedId)) {
    selectedId = visible[0]?.id ?? ""
  }

  count.textContent = `${visible.length} no ${termini.length}`

  container.innerHTML = visible
    .map(termins => `
      <button
        class="termins ${termins.id === selectedId ? "active" : ""}"
        data-id="${escapeHtml(termins.id)}"
      >
        <span>${escapeHtml(termins.source)}</span>
        <small>
          ${escapeHtml(statusLabels[termins.status] ?? termins.status)}
        </small>
      </button>
    `)
    .join("")

  document
    .querySelectorAll<HTMLButtonElement>("[data-id]")
    .forEach(button => {
      button.addEventListener("click", () => {
        selectedId = button.dataset.id ?? ""
        atteloTerminuSarakstu()
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

  const termins = izveletaisTermins()

  if (!termins) {
    container.innerHTML =
      '<div class="empty">Nav termina ko rādīt</div>'
    return
  }

  container.innerHTML = `
    <div class="position">
      ${termins.order} / ${termini.length}
    </div>

    <h2>${escapeHtml(termins.source)}</h2>

    <div class="badges">
      <span>${escapeHtml(termins.kind)}</span>
      <span>${escapeHtml(termins.category)}</span>
      ${termins.layers
        .map(layer => `<span>${escapeHtml(layer)}</span>`)
        .join("")}
    </div>

    <form id="termins-form" class="editor-form">
      <label class="field">
        <span>Latviskais variants</span>
        <input
          id="latvian"
          type="text"
          maxlength="80"
          value="${escapeHtml(termins.latvian ?? "")}"
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
                ${termins.status === value ? "selected" : ""}
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
        >${escapeHtml(termins.notes ?? "")}</textarea>
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
    .querySelector<HTMLFormElement>("#termins-form")
    ?.addEventListener("submit", saglabaIzveletoTerminu)
}

async function saglabaIzveletoTerminu(
  event: SubmitEvent
): Promise<void> {
  event.preventDefault()

  const termins = izveletaisTermins()

  if (!termins) {
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
          id: termins.id,
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

    termini = termini.map(item =>
      item.id === result.candidate?.id
        ? result.candidate
        : item
    )

    atteloTerminuSarakstu()
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
atteloTerminuSarakstu()
renderDetail()
