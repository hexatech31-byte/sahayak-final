import sys
import json
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from retrieval.search_bis import get_relevant_results
from llm.standard_analysis import analyze_standards

# Office Chair test case
requirement = {
    'title': 'Office Chair',
    'description': 'Procurement of office chairs for government offices.',
    'category': 'Furniture',
    'quantity': '200',
    'budget': '300000',
    'department': 'General Administration',
    'deadline': '20 Oct 2026',
    'intended_purpose': 'government offices',
    'application_environment': 'Office',
    'technical_requirements': []
}

query = f"{requirement['title']} {requirement['description']} {requirement.get('category', '')} {requirement.get('intended_purpose', '')} {requirement.get('application_environment', '')}"

print("=" * 80)
print("OFFICE CHAIR TEST - Debugging why it fails")
print("=" * 80)
print()

# Retrieval
print("RETRIEVING EVIDENCE...")
results = get_relevant_results(query, top_k=20)
print(f"Retrieved {len(results)} evidence chunks")
print()

# Check for any chair-related standards
print("CHECKING FOR CHAIR-RELATED STANDARDS...")
found_chair = False
for i, result in enumerate(results, 1):
    std_nums = result.get('standard_numbers', [])
    text = result.get('text', '').lower()
    for std_num in std_nums:
        if 'chair' in text or 'seat' in text or 'furniture' in text:
            print(f"[OK] Found chair-related in result {i}: {std_num}")
            print(f"  Similarity: {result.get('similarity', 0):.4f}")
            print(f"  Text preview: {text[:400]}...")
            found_chair = True

if not found_chair:
    print("[FAIL] No chair-related standards found in retrieved results")
    print("  This is a dataset coverage issue - no chair standards in BIS compendium")
print()

# Analysis
print("ANALYZING WITH QWEN...")
analysis = analyze_standards(requirement, results)
print()

# Output results
print("PRIMARY STANDARD:")
primary = analysis.get('primary_standard')
if primary and isinstance(primary, dict):
    std_num = primary.get('standard_number', 'None')
    print(f"  {std_num}")
else:
    print("  None")
print()

print("APPLICABILITY:")
print(f"  {analysis.get('applicability', 'Unknown')}")
print()

print("CONFIDENCE:")
print(f"  {analysis.get('match_confidence', 0)}")
print()
