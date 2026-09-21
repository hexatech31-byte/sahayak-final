import sys
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from retrieval.search_bis import get_relevant_results

test_cases = [
    {
        'name': 'LED Bulb',
        'query': 'LED Bulb Procurement of LED bulbs for general lighting applications in government offices. Electrical general lighting Indoor / office'
    },
    {
        'name': 'Cotton Yoga Mat',
        'query': 'Cotton Yoga Mat Procurement of 100 cotton yoga mats for yoga facilities. Sports Equipment Indoor'
    },
    {
        'name': 'Power Cable',
        'query': 'Power Cable Procurement of power cables for industrial electrical installation. Electrical Industrial'
    },
    {
        'name': 'LED Street Light',
        'query': 'LED Street Light Procurement of LED street lights for municipal road lighting infrastructure. Electrical street lighting Outdoor / municipal'
    },
    {
        'name': 'Office Chair',
        'query': 'Office Chair Procurement of ergonomic office chairs for government offices. Furniture Indoor / office'
    }
]

print("="*80)
print("DIRECT RETRIEVAL TEST (BEFORE QWEN)")
print("="*80)
print()

for test in test_cases:
    print(f"PRODUCT: {test['name']}")
    print(f"QUERY: {test['query']}")
    print("-"*80)
    
    try:
        results = get_relevant_results(test['query'], top_k=10)
        
        print(f"INDEX INITIALIZED: Yes")
        print(f"EMBEDDING MODEL INITIALIZED: Yes")
        print(f"TOP_K: 10")
        print(f"RAW RETRIEVAL COUNT: {len(results)}")
        print()
        
        print("TOP RETRIEVED RESULTS:")
        for i, r in enumerate(results[:5], 1):
            std_nums = r.get('standard_numbers', r.get('standard_number', []))
            if isinstance(std_nums, list) and len(std_nums) == 0:
                std_nums = "[]"
            elif isinstance(std_nums, list):
                std_nums = str(std_nums[:3]) if len(std_nums) > 3 else str(std_nums)
            else:
                std_nums = str(std_nums)
            
            title = r.get('document_title') or r.get('title') or 'Unknown'
            similarity = r.get('similarity', 0)
            text = r.get('text', '')[:200]
            
            print(f"  {i}. Standard: {std_nums}")
            print(f"     Title: {title[:80]}")
            print(f"     Similarity: {similarity:.4f}")
            print(f"     Text: {text}")
            print()
        
        # Count results with standard numbers
        with_std = sum(1 for r in results if r.get('standard_numbers') and len(r.get('standard_numbers', [])) > 0)
        print(f"RESULTS WITH STANDARD NUMBERS: {with_std}/{len(results)}")
        print()
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
    
    print("="*80)
    print()
