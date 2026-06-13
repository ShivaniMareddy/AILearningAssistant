from rag.pdf_loader import extract_text_from_pdf
from rag.chunking import chunk_text

text = extract_text_from_pdf(
    "uploads/Shivani MareddyResume.pdf"
)

chunks = chunk_text(text)

print("Total Chunks:", len(chunks))

print("\nFirst Chunk:\n")
print(chunks[0])