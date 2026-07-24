# Workflows

This folder contains Markdown SOPs (Standard Operating Procedures) — the instructions Claude reads before executing any task.

## How to Use

1. **Before starting any task**, check this folder for a relevant workflow
2. **Follow the workflow exactly** — it defines the objective, inputs, tools, outputs, and edge cases
3. **Update workflows** when you discover better methods, encounter constraints, or find recurring issues
4. **Never create or overwrite workflows without asking Michael** — unless explicitly told to

## Naming Convention

Use descriptive, action-oriented names:
- `scrape_website.md`
- `generate_product_descriptions.md`
- `update_google_sheet.md`
- `send_email_campaign.md`

## Workflow Template

```markdown
# Workflow: [Name]

## Objective
What this workflow accomplishes in 1-2 sentences.

## Inputs Required
- Input 1: Description
- Input 2: Description

## Tools to Use
- `tools/script_name.py` — what it does

## Steps
1. Step one
2. Step two
3. Step three

## Expected Output
What a successful run looks like.

## Edge Cases & Error Handling
- **Rate limited?** Do X
- **Missing data?** Do Y
- **API down?** Do Z

## Notes
Anything learned from running this workflow previously.
```

---

_No workflows yet. Add them as tasks arise._
