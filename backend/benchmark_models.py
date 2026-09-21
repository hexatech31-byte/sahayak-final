import sys
import time
import json
import ollama
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

SYSTEM_PROMPT = """
You are an AI assistant for an Indian Standards procurement system.

Your task is to understand a procurement requirement provided by a
government procurement officer.

Extract the requirement into structured information.

IMPORTANT RULES:

1. Do not identify or recommend Indian Standards.
2. Do not invent technical requirements.
3. Do not add information that is not present or reasonably implied
   by the user's input.
4. Preserve numerical values, units, ratings and constraints exactly.
5. If a field is not available, return null.
6. Separate explicit requirements from general descriptions.
7. The output must be valid JSON only.

Return this structure:

{
    "product": "",
    "category": "",
    "quantity": "",
    "budget": "",
    "department": "",
    "deadline": "",
    "intended_purpose": "",
    "application_environment": "",
    "technical_requirements": []
}
"""

def test_model(model_name, description, title, is_cold=True):
    """Test a single model with timing."""
    user_prompt = f"""
Understand the following procurement requirement.

Requirement Title:
{title}

Description:
{description}

Category:

Estimated Quantity:

Estimated Budget:

Department:

Submission Deadline:

Return ONLY valid JSON.
"""
    
    start = time.time()
    response = ollama.chat(
        model=model_name,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        options={"temperature": 0},
    )
    elapsed = time.time() - start
    
    content = response["message"]["content"].strip()
    if content.startswith("```"):
        content = content.replace("```json", "")
        content = content.replace("```", "")
        content = content.strip()
    
    try:
        result = json.loads(content)
        valid = True
    except:
        valid = False
        result = None
    
    return elapsed, valid, result

print("=" * 80)
print("P3-P6: MODEL LOADING AND BENCHMARK TESTS")
print("=" * 80)
print()

# Test inputs
test_inputs = [
    ("Procurement of 100 cotton yoga mats for use in yoga and wellness facilities.", "Cotton Yoga Mat"),
    ("Procurement of 500 energy-efficient LED street lights for installation on municipal roads.", "LED Street Light"),
    ("Procurement of power cables for an industrial electrical installation.", "Power Cable"),
    ("Procurement of ergonomic office chairs for government administrative offices.", "Office Chair"),
    ("Need 200 fire-resistant electrical cables.", "Fire-resistant Cable"),
]

models = ["qwen3:4b", "qwen2.5:3b"]

for model in models:
    print(f"MODEL: {model}")
    print("=" * 80)
    
    # Cold start (first request after model switch)
    print("COLD START TEST")
    print("-" * 80)
    cold_times = []
    for i, (desc, name) in enumerate(test_inputs[:1]):  # Just one cold test
        elapsed, valid, result = test_model(model, desc, name, is_cold=True)
        cold_times.append(elapsed)
        print(f"  {name}: {elapsed:.4f}s (valid: {valid})")
        if result:
            print(f"    Product: {result.get('product')}")
            print(f"    Quantity: {result.get('quantity')}")
    print()
    
    # Warm start tests (multiple consecutive requests)
    print("WARM START TESTS (3 consecutive requests)")
    print("-" * 80)
    warm_times = []
    for i in range(3):
        desc, name = test_inputs[0]  # Same input for warm tests
        elapsed, valid, result = test_model(model, desc, name, is_cold=False)
        warm_times.append(elapsed)
        print(f"  Warm {i+1}: {elapsed:.4f}s (valid: {valid})")
    print()
    
    # Test all inputs with warm model
    print("ALL INPUTS (WARM)")
    print("-" * 80)
    all_warm_times = []
    for desc, name in test_inputs:
        elapsed, valid, result = test_model(model, desc, name, is_cold=False)
        all_warm_times.append(elapsed)
        print(f"  {name}: {elapsed:.4f}s (valid: {valid})")
        if result:
            print(f"    Product: {result.get('product')}")
            print(f"    Quantity: {result.get('quantity')}")
            print(f"    Purpose: {result.get('intended_purpose')}")
    print()
    
    avg_cold = sum(cold_times) / len(cold_times) if cold_times else 0
    avg_warm = sum(warm_times) / len(warm_times) if warm_times else 0
    avg_all_warm = sum(all_warm_times) / len(all_warm_times) if all_warm_times else 0
    
    print(f"SUMMARY for {model}:")
    print(f"  Cold start: {avg_cold:.4f}s")
    print(f"  Warm (consecutive): {avg_warm:.4f}s")
    print(f"  Warm (all inputs): {avg_all_warm:.4f}s")
    print()
    print("=" * 80)
    print()
