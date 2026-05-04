## BMAD Coding Standards Extension

### Startup: Language Detection & Style Guide Loading

Execute once at the start of every coding task:

**Step 1** — Read `{project-root}/_bmad/data/active-coding-standards.md` → get `{provider}`.

**Step 2** — Detect language (priority order):
1. Story `tech_stack` / `language` fields
2. Root config files:
   `pom.xml` / `build.gradle` → `java` |
   `pyproject.toml` / `requirements.txt` → `python` |
   `tsconfig.json` (or TypeScript in package.json deps) → `typescript` |
   `package.json` alone → `javascript` |
   `go.mod` → `go` |
   `*.sh` in root → `shell` |
   `.cpp` / `.cc` files → `cpp` |
   AngularJS patterns in JS/TS → `angularjs`
3. Extensions of files being created or edited

**Step 3** — Load in this order:
1. `{project-root}/_bmad/data/style-guides/{provider}/{language}/SKILL.md` — quick reference
2. `{project-root}/_bmad/data/style-guides/{provider}/{language}/{language}.md` — full rules
3. `{project-root}/_bmad/data/technical-preferences-global.md` — universal rules
4. `{project-root}/_bmad/data/technical-preferences-local.md` — project overrides (local wins on conflict)

For multi-language projects: repeat steps 2–3 for each detected language.

**Step 4** — Confirm to user:
> 📐 Standards: **{Provider} / {Language}** | local prefs: {found / not found}

**Step 5** — Enforce: all code must comply. Violations are defects, not suggestions.