# Games

Card games made for phones, hosted on GitHub Pages: https://robinske.github.io/games/

Each game lives in its own folder and works offline once it's added to the Home Screen
(Share → Add to Home Screen on iPhone, ⋮ → Install app on Android).

## Spider Solitaire

`spider/` — two-suit Spider Solitaire built with three.js.

- Play: https://robinske.github.io/games/spider/
- Auto solve preview: https://robinske.github.io/games/spider/#autosolve-demo
- Tap a card to send it to its best spot, or drag it
- Undo, hints, restart the current deal, and auto solve once every deal is out and nothing is greyed out

## Adding a game

1. Put the game in a new folder with its own `index.html`, `manifest.webmanifest`, `sw.js` and icons.
2. Register the service worker relative to that folder so its offline cache stays separate.
3. Add a tile for it to the top-level `index.html`.
