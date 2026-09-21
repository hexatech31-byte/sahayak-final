import sys
import json
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from retrieval.search_bis import get_relevant_results
from llm.standard_analysis import analyze_standards, _build_candidates

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

print("=" * 80)
print("V2: POWER CABLE END-TO-END VERIFICATION")
print("=" * 80)
print()

# Retrieval
print("STEP 1: RETRIEVAL")
print("-" * 80)
results = get_relevant_results(query, top_k=20)
print(f"Retrieved {len(results)} evidence chunks")
print()

# Find IS 7098 Part 1 in raw retrieval
print("STEP 2: RAW RETRIEVED CHUNK CONTAINING IS 7098 PART 1")
print("-" * 80)
for i, result in enumerate(results, 1):
    std_nums = result.get('standard_numbers', [])
    text = result.get('text', '')
    for std_num in std_nums:
        if '7098' in str(std_num) and 'part 1' in str(std_num).lower():
            print(f"Found at rank {i}: {std_num}")
            print(f"Source PDF: {result.get('source_pdf', 'Unknown')}")
            print(f"Similarity: {result.get('similarity', 0):.4f}")
            print(f"\nRAW CHUNK TEXT:")
            print(text[:800])
            print()
            raw_7098_chunk = result
            break
print()

# Build candidates
print("STEP 3: CANDIDATE BUILDING")
print("-" * 80)
# Prepare evidence package for _build_candidates
evidence_package = []
for i, result in enumerate(results[:20], 1):
    evidence_package.append({
        "evidence_id": i,
        "source_pdf": result.get('source_pdf', 'Unknown'),
        "standard_numbers": result.get('standard_numbers', []),
        "text": result.get('text', ''),
        "score": result.get('similarity', 0)
    })

candidates = _build_candidates(requirement, evidence_package)
print(f"Built {len(candidates)} candidates")
print()

# Find IS 7098 Part 1 candidate
print("STEP 4: ISOLATED EVIDENCE FOR IS 7098 (PART 1):1988")
print("-" * 80)
for candidate in candidates:
    if '7098' in candidate['standard_number'] and 'part 1' in candidate['standard_number'].lower():
        print("CANDIDATE OBJECT:")
        print(json.dumps(candidate, indent=2, default=str))
        print()
        print(f"Standard Number: {candidate['standard_number']}")
        print(f"Title: {candidate['title']}")
        print(f"Product Match Score: {candidate['product_match_score']}")
        print(f"Retrieval Score: {candidate['best_score']}")
        print(f"Relevance Hint: {candidate.get('relevance_hint', 'N/A')}")
        print(f"Evidence IDs: {candidate['evidence_ids']}")
        print(f"Source PDFs: {candidate['source_pdfs']}")
        print(f"\nISOLATED EVIDENCE EXCERPTS:")
        for i, excerpt in enumerate(candidate['evidence_excerpts'], 1):
            print(f"Excerpt {i}: {excerpt[:400]}...")
        print()
        break
else:
    print("IS 7098 Part 1 NOT found in candidates!")
print()

# Full analysis
print("STEP 5: FULL QWEN ANALYSIS")
print("-" * 80)
analysis = analyze_standards(requirement, results)
print()

print("FINAL QWEN JSON:")
print(json.dumps(analysis, indent=2, ensure_ascii=False))
print()
