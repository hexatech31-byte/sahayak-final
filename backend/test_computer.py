import sys
import json

sys.path.insert(0, r'D:\Sanku\sahayak-web-main\sahayak-web-main\Indian-Standards-AI(1)\Indian-Standards-AI')
sys.path.insert(0, r'D:\Sanku\sahayak-web-main\sahayak-web-main\Indian-Standards-AI(1)\Indian-Standards-AI\src')

from retrieval.search_bis import get_relevant_results
from llm.standard_analysis import analyze_standards

# Test with consistent computer data
req = {
    'title': 'Desktop Computers',
    'description': 'Procurement of desktop computers for government offices with minimum 8GB RAM, 512GB SSD, Windows 11 and 3 years warranty.',
    'category': 'IT Hardware',
    'quantity': '85 Units',
    'budget': '₹ 45,00,000',
    'department': 'Central Public Works Dept (CPWD)',
    'deadline': '30 Sep 2026',
    'intended_purpose': 'government offices',
    'application_environment': 'Indoor office',
    'technical_requirements': []
}

query = 'Desktop Computers Procurement of desktop computers for government offices with minimum 8GB RAM, 512GB SSD, Windows 11 and 3 years warranty. IT Hardware government offices Indoor office'

print("Testing Desktop Computers (consistent data)...")
print(f"Query: {query}")
print()

results = get_relevant_results(query, top_k=10)
print(f"Retrieved {len(results)} results")
print()

for i, r in enumerate(results[:5], 1):
    std_nums = r.get('standard_numbers', r.get('standard_number', 'Unknown'))
    print(f"Result {i}:")
    print(f"  Standard: {std_nums}")
    title = r.get('document_title') or r.get('title') or 'Unknown'
    print(f"  Title: {title[:100] if title else 'Unknown'}")
    print(f"  Similarity: {r.get('similarity', 0):.4f}")
    text = r.get('text', 'Unknown')
    print(f"  Text: {text[:200] if text else 'Unknown'}")
    print()

print("="*80)
print("Running analysis...")
print("="*80)

analysis = analyze_standards(req, results)

print(f"Applicability: {analysis.get('applicability')}")
print(f"Primary Standard: {analysis.get('primary_standard', {}).get('standard_number') if analysis.get('primary_standard') else None}")
print(f"Confidence: {analysis.get('match_confidence')}")
print(f"Why: {analysis.get('why_this_standard', '')[:300]}")
