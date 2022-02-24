# 🤖 ProgNovel Workers

![maintained?](https://img.shields.io/badge/maintained%3F-yes-green.svg)
![last commit](https://img.shields.io/github/last-commit/prognoveljs/prognovel-workers/develop)
![commit](https://img.shields.io/github/commit-activity/m/prognoveljs/prognovel-workers/develop)
![version](https://img.shields.io/github/package-json/v/prognoveljs/prognovel-workers)

## How to get ProgNovel backend

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/prognoveljs/prognovel-workers)

1. Make sure you have a Github account and Cloudflare Workers account first, and make sure you have publish content to Cloudflare Workers network by following [https://github.com/prognoveljs/prognovel-cli](https://github.com/prognoveljs/prognovel-cli). Start by clicking Cloudflare Workers deploy button above.
2. Authorize Clouflare Workers with your Github account. If you are redirected to the main page of Cloudflare Workers deploy site after authorizing, simply click browser's go back button to return to ProgNovel backend's deploy page.
3. Add your account information. Enter your Cloudflare Workers Account ID and API Token, which the deploy page has guide for.
4. The deploy process will pause once you get to the next step and will ask you to enable Workflow for Github Action of your repo. Click the link to your repo and enable Github Action for your repo if you haven't already. Go back to the deploy page and click the "Workflow enabled" button.
5. **Don't click the deploy button yet!** In a new browser tab login to [https://workers.cloudflare.com](https://workers.cloudflare.com). Navigate to KV section under Workers Overview in the left sidebar. Create a new Namespace and grab your newly created Workers KV Namespace ID (or KV Namespace you created if you follow ProgNovel CLI guide). Then browse your forked repo for `wrangler.toml` file, edit it by adding KV namespace ID you have to binding `BUCKET`, just like below:

```toml
kv-namespaces = [
  { binding = "BUCKET", id = "aA516gFxxxxxxx" }
]
```

**NOTE**: Usually `wrangler.toml` will be located in `https://github.com/<YOUR-GITHUB-ACCOUNT>/prognovel-workers/blob/main/wrangler.toml`.

7. In the deploy page click the "Deploy" button and wait. Cross your fingers and hopefully the deploy page will give green "Successful" badge!

   ![Deploy successful](images/successful-deploy.png)

8. (OPTIONAL) At this point installing backend for your ProgNovel is complete. However, if you haven't set up ProgNovel CLI and haven't push content to Cloudflare Workers network yet, or your KV Namespace is invalid, your backend will result in failed deploy. In this case, you don't have to restart installing the backend from step 1, as any commit to your forked repo of ProgNovel Backend will trigger the deploy in the background. Simply edit your `wrangler.toml` to correct configuration or give the file a blank new line to commit the file.

After you done, proceed in installing [CLI for ProgNovel](https://github.com/prognoveljs/prognovel-cli) to create content in your local computer. You need to publish content to your backend before connecting it to the frontend.
