# FlowGuard documentation

This repository is the **canonical technical documentation** for the FlowGuard AML platform. Source Markdown lives in [`docs/`](./docs/README.md).

## Browse online

When [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) is enabled with **“GitHub Actions”** as the source, the site is published at:

`https://<owner>.github.io/<repo>/`

*(Replace `<owner>` and `<repo>` with your GitHub user or org and this repository’s name after the first successful deploy.)*

## Build locally

```bash
python -m pip install -r requirements.txt
# Optional: set to your GitHub repo so "edit" links in the theme resolve (PowerShell: $env:REPO_URL="https://github.com/OWNER/REPO")
mkdocs serve
```

Then open the URL shown in the terminal (by default [http://127.0.0.1:8000/](http://127.0.0.1:8000/)).

## Full documentation index

See [`docs/README.md`](./docs/README.md) (Diátaxis map, entry points, and related paths).
