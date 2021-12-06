# 🤖 ProgNovel Workers

![maintained?](https://img.shields.io/badge/maintained%3F-yes-green.svg)
![last commit](https://img.shields.io/github/last-commit/prognoveljs/prognovel-workers/develop)
![commit](https://img.shields.io/github/commit-activity/m/prognoveljs/prognovel-workers/develop)
![version](https://img.shields.io/github/package-json/v/prognoveljs/prognovel-workers)

## How to get ProgNovel backend

1. Get a Github and Cloudflare Workers account.
2. Clone or download this repo. Then open terminal or command prompt inside the downloaded repo folder, where you see files such as `package.json` or `wrangler.toml` located.
3. You need to install Cloudflare Wrangler to communicate with Cloudflare server. First, make sure NodeJS is installed in your computer, then run `npm i @cloudflare/wrangler -g` or `sudo npm i @cloudflare/wrangler -g` if you're encountered permission error in Mac or Linux.
4. In terminal/command prompt where `wrangler.toml` is located, run `wrangler login` or `sudo wrangler login` if you're encountered permission error in Mac or Linux.
5. Open your browser, navigate to `https://workers.cloudflare.com`, then login. In the dashboard, you'll see your Account ID on the right side of the page. Copy your Account ID and insert that into `wrangler.toml` file.
6. Still in Cloudflare Workers dashboard, navigate to KV section under Workers Overview in the left sidebar. Create a new Namespace and grab your newly created Workers KV Namespace ID and insert it to `wrangler.toml` file again, as the ID for binding for "BUCKET" Namespace.
7. Publish your Workers backend to Cloudflare servers by running `wrangler publish`. If you're encountered error in Mac or Linux, run it with `sudo wrangler publish`. You'll get the url of your backend from the last line from running the publish command.
8. You'll see an empty or error page if you open your newly created Workers script in your browser. This is because the content is still empty. Proceed to [ProgNovel CLI guide](https://github.com/prognoveljs/prognovel-cli) to push contents to your backend.

After you done, proceed in installing [CLI for ProgNovel](https://github.com/prognoveljs/prognovel-cli) to create content in your local computer. You need to publish content to your backend before connecting it to the frontend.
