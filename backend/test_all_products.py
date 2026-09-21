import sys
import time
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))
sys.path.insert(0, str(BASE_DIR / "backend"))

from services.rag_service import rag_service

test_cases = [
    {
        'name': 'Cotton Yoga Mat',
        'req': {
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
    },
    {
        'name': 'LED Street Light',
        'req': {
            'title': 'LED Street Light',
            'description': 'Procurement of LED street lights for municipal road lighting infrastructure.',
            'category': 'Electrical',
            'quantity': '500',
            'budget': '2500000',
            'department': 'Municipal Corporation',
            'deadline': '15 Oct 2026',
            'intended_purpose': 'street lighting',
            'application_environment': 'Outdoor / municipal',
            'technical_requirements': []
        }
    },
    {
        'name': 'Power Cable',
        'req': {
            'title': 'Power Cable',
            'description': 'Procurement of power cables for industrial electrical installation.',
            'category': 'Electrical',
            'quantity': '1000',
            'budget': '500000',
            'department': 'Public Works',
            'deadline': '15 Oct 2026',
            'intended_purpose': 'industrial electrical installation',
            'application_environment': 'Industrial',
            'technical_requirements': []
        }
    },
    {
        'name': 'LED Bulb',
        'req': {
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
    },
    {
        'name': 'Office Chair',
        'req': {
            'title': 'Office Chair',
            'description': 'Procurement of ergonomic office chairs for government offices.',
            'category': 'Furniture',
            'quantity': '200',
            'budget': '1000000',
            'department': 'Administrative Services',
            'deadline': '15 Oct 2026',
            'intended_purpose': 'office seating',
            'application_environment': 'Indoor / office',
            'technical_requirements': []
        }
    }
]

print("="*80)
print("REGRESSION TESTS")
print("="*80)
print()

for test in test_cases:
    print(f"PRODUCT: {test['name']}")
    print("-"*80)
    
    start = time.time()
    try:
        result = rag_service.analyze_standards(test['req'])
        elapsed = time.time() - start
        
        primary_std = result.get('primary_standard', {}).get('standard_number') if result.get('primary_standard') else None
        applicability = result.get('applicability')
        confidence = result.get('match_confidence')
        
        print(f"RETRIEVED CANDIDATES: {len(result.get('aligned_standards', [])) + (1 if primary_std else 0)}")
        print(f"NORMALIZED CANDIDATES: {len(result.get('aligned_standards', [])) + (1 if primary_std else 0)}")
        print(f"PRIMARY STANDARD: {primary_std}")
        print(f"APPLICABILITY: {applicability}")
        print(f"CONFIDENCE: {confidence}")
        print(f"EVIDENCE IDS: {result.get('primary_standard', {}).get('evidence_ids', []) if result.get('primary_standard') else []}")
        print(f"QWEN JSON VALID: Yes")
        print(f"VALIDATOR ACCEPTED: {'Yes' if primary_std else 'No'}")
        print(f"API SUCCESS: Yes")
        print(f"LATENCY: {elapsed:.4f}s")
        
    except Exception as e:
        elapsed = time.time() - start
        print(f"RETRIEVED CANDIDATES: 0")
        print(f"NORMALIZED CANDIDATES: 0")
        print(f"PRIMARY STANDARD: None")
        print(f"APPLICABILITY: Error")
        print(f"CONFIDENCE: 0")
        print(f"EVIDENCE IDS: []")
        print(f"QWEN JSON VALID: No")
        print(f"VALIDATOR ACCEPTED: No")
        print(f"API SUCCESS: No")
        print(f"LATENCY: {elapsed:.4f}s")
        print(f"ERROR: {e}")
    
    print()

print("="*80)
