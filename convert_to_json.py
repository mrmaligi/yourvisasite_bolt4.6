#!/usr/bin/env python3
"""
Convert Visa Markdown Files to JSON Import Format
Usage: python3 convert_to_json.py 417 > visa-417-import.json
"""
import sys
import os
import re
import json

def parse_markdown_to_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract subclass and name from filename
    filename = os.path.basename(filepath)
    match = re.match(r'(\d+)-(.+)\.md', filename)
    if match:
        subclass = match.group(1)
        name = match.group(2).replace('-', ' ').title()
    else:
        subclass = "000"
        name = "Unknown Visa"
    
    # Extract sections
    def extract_section(start_marker, end_marker=None):
        start = content.find(start_marker)
        if start == -1:
            return ""
        start += len(start_marker)
        if end_marker:
            end = content.find(end_marker, start)
            if end == -1:
                end = len(content)
        else:
            end = len(content)
        return content[start:end].strip()
    
    # Get summary from Executive Overview
    overview = extract_section('## Section 1: Executive Overview', '## Section 2:')
    # First paragraph
    summary_match = re.search(r'^([^.]+\.[^.]+\.)', overview, re.MULTILINE)
    summary = summary_match.group(1) if summary_match else overview[:500]
    
    # Get full description
    description = overview[:2000]
    
    # Extract processing times
    processing_section = extract_section('## Section 6: Processing Times', '## Section 7:')
    processing_times = {}
    for line in processing_section.split('\n'):
        match = re.search(r'\|\s*(\d+%)\s*\|\s*([^|]+)\|', line)
        if match:
            key = match.group(1).replace('%', '_percentile')
            processing_times[key] = match.group(2).strip()
    
    # Extract costs
    costs_section = extract_section('## Section 5: Costs', '## Section 6:')
    cost_match = re.search(r'Base Application Charge.*?\$?([\d,]+)', costs_section, re.IGNORECASE)
    cost_aud = f"AUD ${cost_match.group(1)}" if cost_match else ""
    
    # Extract duration
    duration_match = re.search(r'\*\*Duration:\*\*\s*([^\n]+)', overview)
    duration = duration_match.group(1) if duration_match else ""
    
    # Extract eligibility
    eligibility = extract_section('## Section 2: Eligibility Requirements', '## Section 3:')
    
    # Build key requirements
    key_reqs = []
    for line in eligibility.split('\n'):
        match = re.search(r'^\s*\d+\.\s*\*\*([^*]+)\*\*', line)
        if match:
            key_reqs.append(f"• {match.group(1).strip()}")
    key_requirements = '\n'.join(key_reqs[:8]) if key_reqs else ""
    
    # Extract document checklist
    checklist = extract_section('## Section 4: Document Checklist', '## Section 5:')
    required_docs = []
    for line in checklist.split('\n'):
        match = re.search(r'- \[ \]\s*\*?([^*\n]+)\*?', line)
        if match:
            doc_name = match.group(1).strip()
            if doc_name and not doc_name.startswith('For Second'):
                required_docs.append({
                    "name": doc_name[:100],
                    "description": "",
                    "is_mandatory": True,
                    "document_type": "identity" if "passport" in doc_name.lower() else "financial" if "bank" in doc_name.lower() else "other",
                    "checklist_order": len(required_docs) + 1
                })
    
    # Extract timeline entries
    timeline_section = extract_section('## Section 10: REAL TIMELINE TRACKER DATA', '---')
    entries = []
    for line in timeline_section.split('\n'):
        match = re.search(r'\|\s*(\w+ \d{1,2}, \d{4})\s*\|\s*(\w+ \d{1,2}, \d{4})\s*\|\s*(\d+)\s*days?\s*\|\s*([^|]+)\|', line)
        if match:
            try:
                from datetime import datetime
                app_date = datetime.strptime(match.group(1), '%b %d, %Y').strftime('%Y-%m-%d')
                decision_date = datetime.strptime(match.group(2), '%b %d, %Y').strftime('%Y-%m-%d')
                entries.append({
                    "application_date": app_date,
                    "decision_date": decision_date,
                    "days": int(match.group(3)),
                    "status": "granted",
                    "country": "",
                    "notes": match.group(4).strip(),
                    "is_public": True
                })
            except:
                pass
    
    # Build premium content sections
    premium_content = [
        {
            "section_number": 1,
            "title": "Executive Overview",
            "content_type": "guide",
            "content": overview[:5000],
            "is_published": True
        },
        {
            "section_number": 2,
            "title": "Eligibility Requirements",
            "content_type": "guide",
            "content": eligibility[:5000],
            "is_published": True
        },
        {
            "section_number": 3,
            "title": "Step-by-Step Application Process",
            "content_type": "guide",
            "content": extract_section('## Section 3: Step-by-Step Process', '## Section 4:')[:5000],
            "is_published": True
        },
        {
            "section_number": 4,
            "title": "Document Checklist",
            "content_type": "checklist",
            "content": checklist[:5000],
            "is_published": True
        },
        {
            "section_number": 5,
            "title": "Costs and Fees",
            "content_type": "guide",
            "content": costs_section[:5000],
            "is_published": True
        },
        {
            "section_number": 6,
            "title": "Processing Times",
            "content_type": "guide",
            "content": processing_section[:5000],
            "is_published": True
        },
        {
            "section_number": 7,
            "title": "Common Mistakes and Tips",
            "content_type": "guide",
            "content": extract_section('## Section 8: Common Mistakes', '## Section 9:')[:5000],
            "is_published": True
        },
        {
            "section_number": 10,
            "title": "Real Timeline Tracker Data",
            "content_type": "guide",
            "content": timeline_section[:5000],
            "is_published": True
        }
    ]
    
    # Build final JSON structure
    output = {
        "version": "1.0",
        "visa": {
            "subclass": subclass,
            "name": name,
            "category": "visitor" if subclass in ["417", "462", "600", "601", "651"] else 
                       "work" if subclass in ["189", "190", "491", "482", "494", "186"] else
                       "family" if subclass in ["309", "820", "801", "300", "103", "143"] else
                       "student" if subclass in ["500", "485", "590"] else "other",
            "country": "Australia",
            "summary": summary,
            "description": description,
            "duration": duration,
            "cost_aud": cost_aud,
            "processing_time_range": processing_times.get('75_percentile', ''),
            "official_url": f"https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/{name.lower().replace(' ', '-')}-{subclass}",
            "key_requirements": key_requirements,
            "is_active": True,
            "eligibility_criteria": {},
            "metadata": {
                "last_updated": "2025-03-01",
                "source": "Department of Home Affairs Research",
                "reviewed_by": "Immigration Expert"
            }
        },
        "premium_content": premium_content,
        "documents": {
            "required": required_docs[:10],
            "folders": [
                {
                    "name": "Identity Documents",
                    "description": "Passport, photos, birth certificates",
                    "order": 1
                },
                {
                    "name": "Financial Evidence",
                    "description": "Bank statements, proof of funds",
                    "order": 2
                },
                {
                    "name": "Travel Documents",
                    "description": "Flight bookings, itineraries",
                    "order": 3
                }
            ]
        },
        "timeline_tracker": {
            "official_times": processing_times,
            "entries": entries[:15]
        },
        "faqs": [],
        "news_and_updates": []
    }
    
    return output

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 convert_to_json.py <subclass>")
        print("Example: python3 convert_to_json.py 417")
        sys.exit(1)
    
    subclass = sys.argv[1]
    visas_dir = '/home/openclaw/.openclaw/workspace/yourvisasite_bolt4.6/visas'
    
    # Find matching file
    matching_files = [f for f in os.listdir(visas_dir) if f.startswith(f"{subclass}-") and f.endswith('.md')]
    
    if not matching_files:
        print(f"Error: No file found for subclass {subclass}")
        sys.exit(1)
    
    filepath = os.path.join(visas_dir, matching_files[0])
    result = parse_markdown_to_json(filepath)
    
    # Output JSON
    print(json.dumps(result, indent=2))

if __name__ == '__main__':
    main()
