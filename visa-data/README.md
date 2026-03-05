# Visa JSON Import System

## Overview

This system allows you to import complete visa data from JSON files. Each JSON file contains:
- Visa basic information (name, subclass, cost, processing times)
- Premium content sections (8 detailed sections)
- Document requirements and folders
- Timeline tracker entries
- FAQs and news updates

## Files

### JSON Files Location
All JSON files are in `/visa-data/` folder:
- `visa-101.json` - Child Visa
- `visa-103.json` - Parent Visa
- `visa-417.json` - Working Holiday Visa
- `visa-600.json` - Visitor Visa
- ... and 27 more

### Total: 31 visa JSON files

## How to Import

### Method 1: Admin Dashboard (Recommended)

1. Go to `/admin/visas/import`
2. Click "Download Template" to see the format
3. Drag and drop any `visa-XXX.json` file
4. Preview the data
5. Click "Import Visa Data"

### Method 2: Direct Database Import

```bash
# Use the converter script
python3 convert_to_json.py 417 > visa-417.json

# Or use the pre-made files
cp visa-data/visa-417.json .
```

## JSON Structure

Each JSON file follows this structure:

```json
{
  "version": "1.0",
  "visa": {
    "subclass": "417",
    "name": "Working Holiday",
    "category": "visitor",
    "summary": "...",
    "description": "...",
    "cost_aud": "AUD $635",
    "processing_time_range": "18-35 days",
    "duration": "12 months",
    "key_requirements": "...",
    "is_active": true
  },
  "premium_content": [
    {
      "section_number": 1,
      "title": "Executive Overview",
      "content_type": "guide",
      "content": "...",
      "is_published": true
    }
    // ... 7 more sections
  ],
  "documents": {
    "required": [...],
    "folders": [...]
  },
  "timeline_tracker": {
    "entries": [...]
  }
}
```

## Available Visas

| Subclass | Name | Category |
|----------|------|----------|
| 101 | Child Visa | family |
| 103 | Parent Visa | family |
| 173 | Contributory Parent (Temporary) | family |
| 188 | Business Innovation and Investment | business |
| 191 | Skilled Regional Permanent | work |
| 300 | Prospective Marriage | family |
| 400 | Temporary Work (Short Stay) | work |
| 402 | Training and Research | other |
| 403 | Temporary Work (International Relations) | work |
| 407 | Training | work |
| 408 | Temporary Activity | other |
| 417 | Working Holiday | visitor |
| 444 | Special Category | other |
| 461 | NZ Citizen Family Relationship | family |
| 462 | Work and Holiday | visitor |
| 476 | Skilled Recognised Graduate | work |
| 489 | Skilled Regional Provisional | work |
| 494 | Skilled Employer Sponsored Regional | work |
| 590 | Student Guardian | student |
| 600 | Visitor | visitor |
| 601 | Electronic Travel Authority | visitor |
| 602 | Medical Treatment | visitor |
| 651 | eVisitor | visitor |
| 771 | Transit | visitor |
| 804 | Aged Parent | family |
| 820 | Partner (Onshore) | family |
| 858 | Global Talent | work |
| 864 | Contributory Aged Parent | family |
| 870 | Sponsored Parent Temporary | family |
| 887 | Skilled Regional | work |
| 888 | Business Innovation Permanent | business |

## Import Process

The import process:
1. Checks if visa exists in database
2. Updates existing or creates new visa
3. Imports all premium content sections
4. Creates document requirements
5. Creates document folders
6. Imports timeline tracker entries

## Notes

- Duplicate imports are safe (uses upsert)
- All data is validated before import
- Timeline entries are imported as public by default
- Premium content is published by default
