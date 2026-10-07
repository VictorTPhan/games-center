// Shop: spend tokens on bun skins (shown in every game) and site themes.
(function () {
  renderHeader("shop");

  const skinsGrid = document.getElementById("skins");
  const themesGrid = document.getElementById("themes");
  let justBought = null;

  function action(item, equipped) {
    if (equipped) {
      return `<span class="equipped">${icon("check_circle")}Equipped</span>`;
    }
    if (PixelParty.owns(item)) {
      return `<button class="use" type="button" data-use>Use</button>`;
    }
    const short = PixelParty.tokens() < item.price;
    return `<button class="buy" type="button" data-buy ${short ? "disabled" : ""}
      aria-label="Buy ${item.name} for ${item.price} tokens">${icon("toll")}${item.price}</button>`;
  }

  function card(item, kind, preview, equipped) {
    const classes = ["item", equipped ? "is-equipped" : "", justBought === item ? "just-bought" : ""];
    return `
      <article class="${classes.join(" ")}" data-kind="${kind}" data-id="${item.id}">
        ${preview}
        <div class="item-body">
          <h3>${item.name}</h3>
          ${action(item, equipped)}
        </div>
      </article>`;
  }

  function render() {
    const skin = PixelParty.skin();
    const theme = PixelParty.theme();

    skinsGrid.innerHTML = PixelParty.SKINS.map((s) =>
      card(s, "skin", `<div class="item-preview skin-preview">${PixelParty.bunSVG(s)}</div>`, s === skin)
    ).join("");

    themesGrid.innerHTML = PixelParty.THEMES.map((t) =>
      card(
        t,
        "theme",
        `<div class="item-preview theme-preview" data-preview="${t.id}" style="--preview-sky: ${PixelParty.skyCSS(t)}">
          <span class="tp-header"></span>
          <span class="tp-cards"><i></i><i></i><i></i></span>
        </div>`,
        t === theme
      )
    ).join("");
    justBought = null;
  }

  document.querySelector(".shop").addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;
    const el = button.closest(".item");
    const list = el.dataset.kind === "skin" ? PixelParty.SKINS : PixelParty.THEMES;
    const item = list.find((x) => x.id === el.dataset.id);
    if (button.hasAttribute("data-buy") && PixelParty.buy(item)) justBought = item;
    if (button.hasAttribute("data-use")) PixelParty.equip(item);
    render();
  });

  window.addEventListener("pixelparty:change", render);
  window.addEventListener("storage", render);
  render();
})();
