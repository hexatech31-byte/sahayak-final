import sys
import json
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from retrieval.search_bis import get_relevant_results

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

print("Testing Power Cable retrieval...")
print(f"Query: {query}")
print()

results = get_relevant_results(query, top_k=10)
print(f"Retrieved {len(results)} results")
print()

for i, r in enumerate(results[:10], 1):
    std_nums = r.get('standard_numbers', r.get('standard_number', 'Unknown'))
    print(f"Result {i}:")
    print(f"  Standard: {std_nums}")
    title = r.get('document_title') or r.get('title') or 'Unknown'
    print(f"  Title: {str(title)[:80]}")
    print(f"  Similarity: {r.get('similarity', 0):.4f}")
    text = r.get('text', '')
    print(f"  Text: {text[:400]}")
    print()
