import requests
import json
import time

API_BASE_URL = "http://localhost:8000"

# Test cases
test_cases = [
    {
        'name': 'Power Cable',
        'requirement': {
            'title': 'Power Cable',
            'description': 'Procurement of power cables for industrial electrical installation.',
            'category': 'Electrical',
            'quantity': '500',
            'budget': '400000',
            'department': 'Electrical Engineering',
            'deadline': '10 Dec 2026',
            'intended_purpose': 'industrial electrical installation',
            'application_environment': 'Industrial',
            'technical_requirements': []
        },
        'standard_analysis': {
            'applicability': 'Directly Applicable',
            'primary_standard': {
                'standard_number': 'IS 13573 (PART 3):2011',
                'title': '2011',
                'evidence_ids': [4],
                'product_level_applicability': True
            },
            'match_confidence': 95,
            'why_this_standard': 'The candidate explicitly states the standard specifies test methods for cable accessories used with extruded insulated power cables',
            'technical_specifications': [
                {
                    'requirement': 'Test methods for cable accessories (joints, terminations, separable connectors) for extruded insulated power cables (XLPE or EPR)',
                    'source_evidence_ids': [4]
                }
            ],
            'safety_measures': [],
            'implementation_measures': [],
            'aligned_standards': [],
            'certification_requirements': [],
            'final_recommendation': 'IS 13573 (PART 3):2011 is directly applicable for power cables in industrial electrical installations'
        }
    },
    {
        'name': 'LED Street Light',
        'requirement': {
            'title': 'LED Street Light',
            'description': 'Supply of LED street lights for installation on public roads.',
            'category': 'Electrical',
            'quantity': '100',
            'budget': '500000',
            'department': 'Municipal Corporation',
            'deadline': '30 days',
            'intended_purpose': 'public road lighting',
            'application_environment': 'Outdoor',
            'technical_requirements': []
        },
        'standard_analysis': {
            'applicability': 'Directly Applicable',
            'primary_standard': {
                'standard_number': 'IS 16107 (PART 2/ SEC 1 & PART 2/ SEC 2)',
                'title': 'LED Street Light',
                'evidence_ids': [1, 2],
                'product_level_applicability': True
            },
            'match_confidence': 95,
            'why_this_standard': 'Standard covers LED street light requirements for public road lighting',
            'technical_specifications': [
                {
                    'requirement': 'LED Street Light specifications for outdoor public road lighting',
                    'source_evidence_ids': [1, 2]
                }
            ],
            'safety_measures': [],
            'implementation_measures': [],
            'aligned_standards': [],
            'certification_requirements': [],
            'final_recommendation': 'IS 16107 is the primary standard for LED street lights'
        }
    },
    {
        'name': 'Cotton Yoga Mat',
        'requirement': {
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
        },
        'standard_analysis': {
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
    }
]

print("="*80)
print("TESTING TENDER GENERATION FOR ALL PRODUCTS")
print("="*80)
print()

results = []

for test in test_cases:
    print(f"TESTING: {test['name']}")
    print("-"*80)
    
    start_time = time.time()
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/ai/generate-tender",
            json={
                "requirement": test['requirement'],
                "standard_analysis": test['standard_analysis']
            },
            headers={"Content-Type": "application/json"}
        )
        
        latency = time.time() - start_time
        
        if response.status_code == 200:
            result = response.json()
            
            if result.get('success') and result.get('tender'):
                tender = result['tender']
                sections = tender.get('sections', [])
                
                print(f"✓ HTTP 200")
                print(f"✓ Success: True")
                print(f"✓ Latency: {latency:.2f}s")
                print(f"✓ Sections: {len(sections)}")
                
                # Verify all 7 sections
                section_titles = [s['title'] for s in sections]
                expected_sections = [
                    "Scope of Procurement",
                    "Applicable Indian Standards & Regulatory Framework",
                    "Technical Specifications & Material Requirements",
                    "Physical & Performance Requirements",
                    "Quality Assurance & Factory Acceptance Testing (FAT)",
                    "Mandatory Statutory Certifications & BIS Standard Mark",
                    "Marking, Packaging & Consignee Identification"
                ]
                
                missing_sections = [s for s in expected_sections if s not in section_titles]
                if missing_sections:
                    print(f"✗ Missing sections: {missing_sections}")
                else:
                    print(f"✓ All 7 sections present")
                
                # Count total clauses
                total_clauses = sum(len(s.get('clauses', [])) for s in sections)
                print(f"✓ Total clauses: {total_clauses}")
                
                # Check for tender clause language
                sample_clauses = []
                for section in sections[:3]:
                    for clause in section.get('clauses', [])[:2]:
                        sample_clauses.append(clause.get('text', '')[:80])
                
                has_tender_language = any('shall' in c.lower() for c in sample_clauses)
                if has_tender_language:
                    print(f"✓ Tender clause language detected")
                else:
                    print(f"✗ No tender clause language detected")
                
                results.append({
                    'name': test['name'],
                    'success': True,
                    'latency': latency,
                    'sections': len(sections),
                    'clauses': total_clauses,
                    'all_sections_present': len(missing_sections) == 0,
                    'has_tender_language': has_tender_language
                })
            else:
                print(f"✗ Success: False")
                print(f"✗ Error: {result.get('error')}")
                results.append({
                    'name': test['name'],
                    'success': False,
                    'error': result.get('error')
                })
        else:
            print(f"✗ HTTP {response.status_code}")
            print(f"✗ Error: {response.text}")
            results.append({
                'name': test['name'],
                'success': False,
                'error': f"HTTP {response.status_code}"
            })
            
    except Exception as e:
        print(f"✗ Exception: {e}")
        results.append({
            'name': test['name'],
            'success': False,
            'error': str(e)
        })
    
    print()

# Summary
print("="*80)
print("SUMMARY")
print("="*80)
print()

for result in results:
    if result['success']:
        print(f"✓ {result['name']}: {result['sections']} sections, {result['clauses']} clauses, {result['latency']:.2f}s")
    else:
        print(f"✗ {result['name']}: {result.get('error', 'Unknown error')}")

print()

# Verify all tests passed
all_passed = all(r['success'] for r in results)
all_sections_present = all(r.get('all_sections_present', False) for r in results if r['success'])
all_tender_language = all(r.get('has_tender_language', False) for r in results if r['success'])

if all_passed and all_sections_present and all_tender_language:
    print("✓ ALL TESTS PASSED")
    print("✓ All 7 sections generated for each product")
    print("✓ Tender clause language detected in all responses")
else:
    print("✗ SOME TESTS FAILED")
    if not all_passed:
        print("✗ Not all API calls succeeded")
    if not all_sections_present:
        print("✗ Not all products have all 7 sections")
    if not all_tender_language:
        print("✗ Not all responses have tender clause language")

print()
print("="*80)
