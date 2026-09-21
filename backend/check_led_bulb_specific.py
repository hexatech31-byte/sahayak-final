import json

data = json.load(open('D:/Sanku/sahayak-web-main/sahayak-web-main/Indian-Standards-AI(1)/Indian-Standards-AI/data/vector_db/standards_metadata.json', encoding='utf-8'))

# Find LED bulb/lamp specific standards
led_bulb_standards = []
for chunk in data:
    std_nums = chunk.get('standard_numbers', [])
    text = chunk.get('text', '').lower()
    title = chunk.get('document_title') or ''
    
    # Check for bulb/lamp specific LED content
    if ('led' in text or 'led' in title.lower()) and ('bulb' in text or 'lamp' in text or 'general service' in text):
        if std_nums:
            led_bulb_standards.append({
                'standard_numbers': std_nums,
                'title': title,
                'text_preview': text[:300]
            })

print(f"Found {len(led_bulb_standards)} chunks with LED bulb/lamp content AND standard numbers")
print()

# Group by standard number
from collections import defaultdict
grouped = defaultdict(list)
for item in led_bulb_standards:
    for std in item['standard_numbers']:
        grouped[std].append(item)

print(f"Unique LED bulb/lamp standards: {len(grouped)}")
print()

for std, chunks in sorted(grouped.items()):
    print(f"Standard: {std}")
    print(f"  Chunks: {len(chunks)}")
    print(f"  Title: {chunks[0]['title'][:100]}")
    print(f"  Text: {chunks[0]['text_preview'][:200]}")
    print()
