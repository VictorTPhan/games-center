// Builds the menu bar on a play page and loads the untouched game into the frame.
// Each play page sets <body data-game="..."> to pick its game.
(function () {
  const id = document.body.dataset.game;
  const index = PIXEL_PARTY_GAMES.findIndex((g) => g.id === id);
  const game = PIXEL_PARTY_GAMES[index];
  const next = PIXEL_PARTY_GAMES[(index + 1) % PIXEL_PARTY_GAMES.length];

  document.title = `${game.title} — Pixel Party`;
  writeStore(LAST_PLAYED_KEY, game.id);

  document.getElementById("bar").innerHTML = `
    <a class="chip" href="index.html" aria-label="Back to the game menu">◀ MENU</a>
    <h1 class="title"><img src="assets/bun.svg" alt="" /><span>${game.title.toUpperCase()}</span></h1>
    <ul class="controls" aria-label="Controls">${controlsHTML(game)}</ul>
    <a class="chip next" href="${next.page}"><span class="full">NEXT:&nbsp;</span>${next.title.toUpperCase()} ▶</a>
  `;

  // Hand keyboard focus to the game so arrow keys and space work right away.
  const frame = document.getElementById("frame");
  frame.title = game.title;
  frame.addEventListener("load", () => {
    frame.focus();
    try {
      frame.contentWindow.focus();
    } catch {
      /* cross-origin when opened from file:// in some browsers — clicking the game still works */
    }
  });
  frame.src = game.src;
})();
