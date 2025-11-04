from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os, fitz, requests, tempfile, json, re
from datetime import datetime
import google.generativeai as genai

from dotenv import load_dotenv
load_dotenv(dotenv_path="./.env")


# ------------------- CONFIG -------------------
GEMINI_API_KEY = os.getenv("GEMINI_KEY")
if not GEMINI_API_KEY:
    raise ValueError("⚠️ Missing GEMINI_API_KEY environment variable")

genai.configure(api_key=GEMINI_API_KEY)

SYSTEM_PROMPT = """
You are an AI Safety Auditor specialized in mining domain analysis.
You will receive the text of a DGMS circular or safety notice.
Your task is to create a structured, factual, and concise audit report in JSON format.

The report must contain:
{
  "title": "Extracted title of circular if available",
  "summary_points": ["key bullet points in neutral tone"],
  "hazard_types": ["Inundation", "Gas Explosion", "Machinery Accident", "Heat Stress", "Legislative"],
  "preventive_measures": ["safety actions advised"],
  "regulatory_references": ["any laws or rules mentioned"],
  "risk_level": "Low | Medium | High",
  "region_or_mines": ["if mentioned"],
  "issued_date": "YYYY-MM-DD or empty string",
  "source": "DGMS Circular / Technical Circular / Safety Alert",
  "raw_excerpt": "first 500 characters of the circular",
  "audit_recommendations": [
      "actions to be taken by mine management based on the document"
  ]
}

Rules:
- Be factual and concise. No hallucination.
- If a field is unknown, return an empty string or [].
- Output must be **valid JSON only**. No markdown or prose.
"""

# ------------------- FASTAPI -------------------
app = FastAPI(title="DGMS Audit Report Generator", version="1.0")

class PDFRequest(BaseModel):
    pdf_url: str


def download_pdf(url: str) -> str:
    """Download PDF and return local temp path"""
    print(f"📥 Downloading: {url}")
    r = requests.get(url, timeout=60)
    r.raise_for_status()
    tmp_path = os.path.join(tempfile.gettempdir(), os.path.basename(url.split("?")[0]))
    with open(tmp_path, "wb") as f:
        f.write(r.content)
    return tmp_path


def extract_text(pdf_path: str) -> str:
    """Extract text from PDF using PyMuPDF"""
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text("text")
    return text.strip()


def summarize_with_gemini(text: str, model_name="gemini-2.0-flash") -> dict:
    """Send structured prompt to Gemini and parse JSON"""
    model = genai.GenerativeModel(model_name)
    prompt = f"{SYSTEM_PROMPT}\n\n---\nDocument:\n{text[:10000]}"
    response = model.generate_content(prompt)

    raw = response.text.strip()
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        cleaned = re.search(r"\{.*\}", raw, re.S)
        if cleaned:
            return json.loads(cleaned.group(0))
        else:
            return {"error": "Gemini returned invalid JSON", "raw": raw}


@app.post("/generate_audit_report")
def generate_audit_report(req: PDFRequest):
    """Fetch a PDF, extract text, and summarize it using Gemini."""
    try:
        pdf_path = download_pdf(req.pdf_url)
        text = extract_text(pdf_path)
        if not text:
            raise HTTPException(status_code=400, detail="No text extracted from PDF")
        
        summary = summarize_with_gemini(text)
        summary["pdf_url"] = req.pdf_url
        summary["generated_at"] = datetime.now().isoformat()

        return summary

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


@app.post("/generate_and_store_audit_report")
def generate_and_store_audit_report(req: PDFRequest):
    report = generate_audit_report(req)
    supabase.table("audit_reports").insert(report).execute()
    return {"status": "stored", "report": report}
