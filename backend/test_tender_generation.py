import sys
import json
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from llm.tender_generation import generate_tender_specification

# Test case: Cotton Yoga Mat
requirement = {
    'title': 'Cotton Yoga Mat',
    'description': 'Procurement of 100 cotton yoga mats for yoga facilities.',
    'category': 'Sports Equipment',
    'quantity': '100',
    'budget': '50000',
    'department': 'Sports Authority',
    'deadline': '15 Nov 2026',
    'intended_purpose': 'yoga facilities',
    'application_environment': 'Indoor',
    'technical_requirements': []
}

standard_analysis = {
    'applicability': 'Directly Applicable',
    'primary_standard': {
        'standard_number': 'IS 17873:2022',
        'title': 'Cotton Yoga Mat — Specification',
        'evidence_ids': [1, 2],
        'product_level_applicability': True
    },
    'match_confidence': 95,
    'why_this_standard': 'Candidate C1 explicitly covers Cotton Yoga Mat with product term coverage of 0.7777777777777778 and states the standard covers requirements for yoga mats made of cotton',
    'technical_specifications': [
        {
            'requirement': 'Cotton Yoga Mat — Specification',
            'source_evidence_ids': [1, 2]
        }
    ],
    'safety_measures': [],
    'implementation_measures': [],
    'aligned_standards': [],
    'certification_requirements': [],
    'final_recommendation': 'IS 17873:2022 is the primary standard for Cotton Yoga Mat procurement as it directly specifies requirements for the product'
}

evidence_package = [
    {
        'id': 1,
        'text': 'Cotton Yoga Mat — Specification This standard covers the requirements of yoga mats made of cotton. The specifications cover various aspects, including types and sizes, material workmanship and finish, constructional and'
    },
    {
        'id': 2,
        'text': 'The standard specifies requirements for cotton yoga mats including dimensions, material quality, workmanship, and testing procedures. All mats shall conform to these specifications.'
    }
]

print("="*80)
print("TESTING TENDER GENERATION MODULE")
print("="*80)
print()

print("INPUT:")
print(f"Product: {requirement['title']}")
print(f"Standard: {standard_analysis['primary_standard']['standard_number']}")
print()

print("GENERATING TENDER SPECIFICATION...")
print()

try:
    result = generate_tender_specification(requirement, standard_analysis, evidence_package)
    
    print("OUTPUT:")
    print(json.dumps(result, indent=2))
    print()
    
    # Validate structure
    if "sections" in result:
        print(f"SUCCESS: Generated {len(result['sections'])} sections")
        for section in result["sections"]:
            print(f"  - Section {section['number']}: {section['title']}")
            print(f"    Clauses: {len(section['clauses'])}")
    else:
        print("ERROR: No sections in result")
        
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()

print()
print("="*80)
