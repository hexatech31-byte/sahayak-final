import requests
import json

# Test the API endpoint
url = "http://localhost:8000/api/ai/analyze-standards"

test_requirement = {
    "title": "Cotton Yoga Mat",
    "description": "Procurement of cotton yoga mats for fitness centers",
    "category": "Sports Equipment",
    "quantity": "100 Units",
    "budget": "₹ 50,000",
    "department": "Sports Authority",
    "deadline": "30 Sep 2026",
    "intended_purpose": "fitness centers",
    "application_environment": "Indoor",
    "technical_requirements": []
}

payload = {
    "requirement": test_requirement
}

print("Testing API endpoint...")
print(f"URL: {url}")
print(f"Payload: {json.dumps(payload, indent=2)}")
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
            print(f"Why: {analysis.get('why_this_standard', '')[:100]}...")
            print()
            print("✓ API returns real analysis data (not null)")
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
