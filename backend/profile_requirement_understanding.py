import sys
import time
import json
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from llm.requirement_understanding import understand_requirement

print("=" * 80)
print("P1-P2: PROFILING REQUIREMENT UNDERSTANDING PIPELINE")
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

for description, name in test_inputs:
    print(f"TEST: {name}")
    print("-" * 80)
    
    # Stage 1: Request received (start timing)
    request_start = time.time()
    
    # Stage 2: Input preprocessing
    preprocess_start = time.time()
    title = name
    category = ""
    quantity = ""
    budget = ""
    department = ""
    deadline = ""
    preprocess_time = time.time() - preprocess_start
    
    # Stage 3: Ollama connection/request setup
    setup_start = time.time()
    # This is implicit in the ollama.chat call
    setup_time = time.time() - setup_start
    
    # Stage 4-5: Model load + Qwen generation
    ollama_start = time.time()
    try:
        result = understand_requirement(
            title=title,
            description=description,
            category=category,
            quantity=quantity,
            budget=budget,
            department=department,
            deadline=deadline
        )
        ollama_time = time.time() - ollama_start
    except Exception as e:
        print(f"ERROR: {e}")
        continue
    
    # Stage 6: JSON parsing/validation
    parse_start = time.time()
    # Already done in understand_requirement, but we can measure the internal parsing
    parse_time = time.time() - parse_start
    
    # Stage 7: Response construction
    construct_start = time.time()
    # Minimal construction for this test
    construct_time = time.time() - construct_start
    
    total_time = time.time() - request_start
    
    print(f"Input preprocessing:     {preprocess_time:.4f} s")
    print(f"Ollama request setup:    {setup_time:.4f} s")
    print(f"Model load + Qwen gen:    {ollama_time:.4f} s")
    print(f"JSON parsing:             {parse_time:.4f} s")
    print(f"Response construction:   {construct_time:.4f} s")
    print(f"TOTAL:                    {total_time:.4f} s")
    print()
    print(f"Result: {json.dumps(result, indent=2)}")
    print()
    print("=" * 80)
    print()
