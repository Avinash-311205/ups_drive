import os
import shutil
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from rag_utils import extract_text_from_pdf, chunk_text, build_index, load_index, query_index, extractive_answer, INDEX_PATH

DATA_FOLDER = os.path.join(os.path.dirname(__file__), 'data')
os.makedirs(DATA_FOLDER, exist_ok=True)

app = FastAPI(title='Simple RAG Service')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

class QARequest(BaseModel):
    question: str
    top_k: int = 3

@app.post('/upload')
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail='Only PDF uploads are supported')
    dest = os.path.join(DATA_FOLDER, file.filename)
    with open(dest, 'wb') as f:
        shutil.copyfileobj(file.file, f)

    text = extract_text_from_pdf(dest)
    chunks = chunk_text(text, chunk_size=400, overlap=50)
    if not chunks:
        raise HTTPException(status_code=500, detail='Failed to extract any text from PDF')
    index = build_index(chunks)
    return {'ok': True, 'chunks': len(chunks)}

@app.post('/qa')
async def qa(req: QARequest):
    index = load_index()
    if not index:
        raise HTTPException(status_code=400, detail='No index found. Upload a PDF first via /upload')
    results = query_index(req.question, index, top_k=req.top_k)
    # results -> list of (idx, score, chunk)
    context_chunks = [r[2] for r in results]
    answer = extractive_answer(req.question, context_chunks)
    return {
        'question': req.question,
        'answer': answer,
        'sources': [{'index': r[0], 'score': r[1], 'text': r[2][:1000]} for r in results]
    }

@app.get('/health')
def health():
    return {'status': 'ok', 'index_exists': os.path.exists(INDEX_PATH)}
