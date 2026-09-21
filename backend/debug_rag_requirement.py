import sys
import time
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))
sys.path.insert(0, str(BASE_DIR / "backend"))

from services.rag_service import rag_service

req = {
    'title': 'LED Bulb',
    'description': 'Procurement of LED bulbs for general lighting applications in government offices.',
    'category': 'Electrical',
    'quantity': '1000 Units',
    'budget': '₹ 5,00,000',
    'department': 'Public Works Department',
    'deadline': '15 Oct 2026',
    'intended_purpose': 'general lighting',
    'application_environment': 'Indoor / office',
    'technical_requirements': []
}

print("Testing LED Bulb through RAG service...")
print(f"Requirement: {req}")
print(f"Requirement type: {type(req)}")
print()

start = time.time()
try:
    result = rag_service.analyze_standards(req)
    elapsed = time.time() - start
    print(f"✓ Success in {elapsed:.4f}s")
    print(f"Applicability: {result.get('applicability')}")
    print(f"Primary Standard: {result.get('primary_standard', {}).get('standard_number') if result.get('primary_standard') else None}")
    print(f"Confidence: {result.get('match_confidence')}")
except Exception as e:
    elapsed = time.time() - start
    print(f"✗ Failed in {elapsed:.4f}s: {e}")
    import traceback
    traceback.print_exc()
