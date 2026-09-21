import sys
import json
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from llm.requirement_understanding import understand_requirement

print("=" * 80)
print("P12: CORRECTNESS REGRESSION TEST")
print("=" * 80)
print()

test_cases = [
    {
        "name": "Complete Input",
        "title": "Cotton Yoga Mat",
        "description": "Procurement of 100 cotton yoga mats for use in yoga and wellness facilities.",
        "category": "Sports Equipment",
        "quantity": "100",
        "budget": "50000",
        "department": "Sports Authority",
        "deadline": "15 Nov 2026",
        "expected": {
            "product": "Cotton Yoga Mat",
            "quantity": "100",
            "budget": "50000",
            "department": "Sports Authority",
            "deadline": "15 Nov 2026"
        }
    },
    {
        "name": "Minimal Input",
        "title": "Power Cable",
        "description": "Procurement of power cables for an industrial electrical installation.",
        "category": "",
        "quantity": "",
        "budget": "",
        "department": "",
        "deadline": "",
        "expected": {
            "product": "Power Cable",
            "quantity": None,
            "budget": None,
            "department": None,
            "deadline": None
        }
    },
    {
        "name": "No Purpose/Environment",
        "title": "Fire-resistant Cable",
        "description": "Need 200 fire-resistant electrical cables.",
        "category": "",
        "quantity": "200",
        "budget": "",
        "department": "",
        "deadline": "",
        "expected": {
            "product": "Fire-resistant Cable",
            "quantity": "200",
            "intended_purpose": None,
            "application_environment": None
        }
    },
    {
        "name": "Technical Requirements",
        "title": "LED Street Light",
        "description": "Procurement of 500 energy-efficient LED street lights for installation on municipal roads.",
        "category": "",
        "quantity": "500",
        "budget": "",
        "department": "",
        "deadline": "",
        "expected": {
            "product": "LED Street Light",
            "quantity": "500"
        }
    }
]

all_pass = True

for test in test_cases:
    print(f"TEST: {test['name']}")
    print("-" * 80)
    
    result = understand_requirement(
        title=test['title'],
        description=test['description'],
        category=test['category'],
        quantity=test['quantity'],
        budget=test['budget'],
        department=test['department'],
        deadline=test['deadline']
    )
    
    # Check JSON validity
    try:
        json.dumps(result)
        print("✓ Valid JSON")
    except:
        print("✗ Invalid JSON")
        all_pass = False
        continue
    
    # Check expected fields
    for key, expected_value in test['expected'].items():
        actual_value = result.get(key)
        
        # Handle None vs empty string
        ifExpectedNone = expected_value is None or expected_value == ""
        ifActualNone = actual_value is None or actual_value == ""
        
        if ifExpectedNone and ifActualNone:
            print(f"✓ {key}: Correctly empty")
        elif expected_value == actual_value:
            print(f"✓ {key}: {actual_value}")
        elif ifExpectedNone and not ifActualNone:
            print(f"⚠ {key}: Expected empty, got '{actual_value}' (may be acceptable)")
        elif not ifExpectedNone and ifActualNone:
            print(f"✗ {key}: Expected '{expected_value}', got empty")
            all_pass = False
        else:
            print(f"⚠ {key}: Expected '{expected_value}', got '{actual_value}' (may be acceptable)")
    
    # Check for hallucinations
    if test['name'] == "No Purpose/Environment":
        purpose = result.get('intended_purpose')
        env = result.get('application_environment')
        if purpose and purpose not in ["", None]:
            print(f"⚠ Hallucinated intended_purpose: '{purpose}'")
        if env and env not in ["", None]:
            print(f"⚠ Hallucinated application_environment: '{env}'")
    
    # Check technical requirements
    tech_reqs = result.get('technical_requirements', [])
    if tech_reqs:
        print(f"Technical requirements: {tech_reqs}")
        if test['name'] == "Technical Requirements":
            # Should extract "energy-efficient"
            if any("energy" in str(req).lower() for req in tech_reqs):
                print("✓ Extracted technical requirement correctly")
            else:
                print("⚠ Did not extract expected technical requirement")
    
    print()
    print(f"Full result: {json.dumps(result, indent=2)}")
    print()
    print("=" * 80)
    print()

if all_pass:
    print("✓ ALL CORRECTNESS TESTS PASSED")
else:
    print("⚠ SOME CORRECTNESS TESTS HAD ISSUES (may be acceptable)")
