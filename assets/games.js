// One list of games shared by the menu and every play page.
// The games themselves live untouched in /games — this file only describes them.
const PIXEL_PARTY_GAMES = [
  {
    id: "flag-rush",
    title: "Flag Rush",
    page: "flag-rush.html",
    src: "games/mario-platformer/index.html",
    genre: "Platformer",
    blurb: "Run, jump, and stomp through one sunny stage. Bonk ? blocks for coins and reach the flagpole before the clock hits zero.",
    tint: "#2f7de0",
    controls: [
      { keys: ["A", "D"], alt: ["←", "→"], label: "Move" },
      { keys: ["W"], alt: ["Space"], label: "Jump" },
      { keys: ["R"], label: "Restart" },
    ],
    best: null,
  },
  {
    id: "bun-survivor",
    title: "Bun Survivor",
    page: "bun-survivor.html",
    src: "games/zombie-shooter/index.html",
    genre: "Arena Shooter",
    blurb: "Zombies pour out of the pipes. Clear each round, pick a buff, and see how long your bun can hold the arena.",
    tint: "#8b3fd1",
    controls: [
      { keys: ["W", "A", "S", "D"], label: "Move" },
      { keys: ["Mouse"], label: "Aim" },
      { keys: ["Click"], label: "Shoot" },
    ],
    best: { key: "bun-survivor-best-round", format: (n) => `ROUND ${n}` },
  },
  {
    id: "bun-express",
    title: "Bun Express",
    page: "bun-express.html",
    src: "games/subway-runner/index.html",
    genre: "Endless Runner",
    blurb: "Sprint down the tracks, switch lanes to dodge trains, and hop the barriers. Every run is a new personal best waiting to happen.",
    tint: "#d6337a",
    controls: [
      { keys: ["A", "D"], alt: ["←", "→"], label: "Lanes" },
      { keys: ["W"], alt: ["Space"], label: "Jump" },
      { keys: ["Swipe"], label: "Touch" },
    ],
    best: { key: "bun-express-best", format: (n) => `${n} M` },
  },
];

const LAST_PLAYED_KEY = "pixel-party-last-played";

// localStorage can throw (private mode, blocked storage), so every access is guarded.
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
    /* storage unavailable — the site still works, it just won't remember */
  }
}

function bestScoreText(game) {
  if (!game.best) return null;
  const n = Number(readStore(game.best.key)) || 0;
  return n > 0 ? game.best.format(n) : null;
}

function kbd(key) {
  return `<kbd>${key}</kbd>`;
}

function controlsHTML(game) {
  return game.controls
    .map((c) => {
      const main = c.keys.map(kbd).join("");
      const alt = c.alt ? `<span class="or">/</span>${c.alt.map(kbd).join("")}` : "";
      return `<li>${main}${alt}<span class="label">${c.label}</span></li>`;
    })
    .join("");
}
