import sys
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from retrieval.search_bis import get_relevant_results

# Power Cable test case
requirement = {
    'title': 'Power Cable',
    'description': 'Procurement of power cables for industrial electrical installation.',
    'category': 'Electrical',
    'quantity': '500',
    'budget': '400000',
    'department': 'Electrical Engineering',
    'deadline': '10 Dec 2026',
    'intended_purpose': 'industrial electrical installation',
    'application_environment': 'Industrial',
    'technical_requirements': []
}

query = f"{requirement['title']} {requirement['description']} {requirement.get('category', '')} {requirement.get('intended_purpose', '')} {requirement.get('application_environment', '')}"

print("="*80)
print("CHECKING IS 7098 RANKING IN RETRIEVAL RESULTS")
print("="*80)
print()
print(f"Query: {query}")
print()

# Retrieve with top_k=50 to see where IS 7098 ranks
results = get_relevant_results(query, top_k=50)
print(f"Retrieved {len(results)} results")
print()

# Find IS 7098 rank
found_7098 = False
for i, result in enumerate(results, 1):
    std_nums = result.get('standard_numbers', [])
    for std_num in std_nums:
        if '7098' in str(std_num):
            print(f"[FOUND] IS 7098 at rank {i}")
            print(f"  Standard: {std_num}")
            print(f"  Similarity: {result.get('similarity', 0):.4f}")
            print(f"  Text: {result.get('text', '')[:300]}...")
            found_7098 = True
            break
    if found_7098:
        break

if not found_7098:
    print("[NOT FOUND] IS 7098 not in top 50 results")
    print("This is a retrieval/ranking issue")
else:
    print()
    print(f"[INFO] IS 7098 is at rank {i}, but only top 10 are sent to Qwen")
    print(f"[INFO] Current candidate limit is 3, so IS 7098 is not being analyzed")
