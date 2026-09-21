import sys
import json
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from retrieval.search_bis import get_relevant_results
from llm.standard_analysis import _build_candidates

req = {
    'title': 'Portland Cement',
    'description': 'Procurement of Portland cement for construction of government buildings.',
    'category': 'Construction Materials',
    'quantity': '500',
    'budget': '250000',
    'department': 'Public Works Department',
    'deadline': '30 Sep 2026',
    'intended_purpose': 'construction of government buildings',
    'application_environment': 'Construction',
    'technical_requirements': []
}

query = f"{req['title']} {req['description']} {req.get('category', '')} {req.get('intended_purpose', '')} {req.get('application_environment', '')}"

print("TEST: Portland Cement - Candidate Building Debug")
print("="*80)
print(f"Query: {query}")
print()

results = get_relevant_results(query, top_k=10)

# Add evidence_id to results
for i, r in enumerate(results, 1):
    r["evidence_id"] = i
    r["score"] = r.get("similarity", 0)

candidates = _build_candidates(req, results)

print(f"Total candidates built: {len(candidates)}")
print()

# Look for cement-specific candidates
cement_keywords = ['cement', 'portland', 'opc', 'ppc']
cement_candidates = []

for i, candidate in enumerate(candidates, 1):
    std_num = candidate.get('standard_number', '')
    title = candidate.get('title', '').lower()
    excerpts = " ".join(candidate.get('evidence_excerpts', [])).lower()
    
    is_cement = any(keyword in std_num.lower() or keyword in title or keyword in excerpts for keyword in cement_keywords)
    
    print(f"Candidate {i}:")
    print(f"  Standard: {std_num}")
    print(f"  Title: {candidate.get('title', 'N/A')}")
    print(f"  Product Match Score: {candidate.get('product_match_score', 0):.2f}")
    print(f"  Retrieval Score: {candidate.get('best_score', 0):.4f}")
    print(f"  Is cement-related: {is_cement}")
    if is_cement:
        cement_candidates.append((i, std_num, candidate.get('product_match_score', 0)))
    print()

print(f"Total cement-related candidates: {len(cement_candidates)}")
print()
print("Cement candidates sorted by product_match_score:")
cement_candidates.sort(key=lambda x: x[2], reverse=True)
for idx, std_num, score in cement_candidates:
    print(f"  Candidate {idx}: {std_num} (score: {score:.2f})")
