# AI Resume Analyzer

An AI powered resume analysis platform that evaluates resumes using Google Gemini AI, provides ATS-style feedback, and automatically emails a detailed report through an n8n workflow.

This project was developed as the **final project for the AI & Automation Summer School conducted by ISTE MIT Manipal**. The objective was to design and deploy a complete AI automation workflow by combining Large Language Models, backend APIs, workflow automation, and cloud deployment into a real-world application.

---

## Project Overview

Recruiters often spend only a few seconds scanning a resume before deciding whether to continue reading it. Most resumes are also filtered through Applicant Tracking Systems (ATS), which evaluate formatting, keyword relevance, and technical skills before a recruiter even sees the document.

This project aims to simulate that process using Google's Gemini AI.

Users can upload their resume in PDF format, optionally provide a job description, and receive an AI-generated analysis containing:

- ATS Compatibility Score
- Resume Strengths
- Resume Weaknesses
- Actionable Suggestions
- Processing Time

After the analysis is complete, users can enter their email address and instantly receive a formatted report through an automated n8n workflow.

---

# Features

- AI-powered resume evaluation using Google Gemini 2.5 Flash
- ATS-style resume scoring
- Optional job description matching
- PDF text extraction
- Automated email delivery
- Responsive frontend
- Fully deployed cloud architecture
- Production-ready webhook automation
- JSON schema validated AI responses
- Fast API response times

---

# Screenshots

## Home Page


<img width="2438" height="1494" alt="image" src="https://github.com/user-attachments/assets/bcbf4612-4322-4e50-bd89-721c2fe03a12" />


---

## Email Report


<img width="1984" height="1086" alt="image" src="https://github.com/user-attachments/assets/1694d981-7bbb-4f9c-acc2-f9a0a8b41481" />


## n8n Workflow

The automation pipeline responsible for sending personalized email reports.


<img width="1304" height="406" alt="image" src="https://github.com/user-attachments/assets/ffa8df06-6682-43c9-a834-ff3bced8f772" />


---

# System Architecture

```
                     User
                       │
                       ▼
        HTML • CSS • JavaScript Frontend
                 (Hosted on Netlify)
                       │
                       ▼
             FastAPI Backend (Render)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
 Google Gemini API            Railway Hosted n8n
         │                           │
         │                           ▼
         │                     Gmail API
         │                           │
         └──────────────► Personalized Email
```

---

# How It Works

## 1. Resume Upload

The user uploads a PDF resume through the frontend.

An optional job description can also be supplied for role-specific evaluation.

---

## 2. FastAPI Backend

The frontend sends the resume as a multipart form request to the FastAPI backend.

The backend:

- validates the uploaded file
- extracts text from the PDF
- validates user input
- prepares the prompt for Gemini

---

## 3. PDF Processing

The uploaded PDF is processed using **pdfplumber**.

Instead of sending the PDF itself to Gemini, the backend extracts readable text from every page and combines it into a single string.

This reduces token usage while improving AI accuracy.

---

## 4. AI Analysis

The extracted resume text and optional job description are combined with a carefully engineered prompt before being sent to **Google Gemini 2.5 Flash**.

Gemini performs an ATS-style review and returns structured JSON containing:

- Resume Score
- Strengths
- Weaknesses
- Suggestions

Instead of parsing free-form AI text manually, the response is validated directly using **Pydantic response schemas**, ensuring consistent and reliable outputs.

---

## 5. Displaying Results

The frontend dynamically renders:

- ATS Score
- Animated score progress bar
- Resume strengths
- Resume weaknesses
- Improvement suggestions
- Processing time

Without requiring a page refresh.

---

## 6. Automated Email Workflow

After viewing the report, users can request an emailed copy.

The frontend sends the complete analysis to a dedicated FastAPI endpoint.

The backend forwards this data to a production **n8n Webhook** hosted on Railway.

The workflow then:

1. Receives the webhook payload.
2. Maps the incoming fields.
3. Formats the email.
4. Sends the report using Gmail.
5. Returns a success response back to FastAPI.

This allows the backend to remain lightweight while delegating automation responsibilities to n8n.

---

# Tech Stack

| Technology | Purpose |
|------------|----------|
| HTML | Application structure |
| CSS | Responsive styling |
| JavaScript | Frontend interactions |
| FastAPI | REST API backend |
| Google Gemini 2.5 Flash | Resume analysis |
| pdfplumber | PDF text extraction |
| Pydantic | Data validation |
| n8n | Workflow automation |
| Gmail API | Email delivery |
| Railway | n8n deployment |
| Render | Backend deployment |
| Netlify | Frontend deployment |
| Git & GitHub | Version control |

---

# AI Prompt Engineering

A custom prompt was designed to make Gemini behave as an experienced ATS recruiter.

The prompt instructs the model to evaluate:

- Resume structure
- ATS compatibility
- Technical skills
- Project quality
- Keyword relevance
- Experience
- Actionable improvements

It also forces Gemini to return **strict JSON**, making the output immediately usable by the backend without additional parsing.

---

# Project Structure

```
Resume Analyzer
│
├── Client
│   ├── index.html
│   ├── style.css
│   ├── script.js
│
├── Backend
│   ├── ai
│   │     └── analyzer.py
│   │
│   ├── utils
│   │     ├── pdf.py
│   │     └── prompts.py
│   │
│   ├── schemas.py
│   ├── app.py
│   └── requirements.txt
│
└── README.md
```

---

# API Endpoints

## Analyze Resume

```
POST /analyze
```

Accepts:

- PDF Resume
- Optional Job Description

Returns:

```json
{
    "score": 91,
    "strengths": [],
    "weaknesses": [],
    "suggestions": [],
    "processing_time": 2.4
}
```

---

## Send Email

```
POST /send-email
```

Accepts:

```json
{
    "email": "...",
    "filename": "...",
    "score": 91,
    "strengths": [],
    "weaknesses": [],
    "suggestions": []
}
```

The backend forwards this payload directly to the Railway-hosted n8n webhook.

---

# Deployment

| Component | Platform |
|------------|----------|
| Frontend | Netlify |
| Backend | Render |
| Workflow Automation | Railway |
| AI Model | Google Gemini API |
| Email Service | Gmail API |

---

# Acknowledgements

This project was built as the **final submission for the AI & Automation Summer School conducted by ISTE MIT Manipal**.

Special thanks to the mentors and organizers for introducing practical concepts including:

- FastAPI
- Workflow Automation
- n8n
- AI APIs
- Prompt Engineering
- Cloud Deployment

which made this project possible.

---

## Author

**Arunangshu Dasgupta**

B.Tech Computer Science Engineering  
Manipal Institute of Technology

GitHub: https://github.com/Arun-D-Algo
