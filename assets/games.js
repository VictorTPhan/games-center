// One list of games shared by the menu and every play page.
// The games themselves live untouched in /games — this file only describes them.
const PIXEL_PARTY_GAMES = [
  {
    id: "flag-rush",
    title: "Flag Rush",
    page: "flag-rush.html",
    src: "games/mario-platformer/index.html",
    blurb: "A one-level platformer where you race the clock to the flagpole, grabbing coins and stomping enemies along the way.",
    tint: "#2f7de0",
    best: null,
  },
  {
    id: "bun-survivor",
    title: "Bun Survivor",
    page: "bun-survivor.html",
    src: "games/zombie-shooter/index.html",
    blurb: "A top-down arena shooter where zombies climb out of the pipes in waves and you choose a new upgrade after every round.",
    tint: "#8b3fd1",
    best: { key: "bun-survivor-best-round", format: (n) => `Round ${n}` },
  },
  {
    id: "bun-express",
    title: "Bun Express",
    page: "bun-express.html",
    src: "games/subway-runner/index.html",
    blurb: "An endless runner through a pink city where you switch lanes to dodge trains and hop barriers for as long as you can last.",
    tint: "#d6337a",
    best: { key: "bun-express-best", format: (n) => `${n} m` },
  },
];

// localStorage can throw (private mode, blocked storage), so access is guarded.
function readStore(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — the setting just won't be remembered */
  }
}

const MUTE_KEY = "pixel-party-muted";

function isMuted() {
  return readStore(MUTE_KEY) === "1";
}

function bestScoreText(game) {
  if (!game.best) return null;
  const n = Number(readStore(game.best.key)) || 0;
  return n > 0 ? game.best.format(n) : null;
}

function icon(name) {
  return `<span class="material-symbols-rounded" aria-hidden="true">${name}</span>`;
}

// currentId is a game id, "shop", or null on the menu.
function renderHeader(currentId) {
  const links = PIXEL_PARTY_GAMES.map((g) => {
    const current = g.id === currentId ? ` aria-current="page"` : "";
    return `<a href="${g.page}" style="--tint: ${g.tint}"${current}>${g.title}</a>`;
  }).join("");
  const shopCurrent = currentId === "shop" ? ` aria-current="page"` : "";

  document.getElementById("site-header").innerHTML = `
    <a class="logo" href="index.html" aria-label="Pixel Party home">
      <span class="logo-bun" id="logo-bun"></span>
      <span>PIXEL PARTY</span>
    </a>
    <nav class="site-nav" aria-label="Site">
      ${links}
      <a href="shop.html" class="shop-link"${shopCurrent}>${icon("storefront")}Shop</a>
    </nav>
    <div class="header-actions">
      <span class="wallet" id="wallet" role="status"></span>
      <button class="icon-btn" id="mute" type="button" aria-label="Mute" title="Mute"></button>
      <button class="icon-btn" id="random" type="button" aria-label="Random game" title="Random game">
        ${icon("shuffle")}
      </button>
    </div>
  `;

  const mute = document.getElementById("mute");
  const showMute = () => {
    const muted = isMuted();
    mute.innerHTML = icon(muted ? "volume_off" : "volume_up");
    mute.setAttribute("aria-pressed", String(muted));
  };
  showMute();
  mute.addEventListener("click", () => {
    const muted = !isMuted();
    writeStore(MUTE_KEY, muted ? "1" : "0");
    showMute();
    document.dispatchEvent(new CustomEvent("pixelparty:mute", { detail: muted }));
  });

  document.getElementById("random").addEventListener("click", () => {
    const others = PIXEL_PARTY_GAMES.filter((g) => g.id !== currentId);
    location.href = others[Math.floor(Math.random() * others.length)].page;
  });

  showSkin();
  showWallet();
  // "storage" fires when a game in the frame (or another tab) changes the save;
  // "pixelparty:change" fires for changes made on this page, like a purchase.
  window.addEventListener("storage", (e) => {
    if (e.key === PixelParty.KEYS.tokens) showWallet();
    if (e.key === PixelParty.KEYS.skin) showSkin();
  });
  window.addEventListener("pixelparty:change", () => {
    showWallet();
    showSkin();
  });
}

// The logo and favicon wear whichever bun skin is equipped.
function showSkin() {
  const svg = PixelParty.bunSVG();
  document.getElementById("logo-bun").innerHTML = svg;
  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    document.head.appendChild(favicon);
  }
  favicon.type = "image/svg+xml";
  favicon.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

let shownTokens = null;

function showWallet() {
  const wallet = document.getElementById("wallet");
  const total = PixelParty.tokens();
  wallet.innerHTML = `${icon("toll")}<span>${total.toLocaleString()}</span>`;
  wallet.setAttribute("aria-label", `${total} tokens`);
  if (shownTokens !== null && total > shownTokens) {
    const pop = document.createElement("span");
    pop.className = "token-pop";
    pop.textContent = `+${total - shownTokens}`;
    pop.setAttribute("aria-hidden", "true");
    wallet.appendChild(pop);
    pop.addEventListener("animationend", () => pop.remove());
  }
  if (shownTokens !== null && total !== shownTokens) {
    wallet.classList.remove("bump");
    void wallet.offsetWidth; // restart the animation
    wallet.classList.add("bump");
  }
  shownTokens = total;
}
