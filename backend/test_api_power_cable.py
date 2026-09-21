import requests
import json

# Test the API endpoint with Power Cable
url = "http://localhost:8000/api/ai/analyze-standards"

test_requirement = {
    "title": "Power Cable",
    "description": "Procurement of power cables for an industrial electrical installation.",
    "category": "Electrical Equipment",
    "quantity": "500 Meters",
    "budget": "₹ 5,00,000",
    "department": "Electrical Engineering Dept",
    "deadline": "30 Sep 2026",
    "intended_purpose": "industrial electrical installation",
    "application_environment": "Industrial",
    "technical_requirements": []
}

payload = {
    "requirement": test_requirement
}

print("Testing API endpoint with Power Cable...")
print(f"URL: {url}")
print()

try:
    response = requests.post(url, json=payload, timeout=60)
    print(f"Status Code: {response.status_code}")
    print()
    
    if response.status_code == 200:
        result = response.json()
        print("✓ API Response received")
        print()
        print(f"Success: {result.get('success')}")
        print()
        
        if result.get('success') and result.get('analysis'):
            analysis = result.get('analysis')
            print("✓ Analysis data present")
            print()
            print(f"Applicability: {analysis.get('applicability')}")
            print(f"Primary Standard: {analysis.get('primary_standard', {}).get('standard_number') if analysis.get('primary_standard') else None}")
            print(f"Confidence: {analysis.get('match_confidence')}")
            print(f"Why: {analysis.get('why_this_standard', '')[:200]}...")
            print()
            print("✓ API returns real analysis data (not null)")
            print("✓ No 'NoneType' error")
        else:
            print("✗ Analysis data is null or missing")
            print(f"Error: {result.get('error')}")
    else:
        print(f"✗ Request failed")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
