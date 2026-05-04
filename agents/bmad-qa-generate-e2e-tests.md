## BMAD Coding Standards Extension

### Test Design: Testing Conventions

When generating test plans, test cases, or test code:

**Step 1** — Read `{project-root}/_bmad/data/active-coding-standards.md`.
**Step 2** — Detect language of the code under test.
**Step 3** — Load:
1. `{project-root}/_bmad/data/style-guides/{provider}/{language}/{language}.md`
   (focus: testing section — framework, naming, structure, mocking, file location)
2. `{project-root}/_bmad/data/technical-preferences-global.md`

**Step 4** — Apply the guide's required test framework, naming convention,
test structure pattern, mocking strategy, and file location rules.