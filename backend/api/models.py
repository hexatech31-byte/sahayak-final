from pydantic import BaseModel, Field
from typing import List, Optional, Any


# ============================================================================
# REQUEST MODELS
# ============================================================================

class UnderstandRequest(BaseModel):
    title: str = Field(..., description="Requirement title")
    description: str = Field(..., description="Procurement description")
    category: Optional[str] = Field("", description="Product category")
    quantity: Optional[str] = Field("", description="Estimated quantity")
    budget: Optional[str] = Field("", description="Estimated budget")
    department: Optional[str] = Field("", description="Department name")
    deadline: Optional[str] = Field("", description="Submission deadline")


class AnalyzeStandardsRequest(BaseModel):
    requirement: dict = Field(..., description="Structured requirement from Qwen")


class GenerateTenderRequest(BaseModel):
    requirement: dict = Field(..., description="Original procurement requirement")
    standard_analysis: dict = Field(..., description="RAG analysis from Layer 2")


# ============================================================================
# RESPONSE MODELS
# ============================================================================

class TechnicalRequirement(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class UnderstandingResponse(BaseModel):
    product: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[str] = None
    budget: Optional[str] = None
    department: Optional[str] = None
    deadline: Optional[str] = None
    intended_purpose: Optional[str] = None
    application_environment: Optional[str] = None
    technical_requirements: List[TechnicalRequirement] = []


class PrimaryStandard(BaseModel):
    standard_number: Optional[str] = None
    title: Optional[str] = None
    evidence_ids: List[int] = []


class AlignedStandard(BaseModel):
    standard_number: Optional[str] = None
    relationship: Optional[str] = None
    source_evidence_ids: List[int] = []


class TechnicalSpec(BaseModel):
    requirement: Optional[str] = None
    source_evidence_ids: List[int] = []


class Measure(BaseModel):
    requirement: Optional[str] = None
    source_evidence_ids: List[int] = []


class CertificationRequirement(BaseModel):
    requirement: Optional[str] = None
    source_evidence_ids: List[int] = []


class TenderClause(BaseModel):
    text: Optional[str] = None
    source_type: Optional[str] = None
    evidence_ids: List[int] = []


class TenderSection(BaseModel):
    number: int
    title: Optional[str] = None
    source_type: Optional[str] = None
    reference: Optional[str] = None
    clauses: List[TenderClause] = []


class TenderSpecificationResponse(BaseModel):
    sections: List[TenderSection] = []


class StandardsAnalysisResponse(BaseModel):
    applicability: Optional[str] = None
    primary_standard: Optional[PrimaryStandard] = None
    match_confidence: int = 0
    why_this_standard: Optional[str] = None
    technical_specifications: List[TechnicalSpec] = []
    safety_measures: List[Measure] = []
    implementation_measures: List[Measure] = []
    aligned_standards: List[AlignedStandard] = []
    certification_requirements: List[CertificationRequirement] = []
    final_recommendation: Optional[str] = None


# ============================================================================
# API RESPONSE WRAPPERS
# ============================================================================

class UnderstandAPIResponse(BaseModel):
    success: bool
    understanding: Optional[UnderstandingResponse] = None
    error: Optional[str] = None


class AnalyzeStandardsAPIResponse(BaseModel):
    success: bool
    analysis: Optional[StandardsAnalysisResponse] = None
    error: Optional[str] = None


class GenerateTenderAPIResponse(BaseModel):
    success: bool
    tender: Optional[TenderSpecificationResponse] = None
    error: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    qwen_available: bool
    vector_db_available: bool
    embedding_model_available: bool