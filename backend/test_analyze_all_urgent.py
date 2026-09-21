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
        }
    }
]

print("="*80)
print("TESTING ANALYZE FOR ALL PRODUCTS")
print("="*80)
print()

results = []

for test in test_cases:
    print(f"TESTING: {test['name']}")
    print("-"*80)
    
    start_time = time.time()
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/ai/analyze-standards",
            json={
                "requirement": test['requirement']
            },
            headers={"Content-Type": "application/json"}
        )
        
        latency = time.time() - start_time
        
        if response.status_code == 200:
            result = response.json()
            
            if result.get('success') and result.get('analysis'):
                analysis = result['analysis']
                primary_std = analysis.get('primary_standard', {}).get('standard_number') if analysis.get('primary_standard') else None
                
                print(f"✓ HTTP 200")
                print(f"✓ Success: True")
                print(f"✓ Latency: {latency:.2f}s")
                print(f"✓ Applicability: {analysis.get('applicability')}")
                print(f"✓ Primary Standard: {primary_std}")
                print(f"✓ Confidence: {analysis.get('match_confidence')}")
                
                results.append({
                    'name': test['name'],
                    'success': True,
                    'latency': latency,
                    'primary_standard': primary_std,
                    'applicability': analysis.get('applicability')
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
        print(f"✓ {result['name']}: {result['primary_standard']}, {result['latency']:.2f}s")
    else:
        print(f"✗ {result['name']}: {result.get('error', 'Unknown error')}")

print()

# Verify all tests passed
all_passed = all(r['success'] for r in results)
avg_latency = sum(r['latency'] for r in results if r['success']) / len([r for r in results if r['success']]) if any(r['success'] for r in results) else 0

if all_passed:
    print("✓ ALL TESTS PASSED")
    print(f"✓ Average latency: {avg_latency:.2f}s")
    print("✓ Analyze endpoint working correctly")
else:
    print("✗ SOME TESTS FAILED")

print()
print("="*80)
