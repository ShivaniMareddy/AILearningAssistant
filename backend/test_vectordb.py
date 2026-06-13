from rag.pdf_loader import extract_text_from_pdf
from rag.chunking import chunk_text
from rag.embeddings import create_embeddings
from rag.vectordb import store_chunks

text = extract_text_from_pdf(
    "uploads/Shivani MareddyResume.pdf"
)

chunks = chunk_text(text)

embeddings = create_embeddings(chunks)

store_chunks(
    chunks,
    embeddings
)

print("Chunks stored successfully!")