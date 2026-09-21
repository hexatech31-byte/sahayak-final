import sys
import json
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

import ollama

print("Testing Qwen3:4b with a simple JSON request...")
print()

simple_prompt = """
You are a JSON generator. Return a valid JSON response with the following structure:
{
  "test": "value",
  "number": 42
}
"""

try:
    response = ollama.chat(
        model="qwen3:4b",
        messages=[{"role": "user", "content": simple_prompt}],
        format="json",
        think=False,
        options={"num_predict": 200}
    )
    
    print("Response type:", type(response))
    print("Response:", response)
    
    if hasattr(response, "message"):
        content = response.message.content
        print("Content:", content)
        
        try:
            parsed = json.loads(content)
            print("Parsed JSON:", parsed)
        except Exception as e:
            print("JSON parse error:", e)
    
except Exception as e:
    print("Error:", e)
    import traceback
    traceback.print_exc()
