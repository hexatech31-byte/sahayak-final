import sys
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from llm.standard_analysis import _product_terms, _calculate_product_match_score

req = {
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

print("Testing _product_terms with requirement dict...")
print(f"Requirement: {req}")
print(f"Requirement type: {type(req)}")
print()

try:
    terms = _product_terms(req)
    print(f"Product terms: {terms}")
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()

print()
print("Testing _calculate_product_match_score...")
evidence = "This standard specifies the safety requirements for LED modules intended for general lighting applications, ensuring their safe operation and use. This standard includes various tests such as: Marking test, Provision for protective earthing, Protection against accidental contact"

try:
    score = _calculate_product_match_score(req, evidence)
    print(f"Product match score: {score}")
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
