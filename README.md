# bmad-coding-standards

Multi-provider coding standards enforcement for BMAD agents. Enforces consistent code style across all languages in your project.

## Quick Start

```bash
npx @flothemaker/bmad-coding-standards
```

Or for local development:
```bash
node install.js
```

Select your style guide provider and the installer handles the rest.

## What It Does

- **Language-aware**: Detects project language automatically, loads the right style guide
- **Provider-agnostic**: Supports multiple style guide providers (Google, etc.)
- **Project-specific**: Respects `_bmad/data/technical-preferences-local.md` for custom rules
- **Agent-integrated**: Extends BMAD agents with coding standards knowledge
- **Multi-IDE**: Works with any IDE configured in BMAD (OpenCode, Cursor, etc.)

## Providers

| Provider | Languages |
|----------|-----------|
| [Google](https://github.com/testdino-hq/google-styleguides-skills) | AngularJS, C++, C#, Common Lisp, Go, HTML/CSS, Java, JavaScript, JSON, Markdown, Objective-C, Python, R, Shell, Swift, TypeScript, Vim Script |

## File Structure

```
bmad-coding-standards/
├── install.js                      # Interactive installer
├── platform-codes.yaml             # IDE platform mappings
├── package.json                    # Dependencies
├── agents/                         # Agent extensions (merged on install)
│   ├── bmad-quick-dev.md
│   ├── bmad-code-review.md
│   ├── bmad-create-architecture.md
│   ├── bmad-qa-generate-e2e-tests.md
│   ├── bmad-document-project.md
│   ├── bmad-product-brief.md
│   └── bmad-sprint-planning.md
└── data/
    ├── technical-preferences-global.md  # Universal rules (all languages)
    └── style-guides/{provider}/{language}/
        ├── SKILL.md                      # Quick reference for LLM
        └── {language}.md                 # Full style guide
```

## After Installation

Files are copied to your project:

```
{project}/
├── .agents/skills/             # Extended agent skills (per IDE)
└── _bmad/
    └── data/
        ├── active-coding-standards.md
        ├── technical-preferences-global.md
        ├── technical-preferences-local.md   # Your overrides (never touched)
        └── style-guides/{provider}/{language}/
```

Agents read files in this order (later ones override earlier):
1. `_bmad/data/style-guides/{provider}/{language}/SKILL.md`
2. `_bmad/data/style-guides/{provider}/{language}/{language}.md`
3. `_bmad/data/technical-preferences-global.md`
4. `_bmad/data/technical-preferences-local.md` (if exists)

## Global Preferences (Universal Rules)

The `technical-preferences-global.md` file enforces:

- **Logging**: Structured JSON with `level`, `msg`, `trace_id`, `timestamp`; never log PII
- **Exceptions**: Never swallow silently; log context before re-throwing; wrap third-party at boundaries
- **Code Structure**: Prefer <40 lines per function; no magic strings/numbers; single responsibility
- **Security**: No secrets in code; no hardcoded IPs/URLs; validate external input
- **Testing**: Cover all public APIs; use descriptive names (`should_return_x_when_y`)

## Customization

### Project-Specific Rules

Create `_bmad/data/technical-preferences-local.md` — it takes precedence over global rules.

### Adding a New Provider

```
# In bmad-coding-standards source:
data/style-guides/{new-provider}/{language}/
├── SKILL.md      # Quick reference for LLM
└── {language}.md # Full style guide content

# Example: airbnb JavaScript style guide
data/style-guides/airbnb/javascript/
├── SKILL.md
└── javascript.md
```

The installer auto-discovers new providers — users select them interactively. No code changes needed.

## Switching Providers

Re-run the installer anytime:

```bash
npx @flothemaker/bmad-coding-standards
```

## License

[MIT](license.md)

The [Google styleguides-skills](https://github.com/testdino-hq/google-styleguides-skills) is also MIT licensed.