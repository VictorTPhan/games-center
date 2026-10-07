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
shop.html             Shop: bun skins and site themes, bought with tokens
assets/
  party.js            Save data shared by the site and the games: tokens, purchases, skin, theme
  games.js            Game list + shared header (nav, wallet, mute, random), used by every page
  play.js             Fills in a play page, loads the game, and hooks its audio up to mute
  sky.js              Backdrop: the games' sky (gradient, tile grid, drifting clouds), per theme
  shop.js             Renders the shop and handles buying / equipping
  site.css            Shared styles (Outfit body text, Press Start 2P names, HUD-style header)
  bun.svg             Default favicon; the live logo/favicon is drawn by party.js in the equipped skin
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
- Each game loads `../../assets/party.js`, draws the player as the equipped skin, and pays out tokens
  (see below). Opened on their own, the games still run; they just use the classic bun.

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

## Expand phase: tokens + shop

| Upgrade goal (Expand It) | In this build |
|---|---|
| Points system | **Tokens**, one wallet for the whole site, shown in the header |
| Earn points by playing | Flag Rush: 1 per coin + 1 per second left when you reach the flag. Bun Express: 1 per 10 coins. Bun Survivor: 5 per round cleared |
| Shop page | `shop.html`, linked from the header |
| Spend points on items | 6 character skins (60–400) and 3 site themes (Sunset free, Night Sky 200, Retro 300) |
| Items do something | Skins change the player character in all three games, plus the logo and favicon; themes restyle the whole site |
| Save with `localStorage` | `party.js` stores tokens, purchases, and the equipped skin/theme |
| Static, account-free | No server or login; everything lives in the browser |

A good run earns roughly 20–30 tokens in any game, so cheap skins take a couple of runs and the
Gold Star skin is a long-term goal.

Skins: Bun (free), Strawberry, Mochi, Blueberry, Choco Block, Gold Star. Each is a shape in the
games' 270x255 bun space with a flat base at y=237 (see `SKINS` in `party.js`), so the games'
eyes, feet, hitboxes, and animations work unchanged. Enemies and Flag Rush's hard hat still use
the original bun shape. Tokens earned inside a game frame update the header wallet live
(the browser's `storage` event), with a small "+N" pop.
