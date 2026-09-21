import ollama
response = ollama.chat(model='qwen3:4b', messages=[{'role': 'user', 'content': 'Return JSON only: {"product": "test"}'}], options={'temperature': 0})
print(response['message']['content'])