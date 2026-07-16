import logging
import time
import requests

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    HTTPException,
    status,
)
from fastapi.middleware.cors import CORSMiddleware

from ai.analyzer import analyze_resume
from schemas import ResumeAnalysis, EmailRequest
from utils.pdf import extract_text
from utils.prompts import RESUME_ANALYSIS_PROMPT


logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s | %(message)s"
)

logger = logging.getLogger(__name__)


app = FastAPI(
    title="AI Resume Analyzer API",
    description="Analyze resumes using Google Gemini AI and receive ATS resume feedback.",
    version="1.0.0",
)

N8N_WEBHOOK = "http://localhost:5678/webhook/resume-analysis"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "application": "AI Resume Analyzer",
        "version": "1.0.0",
        "status": "Running",
    }


@app.post("/analyze", response_model=ResumeAnalysis)
async def analyze_endpoint(
    file: UploadFile = File(...),
    job_description: str = Form("")
):

    logger.info("Resume received for analysis.")

    start = time.perf_counter()

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported."
        )

    resume_text = extract_text(file.file)

    if not resume_text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The uploaded PDF contains no readable text. Please upload a text-based PDF."
        )

    if not job_description.strip():
        job_description = "No job description was provided."

    try:

        logger.info("Sending resume to Gemini.")

        analysis = analyze_resume(
            resume_text,
            job_description,
            RESUME_ANALYSIS_PROMPT
        )

        processing_time = round(
            time.perf_counter() - start,
            2
        )

        response = ResumeAnalysis(
            score=analysis.score,
            strengths=analysis.strengths,
            weaknesses=analysis.weaknesses,
            suggestions=analysis.suggestions,
            processing_time=processing_time
        )

        logger.info("Gemini analysis completed.")

        return response

    except Exception as gemini_error:

        logger.error(gemini_error)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze the resume using Gemini AI."
        )
    
@app.post("/send-email")
async def send_email(request: EmailRequest):

    try:

        response = requests.post(
            N8N_WEBHOOK,
            json=request.model_dump(),
            timeout=10
        )

        response.raise_for_status()

        return {
            "message": "Email request sent successfully."
        }

    except Exception as e:

        logger.error(e)

        raise HTTPException(
            status_code=500,
            detail="Failed to send email."
        )