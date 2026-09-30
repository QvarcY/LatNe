import "./styles.css"

const app = document.querySelector<HTMLDivElement>("#app")

if (!app) {
  throw new Error("Trūkst app konteinera")
}

app.innerHTML = `
  <main class="shell">
    <div class="eyebrow">LatNe</div>
    <h1>Vārdu kalve</h1>
    <p>Terminoloģijas pārskatīšanas rīks</p>

    <section class="card">
      <strong>84</strong>
      <span>termini gaida pārskatīšanu</span>
    </section>
  </main>
`
