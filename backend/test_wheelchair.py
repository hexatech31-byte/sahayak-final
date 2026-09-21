import sys
import json
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from retrieval.search_bis import get_relevant_results
from llm.standard_analysis import analyze_standards

req = {
    'title': 'Wheelchair',
    'description': 'Procurement of wheelchairs for use in hospitals and public healthcare facilities.',
    'category': 'Assistive Products',
    'quantity': '50',
    'budget': '250000',
    'department': 'Health Department',
    'deadline': '15 Oct 2026',
    'intended_purpose': 'use in hospitals and public healthcare facilities',
    'application_environment': 'Healthcare',
    'technical_requirements': []
}

query = f"{req['title']} {req['description']} {req.get('category', '')} {req.get('intended_purpose', '')} {req.get('application_environment', '')}"

print("TEST: Wheelchair")
print("="*80)
print(f"Query: {query}")
print()

results = get_relevant_results(query, top_k=10)
analysis = analyze_standards(req, results)

print(f"Applicability: {analysis.get('applicability')}")
primary_standard = analysis.get('primary_standard', {})
print(f"Primary Standard: {primary_standard.get('standard_number') if primary_standard else None}")
print(f"Confidence: {analysis.get('match_confidence')}")
print(f"Why: {analysis.get('why_this_standard', '')[:300]}")
print()

# Check if any wheelchair standard is returned
actual_standard = primary_standard.get('standard_number') if primary_standard else None
if actual_standard and analysis.get('applicability') == "Directly Applicable":
    print(f"✓ Standard returned: {actual_standard}")
else:
    print(f"✗ Expected wheelchair standard, got: {actual_standard or 'None'}")
