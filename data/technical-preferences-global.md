# Technical Preferences — Global
Applies to ALL languages and ALL projects.
Language-specific rules are loaded dynamically from
`{project-root}/_bmad/data/style-guides/{provider}/{language}/{language}.md`.
Do NOT add language-specific rules here.

## Conventions
- `{project-root}`-prefixed paths resolve from the project working directory.

## Logging
- Structured JSON logging only
- Required fields: `level`, `msg`, `trace_id`, `timestamp`
- Never log PII or secrets
- Log context before re-throwing exceptions

## Exception Handling
- Never swallow exceptions silently
- Log full context before re-throwing
- Wrap third-party exceptions in domain exceptions at integration boundaries

## Code Structure
- Prefer functions/methods under 40 lines; extract when exceeded
- Avoid magic strings/numbers — use named constants, enums, or configuration
- One responsibility per function/method/class
- All public APIs require documentation (format per active style guide)

## Security
- No secrets or credentials in source code or comments
- No hardcoded IPs or environment-specific URLs
- Validate all external input at the boundary

## Testing
- Unit tests cover all public functions/methods
- Test names describe behaviour: `should_return_error_when_input_is_null`
- Keep test setup simple — avoid complex logic in fixtures; prefer explicit construction

## Style Guide Reference
Active provider: `{project-root}/_bmad/data/active-coding-standards.md`
Language guides: `{project-root}/_bmad/data/style-guides/{provider}/{language}/{language}.md`
Language quick ref: `{project-root}/_bmad/data/style-guides/{provider}/{language}/SKILL.md`