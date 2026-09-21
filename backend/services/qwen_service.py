import sys
import logging
import time
from pathlib import Path
from typing import Dict, Any, List

try:
    # Use absolute path to avoid naming conflicts
    import sys
    from pathlib import Path
    ai_package_path = Path(__file__).resolve().parent.parent / "Indian-Standards-AI(1)" / "Indian-Standards-AI"
    src_path = ai_package_path / "src"
    
    if str(src_path) not in sys.path:
        sys.path.insert(0, str(src_path))
    
    from llm.requirement_understanding import understand_requirement
    QWEN_AVAILABLE = True
except ImportError as e:
    logging.warning(f"Qwen requirement understanding not available: {e}")
    QWEN_AVAILABLE = False
    understand_requirement = None

logger = logging.getLogger(__name__)


class QwenService:
    """Service for Qwen-based requirement understanding."""
    
    def __init__(self):
        self.available = QWEN_AVAILABLE
        
    def is_available(self) -> bool:
        """Check if Qwen service is available."""
        return self.available
        
    def understand_requirement(
        self,
        title: str,
        description: str,
        category: str = "",
        quantity: str = "",
        budget: str = "",
        department: str = "",
        deadline: str = ""
    ) -> Dict[str, Any]:
        """
        Call the existing Qwen requirement understanding function.
        
        Args:
            title: Requirement title
            description: Procurement description
            category: Product category
            quantity: Estimated quantity
            budget: Estimated budget
            department: Department name
            deadline: Submission deadline
            
        Returns:
            Dictionary with structured understanding
        """
        if not self.available:
            raise RuntimeError("Qwen service is not available")
            
        print("[QS] QwenService.understand_requirement called")
        start_time = time.time()
        logger.info("[PERF] Understanding started")
        logger.info(f"[AI] Understanding requirement: {title}")
        
        try:
            result = understand_requirement(
                title=title,
                description=description,
                category=category,
                quantity=quantity,
                budget=budget,
                department=department,
                deadline=deadline
            )
            
            total_time = time.time() - start_time
            print(f"[QS] QwenService.understand_requirement completed: {total_time:.4f}s")
            logger.info(f"[PERF] Understanding completed: {total_time:.2f} sec")
            logger.info(f"[AI] Qwen completed successfully")
            logger.info(f"[AI] Extracted {len(result.get('technical_requirements', []))} requirements")
            
            return result
            
        except Exception as e:
            print(f"[QS] QwenService.understand_requirement failed: {e}")
            logger.error(f"[AI] Qwen understanding failed: {e}")
            raise RuntimeError(f"Qwen understanding failed: {str(e)}") from e


# Singleton instance
qwen_service = QwenService()