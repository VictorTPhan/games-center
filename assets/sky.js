// Page backdrop: the same sky the games draw — the sunset gradient, the faint white
// tile grid, and rows of three pulsing rounded-square clouds drifting by.
// Values are lifted from drawSky / drawGridHint / drawCloudRow in the games; the
// equipped theme (PixelParty.theme()) swaps the colors and style.
(function () {
  const canvas = document.getElementById("sky");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const TILE = 48;
  const CLOUD_RADIUS = 8;
  // Cloud rows in tile units; they wrap around a span wider than any screen.
  const CLOUDS = [
    { c: 2, r: 1 }, { c: 8, r: 3 }, { c: 14, r: 1 }, { c: 21, r: 4 },
    { c: 28, r: 2 }, { c: 35, r: 5 }, { c: 42, r: 1 }, { c: 49, r: 3 },
    { c: 5, r: 8 }, { c: 18, r: 10 }, { c: 31, r: 9 }, { c: 45, r: 11 },
  ];
  // Fixed star field for the night theme, in fractions of the screen.
  const STARS = Array.from({ length: 70 }, (_, i) => ({
    x: ((i * 7919) % 1000) / 1000,
    y: ((i * 4211) % 1000) / 1000 * 0.8,
    s: 2 + (i % 3),
    phase: i * 1.7,
  }));
  const SPAN_COLS = 56;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let theme = PixelParty.theme();
  let w = 0;
  let h = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawSky() {
    if (theme.bands) {
      // Retro: hard color bands instead of a smooth blend.
      const bandH = h / theme.bands;
      for (let i = 0; i < theme.bands; i++) {
        ctx.fillStyle = PixelParty.skyColorAt(theme, i / (theme.bands - 1));
        ctx.fillRect(0, Math.floor(i * bandH), w, Math.ceil(bandH) + 1);
      }
      return;
    }
    const g = ctx.createLinearGradient(0, 0, 0, h);
    for (const [at, color] of theme.sky) g.addColorStop(at, color);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function drawGrid() {
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= w; x += TILE) {
      ctx.moveTo(Math.floor(x) + 0.5, 0);
      ctx.lineTo(Math.floor(x) + 0.5, h);
    }
    for (let y = 0; y <= h; y += TILE) {
      ctx.moveTo(0, Math.floor(y) + 0.5);
      ctx.lineTo(w, Math.floor(y) + 0.5);
    }
    ctx.stroke();
  }

  function drawStars(t) {
    for (const star of STARS) {
      ctx.globalAlpha = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 1.6 + star.phase));
      ctx.fillStyle = "#fff6c2";
      ctx.fillRect(Math.round(star.x * w), Math.round(star.y * h), star.s, star.s);
    }
    ctx.globalAlpha = 1;
  }

  function drawClouds(t) {
    const span = SPAN_COLS * TILE;
    ctx.fillStyle = theme.cloud;
    for (let i = 0; i < CLOUDS.length; i++) {
      const cloud = CLOUDS[i];
      const raw = cloud.c * TILE - t * 14;
      let x = (((raw % span) + span) % span) - TILE * 3;
      const y = cloud.r * TILE;
      if (x > w || y > h) continue;
      if (theme.square) x = Math.round(x / 8) * 8; // retro clouds move in chunky steps
      for (let j = 0; j < 3; j++) {
        let pulse = 0.72 + 0.28 * Math.sin(t * 2.2 + i * 0.7 + j * 0.9);
        if (theme.square) pulse = Math.round(pulse * 4) / 4;
        const size = TILE * pulse;
        ctx.beginPath();
        ctx.roundRect(
          x + j * TILE + (TILE - size) / 2,
          y + (TILE - size) / 2,
          size,
          size,
          theme.square ? 0 : CLOUD_RADIUS * pulse
        );
        ctx.fill();
      }
    }
  }

  function draw(t) {
    drawSky();
    drawGrid();
    if (theme.stars) drawStars(t);
    drawClouds(t);
  }

  function frame(ms) {
    draw(ms / 1000);
    if (!reduceMotion) requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", () => {
    resize();
    if (reduceMotion) draw(0);
  });
  window.addEventListener("pixelparty:change", () => {
    theme = PixelParty.theme();
    if (reduceMotion) draw(0);
  });
  requestAnimationFrame(frame);
})();
