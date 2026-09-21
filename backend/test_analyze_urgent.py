import requests
import json
import time

API_BASE_URL = "http://localhost:8000"

# Test case: Power Cable
requirement = {
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

print("="*80)
print("REPRODUCING ANALYZE FAILURE")
print("="*80)
print()

print("TESTING: Power Cable")
print("-"*80)
print()

start_time = time.time()

try:
    response = requests.post(
        f"{API_BASE_URL}/api/ai/analyze-standards",
        json={
            "requirement": requirement
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
        
        if result.get('success') and result.get('analysis'):
            analysis = result['analysis']
            print(f"Applicability: {analysis.get('applicability')}")
            print(f"Primary Standard: {analysis.get('primary_standard', {}).get('standard_number') if analysis.get('primary_standard') else None}")
            print(f"Confidence: {analysis.get('match_confidence')}")
            print(f"✓ Analyze working correctly")
        else:
            print(f"✗ Success: False")
            print(f"✗ Error: {result.get('error')}")
            print(f"✗ Analysis: {result.get('analysis')}")
    else:
        print(f"✗ HTTP {response.status_code}")
        print(f"✗ Error: {response.text}")
        
except Exception as e:
    print(f"✗ Exception: {e}")
    import traceback
    traceback.print_exc()

print()
print("="*80)
