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

# Portland Cement test case
requirement = {
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

query = f"{requirement['title']} {requirement['description']} {requirement.get('category', '')} {requirement.get('intended_purpose', '')} {requirement.get('application_environment', '')}"

print("=" * 80)
print("PORTLAND CEMENT TEST - Debugging why it now fails")
print("=" * 80)
print()

# Retrieval
print("RETRIEVING EVIDENCE...")
results = get_relevant_results(query, top_k=20)
print(f"Retrieved {len(results)} evidence chunks")
print()

# Check for IS 269
print("CHECKING FOR IS 269 IN RETRIEVED RESULTS...")
found_269 = False
for i, result in enumerate(results, 1):
    std_nums = result.get('standard_numbers', [])
    text = result.get('text', '')
    for std_num in std_nums:
        if '269' in str(std_num):
            print(f"[OK] Found IS 269 in result {i}: {std_num}")
            print(f"  Similarity: {result.get('similarity', 0):.4f}")
            print(f"  Text preview: {text[:400]}...")
            found_269 = True

if not found_269:
    print("[FAIL] IS 269 NOT found in retrieved results")
else:
    print(f"\n[OK] IS 269 found at rank {i} out of {len(results)}")
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
    if '269' in str(std_num):
        print("  [OK] IS 269 identified correctly!")
    else:
        print(f"  [FAIL] Expected IS 269, got {std_num}")
else:
    print("  None")
print()

print("APPLICABILITY:")
print(f"  {analysis.get('applicability', 'Unknown')}")
print()

print("CONFIDENCE:")
print(f"  {analysis.get('match_confidence', 0)}")
print()
