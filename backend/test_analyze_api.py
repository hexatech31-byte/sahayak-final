import requests
import json
import time

BASE_URL = "http://localhost:8000"

test_cases = [
    {
        "name": "Power Cable",
        "requirement": {
            "title": "Power Cable",
            "description": "Procurement of power cables for industrial electrical installation.",
            "category": "Electrical",
            "quantity": "1000",
            "budget": "500000",
            "department": "Public Works",
            "deadline": "15 Oct 2026",
            "intended_purpose": "industrial electrical installation",
            "application_environment": "Industrial",
            "technical_requirements": []
        }
    },
    {
        "name": "LED Street Light",
        "requirement": {
            "title": "LED Street Light",
            "description": "Procurement of LED street lights for municipal road lighting infrastructure.",
            "category": "Electrical",
            "quantity": "500",
            "budget": "2500000",
            "department": "Municipal Corporation",
            "deadline": "15 Nov 2026",
            "intended_purpose": "municipal road lighting",
            "application_environment": "Outdoor / municipal",
            "technical_requirements": []
        }
    },
    {
        "name": "Cotton Yoga Mat",
        "requirement": {
            "title": "Cotton Yoga Mat",
            "description": "Procurement of 100 cotton yoga mats for yoga facilities.",
            "category": "Sports Equipment",
            "quantity": "100",
            "budget": "50000",
            "department": "Sports Authority",
            "deadline": "15 Nov 2026",
            "intended_purpose": "yoga facilities",
            "application_environment": "Indoor",
            "technical_requirements": []
        }
    }
]

print("="*80)
print("TESTING ANALYZE-STANDARDS API ENDPOINT")
print("="*80)
print()

for test in test_cases:
    print(f"TEST: {test['name']}")
    print("-"*80)
    
    start = time.time()
    try:
        response = requests.post(
            f"{BASE_URL}/api/ai/analyze-standards",
            json={"requirement": test["requirement"]},
            timeout=60
        )
        elapsed = time.time() - start
        
        print(f"HTTP Status: {response.status_code}")
        print(f"Latency: {elapsed:.2f}s")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success: {data.get('success')}")
            
            if data.get('success'):
                analysis = data.get('analysis')
                if analysis:
                    applicability = analysis.get('applicability')
                    primary_std = analysis.get('primary_standard', {}).get('standard_number') if analysis.get('primary_standard') else None
                    confidence = analysis.get('match_confidence')
                    
                    print(f"Applicability: {applicability}")
                    print(f"Primary Standard: {primary_std}")
                    print(f"Confidence: {confidence}")
                else:
                    print("ERROR: analysis is null")
            else:
                print(f"ERROR: {data.get('error')}")
        else:
            print(f"ERROR: HTTP {response.status_code}")
            print(response.text)
            
    except Exception as e:
        elapsed = time.time() - start
        print(f"EXCEPTION: {e}")
        print(f"Latency: {elapsed:.2f}s")
    
    print()
    print("="*80)
    print()
