import sys
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from retrieval.search_bis import get_relevant_results
from llm.standard_analysis import _build_candidates, _is_hard_negative, _calculate_product_match_score

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
        },
        'query': 'LED Bulb Procurement of LED bulbs for general lighting applications in government offices. Electrical general lighting Indoor / office'
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
        },
        'query': 'Cotton Yoga Mat Procurement of 100 cotton yoga mats for yoga facilities. Sports Equipment Indoor'
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
        },
        'query': 'Power Cable Procurement of power cables for industrial electrical installation. Electrical Industrial'
    }
]

print("="*80)
print("CANDIDATE FILTERING TEST")
print("="*80)
print()

for test in test_cases:
    print(f"PRODUCT: {test['name']}")
    print("-"*80)
    
    try:
        results = get_relevant_results(test['query'], top_k=10)
        print(f"RAW RETRIEVAL COUNT: {len(results)}")
        print()
        
        # Build candidates - convert results to evidence format expected by _build_candidates
        evidence_package = []
        for i, item in enumerate(results, start=1):
            evidence_package.append({
                'evidence_id': i,
                'source_pdf': item.get('source_pdf', ''),
                'score': item.get('similarity', 0),
                'text': item.get('text', '')
            })
        
        candidates = _build_candidates(evidence_package, test['req'])
        print(f"CANDIDATES BEFORE HARD NEGATIVE FILTER: {len(candidates)}")
        
        # Show candidates with scores
        for i, c in enumerate(candidates[:5], 1):
            print(f"  {i}. {c['standard_number']}")
            print(f"     product_match_score: {c['product_match_score']:.2f}")
            print(f"     best_score: {c['best_score']:.4f}")
            print(f"     relevance_hint: {c['relevance_hint']}")
            print()
        
        # Apply hard negative filter
        filtered = [c for c in candidates if not _is_hard_negative(test['req'], c)]
        print(f"CANDIDATES AFTER HARD NEGATIVE FILTER: {len(filtered)}")
        
        # Show filtered candidates
        for i, c in enumerate(filtered[:5], 1):
            print(f"  {i}. {c['standard_number']}")
            print(f"     product_match_score: {c['product_match_score']:.2f}")
            print(f"     best_score: {c['best_score']:.4f}")
            print()
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
    
    print("="*80)
    print()
