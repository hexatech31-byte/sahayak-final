import requests
import json
import time

API_BASE_URL = "http://localhost:8000"

# Test case: Cotton Yoga Mat
requirement = {
    'title': 'Cotton Yoga Mat',
    'description': 'Procurement of 100 cotton yoga mats for yoga facilities.',
    'category': 'Sports Equipment',
    'quantity': '100',
    'budget': '50000',
    'department': 'Sports Authority',
    'deadline': '15 Nov 2026',
    'intended_purpose': 'yoga facilities',
    'application_environment': 'Indoor',
    'technical_requirements': []
}

standard_analysis = {
    'applicability': 'Directly Applicable',
    'primary_standard': {
        'standard_number': 'IS 17873:2022',
        'title': 'Cotton Yoga Mat — Specification',
        'evidence_ids': [1, 2],
        'product_level_applicability': True
    },
    'match_confidence': 95,
    'why_this_standard': 'Candidate C1 explicitly covers Cotton Yoga Mat with product term coverage of 0.7777777777777778 and states the standard covers requirements for yoga mats made of cotton',
    'technical_specifications': [
        {
            'requirement': 'Cotton Yoga Mat — Specification',
            'source_evidence_ids': [1, 2]
        }
    ],
    'safety_measures': [],
    'implementation_measures': [],
    'aligned_standards': [],
    'certification_requirements': [],
    'final_recommendation': 'IS 17873:2022 is the primary standard for Cotton Yoga Mat procurement as it directly specifies requirements for the product'
}

print("="*80)
print("TESTING TENDER GENERATION API ENDPOINT")
print("="*80)
print()

print("INPUT:")
print(f"Product: {requirement['title']}")
print(f"Standard: {standard_analysis['primary_standard']['standard_number']}")
print()

print("CALLING API...")
print()

start_time = time.time()

try:
    response = requests.post(
        f"{API_BASE_URL}/api/ai/generate-tender",
        json={
            "requirement": requirement,
            "standard_analysis": standard_analysis
        },
        headers={"Content-Type": "application/json"}
    )
    
    latency = time.time() - start_time
    
    print(f"HTTP Status: {response.status_code}")
    print(f"Latency: {latency:.2f}s")
    print()
    
    if response.status_code == 200:
        result = response.json()
        print(f"Success: {result.get('success')}")
        print()
        
        if result.get('success') and result.get('tender'):
            tender = result['tender']
            print(f"Sections generated: {len(tender.get('sections', []))}")
            print()
            
            for section in tender.get('sections', []):
                print(f"Section {section['number']}: {section['title']}")
                print(f"  Reference: {section.get('reference', 'N/A')}")
                print(f"  Clauses: {len(section.get('clauses', []))}")
                for clause in section.get('clauses', [])[:2]:  # Show first 2 clauses
                    print(f"    - {clause.get('text', '')[:100]}...")
                print()
        else:
            print(f"Error: {result.get('error')}")
    else:
        print(f"Error: {response.text}")
        
except Exception as e:
    print(f"Exception: {e}")
    import traceback
    traceback.print_exc()

print()
print("="*80)
