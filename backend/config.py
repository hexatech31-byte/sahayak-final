import os
import sys
from pathlib import Path

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent

# Use Indian-Standards-AI for vector database with LED standards
INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI"

# Handle different possible locations for Indian-Standards-AI
if not INDIAN_STANDARDS_AI_DIR.exists():
    # Try the nested directory structure
    INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
    
if not INDIAN_STANDARDS_AI_DIR.exists():
    # Try sibling directory (since backend is inside sahayak-web-main)
    INDIAN_STANDARDS_AI_DIR = BASE_DIR / "Indian-Standards-AI"
    
if not INDIAN_STANDARDS_AI_DIR.exists():
    # Try absolute path from current working directory
    current_dir = Path.cwd()
    INDIAN_STANDARDS_AI_DIR = current_dir / "Indian-Standards-AI(1)" / "Indian-Standards-AI"

# Add to Python path (with priority)
if str(INDIAN_STANDARDS_AI_DIR) not in sys.path:
    sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
    
# Also add src subdirectory
src_dir = INDIAN_STANDARDS_AI_DIR / "src"
if str(src_dir) not in sys.path:
    sys.path.insert(0, str(src_dir))

# AI Model Configuration
QWEN_MODEL_NAME = "qwen3:4b"
EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# Vector Database Paths
VECTOR_DB_DIR = INDIAN_STANDARDS_AI_DIR / "data" / "vector_db"
STANDARDS_INDEX = VECTOR_DB_DIR / "standards.index"
STANDARDS_METADATA = VECTOR_DB_DIR / "standards_metadata.json"
CERTIFICATION_INDEX = VECTOR_DB_DIR / "certification.index"
CERTIFICATION_METADATA = VECTOR_DB_DIR / "certification_metadata.json"

# API Configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

# CORS Configuration
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000").split(",")

# Logging
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
