import sys
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from retrieval.search_bis import get_relevant_results
from llm.standard_analysis import _build_candidates, _calculate_product_match_score

req = {
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

query = 'LED Bulb Procurement of LED bulbs for general lighting applications in government offices. Electrical general lighting Indoor / office'

print("Testing product_match_score calculation...")
print()

results = get_relevant_results(query, top_k=10)

# Build evidence package
evidence_package = []
for i, item in enumerate(results, start=1):
    evidence_package.append({
        'evidence_id': i,
        'source_pdf': item.get('source_pdf', ''),
        'score': item.get('similarity', 0),
        'text': item.get('text', '')
    })

print(f"Evidence package size: {len(evidence_package)}")
print()

# Build candidates (note: _build_candidates takes requirement first, then evidence_package)
candidates = _build_candidates(req, evidence_package)

print(f"Candidates built: {len(candidates)}")
print()

for i, c in enumerate(candidates[:3], 1):
    print(f"Candidate {i}:")
    print(f"  Standard: {c['standard_number']}")
    print(f"  product_match_score: {c['product_match_score']}")
    print(f"  best_score: {c['best_score']}")
    print(f"  evidence_excerpts count: {len(c['evidence_excerpts'])}")
    
    # Test product_match_score calculation manually
    if c['evidence_excerpts']:
        evidence_text = " ".join(c['evidence_excerpts'])
        manual_score = _calculate_product_match_score(req, evidence_text)
        print(f"  Manual product_match_score: {manual_score}")
    print()
