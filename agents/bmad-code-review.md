## BMAD Coding Standards Extension

### Code Review: Standards-Based Violation Reporting

**Step 1** — Read `{project-root}/_bmad/data/active-coding-standards.md` → get `{provider}`.

**Step 2** — Detect language of files under review (same logic as dev agent).

**Step 3** — Load:
1. `{project-root}/_bmad/data/style-guides/{provider}/{language}/SKILL.md`
2. `{project-root}/_bmad/data/style-guides/{provider}/{language}/{language}.md`
3. `{project-root}/_bmad/data/technical-preferences-global.md`
4. `{project-root}/_bmad/data/technical-preferences-local.md` (if present)

**Step 4** — Review all code against loaded rules.

**Step 5** — Report in this format:

```
## Code Review — {Provider} {Language}

### ❌ Blocking (must fix before story closes)
1. [Rule] {rule name}
   File: {filename}:{line}
   Found:    {what the code does}
   Expected: {what the guide requires}
   Fix:      {corrected snippet}

### ⚠️ Warnings (non-blocking)
1. ...

### ✅ Passed
Guide: {provider}/{language}/{language}.md
Checked: {list of rule categories}
```