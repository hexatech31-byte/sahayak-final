import sys
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
print("FULL PIPELINE TEST (RETRIEVAL + ANALYSIS)")
print("="*80)
print()

for test in test_cases:
    print(f"PRODUCT: {test['name']}")
    print("-"*80)
    
    try:
        # Step 1: Retrieval
        results = get_relevant_results(test['query'], top_k=10)
        print(f"RETRIEVAL COUNT: {len(results)}")
        
        # Show top 3 retrieval results
        print("TOP RETRIEVAL RESULTS:")
        for i, r in enumerate(results[:3], 1):
            std_nums = r.get('standard_numbers', r.get('standard_number', []))
            if isinstance(std_nums, list) and len(std_nums) == 0:
                std_nums = "[]"
            elif isinstance(std_nums, list):
                std_nums = str(std_nums[:3]) if len(std_nums) > 3 else str(std_nums)
            else:
                std_nums = str(std_nums)
            print(f"  {i}. Standard: {std_nums}")
            print(f"     Similarity: {r.get('similarity', 0):.4f}")
        print()
        
        # Step 2: Analysis
        analysis = analyze_standards(test['req'], results)
        
        print(f"ANALYSIS RESULT:")
        print(f"  Applicability: {analysis.get('applicability')}")
        print(f"  Primary Standard: {analysis.get('primary_standard', {}).get('standard_number') if analysis.get('primary_standard') else None}")
        print(f"  Confidence: {analysis.get('match_confidence')}")
        print(f"  Why: {analysis.get('why_this_standard', '')[:200]}")
        print()
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
    
    print("="*80)
    print()
