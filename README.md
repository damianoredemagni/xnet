# X Video Platform
A lightweight, open-source Netflix-like platform for curated X videos.

## Features
- Sleek home page with dynamic carousel and category rows (Netflix-style UI)
- Dynamic video details page for individual X video embeds
- Manually updated `data.json` on GitHub for video management

## Stack
- HTML/CSS/JS
- Tailwind CSS (via CDN)
- JSON file for video data (manually updated)

## Deployment
Hosted on GitHub Pages. Update `data.json` manually in the repo to manage videos.

## Run Locally
1. Clone the repo
2. Install Node.js (optional, for local testing with `http-server`)
3. Run `npx http-server` or `python -m http.server 8080` in the directory
4. Open `http://localhost:8080` in a browser

## Notes
- X video embeds use `<blockquote class="twitter-tweet" data-media-max-width="560"><a href="URL"></a></blockquote>` with `widgets.js` loaded globally.
- Videos are dynamically populated from `data.json` using minimal JavaScript.
