import os

from dotenv import load_dotenv
from google import genai

from schemas import GeminiResumeAnalysis

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY").strip()
)


def analyze_resume(resume_text, job_description, prompt):

    if not job_description.strip():
        job_description = "No job description was provided."

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""
{prompt}

Job Description:
{job_description}

Resume:
{resume_text}
""",
        config={
            "response_mime_type": "application/json",
            "response_schema": GeminiResumeAnalysis,
            "temperature": 0.4,
        },
    )

    return response.parsed