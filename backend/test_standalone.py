import sys
import json
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

print(f"INDIAN_STANDARDS_AI_DIR: {INDIAN_STANDARDS_AI_DIR}")
print(f"Directory exists: {INDIAN_STANDARDS_AI_DIR.exists()}")
print()

# Test imports
print("Testing imports...")
try:
    from retrieval.search_bis import get_relevant_results
    print(f"✓ get_relevant_results imported: {type(get_relevant_results)}")
    print(f"  Callable: {callable(get_relevant_results)}")
except Exception as e:
    print(f"✗ Failed to import get_relevant_results: {e}")

try:
    from llm.standard_analysis import analyze_standards
    print(f"✓ analyze_standards imported: {type(analyze_standards)}")
    print(f"  Callable: {callable(analyze_standards)}")
except Exception as e:
    print(f"✗ Failed to import analyze_standards: {e}")

print()

# Test with a simple requirement
print("Testing standalone analysis...")
req = {
    'title': 'Cotton Yoga Mat',
    'description': 'Procurement of cotton yoga mats for fitness centers',
    'category': 'Sports Equipment',
    'quantity': '100 Units',
    'budget': '₹ 50,000',
    'department': 'Sports Authority',
    'deadline': '30 Sep 2026',
    'intended_purpose': 'fitness centers',
    'application_environment': 'Indoor',
    'technical_requirements': []
}

query = 'Cotton Yoga Mat Procurement of cotton yoga mats for fitness centers Sports Equipment Indoor'

try:
    print(f"Calling get_relevant_results...")
    results = get_relevant_results(query, top_k=10)
    print(f"✓ Retrieved {len(results)} results")
    
    print(f"Calling analyze_standards...")
    analysis = analyze_standards(req, results)
    print(f"✓ Analysis completed")
    print(f"  Applicability: {analysis.get('applicability')}")
    print(f"  Primary Standard: {analysis.get('primary_standard', {}).get('standard_number') if analysis.get('primary_standard') else None}")
    print(f"  Confidence: {analysis.get('match_confidence')}")
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
