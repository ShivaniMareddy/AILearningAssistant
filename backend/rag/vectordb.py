import chromadb
import uuid
import chromadb

def get_collection():
    client = chromadb.PersistentClient(
        path="vector_db"
    )

    return client.get_or_create_collection(
        name="documents"
    )


def store_chunks(chunks, embeddings,pdf_name):

    ids = [
    str(uuid.uuid4())
    for _ in chunks
    ]
    collection = get_collection()

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
    collection = get_collection()

    results = collection.query(
        query_embeddings=[query_embedding.tolist()],
        n_results=n_results,
        include=["documents", "metadatas", "distances"]
    )
    print("RESULTS:")
    print(results)

    return {
        "documents": results["documents"][0],
        "sources": results["metadatas"][0],
        "distances": results["distances"][0]
    }