import json
from pathlib import Path

# Check if IS 7098 is in the metadata
METADATA_FILE = Path(r"D:\Sanku\sahayak-web-main\sahayak-web-main\Indian-Standards-AI(1)\Indian-Standards-AI\data\vector_db\standards_metadata.json")

with open(METADATA_FILE, 'r', encoding='utf-8') as f:
    metadata = json.load(f)

print("Searching for IS 7098 in metadata...")
print()

found_7098 = []
for i, entry in enumerate(metadata):
    std_nums = entry.get('standard_numbers', entry.get('standard_number', []))
    if isinstance(std_nums, list):
        for std_num in std_nums:
            if '7098' in str(std_num):
                found_7098.append({
                    'index': i,
                    'standard_number': std_num,
                    'source_pdf': entry.get('source_pdf', 'Unknown'),
                    'text_preview': entry.get('text', '')[:300]
                })
    elif '7098' in str(std_nums):
        found_7098.append({
            'index': i,
            'standard_number': std_nums,
            'source_pdf': entry.get('source_pdf', 'Unknown'),
            'text_preview': entry.get('text', '')[:300]
        })

if found_7098:
    print(f"Found {len(found_7098)} entries with IS 7098:")
    for entry in found_7098:
        print(f"\n  Index: {entry['index']}")
        print(f"  Standard: {entry['standard_number']}")
        print(f"  Source PDF: {entry['source_pdf']}")
        print(f"  Text preview: {entry['text_preview']}...")
else:
    print("✗ IS 7098 NOT found in metadata")
    print("  This is the root cause - the standard is not in the dataset")
