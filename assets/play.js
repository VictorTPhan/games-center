// Fills in a play page and loads the untouched game into the frame.
// Each play page sets <body data-game="..."> to pick its game.
(function () {
  const id = document.body.dataset.game;
  const game = PIXEL_PARTY_GAMES.find((g) => g.id === id);

  document.title = `${game.title} | Pixel Party`;
  renderHeader(game.id);

  // Mute: every sound the games make goes through their AudioContext's destination,
  // so give each context a volume knob in front of the speakers that the header button controls.
  const volumeKnobs = new Set();

  function routeGameAudio(win) {
    if (win.__pixelPartyAudio) return;
    const GameAudioContext = win.AudioContext || win.webkitAudioContext;
    if (!GameAudioContext) return;
    const base = win.BaseAudioContext ? win.BaseAudioContext.prototype : GameAudioContext.prototype;
    const speakers = Object.getOwnPropertyDescriptor(base, "destination").get;

    class RoutedAudioContext extends GameAudioContext {
      get destination() {
        if (!this.pixelPartyVolume) {
          this.pixelPartyVolume = this.createGain();
          this.pixelPartyVolume.gain.value = isMuted() ? 0 : 1;
          this.pixelPartyVolume.connect(speakers.call(this));
          volumeKnobs.add(this.pixelPartyVolume);
        }
        return this.pixelPartyVolume;
      }
    }

    win.AudioContext = RoutedAudioContext;
    if (win.webkitAudioContext) win.webkitAudioContext = RoutedAudioContext;
    win.__pixelPartyAudio = true;
  }

  document.addEventListener("pixelparty:mute", (e) => {
    for (const knob of volumeKnobs) knob.gain.value = e.detail ? 0 : 1;
  });

  const frame = document.getElementById("frame");

  // The games only create their AudioContext on the first key press or click, so hooking
  // in as soon as the game's document exists is early enough.
  function hookWhenReady() {
    try {
      const win = frame.contentWindow;
      if (win && win.location.href !== "about:blank") {
        routeGameAudio(win);
        return;
      }
    } catch {
      return; /* file:// in some browsers blocks frame access — the game still plays, just unmuteable */
    }
    requestAnimationFrame(hookWhenReady);
  }

  // Hand keyboard focus to the game so arrow keys and space work right away.
  frame.title = game.title;
  frame.addEventListener("load", () => {
    try {
      routeGameAudio(frame.contentWindow);
    } catch {
      /* see hookWhenReady */
    }
    frame.focus();
    try {
      frame.contentWindow.focus();
    } catch {
      /* some browsers block this on file:// — clicking the game still works */
    }
  });
  frame.src = game.src;
  requestAnimationFrame(hookWhenReady);
})();
