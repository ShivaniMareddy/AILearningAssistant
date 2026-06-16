import chromadb
import uuid

def get_collection():
    client = chromadb.PersistentClient(
        path="vector_db"
    )

    return client.get_or_create_collection(
        name="documents"
    )


def store_chunks(chunks, embeddings, pdf_name):
    collection = get_collection()

    print("STORE_CHUNKS CALLED")
    print("Chunks:", len(chunks))

    ids = [str(uuid.uuid4()) for _ in chunks]

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=[
            {"source": pdf_name}
            for _ in chunks
        ]
    )
    print("STORE_CHUNKS CALLED")
    print("Chunks:", len(chunks))

    print("Stored successfully")
    print("Total docs in collection:", collection.count())


def search_chunks(query_embedding, n_results=3):

    collection = get_collection()

    results = collection.query(
        query_embeddings=[query_embedding],
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