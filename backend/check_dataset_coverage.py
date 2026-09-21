import json
from pathlib import Path

# Check dataset coverage for failing products
METADATA_FILE = Path(r"D:\Sanku\sahayak-web-main\sahayak-web-main\Indian-Standards-AI(1)\Indian-Standards-AI\data\vector_db\standards_metadata.json")

with open(METADATA_FILE, 'r', encoding='utf-8') as f:
    metadata = json.load(f)

print("=" * 80)
print("V7: DATASET COVERAGE VERIFICATION FOR FAILING PRODUCTS")
print("=" * 80)
print()

products_to_check = [
    ("Office Chair", ["chair", "seat", "furniture", "office"]),
    ("Safety Helmet", ["helmet", "safety", "head", "protective"]),
    ("Electric Motor", ["motor", "electric", "machine", "rotating"])
]

for product_name, keywords in products_to_check:
    print(f"PRODUCT: {product_name}")
    print("-" * 80)
    
    found_entries = []
    for i, entry in enumerate(metadata):
        text = entry.get('text', '').lower()
        std_nums = entry.get('standard_numbers', [])
        
        # Check if any keyword appears in text
        if any(keyword in text for keyword in keywords):
            found_entries.append({
                'index': i,
                'standard_numbers': std_nums,
                'source_pdf': entry.get('source_pdf', 'Unknown'),
                'text_preview': text[:200]
            })
    
    if found_entries:
        print(f"FOUND: {len(found_entries)} entries containing relevant keywords")
        print("Sample entries:")
        for entry in found_entries[:3]:
            print(f"  Standards: {entry['standard_numbers']}")
            print(f"  Source: {entry['source_pdf']}")
            print(f"  Text: {entry['text_preview']}...")
            print()
    else:
        print(f"NOT FOUND: No entries containing relevant keywords")
        print("  This is a genuine dataset coverage limitation")
    print()
