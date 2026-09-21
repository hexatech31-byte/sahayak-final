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
print("POWER CABLE TEST - Checking for IS 7098 Part 1")
print("=" * 80)
print()

# Retrieval
print("RETRIEVING EVIDENCE...")
results = get_relevant_results(query, top_k=50)
print(f"Retrieved {len(results)} evidence chunks")
print()

# Check if IS 7098 is in retrieved results
print("CHECKING FOR IS 7098 IN RETRIEVED RESULTS...")
found_7098 = False
for i, result in enumerate(results, 1):
    std_nums = result.get('standard_numbers', [])
    text = result.get('text', '')
    for std_num in std_nums:
        if '7098' in str(std_num):
            print(f"[OK] Found IS 7098 in result {i}: {std_num}")
            print(f"  Similarity: {result.get('similarity', 0):.4f}")
            print(f"  Text preview: {text[:400]}...")
            found_7098 = True

if not found_7098:
    print("[FAIL] IS 7098 NOT found in retrieved results")
    print("  This is the root cause - retrieval is not finding the correct standard")
else:
    print(f"\n[OK] IS 7098 found at rank {i} out of {len(results)}")
print()

# Analysis
print("ANALYZING WITH QWEN...")
print("Checking if IS 7098 Part 1 is in candidates sent to Qwen...")
print()

analysis = analyze_standards(requirement, results)
print()

# Output results
print("PRIMARY STANDARD:")
primary = analysis.get('primary_standard')
if primary and isinstance(primary, dict):
    std_num = primary.get('standard_number', 'None')
    print(f"  {std_num}")
    if '7098' in str(std_num):
        print("  ✓ IS 7098 identified correctly!")
    else:
        print(f"  ✗ Expected IS 7098, got {std_num}")
else:
    print("  None")
print()

print("APPLICABILITY:")
print(f"  {analysis.get('applicability', 'Unknown')}")
print()

print("CONFIDENCE:")
print(f"  {analysis.get('match_confidence', 0)}")
print()

print("COMPLETE FINAL QWEN JSON:")
print(json.dumps(analysis, indent=2, ensure_ascii=False))
print()
