import logging
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import API_HOST, API_PORT, DEBUG, CORS_ORIGINS, LOG_LEVEL

# Add Indian-Standards-AI to path for imports
# Use the new package directory: Indian-Standards-AI(1)\Indian-Standards-AI
INDIAN_STANDARDS_AI_DIR = Path(__file__).resolve().parent.parent / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
if str(INDIAN_STANDARDS_AI_DIR) not in sys.path:
    sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR))
    
# Also add src subdirectory
src_dir = INDIAN_STANDARDS_AI_DIR / "src"
if str(src_dir) not in sys.path:
    sys.path.insert(0, str(src_dir))

# For importing with the package name Indian_Standards_AI (replacing hyphens)
if str(INDIAN_STANDARDS_AI_DIR.parent) not in sys.path:
    sys.path.insert(0, str(INDIAN_STANDARDS_AI_DIR.parent))

# Configure logging
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Sahayak AI API",
    description="AI-powered procurement standards analysis API",
    version="1.0.0",
    debug=DEBUG
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
from api.ai_routes import router as ai_router
app.include_router(ai_router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Sahayak AI API",
        "version": "1.0.0",
        "status": "running"
    }

# Health check
@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting Sahayak AI API on {API_HOST}:{API_PORT}")
    uvicorn.run(
        "main:app",
        host=API_HOST,
        port=API_PORT,
        reload=DEBUG
    )