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
    'title': 'Office Chairs',
    'description': 'Procurement of ergonomic office chairs for government administrative offices.',
    'category': 'Furniture',
    'quantity': '50 Units',
    'budget': '₹ 2,50,000',
    'department': 'Administrative Services',
    'deadline': '30 Sep 2026',
    'intended_purpose': 'government administrative offices',
    'application_environment': 'Office',
    'technical_requirements': []
}

query = f"{req['title']} {req['description']} {req.get('category', '')} {req.get('intended_purpose', '')} {req.get('application_environment', '')}"

print("TEST 2: Office Chairs")
print("="*80)
print(f"Query: {query}")
print()

results = get_relevant_results(query, top_k=10)
analysis = analyze_standards(req, results)

print(f"Applicability: {analysis.get('applicability')}")
primary_standard = analysis.get('primary_standard', {})
print(f"Primary Standard: {primary_standard.get('standard_number') if primary_standard else None}")
print(f"Confidence: {analysis.get('match_confidence')}")
print(f"Why: {analysis.get('why_this_standard', '')[:200]}")
print()

# Check if wheelchair standards were filtered
if analysis.get('applicability') == "Not Established":
    print("✓ Correctly rejected (no office chair standard found)")
else:
    print(f"✗ Should be Not Established, got {analysis.get('applicability')}")
