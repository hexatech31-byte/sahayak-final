# AI Integration Guide

## Overview
This guide explains how to set up and run the integrated AI pipeline for the Sahayak procurement application.

## Architecture
```
React Frontend → FastAPI Backend → Qwen LLM + RAG Pipeline → Firebase
```

## Prerequisites

### 1. AI Environment Setup
The AI pipeline requires:
- Python 3.12+
- Ollama (running with qwen3:4b-instruct model)
- Indian-Standards-AI vector database files

### 2. Install Ollama and Qwen Model
```bash
# Install Ollama (Windows)
# Download from https://ollama.ai/

# Pull Qwen model
ollama pull qwen3:4b-instruct

# Start Ollama service
ollama serve
```

### 3. Setup Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 4. Install AI Dependencies (if not already in Indian-Standards-AI)
The AI dependencies should already be in `Indian-Standards-AI/.venv`. If not:
```bash
cd Indian-Standards-AI
pip install ollama faiss-cpu sentence-transformers numpy
```

## Configuration

### Backend Configuration
Create `backend/.env`:
```env
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=false
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
LOG_LEVEL=INFO
```

### Frontend Configuration
Create `.env` in the root directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_AI_API_BASE_URL=http://localhost:8000
```

## Running the Application

### 1. Start Ollama Service
```bash
ollama serve
```

### 2. Start FastAPI Backend
```bash
cd backend
python main.py
```

The API will be available at `http://localhost:8000`

### 3. Start React Frontend
```bash
npm run dev
```

The React app will be available at `http://localhost:5173`

## API Endpoints

### Health Check
```
GET /api/ai/health
```

### Requirement Understanding
```
POST /api/ai/understand
Content-Type: application/json

{
  "title": "Desktop Computers and Workstations",
  "description": "Procurement of desktop computers...",
  "category": "IT Hardware",
  "quantity": "85",
  "budget": "4500000",
  "department": "Central Public Works Dept",
  "deadline": "2026-09-30"
}
```

### Standards Analysis
```
POST /api/ai/analyze-standards
Content-Type: application/json

{
  "requirement": {
    "product": "Desktop Computers",
    "category": "IT Hardware",
    "technical_requirements": [...]
  }
}
```

## Testing the Integration

### Test Flow
1. Open React app at `http://localhost:5173`
2. Navigate to procurement input
3. Enter requirement details:
   - Title: "Desktop Computers and Workstations"
   - Description: "Procurement of desktop computers for government offices with minimum 8GB RAM, 512GB SSD, Windows 11 and 3 years warranty."
   - Category: "IT Hardware"
   - Quantity: "85"
   - Department: "Central Public Works Dept"
4. Click "Understand Requirements"
5. Verify AI understanding appears on the Understand screen
6. Confirm the understanding
7. Wait for RAG analysis to complete
8. Verify real standards appear on the Output screen

### Expected Results
- Qwen should extract structured requirements
- RAG should return applicable Indian Standards from the vector database
- No hardcoded IS 18721:2024 should appear in the AI flow
- Firebase should store the AI responses

## Troubleshooting

### Ollama Connection Issues
- Ensure Ollama service is running: `ollama serve`
- Verify Qwen model is available: `ollama list`
- Check if model is pulled: `ollama pull qwen3:4b-instruct`

### Vector Database Issues
- Ensure vector database files exist in `Indian-Standards-AI/data/vector_db/`
- Verify files: `standards.index`, `standards_metadata.json`
- Check that Indian-Standards-AI directory path is correct in `backend/config.py`

### CORS Issues
- Verify CORS origins in backend config
- Check that frontend URL is in CORS_ORIGINS
- Ensure backend is running before frontend

### Firebase Issues
- Verify Firebase credentials in `.env`
- Check Firestore rules allow writes
- Ensure user is authenticated

## Firebase Schema

Procurement documents now include:
```javascript
{
  // ... existing fields
  
  // AI Understanding
  understanding: {
    product: "...",
    category: "...",
    quantity: "...",
    budget: "...",
    department: "...",
    deadline: "...",
    intended_purpose: "...",
    application_environment: "...",
    technical_requirements: [...]
  },
  understandingStatus: "pending | confirmed",
  
  // Standards Analysis
  standardsAnalysis: {
    applicability: "...",
    primary_standard: {...},
    match_confidence: 0,
    why_this_standard: "...",
    technical_specifications: [...],
    safety_measures: [...],
    implementation_measures: [...],
    aligned_standards: [...],
    certification_requirements: [...],
    final_recommendation: "..."
  },
  
  // AI Status Tracking
  aiStatus: {
    understanding: "pending | processing | completed | failed",
    standards: "pending | processing | completed | failed"
  },
  
  // Error Tracking
  aiErrors: {
    stage: "...",
    message: "...",
    timestamp: "..."
  }
}
```

## Development Notes

### Backend Architecture
- **FastAPI**: Web framework for API endpoints
- **Pydantic**: Data validation and serialization
- **Services**: Thin adapters around existing AI functions
- **Config**: Environment-based configuration

### Frontend Integration
- **aiService.js**: Centralized API client
- **Environment variables**: Configurable API base URL
- **Error handling**: Graceful degradation with user feedback
- **Loading states**: Proper UI feedback during API calls

### Key Integration Points
1. **TextSpecificationPage**: Calls `/api/ai/understand` on form submit
2. **UnderstandRequirementPage**: Displays real Qwen understanding
3. **AIProcessingPage**: Calls `/api/ai/analyze-standards` in background
4. **AnalysisOutputPage**: Displays real RAG results from Firebase

## Important Notes

- **DO NOT** modify existing AI functions in Indian-Standards-AI
- **DO NOT** hardcode AI results in React components
- **DO NOT** call Ollama directly from React
- **DO** use the FastAPI backend as the only interface
- **DO** store AI responses in Firebase for persistence
- **DO** implement proper error handling for AI failures

## Next Steps

After successful integration:
1. Test with various procurement requirements
2. Monitor AI service logs for performance
3. Optimize RAG retrieval if needed
4. Add more standards to the knowledge base
5. Implement Phase 2 features (vendor marketplace, etc.)