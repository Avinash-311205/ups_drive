import os
import math
import pickle
from typing import List, Tuple
from PyPDF2 import PdfReader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

DATA_DIR = os.path.dirname(__file__)
INDEX_PATH = os.path.join(DATA_DIR, 'rag_index.pkl')

def extract_text_from_pdf(path: str) -> str:
    with open(path, 'rb') as f:
        file_bytes = f.read()

    # Accept the repository's text policy file even though it has a .pdf name.
    if not file_bytes.startswith(b'%PDF'):
        return file_bytes.decode('utf-8', errors='replace')

    reader = PdfReader(path)
    parts = []
    for p in reader.pages:
        try:
            parts.append(p.extract_text() or '')
        except Exception:
            continue
    return '\n'.join(parts)

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    if not text:
        return []
    text = text.replace('\r', '\n')
    tokens = text.split()
    chunks = []
    i = 0
    while i < len(tokens):
        chunk = tokens[i:i+chunk_size]
        chunks.append(' '.join(chunk))
        i += chunk_size - overlap
    return chunks

def build_index(chunks: List[str]):
    vectorizer = TfidfVectorizer(stop_words='english')
    X = vectorizer.fit_transform(chunks)
    index = {'vectorizer': vectorizer, 'matrix': X, 'chunks': chunks}
    with open(INDEX_PATH, 'wb') as f:
        pickle.dump(index, f)
    return index

def load_index():
    if not os.path.exists(INDEX_PATH):
        return None
    with open(INDEX_PATH, 'rb') as f:
        return pickle.load(f)

def query_index(question: str, index, top_k: int = 3) -> List[Tuple[int, float, str]]:
    if not index:
        return []
    vectorizer = index['vectorizer']
    matrix = index['matrix']
    chunks = index['chunks']
    q_vec = vectorizer.transform([question])
    sims = linear_kernel(q_vec, matrix).flatten()
    ranked_idx = sims.argsort()[::-1][:top_k]
    results = [(int(i), float(sims[i]), chunks[i]) for i in ranked_idx]
    return results

def extractive_answer(question: str, context_chunks: List[str]) -> str:
    # naive: return sentences from top chunks that contain question keywords
    import re
    words = [w.lower() for w in re.findall(r"\w+", question) if len(w) > 2]
    if not words:
        return 'No question terms found; returning context.'
    answers = []
    for c in context_chunks:
        sents = [s.strip() for s in c.split('.') if s.strip()]
        for s in sents:
            low = s.lower()
            if any(w in low for w in words):
                answers.append(s)
    if answers:
        return '. '.join(answers[:5]) + '.'
    # fallback: return the top chunk
    return (context_chunks[0][:1000] + '...') if context_chunks else ''
