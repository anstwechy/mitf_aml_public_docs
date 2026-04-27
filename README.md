# FlowGuard documentation

This repository is the **canonical technical documentation** for the FlowGuard AML platform. Source Markdown lives in [`docs/`](./docs/README.md).

## Browse online

When [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) is enabled with **“GitHub Actions”** as the source, the workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) builds and deploys the site to:

`https://anstwechy.github.io/mitf_aml_public_docs/`

This matches the [public Online Payment docs](https://github.com/anstwechy/public_online_payment_docs) pattern (Material, `mkdocs build --strict`, no pip cache in CI). Diagrams use [Mermaid](https://mermaid.js.org/) (sequence & flow) on operations pages.

## Build locally

```bash
python -m pip install -r requirements.txt
mkdocs serve
# Production build: mkdocs build --strict
```

Then open the URL shown in the terminal (by default [http://127.0.0.1:8000/](http://127.0.0.1:8000/)).

## Full documentation index

See [`docs/README.md`](./docs/README.md) (Diátaxis map, entry points, and related paths).
