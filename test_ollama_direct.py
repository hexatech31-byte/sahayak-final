import ollama
import json

# Test 1: Simple JSON request
print("=== TEST 1: Simple JSON ===")
response1 = ollama.chat(
    model='qwen3:4b',
    messages=[{'role': 'user', 'content': 'Return JSON: {"product": "test"}'}],
    options={'temperature': 0}
)
print("Response type:", type(response1))
print("Response:", response1)
print("Message content:", response1.get('message', {}).get('content', 'NO CONTENT FIELD'))
print()

# Test 2: Same prompt as our application
print("=== TEST 2: Application prompt ===")
prompt = """Extract product info: title=LED Street Light, category=Electrical, quantity=100, budget=500000, department=Municipal Corporation, deadline=30 days, description=Supply of LED street lights.

Return JSON: {"product":"","category":"","quantity":"","budget":"","department":"","deadline":"","intended_purpose":"","application_environment":"","technical_requirements":[]}"""

response2 = ollama.chat(
    model='qwen3:4b',
    messages=[{'role': 'user', 'content': prompt}],
    options={'temperature': 0, 'num_predict': 1000}
)
print("Response type:", type(response2))
print("Response:", response2)
print("Message content:", response2.get('message', {}).get('content', 'NO CONTENT FIELD'))
print()

# Test 3: Check for different response structures
print("=== TEST 3: Response structure ===")
print("Keys:", response2.keys() if hasattr(response2, 'keys') else 'No keys method')
print("Dir:", [x for x in dir(response2) if not x.startswith('_')])
