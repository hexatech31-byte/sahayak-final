import sys
from pathlib import Path

# Add paths
BASE_DIR = Path(__file__).resolve().parent.parent
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR / "src"))

from llm.standard_analysis import _standard_key

print("=" * 80)
print("V4: NORMALIZATION VERIFICATION")
print("=" * 80)
print()

# Test 1: IS 17873 variants should merge
print("TEST 1: IS 17873 variants should merge to one logical candidate")
print("-" * 80)
variants_17873 = [
    "IS 17873",
    "IS 17873:2022",
    "IS 17873 : 2022",
    "IS 17873: 2022",
    "IS 17873 (PART 1):2022"
]
keys_17873 = [_standard_key(v) for v in variants_17873]
print(f"Input variants: {variants_17873}")
print(f"Normalized keys: {keys_17873}")
print(f"Unique keys: {set(keys_17873)}")
print(f"Should merge to 1 key: {len(set(keys_17873)) == 1}")
print()

# Test 2: IS 7098 parts should remain separate
print("TEST 2: IS 7098 parts should remain separate candidates")
print("-" * 80)
variants_7098 = [
    "IS 7098 (PART 1):1988",
    "IS 7098 (PART 2):2011",
    "IS 7098 (PART 3):1993",
    "IS 7098 PART 1",
    "IS 7098 PART 2"
]
keys_7098 = [_standard_key(v) for v in variants_7098]
print(f"Input variants: {variants_7098}")
print(f"Normalized keys: {keys_7098}")
print(f"Unique keys: {set(keys_7098)}")
print(f"Should have 3 unique keys (Part 1, Part 2, Part 3): {len(set(keys_7098)) == 3}")
print()

# Test 3: Year suffix removal
print("TEST 3: Year suffix removal")
print("-" * 80)
with_year = ["IS 269:2015", "IS 269:2022", "IS 269"]
keys_with_year = [_standard_key(v) for v in with_year]
print(f"Input: {with_year}")
print(f"Normalized keys: {keys_with_year}")
print(f"Unique keys: {set(keys_with_year)}")
print(f"Should merge to 1 key (year removed): {len(set(keys_with_year)) == 1}")
print()

# Test 4: Parentheses spacing normalization
print("TEST 4: Parentheses spacing normalization")
print("-" * 80)
parentheses_variants = [
    "IS 7098 (PART 1):1988",
    "IS 7098(PART 1):1988",
    "IS 7098 ( PART 1):1988",
    "IS 7098 (PART 1 ) :1988"
]
keys_parentheses = [_standard_key(v) for v in parentheses_variants]
print(f"Input: {parentheses_variants}")
print(f"Normalized keys: {keys_parentheses}")
print(f"Unique keys: {set(keys_parentheses)}")
print(f"Should merge to 1 key: {len(set(keys_parentheses)) == 1}")
print()
