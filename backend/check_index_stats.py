import json
from pathlib import Path

# Check FAISS index and metadata statistics
METADATA_FILE = Path(r"D:\Sanku\sahayak-web-main\sahayak-web-main\Indian-Standards-AI(1)\Indian-Standards-AI\data\vector_db\standards_metadata.json")
INDEX_FILE = Path(r"D:\Sanku\sahayak-web-main\sahayak-web-main\Indian-Standards-AI(1)\Indian-Standards-AI\data\vector_db\standards.index")

print("=" * 80)
print("V11: DATASET STATISTICS VERIFICATION")
print("=" * 80)
print()

# Load metadata
with open(METADATA_FILE, 'r', encoding='utf-8') as f:
    metadata = json.load(f)

print(f"Total indexed chunks: {len(metadata)}")
print()

# Count unique source PDFs
source_pdfs = set()
for entry in metadata:
    source_pdfs.add(entry.get('source_pdf', 'Unknown'))

print(f"Unique source PDFs: {len(source_pdfs)}")
print()

# Count unique standards
all_standards = set()
for entry in metadata:
    std_nums = entry.get('standard_numbers', [])
    if isinstance(std_nums, list):
        for std_num in std_nums:
            if std_num:
                all_standards.add(std_num)

print(f"Unique standard numbers: {len(all_standards)}")
print()

# FAISS index size
if INDEX_FILE.exists():
    index_size_mb = INDEX_FILE.stat().st_size / (1024 * 1024)
    print(f"FAISS index file size: {index_size_mb:.2f} MB")
else:
    print("FAISS index file not found")
print()

# Sample of source PDFs
print("Sample source PDFs:")
for i, pdf in enumerate(sorted(source_pdfs)[:10], 1):
    print(f"  {i}. {pdf}")
print()

# Check metadata/index consistency
print("Metadata/Index Consistency Check:")
print(f"  Metadata entries: {len(metadata)}")
print(f"  All entries have 'text' field: {all('text' in entry for entry in metadata)}")
print(f"  All entries have 'standard_numbers' field: {all('standard_numbers' in entry for entry in metadata)}")
print()
