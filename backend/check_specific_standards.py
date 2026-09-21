import json
from pathlib import Path

METADATA_FILE = Path(r"D:\Sanku\sahayak-web-main\sahayak-web-main\Indian-Standards-AI(1)\Indian-Standards-AI\data\vector_db\standards_metadata.json")

with open(METADATA_FILE, 'r', encoding='utf-8') as f:
    metadata = json.load(f)

print("=" * 80)
print("V7: SPECIFIC STANDARD SEARCH FOR FAILING PRODUCTS")
print("=" * 80)
print()

# Check for office furniture/chair standards
print("OFFICE CHAIR - searching for office furniture standards")
print("-" * 80)
found_office_furniture = []
for entry in metadata:
    std_nums = entry.get('standard_numbers', [])
    text = entry.get('text', '').lower()
    # Look for office furniture or chair specifications
    if any('office' in text and 'furniture' in text for text in [text]):
        found_office_furniture.append({
            'standards': std_nums,
            'text': text[:300],
            'source': entry.get('source_pdf', 'Unknown')
        })

if found_office_furniture:
    print(f"FOUND {len(found_office_furniture)} office furniture entries")
    for f in found_office_furniture[:3]:
        print(f"  Standards: {f['standards']}")
        print(f"  Text: {f['text']}...")
else:
    print("NOT FOUND: No office furniture standards")
print()

# Check for safety helmet standards
print("SAFETY HELMET - searching for head protection/helmet standards")
print("-" * 80)
found_helmet = []
for entry in metadata:
    std_nums = entry.get('standard_numbers', [])
    text = entry.get('text', '').lower()
    # Look for head protection or safety helmet specifications
    if any(word in text for word in ['head protection', 'safety helmet', 'industrial helmet', 'protective helmet']):
        found_helmet.append({
            'standards': std_nums,
            'text': text[:300],
            'source': entry.get('source_pdf', 'Unknown')
        })

if found_helmet:
    print(f"FOUND {len(found_helmet)} helmet entries")
    for f in found_helmet[:3]:
        print(f"  Standards: {f['standards']}")
        print(f"  Text: {f['text']}...")
else:
    print("NOT FOUND: No safety helmet standards")
print()

# Check for electric motor standards specifically
print("ELECTRIC MOTOR - searching for motor specifications")
print("-" * 80)
found_motor = []
for entry in metadata:
    std_nums = entry.get('standard_numbers', [])
    text = entry.get('text', '').lower()
    # Look for electric motor specifications
    if any(word in text for word in ['electric motor specification', 'motor specification', 'rotating electrical']):
        found_motor.append({
            'standards': std_nums,
            'text': text[:300],
            'source': entry.get('source_pdf', 'Unknown')
        })

if found_motor:
    print(f"FOUND {len(found_motor)} motor specification entries")
    for f in found_motor[:5]:
        print(f"  Standards: {f['standards']}")
        print(f"  Text: {f['text']}...")
else:
    print("NOT FOUND: No electric motor specification entries")
print()
