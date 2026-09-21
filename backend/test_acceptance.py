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

test_cases = [
    {
        "name": "TEST 1: Power Cable",
        "req": {
            'title': 'Power Cable',
            'description': 'Procurement of power cables for an industrial electrical installation.',
            'category': 'Electrical Equipment',
            'quantity': '500 Meters',
            'budget': '₹ 5,00,000',
            'department': 'Electrical Engineering Dept',
            'deadline': '30 Sep 2026',
            'intended_purpose': 'industrial electrical installation',
            'application_environment': 'Industrial',
            'technical_requirements': []
        },
        "expected_applicability": "Directly Applicable",
        "expected_standard": "IS 7098"
    },
    {
        "name": "TEST 2: Office Chairs",
        "req": {
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
        },
        "expected_applicability": "Not Established",  # Should reject wheelchair standards
        "expected_standard": None
    },
    {
        "name": "TEST 3: Cotton Yoga Mat",
        "req": {
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
        },
        "expected_applicability": "Directly Applicable",
        "expected_standard": "IS 17873"
    },
    {
        "name": "TEST 4: LED Street Lights",
        "req": {
            'title': 'LED Street Lights',
            'description': 'Procurement of LED street lights for municipal road lighting.',
            'category': 'Lighting',
            'quantity': '200 Units',
            'budget': '₹ 10,00,000',
            'department': 'Municipal Corporation',
            'deadline': '30 Sep 2026',
            'intended_purpose': 'municipal road lighting',
            'application_environment': 'Outdoor',
            'technical_requirements': []
        },
        "expected_applicability": "Directly Applicable",
        "expected_standard": "IS 16107"
    }
]

for test in test_cases:
    print("="*80)
    print(test["name"])
    print("="*80)
    
    req = test["req"]
    query = f"{req['title']} {req['description']} {req.get('category', '')} {req.get('intended_purpose', '')} {req.get('application_environment', '')}"
    
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
    
    # Check if expectations met
    actual_applicability = analysis.get('applicability')
    actual_standard = primary_standard.get('standard_number') if primary_standard else None
    
    if actual_applicability == test['expected_applicability']:
        print(f"✓ Applicability matches expected: {test['expected_applicability']}")
    else:
        print(f"✗ Applicability mismatch: expected {test['expected_applicability']}, got {actual_applicability}")
    
    if test['expected_standard']:
        if actual_standard and test['expected_standard'] in actual_standard:
            print(f"✓ Standard matches expected: contains {test['expected_standard']}")
        else:
            print(f"✗ Standard mismatch: expected to contain {test['expected_standard']}, got {actual_standard}")
    else:
        if actual_standard is None or actual_standard == "":
            print(f"✓ Standard is None as expected")
        else:
            print(f"✗ Standard should be None, got {actual_standard}")
    
    print()
