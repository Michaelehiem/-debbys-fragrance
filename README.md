# Debby's Fragrance — AI Assistant Project

> Powered by the **WAT Architecture** (Workflows · Agents · Tools)

---

## Project Overview

This is the AI-assisted operations hub for **Debby's Fragrance**, managed by Michael.

Claude operates as the intelligent coordinator — reading workflows, executing tools, and keeping a persistent memory of all work done.

---

## Quick Start

1. **Claude reads `CLAUDE.md`** at the start of every session
2. **Check `memory/active_tasks.md`** for any pending work
3. **Check `workflows/`** before starting any new task
4. **Check `tools/`** before building any new script
5. **Save to `memory/`** at the end of every session

---

## Folder Structure

```
Debby's Fragrance/
│
├── CLAUDE.md               # Operating instructions for Claude
├── README.md               # This file
├── .env                    # API keys (never commit this)
├── .env.example            # Template for .env
├── .gitignore              # Protects credentials and temp files
│
├── workflows/              # Markdown SOPs — what to do and how
│   └── README.md
│
├── tools/                  # Python scripts — deterministic execution
│   └── README.md
│
├── memory/                 # Persistent memory — always updated
│   ├── active_tasks.md         # Tasks in progress
│   ├── completed_projects.md   # Finished work archive
│   ├── lessons_learned.md      # Errors & fixes log
│   ├── tools_registry.md       # Index of all tools
│   ├── workflow_changelog.md   # History of workflow changes
│   └── session_log.md          # Rolling session history
│
└── .tmp/                   # Temporary processing files (disposable)
    └── README.md
```

---

## Memory Rule

> Claude **must** update `memory/session_log.md` at the end of every session.
> Completed tasks go to `completed_projects.md`. No exceptions.

---

*Built for Michael | Debby's Fragrance | 2026*
