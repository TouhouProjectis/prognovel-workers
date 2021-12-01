# 🤖 ProgNovel Workers

![maintained?](https://img.shields.io/badge/maintained%3F-yes-green.svg)
![last commit](https://img.shields.io/github/last-commit/prognoveljs/prognovel-workers/develop)
![commit](https://img.shields.io/github/commit-activity/m/prognoveljs/prognovel-workers/develop)
![version](https://img.shields.io/github/package-json/v/prognoveljs/prognovel-workers)

## How to get ProgNovel backend

1. Get a Github and Cloudflare Workers account.
2. Login to Cloudflare Workers. In Workers section, get your `Account ID` and create a new `API token` from Cloudflare Workers edit template. Your `API token` can be used to access your Cloudflare Workers account, so treat it as a password and keep it in safe place.
3. Again in Workers section, create KV Workers.
4. Fork [ProgNovel backend](https://github.com/prognoveljs/prognovel-workers) repo.
5. In your new forked repo, go to Actions tab, and enable Workflow if it isn't enabled yet.
6. Then go to settings tab, look for Environments section, click the green button `Configure Environment` after you fill out the Name input with whatever you like. You need to do this in order to add two environment secrets, Cloudflare Account ID and API token (from step 2) - which you can create by click `+ Add secret` in Environment secret section. Fill both under environment secret names `CF_ACCOUNT_ID` and `CF_API_TOKEN`, case sensitive.
7. Go to `wrangler.toml`; fill your `account_id` with your Account ID and `kv-namespaces` with KV Workers ID you created in step 3.
8. Wait for Github Action to complete installing CF Workers backend for you.

After you done, proceed in installing [CLI for ProgNovel](https://github.com/prognoveljs/prognovel-cli) to create content in your local computer. You need to publish content to your backend before connecting it to the frontend.
