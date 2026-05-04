## BMAD Coding Standards Extension

### Architecture: Structural Conventions

When designing architecture or creating ADRs:

**Step 1** — Read `{project-root}/_bmad/data/active-coding-standards.md`.
**Step 2** — Detect primary language(s).
**Step 3** — Load:
1. `{project-root}/_bmad/data/style-guides/{provider}/{language}/SKILL.md`
2. `{project-root}/_bmad/data/style-guides/{provider}/{language}/{language}.md`
   (focus: package/module structure and layer naming sections only)
3. `{project-root}/_bmad/data/technical-preferences-global.md`
4. `{project-root}/_bmad/data/technical-preferences-local.md` (if present)

**Step 4** — Apply: package structure, layer names, and API conventions in all
architecture outputs must match the loaded guide. ADRs must cite the active
style guide. Tech stack definitions must not contradict provider requirements.