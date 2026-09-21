import sys
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from retrieval.search_bis import get_relevant_results
from llm.standard_analysis import analyze_standards

# Intentionally unsupported product
requirement = {
    'title': 'Quantum Computer',
    'description': 'Procurement of quantum computing systems for advanced research.',
    'category': 'Advanced Technology',
    'quantity': '1',
    'budget': '50000000',
    'department': 'Research and Development',
    'deadline': '15 Nov 2026',
    'intended_purpose': 'advanced research',
    'application_environment': 'Laboratory',
    'technical_requirements': []
}

query = f"{requirement['title']} {requirement['description']} {requirement.get('category', '')} {requirement.get('intended_purpose', '')} {requirement.get('application_environment', '')}"

print("=" * 80)
print("V8: NEGATIVE CASE TEST - Quantum Computer (Unsupported)")
print("=" * 80)
print()

# Retrieval
print("STEP 1: RETRIEVAL")
print("-" * 80)
results = get_relevant_results(query, top_k=20)
print(f"Retrieved {len(results)} evidence chunks")
print()

# Analysis
print("STEP 2: ANALYSIS")
print("-" * 80)
analysis = analyze_standards(requirement, results)
print()

# Verify expected outcome
print("STEP 3: VERIFICATION")
print("-" * 80)
applicability = analysis.get('applicability', 'Unknown')
primary = analysis.get('primary_standard')
confidence = analysis.get('match_confidence', 0)

print(f"Applicability: {applicability}")
print(f"Primary Standard: {primary}")
print(f"Confidence: {confidence}")
print()

if applicability == "Not Established" and primary is None and confidence == 0:
    print("[PASS] Negative case handled correctly - no hallucination")
else:
    print("[FAIL] Negative case not handled correctly")
    print(f"  Expected: Not Established, None, 0")
    print(f"  Got: {applicability}, {primary}, {confidence}")
print()
