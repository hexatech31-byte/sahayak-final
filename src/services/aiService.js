// AI Service for communicating with FastAPI backend
const API_BASE_URL = import.meta.env.VITE_AI_API_BASE_URL || 'http://localhost:8000';

/**
 * AI Service for procurement analysis
 */
class AIService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Check if AI backend is healthy
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai/health`);
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('AI health check failed:', error);
      throw error;
    }
  }

  /**
   * Understand procurement requirement using Qwen
   */
  async understandRequirement(data) {
    try {
      console.log('[AI] Sending requirement understanding request:', data);
      
      const response = await fetch(`${this.baseUrl}/api/ai/understand`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          category: data.category || '',
          quantity: data.quantity || '',
          budget: data.budget || '',
          department: data.department || '',
          deadline: data.deadline || ''
        }),
      });

      if (!response.ok) {
        throw new Error(`Understanding request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('[AI] Understanding response:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Understanding failed');
      }

      return result.understanding;
    } catch (error) {
      console.error('[AI] Understanding requirement failed:', error);
      throw error;
    }
  }

  /**
   * Analyze standards using RAG
   */
  async analyzeStandards(requirement) {
    try {
      console.log('[AI] Sending standards analysis request:', requirement);
      console.log('[DEBUG] FRONTEND → RAG REQUEST:', JSON.stringify({ requirement: requirement }, null, 2));
      
      const response = await fetch(`${this.baseUrl}/api/ai/analyze-standards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requirement: requirement
        }),
      });

      if (!response.ok) {
        throw new Error(`Standards analysis request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('[AI] Standards analysis response:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Standards analysis failed');
      }

      return result.analysis;
    } catch (error) {
      console.error('[AI] Standards analysis failed:', error);
      throw error;
    }
  }

  /**
   * Generate tender specification
   */
  async generateTender(requirement, standardAnalysis) {
    try {
      console.log('[AI] Sending tender generation request:', { requirement, standardAnalysis });
      console.log('[DEBUG] FRONTEND → TENDER REQUEST:', JSON.stringify({ 
        requirement: requirement, 
        standard_analysis: standardAnalysis 
      }, null, 2));
      
      const response = await fetch(`${this.baseUrl}/api/ai/generate-tender`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requirement: requirement,
          standard_analysis: standardAnalysis
        }),
      });

      if (!response.ok) {
        throw new Error(`Tender generation request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('[AI] Tender generation response:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Tender generation failed');
      }

      return result.tender;
    } catch (error) {
      console.error('[AI] Tender generation failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const aiService = new AIService();