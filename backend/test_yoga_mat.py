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
    'title': 'Cotton Yoga Mat',
    'description': 'Procurement of cotton yoga mats for fitness centers.',
    'category': 'Sports Equipment',
    'quantity': '100 Units',
    'budget': '₹ 50,000',
    'department': 'Sports Authority',
    'deadline': '30 Sep 2026',
    'intended_purpose': 'fitness centers',
    'application_environment': 'Indoor',
    'technical_requirements': []
}

query = f"{req['title']} {req['description']} {req.get('category', '')} {req.get('intended_purpose', '')} {req.get('application_environment', '')}"

print("TEST 3: Cotton Yoga Mat")
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

# Check if IS 17873 is returned
actual_standard = primary_standard.get('standard_number') if primary_standard else None
if actual_standard and "17873" in actual_standard:
    print("✓ IS 17873 returned as expected")
elif analysis.get('applicability') == "Directly Applicable":
    print(f"✗ Expected IS 17873, got {actual_standard}")
else:
    print(f"✗ Should be Directly Applicable with IS 17873")
