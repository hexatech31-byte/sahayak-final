import ollama
response = ollama.chat(model='qwen3:4b', messages=[{'role': 'user', 'content': 'What is 2+2? Return as JSON: {"answer": ""}'}], options={'temperature': 0})
print("Response:", response['message']['content'])