from rag.embeddings import model
from rag.vectordb import search_chunks

query = "What are Shivani's skills?"

query_embedding = model.encode(query)

results = search_chunks(
    query_embedding
)

print(results["documents"][0])