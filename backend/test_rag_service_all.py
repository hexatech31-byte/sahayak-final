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
        'name': 'LED Street Light',
        'req': {
            'title': 'LED Street Light',
            'description': 'Procurement of LED street lights for municipal road lighting infrastructure.',
            'category': 'Electrical',
            'quantity': '500',
            'budget': '2500000',
            'department': 'Municipal Corporation',
            'deadline': '15 Nov 2026',
            'intended_purpose': 'municipal road lighting',
            'application_environment': 'Outdoor / municipal',
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
            'department': 'Public Works Department',
            'deadline': '15 Oct 2026',
            'intended_purpose': 'office seating',
            'application_environment': 'Indoor / office',
            'technical_requirements': []
        }
    }
]

print("="*80)
print("RAG SERVICE API TEST - ALL PRODUCTS")
print("="*80)
print()

results_summary = []

for test in test_cases:
    print(f"PRODUCT: {test['name']}")
    print("-"*80)
    
    start = time.time()
    try:
        result = rag_service.analyze_standards(test['req'])
        elapsed = time.time() - start
        
        applicability = result.get('applicability')
        primary_std = result.get('primary_standard', {}).get('standard_number') if result.get('primary_standard') else None
        confidence = result.get('match_confidence')
        
        print(f"✓ Success in {elapsed:.4f}s")
        print(f"Applicability: {applicability}")
        print(f"Primary Standard: {primary_std}")
        print(f"Confidence: {confidence}")
        
        results_summary.append({
            'name': test['name'],
            'status': 'Success',
            'applicability': applicability,
            'primary_standard': primary_std,
            'confidence': confidence,
            'latency': elapsed
        })
        
    except Exception as e:
        elapsed = time.time() - start
        print(f"✗ Failed in {elapsed:.4f}s: {e}")
        
        results_summary.append({
            'name': test['name'],
            'status': 'Failed',
            'applicability': None,
            'primary_standard': None,
            'confidence': None,
            'latency': elapsed
        })
    
    print()
    print("="*80)
    print()

print()
print("="*80)
print("SUMMARY")
print("="*80)
print()

for r in results_summary:
    status_icon = "✓" if r['status'] == 'Success' else "✗"
    print(f"{status_icon} {r['name']}: {r['applicability'] or 'ERROR'} | Std: {r['primary_standard'] or 'N/A'} | Confidence: {r['confidence'] or 'N/A'} | Latency: {r['latency']:.2f}s")

print()
print("="*80)
