import json

data = json.load(open('D:/Sanku/sahayak-web-main/sahayak-web-main/Indian-Standards-AI(1)/Indian-Standards-AI/data/vector_db/standards_metadata.json', encoding='utf-8'))

# Find LED-related standards
led_standards = []
for chunk in data:
    std_nums = chunk.get('standard_numbers', [])
    text = chunk.get('text', '').lower()
    title = chunk.get('document_title') or ''
    
    # Check if chunk contains LED-related content
    if 'led' in text or 'led' in title.lower():
        if std_nums:  # Only if it has standard numbers
            led_standards.append({
                'standard_numbers': std_nums,
                'title': title,
                'text_preview': text[:200]
            })

print(f"Found {len(led_standards)} chunks with LED content AND standard numbers")
print()

# Group by standard number
from collections import defaultdict
grouped = defaultdict(list)
for item in led_standards:
    for std in item['standard_numbers']:
        grouped[std].append(item)

print(f"Unique LED standards: {len(grouped)}")
print()

for std, chunks in sorted(grouped.items()):
    print(f"Standard: {std}")
    print(f"  Chunks: {len(chunks)}")
    print(f"  Title: {chunks[0]['title'][:80]}")
    print()
