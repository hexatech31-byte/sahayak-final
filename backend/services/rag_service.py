import sys
import json
import logging
import time
from pathlib import Path
from typing import Dict, Any, List

# Lazy import to avoid blocking startup
RAG_AVAILABLE = True
analyze_standards = None
get_relevant_results = None
generate_tender_specification = None

def _import_rag_modules():
    """Lazy import RAG modules when needed."""
    global analyze_standards, get_relevant_results, generate_tender_specification, RAG_AVAILABLE
    try:
        # Import Stage 1 & 2 from Indian-Standards-AI (with new vector database)
        # Rely on main.py path configuration
        from llm.standard_analysis import analyze_standards as _analyze
        from retrieval.search_bis import get_relevant_results as _retrieve
        analyze_standards = _analyze
        get_relevant_results = _retrieve

        print(f"[DEBUG] Successfully loaded analyze_standards from configured path")

        # Import Stage 3 tender generation
        try:
            from llm.tender_generation import generate_tender_specification as _tender
            generate_tender_specification = _tender
        except ImportError:
            print("[WARNING] Tender generation not available")

        RAG_AVAILABLE = True
        logging.info("RAG modules loaded successfully")
    except ImportError as e:
        logging.warning(f"RAG service not available: {e}")
        RAG_AVAILABLE = False

logger = logging.getLogger(__name__)


class RAGService:
    """Service for RAG-based standards analysis."""
    
    def __init__(self):
        self.available = RAG_AVAILABLE
        
    def is_available(self) -> bool:
        """Check if RAG service is available."""
        return self.available
        
    def analyze_standards(self, requirement: Dict[str, Any]) -> Dict[str, Any]:
        """
        Call the existing RAG pipeline for standards analysis.
        
        Args:
            requirement: Structured requirement from Qwen
            
        Returns:
            Dictionary with standards analysis results
        """
        # Lazy import on first use
        _import_rag_modules()
        
        if not self.available:
            raise RuntimeError("RAG service is not available")
            
        start_time = time.time()
        logger.info("[TIMING] API request received for /analyze-standards")
        logger.info("[PERF] Standards analysis started")
        logger.info("[RAG] Starting standards analysis...")
        logger.info(f"[DEBUG] REQUIREMENT SENT TO ORIGINAL RAG: {requirement}")
        
        try:
            # Build query from requirement
            query_parts = []
            if requirement.get("title"):
                query_parts.append(requirement["title"])
            if requirement.get("description"):
                query_parts.append(requirement["description"])
            if requirement.get("category"):
                query_parts.append(requirement["category"])
            if requirement.get("intended_purpose"):
                query_parts.append(requirement["intended_purpose"])
            if requirement.get("application_environment"):
                query_parts.append(requirement["application_environment"])
                
            # Add technical requirements (only if non-empty)
            tech_reqs = requirement.get("technical_requirements", [])
            if isinstance(tech_reqs, list) and tech_reqs:
                for req in tech_reqs:
                    if isinstance(req, dict):
                        query_parts.append(req.get("name", ""))
                        query_parts.append(req.get("description", ""))
                    else:
                        query_parts.append(str(req))
            
            query = " ".join(query_parts)
            logger.info(f"[RAG] Built query: {query[:100]}...")
            logger.info(f"[DEBUG] RAG SEARCH QUERY: {query}")
            
            # Retrieve relevant documents
            retrieval_start = time.time()
            logger.info("[PERF] Retrieval started")
            logger.info("[RAG] Retrieving standards from vector database...")
            # Keep a modestly wider evidence pool. Product-specific standards can
            # rank just below broad catalogue introductions; final selection remains
            # evidence-grounded in standard_analysis.py.
            retrieved_results = get_relevant_results(query, top_k=10)
            retrieval_time = time.time() - retrieval_start
            logger.info(f"[PERF] Retrieval completed: {retrieval_time:.2f} sec")
            logger.info(f"[RAG] Retrieved {len(retrieved_results)} results")
            
            # Log the first few results to see what was retrieved
            if retrieved_results:
                logger.info(f"[DEBUG] === COMPLETE RETRIEVED EVIDENCE FOR: {query[:50]}... ===")
                for i, result in enumerate(retrieved_results[:5]):
                    # Handle new metadata structure
                    std_nums = result.get('standard_numbers', [])
                    std_num = std_nums[0] if std_nums else result.get('standard_number', 'Unknown')
                    title = result.get('document_title', result.get('standard_title', 'Unknown'))
                    source_pdf = result.get('source_pdf', 'Unknown')
                    similarity = result.get('similarity', 0)
                    text = result.get('text', '')
                    
                    if title and isinstance(title, str):
                        title = title[:100]
                    elif title is None:
                        title = 'Unknown'
                    
                    logger.info(f"[DEBUG] RAG RESULT {i+1}:")
                    logger.info(f"[DEBUG]   Standard: {std_num}")
                    logger.info(f"[DEBUG]   Title: {title}")
                    logger.info(f"[DEBUG]   Source PDF: {source_pdf}")
                    logger.info(f"[DEBUG]   Similarity: {similarity:.4f}")
                    logger.info(f"[DEBUG]   Text preview: {text[:200]}...")
                logger.info(f"[DEBUG] === END RETRIEVED EVIDENCE ===")
            
            # Analyze with Qwen
            analysis_start = time.time()
            logger.info("[PERF] RAG analysis started")
            logger.info("[RAG] Analyzing retrieved evidence with Qwen...")
            analysis = analyze_standards(requirement, retrieved_results)
            analysis_time = time.time() - analysis_start
            logger.info(f"[PERF] RAG analysis completed: {analysis_time:.2f} sec")
            logger.info("[RAG] Analysis completed")
            
            total_time = time.time() - start_time
            logger.info(f"[PERF] Standards analysis completed: {total_time:.2f} sec")
            logger.info(f"[TIMING] API response sent - total time: {total_time:.2f}s")
            
            return analysis
            
        except Exception as e:
            logger.error(f"[RAG] Standards analysis failed: {e}")
            raise RuntimeError(f"RAG analysis failed: {str(e)}") from e

    def generate_tender(self, requirement: Dict[str, Any], standard_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate tender specification using Qwen.
        
        Args:
            requirement: Original procurement requirement
            standard_analysis: RAG analysis from Layer 2
            
        Returns:
            Dictionary with tender specification (7 sections)
        """
        # Lazy import on first use
        _import_rag_modules()
        
        if not self.available:
            raise RuntimeError("RAG service is not available")
            
        start_time = time.time()
        logger.info("[PERF] Tender generation started")
        logger.info("[RAG] Starting tender generation...")
        logger.info(f"[DEBUG] TENDER GENERATION INPUT - REQUIREMENT: {requirement}")
        logger.info(f"[DEBUG] TENDER GENERATION INPUT - STANDARD ANALYSIS: {standard_analysis}")
        
        try:
            # Build query to retrieve evidence (same as in analyze_standards)
            query_parts = []
            if requirement.get("title"):
                query_parts.append(requirement["title"])
            if requirement.get("description"):
                query_parts.append(requirement["description"])
            if requirement.get("category"):
                query_parts.append(requirement["category"])
            if requirement.get("intended_purpose"):
                query_parts.append(requirement["intended_purpose"])
            if requirement.get("application_environment"):
                query_parts.append(requirement["application_environment"])
                
            # Add technical requirements (only if non-empty)
            tech_reqs = requirement.get("technical_requirements", [])
            if isinstance(tech_reqs, list) and tech_reqs:
                for req in tech_reqs:
                    if isinstance(req, dict):
                        query_parts.append(req.get("name", ""))
                        query_parts.append(req.get("description", ""))
                    else:
                        query_parts.append(str(req))
            
            query = " ".join(query_parts)
            logger.info(f"[RAG] Retrieving evidence for tender generation: {query[:100]}...")
            
            # Retrieve evidence
            retrieval_start = time.time()
            logger.info("[PERF] Tender evidence retrieval started")
            retrieved_results = get_relevant_results(query, top_k=10)
            retrieval_time = time.time() - retrieval_start
            logger.info(f"[PERF] Tender evidence retrieval completed: {retrieval_time:.2f} sec")
            logger.info(f"[RAG] Retrieved {len(retrieved_results)} evidence items for tender generation")
            
            # Add evidence IDs for tender generation
            evidence_with_ids = []
            for i, result in enumerate(retrieved_results, start=1):
                evidence_item = result.copy()
                evidence_item["id"] = i
                evidence_with_ids.append(evidence_item)
            
            # Generate tender specification
            tender_start = time.time()
            logger.info("[PERF] Tender specification generation started")
            logger.info("[RAG] Generating tender specification with Qwen...")
            tender = generate_tender_specification(requirement, standard_analysis, evidence_with_ids)
            tender_time = time.time() - tender_start
            logger.info(f"[PERF] Tender specification generation completed: {tender_time:.2f} sec")
            logger.info("[RAG] Tender generation completed")
            
            total_time = time.time() - start_time
            logger.info(f"[PERF] Tender generation completed: {total_time:.2f} sec")
            
            return tender
            
        except Exception as e:
            logger.error(f"[RAG] Tender generation failed: {e}")
            raise RuntimeError(f"Tender generation failed: {str(e)}") from e


# Singleton instance
rag_service = RAGService()
