from typing import List

from pydantic import BaseModel, Field


class GeminiResumeAnalysis(BaseModel):
    score: int = Field(..., ge=0, le=100)
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]


class ResumeAnalysis(GeminiResumeAnalysis):
    processing_time: float = Field(..., ge=0)