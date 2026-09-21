import json

metadata_path = r'D:\Sanku\sahayak-web-main\sahayak-web-main\Indian-Standards-AI(1)\Indian-Standards-AI\data\vector_db\standards_metadata.json'

with open(metadata_path, 'r', encoding='utf-8') as f:
    metadata = json.load(f)

print(f'Total standards in dataset: {len(metadata)}')

# Check for computer-related standards
computer_keywords = ['computer', 'desktop', 'laptop', 'pc', 'ram', 'ssd', 'hardware', 'monitor', 'keyboard', 'mouse']
computer_related = []

for m in metadata:
    text = str(m.get('text', '')).lower()
    title = str(m.get('document_title', m.get('title', ''))).lower()
    if any(keyword in text or keyword in title for keyword in computer_keywords):
        computer_related.append(m)

print(f'Computer-related standards: {len(computer_related)}')
print()

if computer_related:
    print('Sample computer-related entries with text preview:')
    for i, m in enumerate(computer_related[:10], 1):
        std_nums = m.get('standard_numbers', m.get('standard_number', 'Unknown'))
        title = m.get('document_title') or m.get('title') or 'Unknown'
        text = m.get('text', '')[:150]
        print(f'{i}. {std_nums}')
        print(f'   Title: {str(title)[:80]}')
        print(f'   Text: {text}')
        print()
else:
    print('No computer-related standards found in dataset.')

# Check what categories are present
print()
print('Checking for IT/Electronics standards...')
it_keywords = ['it', 'information technology', 'electronic', 'digital', 'software', 'data']
it_related = []

for m in metadata:
    text = str(m.get('text', '')).lower()
    title = str(m.get('document_title', m.get('title', ''))).lower()
    if any(keyword in text or keyword in title for keyword in it_keywords):
        it_related.append(m)

print(f'IT/Electronics-related standards: {len(it_related)}')
print()

if it_related:
    print('Sample IT-related entries:')
    for i, m in enumerate(it_related[:10], 1):
        std_nums = m.get('standard_numbers', m.get('standard_number', 'Unknown'))
        title = m.get('document_title') or m.get('title') or 'Unknown'
        print(f'{i}. {std_nums} - {str(title)[:100]}')
