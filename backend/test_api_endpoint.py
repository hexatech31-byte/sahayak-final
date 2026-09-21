import sys
import time
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))
sys.path.insert(0, str(BASE_DIR / "backend"))

from services.qwen_service import qwen_service

print("=" * 80)
print("U9: ACTUAL APPLICATION API ENDPOINT BENCHMARK")
print("=" * 80)
print()

test_cases = [
    ("Cotton Yoga Mat", "Procurement of 100 cotton yoga mats for yoga facilities."),
    ("LED Street Light", "500 energy-efficient LED street lights for municipal roads."),
    ("Power Cable", "Procurement of power cables for industrial electrical installation."),
    ("Office Chair", "Procurement of ergonomic office chairs for government offices."),
    ("Fire-resistant Cable", "Need 200 fire-resistant electrical cables."),
]

print("Running 5 consecutive requests through actual application path...")
print()

for i, (title, description) in enumerate(test_cases, 1):
    print(f"Request {i}: {title}")
    print("-" * 80)
    
    start = time.time()
    try:
        result = qwen_service.understand_requirement(
            title=title,
            description=description,
            category="",
            quantity="",
            budget="",
            department="",
            deadline=""
        )
        elapsed = time.time() - start
        print(f"✓ Success in {elapsed:.4f}s")
        print(f"  Product: {result.get('product')}")
        print(f"  Category: {result.get('category')}")
        print(f"  Quantity: {result.get('quantity')}")
    except Exception as e:
        elapsed = time.time() - start
        print(f"✗ Failed in {elapsed:.4f}s: {e}")
    print()

print("=" * 80)
