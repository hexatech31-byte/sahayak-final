import sys
import json
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

# Load metadata
metadata_path = INDIAN_STANDARDS_AI_DIR / "data" / "vector_db" / "standards_metadata.json"

with open(metadata_path, 'r', encoding='utf-8') as f:
    metadata = json.load(f)

# Search for specific product terms
products_to_check = [
    "cotton yoga mat",
    "yoga mat",
    "power cable",
    "cable",
    "street light",
    "led street light",
    "office chair",
    "chair"
]

print("="*80)
print("CHECKING STANDARDS COVERAGE FOR PRODUCTS")
print("="*80)
print()

for product in products_to_check:
    print(f"PRODUCT: {product.upper()}")
    print("-"*80)
    
    found = []
    for chunk in metadata:
        text = chunk.get('text', '').lower()
        title = chunk.get('document_title', '') or ''
        title = title.lower()
        
        # Check if product term appears in text or title
        if product.lower() in text or product.lower() in title:
            std_nums = chunk.get('standard_numbers', [])
            if std_nums:
                for std in std_nums:
                    if std not in found:
                        found.append(std)
                        # Get a snippet of context
                        snippet = text[:200] if product.lower() in text else title[:200]
                        print(f"  Standard: {std}")
                        print(f"  Context: {snippet}...")
                        print()
    
    if not found:
        print(f"  NO STANDARDS FOUND")
    print()
    print("="*80)
    print()
