import requests
import json

# Test the API endpoint with Portland Cement
url = "http://localhost:8000/api/ai/analyze-standards"

test_requirement = {
    "title": "Portland Cement",
    "description": "Procurement of Portland cement for construction of government buildings.",
    "category": "Construction Materials",
    "quantity": "500",
    "budget": "250000",
    "department": "Public Works Department",
    "deadline": "30 Sep 2026",
    "intended_purpose": "construction of government buildings",
    "application_environment": "Construction",
    "technical_requirements": []
}

payload = {
    "requirement": test_requirement
}

print("Testing API endpoint with Portland Cement...")
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
            
            if analysis.get('applicability') == "Directly Applicable" and ("269" in str(analysis.get('primary_standard', {}).get('standard_number', '')) or "16415" in str(analysis.get('primary_standard', {}).get('standard_number', ''))):
                print("✓ Cement standard returned correctly via API")
            else:
                print(f"✗ Expected cement standard, got: {analysis.get('primary_standard', {}).get('standard_number')}")
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
