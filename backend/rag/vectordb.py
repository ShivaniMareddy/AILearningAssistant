import chromadb
import uuid
client = chromadb.PersistentClient(
    path="vector_db"
)

collection = client.get_or_create_collection(
    name="documents"
)


def store_chunks(chunks, embeddings,pdf_name):

    ids = [
    str(uuid.uuid4())
    for _ in chunks
    ]

    collection.add(
    ids=ids,
    documents=chunks,
    embeddings=embeddings.tolist(),
    metadatas=[
        {"source": pdf_name}
        for _ in chunks
        ]
    )


def search_chunks(query_embedding, n_results=3):

    results = collection.query(
        query_embeddings=[query_embedding.tolist()],
        n_results=n_results,
        include=["documents", "metadatas", "distances"]
    )

    return {
        "documents": results["documents"][0],
        "sources": results["metadatas"][0],
        "distances": results["distances"][0]
    }