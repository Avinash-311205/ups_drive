# Simple RAG service (local)

This folder contains a minimal Retrieval-Augmented-Generation (RAG) service implemented with FastAPI.

Features
- Upload PDF files (POST /upload) — extracts text, chunks it, and builds a TF-IDF index.
- Ask questions (POST /qa) — retrieves top matching chunks and returns a short extractive answer.

Notes
- This implementation uses a TF-IDF retriever (scikit-learn) and a simple extractive answer method. No external LLM is required.
- To use a hosted LLM for better answers, set `OPENAI_API_KEY` (or adapt code) and the service will include a prompt to OpenAI (not implemented by default).

Quick start

1. Create a virtual environment and install dependencies:

```bash
cd "RAG MODEL"
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Run the server:

```bash
uvicorn app:app --reload --port 8001
```

3. Upload a PDF (example with curl):

```bash
curl -F "file=@/path/to/doc.pdf" http://localhost:8001/upload
```

4. Ask a question:

```bash
curl -H "Content-Type: application/json" -d '{"question":"How many leave days does the employee have?"}' http://localhost:8001/qa
```

Files
- `app.py` — FastAPI application and endpoints
- `rag_utils.py` — PDF parsing, chunking, indexing and query helpers
- `requirements.txt` — Python dependencies
