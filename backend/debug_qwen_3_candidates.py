import sys
import json
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

import ollama

# Simulate the actual prompt being sent with 3 candidates
requirement_block = """PRODUCT: LED Bulb
DESCRIPTION: Procurement of LED bulbs for general lighting applications in government offices.
CATEGORY: Electrical
QUANTITY: 1000
DEPARTMENT: Public Works Department"""

candidates_json = """[{"candidate_id":"C1","standard_number":"IS 16103 (PART 1 & PART 2)","title":"LED modules are pre-packaged units containing multiple Light Emitting Diodes (LEDs), along with","evidence_ids":[6],"retrieval_score":0.48,"product_term_coverage":0.625,"relevance_hint":"potential_component_or_related","evidence_excerpt":"This standard specifies the safety requirements for LED modules intended for general lighting applications, ensuring their safe operation and use. This standard includes various tests such as: Marking test, Provision for protective earthing, Protection against accidental contact"},{"candidate_id":"C2","standard_number":"IS 16205(PART 1):2017","title":"2017","evidence_ids":[10],"retrieval_score":0.457,"product_term_coverage":0.5,"relevance_hint":"potential_component_or_related","evidence_excerpt":"LED Modules for General Lighting: Part 1 Safety Requirements Power Systems IS 16205(Part 1): 2017 Conduit Systems for Cable Ma"},{"candidate_id":"C3","standard_number":"IS 16105","title":"This standard specifies the method of measurement of lumen maintenance of LED packages, arrays and","evidence_ids":[5],"retrieval_score":0.482,"product_term_coverage":0.375,"relevance_hint":"potential_component_or_related","evidence_excerpt":"This standard specifies the method of measurement of lumen maintenance of LED packages, arrays and modules only. The standard includes: Lumen maintenance test, Case temperature control test, Chromaticity shifts measurement (optional) test, Environmental condition monitoring test,"}]"""

prompt = f"""
You are an evidence-grounded Indian Standards analysis engine.

PROCUREMENT REQUIREMENT (use this exact product context):
{requirement_block}

CANDIDATES (each excerpt is verbatim retrieved BIS evidence; evidence_ids are traceability links):
{candidates_json}

CRITICAL DECISION RULES:

1. Use ONLY candidates/evidence supplied. NEVER invent a standard number.

2. A candidate is strong direct product evidence when its isolated,
   traceable evidence explicitly identifies the requested product and states that
   the standard covers, specifies, or gives requirements/specification for
   that product. Look for phrases like:
   - "specifies requirements for [product]"
   - "covers [product]"
   - "this standard applies to [product]"
   - "specification for [product]"
   - "requirements for [product]"

3. A candidate marked `potential_product_specific` already meets these evidence conditions.

4. Select a strong direct product candidate as DIRECTLY APPLICABLE unless
   another supplied candidate has stronger contradictory product evidence.
   Do not reject a candidate merely because the source is a catalogue or
   compendium. Do not select a component or related candidate over a strong
   direct product candidate.

5. Component/related standards (accessories, testing, installation, general codes)
   should be marked as "Related" or "Supporting" in aligned_standards, not as primary.
   Examples of component standards: terminations, connectors, installation codes, testing methods.

6. PRIORITY RULE: If a candidate explicitly states "specifies requirements for [product]" or
   "specification for [product]" where [product] matches the requested product, that candidate
   MUST be selected as primary over any component/accessory standard.

7. For a directly applicable candidate, return:
   - applicability: "Directly Applicable"
   - primary_standard.standard_number: use the candidate's standard_number
   - primary_standard.title: use the candidate's title
   - primary_standard.evidence_ids: use the candidate's evidence_ids
   - product_level_applicability: true
   - match_confidence: provide your evidence-based estimate; the application
     calculates the final confidence deterministically.

8. IF NO candidate meets condition 2, return:
   - applicability: "Not Established"
   - primary_standard: null
   - product_level_applicability: false
   - match_confidence: 0

9. DO NOT claim certification or requirements unsupported by an evidence ID.

Return exactly one JSON object with this compact schema:
{{"applicability":"","primary_standard":{{"standard_number":"","title":"","evidence_ids":[],"product_level_applicability":false}},"match_confidence":0,"why_this_standard":"","technical_specifications":[{{"requirement":"","source_evidence_ids":[]}}],"safety_measures":[{{"requirement":"","source_evidence_ids":[]}}],"implementation_measures":[{{"requirement":"","source_evidence_ids":[]}}],"aligned_standards":[{{"standard_number":"","title":"","relationship":"Supporting|Component|Reference|Related","source_evidence_ids":[]}}],"certification_requirements":[{{"requirement":"","source_evidence_ids":[]}}],"final_recommendation":""}}

Return ONLY valid JSON. Do not provide reasoning prose. Do not provide markdown.
Do not explain your thinking. The first character must be {{ and the last character must be }}.
"""

print("Testing Qwen with 3 candidates...")
print(f"Prompt length: {len(prompt)}")
print()

try:
    response = ollama.chat(
        model="qwen3:4b",
        messages=[{"role": "user", "content": prompt}],
        format="json",
        think=False,
        options={"num_predict": 2000}
    )
    
    content = response.message.content
    print("Response:")
    print(content)
    print()
    
    try:
        parsed = json.loads(content)
        print("Parsed JSON:")
        print(json.dumps(parsed, indent=2))
    except Exception as e:
        print("JSON parse error:", e)
    
except Exception as e:
    print("Error:", e)
    import traceback
    traceback.print_exc()
