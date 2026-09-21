import sys
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from retrieval.search_bis import get_relevant_results
from llm.standard_analysis import analyze_standards

# WORKING version (from test_led_bulb_direct.py)
req_working = {
    'title': 'LED Bulb',
    'description': 'Procurement of LED bulbs for general lighting applications in government offices.',
    'category': 'Electrical',
    'quantity': '1000',
    'budget': '500000',
    'department': 'Public Works Department',
    'deadline': '15 Oct 2026',
    'intended_purpose': 'general lighting',
    'application_environment': 'Indoor / office',
    'technical_requirements': []
}

# FAILING version (from RAG service test)
req_failing = {
    'title': 'LED Bulb',
    'description': 'Procurement of LED bulbs for general lighting applications in government offices.',
    'category': 'Electrical',
    'quantity': '1000 Units',
    'budget': '₹ 5,00,000',
    'department': 'Public Works Department',
    'deadline': '15 Oct 2026',
    'intended_purpose': 'general lighting',
    'application_environment': 'Indoor / office',
    'technical_requirements': []
}

query = 'LED Bulb Procurement of LED bulbs for general lighting applications in government offices. Electrical general lighting Indoor / office'

print("="*80)
print("TESTING WORKING VERSION")
print("="*80)
print()

results = get_relevant_results(query, top_k=10)
analysis_working = analyze_standards(req_working, results)

print(f"Applicability: {analysis_working.get('applicability')}")
print(f"Primary Standard: {analysis_working.get('primary_standard', {}).get('standard_number') if analysis_working.get('primary_standard') else None}")
print(f"Confidence: {analysis_working.get('match_confidence')}")

print()
print("="*80)
print("TESTING FAILING VERSION")
print("="*80)
print()

results = get_relevant_results(query, top_k=10)
analysis_failing = analyze_standards(req_failing, results)

print(f"Applicability: {analysis_failing.get('applicability')}")
print(f"Primary Standard: {analysis_failing.get('primary_standard', {}).get('standard_number') if analysis_failing.get('primary_standard') else None}")
print(f"Confidence: {analysis_failing.get('match_confidence')}")

print()
print("="*80)
print("COMPARISON")
print("="*80)
print(f"Working req: {req_working}")
print(f"Failing req: {req_failing}")
