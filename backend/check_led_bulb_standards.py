import sys

sys.path.insert(0, r'D:\Sanku\sahayak-web-main\sahayak-web-main\Indian-Standards-AI(1)\Indian-Standards-AI')
sys.path.insert(0, r'D:\Sanku\sahayak-web-main\sahayak-web-main\Indian-Standards-AI(1)\Indian-Standards-AI\src')

from retrieval.search_bis import get_relevant_results

# Test different LED-related queries
queries = [
    "LED bulb",
    "LED lamp",
    "LED light bulb",
    "general service LED lamp",
    "LED lighting",
]

for query in queries:
    print(f"\n{'='*80}")
    print(f"Query: '{query}'")
    print('='*80)
    
    results = get_relevant_results(query, top_k=10)
    print(f"Retrieved {len(results)} results")
    
    for i, r in enumerate(results[:5], 1):
        std_nums = r.get('standard_numbers', r.get('standard_number', 'Unknown'))
        title = r.get('document_title') or r.get('title') or 'Unknown'
        print(f"\n  {i}. Standard: {std_nums}")
        print(f"     Title: {title[:100]}")
