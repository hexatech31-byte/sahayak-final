import requests
import json
import time

API_BASE_URL = "http://localhost:8000"

power_cable_req = {
    'title': 'Power Cable',
    'description': 'Procurement of power cables for an industrial electrical installation.',
    'category': 'Electrical / Power Cables',
    'quantity': '200',
    'department': 'Municipal Corporation',
    'budget': '500000',
    'deadline': '30 Dec 2026',
    'intended_purpose': 'industrial electrical installation',
    'application_environment': 'Outdoor / Industrial',
    'technical_requirements': [
        {'name': 'Voltage Grade', 'description': 'Up to and including 1100 V'},
        {'name': 'Insulation', 'description': 'Crosslinked polyethylene (XLPE)'}
    ]
}

power_cable_std = {
    'applicability': 'Directly Applicable',
    'primary_standard': {
        'standard_number': 'IS 7098 (Part 1):1988',
        'title': 'Crosslinked polyethylene insulated PVC sheathed cables - Part 1: For working voltages up to and including 1100 V',
        'evidence_ids': [1, 2]
    },
    'match_confidence': 95,
    'why_this_standard': 'IS 7098 (Part 1):1988 directly specifies requirements for crosslinked polyethylene insulated cables up to 1100V.',
    'technical_specifications': [
        {'requirement': 'Crosslinked polyethylene insulated PVC sheathed cables for working voltages up to 1100 V', 'source_evidence_ids': [1]}
    ],
    'safety_measures': [
        {'requirement': 'Ensure proper insulation resistance and dielectric strength testing', 'source_evidence_ids': [2]}
    ],
    'certification_requirements': [
        {'requirement': 'Mandatory BIS ISI certification mark as per Scheme-I', 'source_evidence_ids': [1]}
    ]
}

print("=" * 80)
print("TESTING POWER CABLE ON LIVE TENDER API ENDPOINT")
print("=" * 80)
t0 = time.time()
res = requests.post(
    f"{API_BASE_URL}/api/ai/generate-tender",
    json={
        "requirement": power_cable_req,
        "standard_analysis": power_cable_std
    },
    headers={"Content-Type": "application/json"}
)
elapsed = time.time() - t0

print(f"Status Code: {res.status_code}")
print(f"Latency: {elapsed:.2f}s")
data = res.json()
print("Success:", data.get("success"))
tender = data.get("tender", {})
sections = tender.get("sections", [])
print(f"Total Sections: {len(sections)}")

for sec in sections:
    print(f"\nSection {sec['number']}: {sec['title']} (Ref: {sec.get('reference')})")
    for c in sec.get("clauses", []):
        text = c.get("text", "")
        print(f"  • {text}")
