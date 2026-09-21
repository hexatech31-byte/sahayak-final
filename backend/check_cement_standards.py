import json

metadata_path = r'D:\Sanku\sahayak-web-main\sahayak-web-main\Indian-Standards-AI(1)\Indian-Standards-AI\data\vector_db\standards_metadata.json'

with open(metadata_path, 'r', encoding='utf-8') as f:
    metadata = json.load(f)

# Look for cement standards
cement_std_numbers = ['IS 269', 'IS 16415', 'IS 1489', 'IS 455', 'IS 3466', 'IS 8042', 'IS 8041', 'IS 4032', 'IS 16993']

print("Checking for cement standards in metadata...")
print()

for std_num in cement_std_numbers:
    found = False
    for m in metadata:
        std_nums = m.get('standard_numbers', m.get('standard_number', []))
        if isinstance(std_nums, list):
            if any(std_num in str(s) for s in std_nums):
                found = True
                source = m.get('source_pdf', 'Unknown')
                print(f"✓ {std_num} found in {source}")
                break
        elif std_num in str(std_nums):
            found = True
            source = m.get('source_pdf', 'Unknown')
            print(f"✓ {std_num} found in {source}")
            break
    
    if not found:
        print(f"✗ {std_num} NOT found in metadata")

print()

# Count how many entries from COMPENDIUM-OF-CEMENT-STANDARDS.pdf have standard numbers
cement_pdf_entries = [m for m in metadata if m.get('source_pdf') == 'COMPENDIUM-OF-CEMENT-STANDARDS.pdf']
print(f"Total entries from COMPENDIUM-OF-CEMENT-STANDARDS.pdf: {len(cement_pdf_entries)}")

with_std_nums = [m for m in cement_pdf_entries if m.get('standard_numbers')]
without_std_nums = [m for m in cement_pdf_entries if not m.get('standard_numbers')]

print(f"  With standard numbers: {len(with_std_nums)}")
print(f"  Without standard numbers: {len(without_std_nums)}")
print()

if without_std_nums:
    print("Sample entries without standard numbers:")
    for i, m in enumerate(without_std_nums[:5], 1):
        text = m.get('text', '')[:150]
        print(f"{i}. {text}")
