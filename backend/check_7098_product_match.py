import sys
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from retrieval.search_bis import get_relevant_results
from llm.standard_analysis import _build_candidates, _calculate_product_match_score

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
print("CHECKING PRODUCT MATCH SCORES FOR ALL CANDIDATES")
print("="*80)
print()

# Retrieve
results = get_relevant_results(query, top_k=10)
print(f"Retrieved {len(results)} results")
print()

# Add evidence_id and score to results (required by _build_candidates)
for i, result in enumerate(results):
    result['evidence_id'] = i + 1
    result['score'] = result.get('similarity', 0)

# Build candidates
candidates = _build_candidates(requirement, results)
print(f"Built {len(candidates)} candidates")
print()

# Print all candidates with their scores
print("ALL CANDIDATES WITH SCORES:")
print("-"*80)
for i, candidate in enumerate(candidates, 1):
    print(f"Candidate {i}:")
    print(f"  Standard: {candidate['standard_number']}")
    print(f"  Product Match Score: {candidate['product_match_score']}")
    print(f"  Retrieval Score: {candidate['best_score']}")
    print(f"  Product Term Coverage: {candidate['product_term_coverage']}")
    print(f"  Relevance Hint: {candidate['relevance_hint']}")
    print()

# Check if IS 7098 is in candidates
found_7098 = False
for candidate in candidates:
    if '7098' in candidate['standard_number']:
        print(f"[FOUND] IS 7098 in candidates: {candidate['standard_number']}")
        print(f"  Rank: {[i for i, c in enumerate(candidates, 1) if c['standard_number'] == candidate['standard_number']][0]}")
        print(f"  Product Match Score: {candidate['product_match_score']}")
        found_7098 = True

if not found_7098:
    print("[NOT FOUND] IS 7098 not in top candidates")
    print("This means it was filtered out or has a very low score")
