## Learned User Preferences

- Prefers public docs copy and navigation that highlight system strengths and capabilities, not only generic section titles.
- Wants Mermaid sequence and flow diagrams for operations, end-to-end transaction paths, and tenant or architecture views, alongside prose.
- Values strong visual polish on the Material site (palette, typography, and custom CSS).

## Learned Workspace Facts

- MkDocs with Material: Markdown lives under `docs/`; `mkdocs.yml` stays at the repository root (MkDocs does not support `docs_dir: .` with root config).
- GitHub Pages is built and deployed via `.github/workflows/pages.yml` using `mkdocs build --strict`, adding `site/.nojekyll`, following the same pattern as `anstwechy/public_online_payment_docs`.
- Published site and canonical Git remote for this project: `https://anstwechy.github.io/mitf_aml_public_docs/` and `https://github.com/anstwechy/mitf_aml_public_docs`.
- Mermaid: `pymdownx.superfences` `custom_fences` with `format: !!python/name:pymdownx.superfences.fence_code_format` (yields `pre`/`code.mermaid`); Material’s JavaScript bundle loads and runs Mermaid — avoid vendored `mermaid.min.js` unless customizing.
- `mkdocs.yml` includes `validation` for links and nav, and uses `edit_uri: edit/main/docs/` for GitHub “edit” links.
- This repository is documentation-only: references to the FlowGuard platform codebase should use backtick paths, not `../../src/...` links that cannot resolve here.
