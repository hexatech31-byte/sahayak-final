import sys
import json
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from retrieval.search_bis import get_relevant_results

req = {
    'title': 'Portland Cement',
    'description': 'Procurement of Portland cement for construction of government buildings.',
    'category': 'Construction Materials',
    'quantity': '500',
    'budget': '250000',
    'department': 'Public Works Department',
    'deadline': '30 Sep 2026',
    'intended_purpose': 'construction of government buildings',
    'application_environment': 'Construction',
    'technical_requirements': []
}

query = f"{req['title']} {req['description']} {req.get('category', '')} {req.get('intended_purpose', '')} {req.get('application_environment', '')}"

print("TEST: Portland Cement - Retrieval Debug")
print("="*80)
print(f"Query: {query}")
print()

results = get_relevant_results(query, top_k=10)

print(f"Retrieved {len(results)} results")
print()

# Look for cement-related standards
cement_keywords = ['cement', 'portland', 'opc', 'ppc', 'concrete']
cement_standards = []

for i, r in enumerate(results, 1):
    std_nums = r.get('standard_numbers', [])
    text = r.get('text', '').lower()
    title_val = r.get('document_title', r.get('title', ''))
    title = title_val.lower() if title_val else ''
    
    is_cement = any(keyword in text or keyword in title for keyword in cement_keywords)
    
    if is_cement or std_nums:
        print(f"Result {i}:")
        print(f"  Standards: {std_nums}")
        print(f"  Source: {r.get('source_pdf', 'Unknown')}")
        print(f"  Is cement-related: {is_cement}")
        if is_cement:
            cement_standards.append((i, std_nums, r.get('source_pdf')))
            # Show text snippet
            text_snippet = text[:300] if text else ""
            print(f"  Text: {text_snippet}...")
        print()

print(f"Total cement-related results: {len(cement_standards)}")
print()
print("Cement standards found:")
for idx, std_nums, source in cement_standards:
    print(f"  Result {idx}: {std_nums} from {source}")
