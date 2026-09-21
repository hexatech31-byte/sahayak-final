import ollama

print("=" * 80)
print("P7: OLLAMA CONFIGURATION CHECK")
print("=" * 80)
print()

# Check Ollama version
try:
    import subprocess
    result = subprocess.run(['ollama', '--version'], capture_output=True, text=True)
    print(f"Ollama version: {result.stdout.strip()}")
except:
    print("Ollama version check failed")
print()

# Check current model info
print("Available models:")
print("-" * 80)
models = ollama.list()
print(f"  Response type: {type(models)}")
if hasattr(models, 'models'):
    for model in models.models:
        print(f"  Model: {model}")
print()

# Check if there's an Ollama config file
import os
config_paths = [
    os.path.expanduser("~/.ollama/config"),
    os.path.expanduser("~/.ollama/config.json"),
    "C:\\Users\\%USERNAME%\\.ollama\\config",
    "C:\\Users\\%USERNAME%\\.ollama\\config.json",
]

print("Checking for Ollama config files:")
print("-" * 80)
for path in config_paths:
    expanded = os.path.expanduser(path)
    if os.path.exists(expanded):
        print(f"  Found: {expanded}")
        try:
            with open(expanded, 'r') as f:
                print(f"  Content: {f.read()}")
        except:
            print(f"  Could not read file")
    else:
        print(f"  Not found: {expanded}")
print()

# Test current Ollama behavior with keep-alive
print("Testing Ollama keep-alive behavior:")
print("-" * 80)
import time

# First call (cold)
start = time.time()
response1 = ollama.chat(
    model="qwen2.5:3b",
    messages=[{"role": "user", "content": "Say hello"}],
    options={"temperature": 0}
)
time1 = time.time() - start
print(f"First call (cold): {time1:.4f}s")

# Second call (warm, should be faster if model stays loaded)
start = time.time()
response2 = ollama.chat(
    model="qwen2.5:3b",
    messages=[{"role": "user", "content": "Say hello again"}],
    options={"temperature": 0}
)
time2 = time.time() - start
print(f"Second call (warm): {time2:.4f}s")
print(f"Speedup: {time1/time2:.2f}x")
print()

# Test with explicit keep_alive option
print("Testing with explicit keep_alive option:")
print("-" * 80)
start = time.time()
response3 = ollama.chat(
    model="qwen2.5:3b",
    messages=[{"role": "user", "content": "Say hello"}],
    options={"temperature": 0, "keep_alive": "5m"}
)
time3 = time.time() - start
print(f"With keep_alive=5m: {time3:.4f}s")
print()

print("=" * 80)
