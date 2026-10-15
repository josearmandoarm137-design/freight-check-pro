<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## VisionScan architecture
- Use TanStack file routes for access and each operational view, with shared React context and shell; each page has its own metadata.
- Employee identification uses the supplied fictitious directory, not credential authentication; never present matrícula-only access as proof of identity or suitable for confidential production data.
- Keep employee roles in a separate server-only directory table and validate the selected employee for every operation; client-side role checks only determine presentation.
- Keep operational data in Lovable Cloud and access through validated server functions; no anonymous Data API grants or browser-local business records.
- Export filtered reports as browser-generated PDFs from the same filtered record collection shown on screen.
