import ollama
prompt = """
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

Understand the following procurement requirement.

Requirement Title:
LED Street Light

Description:
Supply of LED street lights for installation on public roads.

Category:
Electrical

Estimated Quantity:
100

Estimated Budget:
500000

Department:
Municipal Corporation

Submission Deadline:
30 days

Return ONLY valid JSON.
"""

response = ollama.chat(model='qwen3:4b', messages=[{'role': 'user', 'content': prompt}], options={'temperature': 0, 'num_predict': 1000})
print("Response length:", len(response['message']['content']))
print("Response:", response['message']['content'])