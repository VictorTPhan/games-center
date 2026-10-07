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

function renderHeader(currentId) {
  const links = PIXEL_PARTY_GAMES.map((g) => {
    const current = g.id === currentId ? ` aria-current="page"` : "";
    return `<a href="${g.page}" style="--tint: ${g.tint}"${current}>${g.title}</a>`;
  }).join("");

  document.getElementById("site-header").innerHTML = `
    <a class="logo" href="index.html" aria-label="Pixel Party home">
      <img src="assets/bun.svg" alt="" width="40" height="42" />
      <span>PIXEL PARTY</span>
    </a>
    <nav class="site-nav" aria-label="Games">${links}</nav>
    <div class="header-actions">
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
}
