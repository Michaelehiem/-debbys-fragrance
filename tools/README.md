# Tools

This folder contains Python scripts that handle actual execution — API calls, data transformations, file operations, and database queries.

## How to Use

1. **Check here first** before building anything new
2. **Run scripts from the project root** so `.env` is accessible
3. **Never hardcode credentials** — always use environment variables from `.env`
4. **Register new tools** in `memory/tools_registry.md` after creating them

## Naming Convention

Use descriptive, verb-first names:
- `scrape_single_site.py`
- `export_to_google_sheets.py`
- `send_email.py`
- `transform_product_data.py`

## Script Template

```python
#!/usr/bin/env python3
"""
Tool: [tool_name].py
Purpose: [One sentence description]
Usage: python tools/tool_name.py --arg value
"""

import os
import argparse
from dotenv import load_dotenv

load_dotenv()

def main():
    parser = argparse.ArgumentParser(description='[Description]')
    parser.add_argument('--arg', required=True, help='Description of argument')
    args = parser.parse_args()

    # Your logic here

if __name__ == '__main__':
    main()
```

## Dependencies

Install with:
```bash
pip install -r requirements.txt
```

---

_No tools yet. Add them as tasks arise._
