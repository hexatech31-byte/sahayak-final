import sys
import json
import time
from pathlib import Path

# Ensure UTF-8 output on Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from llm.tender_generation import generate_tender_specification

def test_product(name, req, std_analysis, evidence):
    print("=" * 80)
    print(f"TESTING PRODUCT: {name}")
    print("=" * 80)
    print(f"Input Product: {req['title']}")
    print(f"Input Standard: {std_analysis['primary_standard']['standard_number']}")
    print()
    
    t0 = time.time()
    result = generate_tender_specification(req, std_analysis, evidence)
    elapsed = time.time() - t0
    
    print(f"Generation Time: {elapsed:.2f}s")
    sections = result.get("sections", [])
    print(f"Sections Count: {len(sections)}")
    print()
    
    assert len(sections) == 7, f"Expected 7 sections, got {len(sections)}"
    
    for i, sec in enumerate(sections, 1):
        print(f"[{sec['number']}] {sec['title']} (Ref: {sec.get('reference', 'N/A')})")
        clauses = sec.get("clauses", [])
        assert len(clauses) > 0, f"Section {sec['number']} has no clauses"
        for c in clauses:
            text = c.get("text", "") if isinstance(c, dict) else str(c)
            source_type = c.get("source_type", "") if isinstance(c, dict) else ""
            assert source_type == "llm_generated", f"Expected llm_generated, got {source_type}"
            print(f"    - {text}")
        print()
    
    print(f"ALL 7 SECTIONS VERIFIED FOR {name}!\n")

# 1. Power Cable
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

power_cable_evidence = [
    {'id': 1, 'text': 'IS 7098 Part 1 covers specification for XLPE insulated thermoplastic sheathed power cables for working voltages up to and including 1100 V.'},
    {'id': 2, 'text': 'Testing requirements include conductor resistance, insulation resistance, high voltage test, flammability test.'}
]

# 2. Cotton Yoga Mat
yoga_mat_req = {
    'title': 'Cotton Yoga Mat',
    'description': 'Procurement of 100 cotton yoga mats for yoga facilities.',
    'category': 'Sports Equipment',
    'quantity': '100',
    'department': 'Sports Authority',
    'budget': '50000',
    'deadline': '15 Nov 2026',
    'intended_purpose': 'yoga facilities',
    'application_environment': 'Indoor',
    'technical_requirements': []
}

yoga_mat_std = {
    'applicability': 'Directly Applicable',
    'primary_standard': {
        'standard_number': 'IS 17873:2022',
        'title': 'Cotton Yoga Mat — Specification',
        'evidence_ids': [1, 2]
    },
    'match_confidence': 95,
    'why_this_standard': 'Candidate explicitly covers Cotton Yoga Mat specification requirements.',
    'technical_specifications': [
        {'requirement': 'Cotton Yoga Mat — Specification', 'source_evidence_ids': [1]}
    ],
    'safety_measures': [],
    'certification_requirements': [
        {'requirement': 'BIS Standard Mark certification', 'source_evidence_ids': [1]}
    ]
}

yoga_mat_evidence = [
    {'id': 1, 'text': 'IS 17873:2022 specifies requirements for yoga mats made of 100% cotton.'}
]

if __name__ == '__main__':
    test_product("Power Cable", power_cable_req, power_cable_std, power_cable_evidence)
    test_product("Cotton Yoga Mat", yoga_mat_req, yoga_mat_std, yoga_mat_evidence)
