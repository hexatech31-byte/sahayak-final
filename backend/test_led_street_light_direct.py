import sys
import time
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from retrieval.search_bis import get_relevant_results
from llm.standard_analysis import analyze_standards

req = {
    'title': 'LED Street Light',
    'description': 'Procurement of LED street lights for municipal road lighting infrastructure.',
    'category': 'Electrical',
    'quantity': '500',
    'budget': '2500000',
    'department': 'Municipal Corporation',
    'deadline': '15 Nov 2026',
    'intended_purpose': 'municipal road lighting',
    'application_environment': 'Outdoor / municipal',
    'technical_requirements': []
}

query = 'LED Street Light Procurement of LED street lights for municipal road lighting infrastructure. Electrical street lighting Outdoor / municipal'

print("="*80)
print("LED STREET LIGHT DIRECT TEST")
print("="*80)
print()

start = time.time()
try:
    results = get_relevant_results(query, top_k=10)
    print(f"Retrieved {len(results)} results")
    print()

    analysis = analyze_standards(req, results)
    elapsed = time.time() - start
    
    print(f"✓ Success in {elapsed:.4f}s")
    print(f"Applicability: {analysis.get('applicability')}")
    print(f"Primary Standard: {analysis.get('primary_standard', {}).get('standard_number') if analysis.get('primary_standard') else None}")
    print(f"Confidence: {analysis.get('match_confidence')}")
    print(f"Why: {analysis.get('why_this_standard', '')[:200]}")
    
except Exception as e:
    elapsed = time.time() - start
    print(f"✗ Failed in {elapsed:.4f}s: {e}")
    import traceback
    traceback.print_exc()
