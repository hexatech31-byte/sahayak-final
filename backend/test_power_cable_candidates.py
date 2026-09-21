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

# Test Power Cable
req = {
    'title': 'Power Cable',
    'description': 'Procurement of power cables for an industrial electrical installation.',
    'category': 'Electrical Equipment',
    'quantity': '500 Meters',
    'budget': '₹ 5,00,000',
    'department': 'Electrical Engineering Dept',
    'deadline': '30 Sep 2026',
    'intended_purpose': 'industrial electrical installation',
    'application_environment': 'Industrial',
    'technical_requirements': []
}

query = 'Power Cable Procurement of power cables for an industrial electrical installation. Electrical Equipment Industrial'

print("Testing Power Cable candidate building...")
print(f"Query: {query}")
print()

results = get_relevant_results(query, top_k=10)
print(f"Retrieved {len(results)} results")
print()

# Convert to evidence package format
evidence_package = []
for i, r in enumerate(results):
    evidence_package.append({
        'evidence_id': i,
        'text': r.get('text', ''),
        'source_pdf': r.get('source_pdf', ''),
        'score': r.get('similarity', 0)
    })

print("Building candidates...")
candidates = _build_candidates(req, evidence_package)

print(f"Built {len(candidates)} candidates")
print()

for i, c in enumerate(candidates, 1):
    print(f"Candidate {i}:")
    print(f"  Standard: {c['standard_number']}")
    print(f"  Title: {c['title'][:80] if c['title'] else 'None'}")
    print(f"  Product term coverage: {c['product_term_coverage']:.2f}")
    print(f"  Product match score: {c.get('product_match_score', 0):.2f}")
    print(f"  Best score: {c['best_score']:.4f}")
    print(f"  Relevance hint: {c['relevance_hint']}")
    print(f"  Evidence IDs: {c['evidence_ids']}")
    print(f"  Evidence excerpt: {c['evidence_excerpts'][0][:200] if c['evidence_excerpts'] else 'None'}")
    print()
