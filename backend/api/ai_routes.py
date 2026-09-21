import logging
from fastapi import APIRouter, HTTPException
from api.models import (
    UnderstandRequest,
    UnderstandAPIResponse,
    AnalyzeStandardsRequest,
    AnalyzeStandardsAPIResponse,
    GenerateTenderRequest,
    GenerateTenderAPIResponse,
    HealthResponse
)
from services.qwen_service import qwen_service
from services.rag_service import rag_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ai", tags=["AI"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint for AI services."""
    return HealthResponse(
        status="ok",
        qwen_available=qwen_service.is_available(),
        vector_db_available=rag_service.is_available(),
        embedding_model_available=rag_service.is_available()
    )


@router.post("/understand", response_model=UnderstandAPIResponse)
async def understand_requirement(request: UnderstandRequest):
    """
    Understand procurement requirement using Qwen LLM.
    
    This endpoint takes a procurement requirement and returns structured
    understanding including product, category, technical requirements, etc.
    """
    import time
    try:
        print("[API] Received understand request")
        logger.info(f"[API] Received understand request for: {request.title}")
        logger.info(f"[DEBUG] UNDERSTAND API INPUT: {request}")
        
        api_start = time.time()
        
        # Call Qwen service
        result = qwen_service.understand_requirement(
            title=request.title,
            description=request.description,
            category=request.category or "",
            quantity=request.quantity or "",
            budget=request.budget or "",
            department=request.department or "",
            deadline=request.deadline or ""
        )
        
        api_time = time.time() - api_start
        print(f"[API] Total API time: {api_time:.4f}s")
        
        logger.info(f"[DEBUG] UNDERSTAND API OUTPUT: {result}")
        
        # Convert to response format
        from api.models import UnderstandingResponse, TechnicalRequirement
        
        # Handle technical requirements - could be list of strings or dicts
        tech_reqs = result.get("technical_requirements", [])
        formatted_tech_reqs = []
        
        for req in tech_reqs:
            if isinstance(req, dict):
                formatted_tech_reqs.append(TechnicalRequirement(
                    name=req.get("name"),
                    description=req.get("description")
                ))
            elif isinstance(req, str):
                formatted_tech_reqs.append(TechnicalRequirement(
                    name=req,
                    description=req
                ))
        
        understanding = UnderstandingResponse(
            product=result.get("product"),
            category=result.get("category"),
            quantity=result.get("quantity"),
            budget=result.get("budget"),
            department=result.get("department"),
            deadline=result.get("deadline"),
            intended_purpose=result.get("intended_purpose"),
            application_environment=result.get("application_environment"),
            technical_requirements=formatted_tech_reqs
        )
        
        logger.info("[API] Understanding completed successfully")
        return UnderstandAPIResponse(success=True, understanding=understanding)
        
    except Exception as e:
        print(f"[API] Understanding failed: {e}")
        logger.error(f"[API] Understanding failed: {e}")
        return UnderstandAPIResponse(
            success=False,
            understanding=None,
            error=str(e)
        )


@router.post("/analyze-standards", response_model=AnalyzeStandardsAPIResponse)
async def analyze_standards_endpoint(request: AnalyzeStandardsRequest):
    """
    Analyze procurement requirement against Indian Standards using RAG.

    This endpoint takes a structured requirement and returns applicable
    Indian Standards with evidence-backed analysis.
    """
    try:
        logger.info("[API] Received analyze-standards request")
        logger.info(f"[DEBUG] RAG API INPUT: {request.requirement}")
        
        # Call RAG service
        result = rag_service.analyze_standards(request.requirement)
        
        # Convert to response format
        from api.models import (
            StandardsAnalysisResponse,
            PrimaryStandard,
            AlignedStandard,
            TechnicalSpec,
            Measure,
            CertificationRequirement
        )
        
        # Handle primary standard
        primary_std_data = result.get("primary_standard")
        primary_standard = None
        if primary_std_data and isinstance(primary_std_data, dict):
            primary_standard = PrimaryStandard(
                standard_number=primary_std_data.get("standard_number"),
                title=primary_std_data.get("title"),
                evidence_ids=primary_std_data.get("evidence_ids", [])
            )
        
        # Handle aligned standards
        aligned_standards_data = result.get("aligned_standards", [])
        aligned_standards = []
        for aligned in aligned_standards_data:
            if isinstance(aligned, dict):
                aligned_standards.append(AlignedStandard(
                    standard_number=aligned.get("standard_number"),
                    relationship=aligned.get("relationship"),
                    source_evidence_ids=aligned.get("source_evidence_ids", [])
                ))
        
        # Handle technical specifications
        tech_specs_data = result.get("technical_specifications", [])
        technical_specifications = []
        for spec in tech_specs_data:
            if isinstance(spec, dict):
                technical_specifications.append(TechnicalSpec(
                    requirement=spec.get("requirement"),
                    source_evidence_ids=spec.get("source_evidence_ids", [])
                ))
        
        # Handle safety measures
        safety_data = result.get("safety_measures", [])
        safety_measures = []
        for measure in safety_data:
            if isinstance(measure, dict):
                safety_measures.append(Measure(
                    requirement=measure.get("requirement"),
                    source_evidence_ids=measure.get("source_evidence_ids", [])
                ))
        
        # Handle implementation measures
        impl_data = result.get("implementation_measures", [])
        implementation_measures = []
        for measure in impl_data:
            if isinstance(measure, dict):
                implementation_measures.append(Measure(
                    requirement=measure.get("requirement"),
                    source_evidence_ids=measure.get("source_evidence_ids", [])
                ))
        
        # Handle certification requirements
        cert_data = result.get("certification_requirements", [])
        certification_requirements = []
        for cert in cert_data:
            if isinstance(cert, dict):
                certification_requirements.append(CertificationRequirement(
                    requirement=cert.get("requirement"),
                    source_evidence_ids=cert.get("source_evidence_ids", [])
                ))
        
        analysis = StandardsAnalysisResponse(
            applicability=result.get("applicability"),
            primary_standard=primary_standard,
            match_confidence=result.get("match_confidence", 0),
            why_this_standard=result.get("why_this_standard"),
            technical_specifications=technical_specifications,
            safety_measures=safety_measures,
            implementation_measures=implementation_measures,
            aligned_standards=aligned_standards,
            certification_requirements=certification_requirements,
            final_recommendation=result.get("final_recommendation")
        )
        
        logger.info("[API] Standards analysis completed successfully")
        return AnalyzeStandardsAPIResponse(success=True, analysis=analysis)
        
    except Exception as e:
        logger.error(f"[API] Standards analysis failed: {e}")
        return AnalyzeStandardsAPIResponse(
            success=False,
            analysis=None,
            error=str(e)
        )


@router.post("/generate-tender")
async def generate_tender(request: GenerateTenderRequest):
    """
    Generate tender specification using Qwen.
    
    This endpoint takes the procurement requirement and RAG analysis
    and generates a formal tender specification with 7 sections.
    """
    try:
        logger.info("[API] Received generate-tender request")
        logger.info(f"[DEBUG] TENDER API INPUT - REQUIREMENT: {request.requirement}")
        logger.info(f"[DEBUG] TENDER API INPUT - STANDARD ANALYSIS: {request.standard_analysis}")
        
        # Validate that standard analysis is not a parsing error
        if not request.standard_analysis:
            logger.error("[API] Cannot generate tender: standard analysis is missing")
            return GenerateTenderAPIResponse(
                success=False,
                tender=None,
                error="Standard analysis is required before generating tender. Please complete standards analysis first."
            )
        
        # Check for parsing errors in the analysis
        why_text = request.standard_analysis.get("why_this_standard", "")
        if "invalid analysis response" in why_text or "parsing" in why_text.lower():
            logger.error("[API] Cannot generate tender: standard analysis contains parsing error")
            return GenerateTenderAPIResponse(
                success=False,
                tender=None,
                error="Standard analysis failed due to parsing error. Please retry standards analysis before generating tender."
            )
        
        # Call RAG service for tender generation
        result = rag_service.generate_tender(request.requirement, request.standard_analysis)
        
        # Convert to response format
        from api.models import (
            TenderSpecificationResponse,
            TenderSection,
            TenderClause
        )
        
        # Handle sections
        sections_data = result.get("sections", [])
        sections = []
        for section_data in sections_data:
            if isinstance(section_data, dict):
                # Handle clauses
                clauses_data = section_data.get("clauses", [])
                clauses = []
                for clause_data in clauses_data:
                    if isinstance(clause_data, dict):
                        clauses.append(TenderClause(
                            text=clause_data.get("text"),
                            source_type=clause_data.get("source_type"),
                            evidence_ids=clause_data.get("evidence_ids", [])
                        ))
                
                sections.append(TenderSection(
                    number=section_data.get("number"),
                    title=section_data.get("title"),
                    source_type=section_data.get("source_type"),
                    reference=section_data.get("reference"),
                    clauses=clauses
                ))
        
        tender = TenderSpecificationResponse(sections=sections)
        
        logger.info("[API] Tender generation completed successfully")
        return GenerateTenderAPIResponse(success=True, tender=tender)
        
    except Exception as e:
        logger.error(f"[API] Tender generation failed: {e}")
        return GenerateTenderAPIResponse(
            success=False,
            tender=None,
            error=str(e)
        )