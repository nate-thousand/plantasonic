# Figma Design Tokens

Pull design tokens from Figma **without manual JSON export**.

## Recommended: drop your Figma export files

If Figma exported `.tokens.json` files to your Desktop:

```bash
npm run tokens:import-json -- \
  --foundation "/path/to/Mode 1.tokens.json" \
  --semantic "/path/to/semantic/Theme 1.tokens.json"
```

This parses native Figma Variables format (hex colors, scale references, semantic aliases) and updates SCSS automatically. Exports are archived to `figma/imports/`.

---

## Alternative: paste a link in Cursor

1. Copy your Figma file URL (e.g. `https://www.figma.com/design/ABC123/Plantasonic?node-id=0-1`)
2. Paste it in chat and say: **"Pull my Figma tokens"**
3. Cursor uses the Figma MCP to read variables and runs the import for you

No export plugins, no copy-paste JSON. The agent writes `figma.snapshot.json` and runs `npm run tokens:import`.

---

## How it works

```text
Figma file (Variables)
  ↓  Cursor MCP (use_figma / get_variable_defs)  OR  REST API (Enterprise)
figma.snapshot.json            intermediate cache (gitignored)
  ↓  npm run tokens:import
tokens.json                      updated in place
  ↓  npm run tokens:sync
generated/_tokens.scss           SCSS primitives → Bootstrap
```

`tokens.json` is maintained automatically — you never edit it by hand.

---

## Option A — Cursor MCP (no token required)

Ask in chat:

> Pull Figma tokens from https://www.figma.com/design/YOUR_FILE_KEY/Plantasonic

The agent will:
1. Read all variable collections via Figma MCP
2. Save `figma.snapshot.json`
3. Run `npm run tokens:import && npm run tokens:sync`

Save your file URL once in `figma.config.json`:

```json
{
  "figmaUrl": "https://www.figma.com/design/YOUR_FILE_KEY/Plantasonic",
  "fileKey": "YOUR_FILE_KEY",
  "nodeId": "0:1",
  "modes": ["dark"]
}
```

---

## Option B — CLI with Figma REST API (Enterprise)

Requires Figma Enterprise + personal access token with `file_variables:read` scope.

```bash
export FIGMA_ACCESS_TOKEN=figd_...
npm run tokens:pull -- "https://www.figma.com/design/FILEKEY/Plantasonic"
```

This pulls variables, writes the snapshot, imports, and syncs in one step.

If you don't have Enterprise, use Option A (MCP).

---

## Commands

| Command | Purpose |
| ------- | ------- |
| `npm run tokens:import-json` | Import native Figma `.tokens.json` exports |
| `npm run tokens:pull` | REST API pull (needs `FIGMA_ACCESS_TOKEN`) |
| `npm run tokens:sync` | Regenerate SCSS from tokens.json |
| `npm run tokens:verify` | CI check |

---

## Figma variable naming

Variables in Figma use kebab-case matching token paths:

| Figma variable | SCSS |
| -------------- | ---- |
| `color-primary` | `$ds-color-primary` |
| `color-surface-default` | `$ds-color-surface-default` |
| `space-3` | `$ds-space-3` |
| `product-nav-height` | `$ps-nav-height` |

See [DESIGN_SYSTEM.md](../../../DESIGN_SYSTEM.md) for the full token spec.

---

## Files

| File | Role |
| ---- | ---- |
| `figma.config.json` | Saved Figma URL + file key |
| `figma.snapshot.json` | Last MCP/REST pull (gitignored) |
| `tokens.json` | Canonical token structure (auto-updated) |
| `generated/_tokens.scss` | Generated SCSS values |
