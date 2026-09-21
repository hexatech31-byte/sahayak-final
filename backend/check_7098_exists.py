import sys
import json
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

# Load metadata
VECTOR_DB_DIR = INDIAN_STANDARDS_AI_DIR / "data" / "vector_db"
METADATA_FILE = VECTOR_DB_DIR / "standards_metadata.json"

print("="*80)
print("CHECKING FOR IS 7098 IN METADATA")
print("="*80)
print()

with open(METADATA_FILE, 'r', encoding='utf-8') as f:
    metadata = json.load(f)

print(f"Total chunks in metadata: {len(metadata)}")
print()

# Search for IS 7098
found_7098 = []
for i, chunk in enumerate(metadata):
    std_nums = chunk.get('standard_numbers', [])
    text = chunk.get('text', '').lower()
    title = chunk.get('document_title', '') or ''
    
    for std_num in std_nums:
        if '7098' in str(std_num):
            found_7098.append({
                'index': i,
                'standard_number': std_num,
                'title': title,
                'text_preview': text[:300]
            })

print(f"Found {len(found_7098)} chunks containing IS 7098")
print()

if found_7098:
    for item in found_7098[:5]:
        print(f"Index: {item['index']}")
        print(f"Standard: {item['standard_number']}")
        print(f"Title: {item['title'][:100]}")
        print(f"Text: {item['text_preview']}...")
        print()
else:
    print("IS 7098 NOT FOUND in metadata")
    print("This is a data coverage issue - the standard is not in the dataset")
