# Pixel Party — Games Center reference build

Reference / answer key for the **Games Center** project in the Website Builder course
(`content/courses/website-builder-course/modules/04_game_website`).

Open `index.html` through a local server (e.g. `python -m http.server`) so the game frames
and saved high scores behave like they will on GitHub Pages.

## Layout

```
index.html            Homepage menu: one card per game
flag-rush.html        Play page: site header + the game in a frame
bun-survivor.html     Play page
bun-express.html      Play page
assets/
  games.js            Game list + shared header (nav, mute, random), used by every page
  play.js             Fills in a play page, loads the game, and hooks its audio up to mute
  sky.js              Menu backdrop: the games' sky (gradient, tile grid, drifting clouds)
  site.css            Shared styles (Outfit body text, Press Start 2P names, HUD-style header)
  bun.svg             Logo + favicon: the player bun from the games' own BUN_PATH
  *.jpg / *.webp      Card art (still frame + hover animation), cut from the L1-2 preview GIFs
games/                The three L1-2 games (see changes below)
  mario-platformer/   Flag Rush
  zombie-shooter/     Bun Survivor
  subway-runner/      Bun Express
```

Source of `games/`: `cm-ai-courses/public/course-assets/website-builder-course/modules/01_web_foundations/`.
Changes from the originals:

- Flag Rush got a start screen matching the other two (it used to drop straight into play).
- The one-line goal on each start screen was rewritten as a full sentence.

## Project requirements → where they're met

| Requirement (project brief) | In this build |
|---|---|
| Website called **Pixel Party** | Logo, page titles, favicon |
| Homepage / main menu | `index.html` |
| At least three playable games | Flag Rush, Bun Survivor, Bun Express |
| Each game on its own page | `flag-rush.html`, `bun-survivor.html`, `bun-express.html` |
| Simple, pick-up-and-play | No logins or tutorials; every game opens on a start screen with its controls, and gets keyboard focus on load |
| Easy to navigate | Same header on every page: logo goes home, each game is one click away, shuffle button opens a random game |

| Test-phase checklist | In this build |
|---|---|
| Obviously a game site | Menu is nothing but game cards with real gameplay art |
| Directs users to play | Whole card is the link; orange PLAY button on each |
| Games look enticing | Still frame on each card, switches to gameplay animation on hover |
| Avoid tacky slogans / "for Daniel" copy | No taglines or headings beyond the game names; one plain sentence per game |

Extras: best scores the games already save (Bun Survivor's best round, Bun Express's best
distance) are read from `localStorage` and shown on the cards. Flag Rush doesn't save a score, so its card has no best-score chip.

The header's mute button silences every game without touching game code: `play.js` routes the game's
`AudioContext` output through a gain node it controls. The setting is saved in `localStorage`.

Not included: the Expand phase (points earned from games + a shop). That needs the games to
award points, which means editing the game code.
