import json
from collections import Counter

metadata_path = r'D:\Sanku\sahayak-web-main\sahayak-web-main\Indian-Standards-AI(1)\Indian-Standards-AI\data\vector_db\standards_metadata.json'

with open(metadata_path, 'r', encoding='utf-8') as f:
    metadata = json.load(f)

print(f'Total standards in dataset: {len(metadata)}')
print()

# Extract unique standard numbers
all_standards = []
for m in metadata:
    std_nums = m.get('standard_numbers', m.get('standard_number', []))
    if isinstance(std_nums, list):
        all_standards.extend(std_nums)
    elif std_nums:
        all_standards.append(std_nums)

print(f'Total unique standard entries: {len(all_standards)}')
print()

# Group by source PDF
source_pdfs = Counter()
for m in metadata:
    pdf = m.get('source_pdf', 'Unknown')
    source_pdfs[pdf] += 1

print('Source PDFs in dataset:')
for pdf, count in source_pdfs.most_common():
    print(f'  {pdf}: {count} entries')
print()

# Extract product categories from titles
product_keywords = {
    'Electrical': ['cable', 'wire', 'conductor', 'voltage', 'power', 'transformer', 'switch', 'socket', 'motor', 'generator', 'circuit'],
    'Construction': ['cement', 'concrete', 'steel', 'brick', 'building', 'construction', 'structural', 'foundation'],
    'Medical': ['medical', 'hospital', 'surgical', 'healthcare', 'sterilization', 'equipment', 'device'],
    'Sports/Fitness': ['yoga', 'fitness', 'sports', 'exercise', 'gym', 'equipment'],
    'Furniture': ['chair', 'table', 'desk', 'furniture', 'seat', 'bed'],
    'Lighting': ['lamp', 'light', 'luminaire', 'led', 'bulb', 'street light'],
    'Textiles': ['cotton', 'fabric', 'textile', 'cloth', 'yarn', 'garment'],
    'Food/Agriculture': ['food', 'agriculture', 'crop', 'seed', 'fertilizer', 'pesticide'],
    'Chemicals': ['chemical', 'paint', 'coating', 'adhesive', 'polymer', 'plastic'],
    'Automotive': ['vehicle', 'automotive', 'car', 'truck', 'brake', 'tyre', 'engine'],
    'Safety': ['safety', 'protective', 'helmet', 'glove', 'guard', 'fire'],
    'Water/Sanitation': ['water', 'sanitation', 'sewage', 'drainage', 'pipe', 'pump'],
    'IT/Electronics': ['computer', 'software', 'data', 'electronic', 'digital', 'monitor', 'keyboard']
}

print('Available product categories based on dataset content:')
print()

category_counts = {}
for category, keywords in product_keywords.items():
    count = 0
    sample_standards = []
    for m in metadata:
        text = str(m.get('text', '')).lower()
        title = str(m.get('document_title', m.get('title', ''))).lower()
        if any(keyword in text or keyword in title for keyword in keywords):
            count += 1
            std_nums = m.get('standard_numbers', m.get('standard_number', []))
            if isinstance(std_nums, list) and std_nums:
                sample_standards.extend(std_nums[:1])
    
    if count > 0:
        category_counts[category] = count
        print(f'{category}: {count} entries')
        if sample_standards:
            print(f'  Sample standards: {", ".join(set(sample_standards[:3]))}')
        print()

# Suggest specific queries based on available standards
print('='*80)
print('SUGGESTED QUERIES TO TEST:')
print('='*80)
print()

suggested_queries = [
    ('Electrical Equipment', 'Power Cable', 'Procurement of power cables for industrial electrical installation'),
    ('Electrical Equipment', 'PVC Cable', 'Procurement of PVC insulated electric cables'),
    ('Electrical Equipment', 'Electric Motor', 'Procurement of electric motors for industrial use'),
    ('Construction', 'Portland Cement', 'Procurement of Portland cement for construction'),
    ('Construction', 'Steel Bars', 'Procurement of steel reinforcement bars for building'),
    ('Medical', 'Hospital Equipment', 'Procurement of medical equipment for hospital'),
    ('Sports/Fitness', 'Yoga Mat', 'Procurement of cotton yoga mats for fitness centers'),
    ('Sports/Fitness', 'Sports Equipment', 'Procurement of general sports equipment'),
    ('Lighting', 'LED Street Light', 'Procurement of LED street lights for municipal roads'),
    ('Lighting', 'Electric Lamp', 'Procurement of electric lamps for indoor lighting'),
    ('Textiles', 'Cotton Fabric', 'Procurement of cotton fabric for garments'),
    ('Chemicals', 'Paint', 'Procurement of industrial paint for coating'),
    ('Safety', 'Safety Helmet', 'Procurement of safety helmets for construction workers'),
    ('Safety', 'Fire Extinguisher', 'Procurement of fire extinguishers for office buildings'),
    ('Water/Sanitation', 'Water Pipe', 'Procurement of PVC water pipes for water supply'),
]

for category, product, description in suggested_queries:
    print(f'Category: {category}')
    print(f'Product: {product}')
    print(f'Description: {description}')
    print()
