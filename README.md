# Pixel Party — Games Center reference build

Reference / answer key for the **Games Center** project in the Website Builder course
(`content/courses/website-builder-course/modules/04_game_website`).

Open `index.html` through a local server (e.g. `python -m http.server`) so the game frames
and saved high scores behave like they will on GitHub Pages.

## Layout

```
index.html            Homepage menu: one card per game
flag-rush.html        Play page — menu bar + the game in a frame
bun-survivor.html     Play page
bun-express.html      Play page
assets/
  games.js            Game list shared by the menu and play pages (titles, controls, high-score keys)
  play.js             Builds the play-page bar and loads the game
  site.css            Shared styles, taken from the games' HUD/sky/tile look
  bun.svg             Logo + favicon
  *.jpg / *.webp      Card art (still frame + hover animation), cut from the L1-2 preview GIFs
games/                The three L1-2 games, copied byte-for-byte — do not edit
  mario-platformer/   Flag Rush
  zombie-shooter/     Bun Survivor
  subway-runner/      Bun Express
```

Source of `games/`: `cm-ai-courses/public/course-assets/website-builder-course/modules/01_web_foundations/`.

## Project requirements → where they're met

| Requirement (project brief) | In this build |
|---|---|
| Website called **Pixel Party** | Logo, page titles, favicon |
| Homepage / main menu | `index.html` |
| At least three playable games | Flag Rush, Bun Survivor, Bun Express |
| Each game on its own page | `flag-rush.html`, `bun-survivor.html`, `bun-express.html` |
| Simple, pick-up-and-play | No logins or tutorials; controls shown in the play bar; game gets keyboard focus on load |
| Easy to navigate | Every play page has **◀ MENU** and **NEXT ▶**; menu has a **Random game** button |

| Test-phase checklist | In this build |
|---|---|
| Obviously a game site | Menu is nothing but game cards with real gameplay art |
| Directs users to play | Whole card is the link; orange PLAY button on each |
| Games look enticing | Still frame on each card, switches to gameplay animation on hover |
| Avoid tacky slogans / "for Daniel" copy | Only headings are "Choose a game" and the game names |

Extras: best scores the games already save (Bun Survivor's best round, Bun Express's best
distance) are read from `localStorage` and shown on the cards, and the last game you opened is
tagged **Last played**. Flag Rush doesn't save a score, so its card has no best-score chip.

Not included: the Expand phase (points earned from games + a shop). That needs the games to
award points, which means editing the game code.
