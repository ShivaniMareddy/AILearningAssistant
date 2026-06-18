import chromadb
import uuid

def get_collection():
    client = chromadb.PersistentClient(
        path="vector_db"
    )

    return client.get_or_create_collection(
        name="documents"
    )


def store_chunks(chunks,embeddings,pdf_name,user_id):
    collection = get_collection()
    print("USER ID:", user_id)
    print("PDF NAME:", pdf_name)

    print("STORE_CHUNKS CALLED")
    print("Chunks:", len(chunks))

    ids = [str(uuid.uuid4()) for _ in chunks]

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=[
            {
                "source": pdf_name,
                "user_id": user_id
            }
            for _ in chunks
        ]
    )
    print("STORED SUCCESSFULLY")

    print("TOTAL DOCS:")
    print(collection.count())

    print("SAMPLE DATA:")
    print(collection.peek())
    print("STORE_CHUNKS CALLED")
    print("Chunks:", len(chunks))

    print("Stored successfully")
    print("Total docs in collection:", collection.count())


def search_chunks(query_embedding,user_id, selected_document=None, n_results=3):

    collection = get_collection()
    print("\n========== SEARCH ==========")
    print("USER ID:", user_id)
    print("SELECTED DOCUMENT:", selected_document)
    if selected_document:

        filter_data = {
            "$and": [
                {"user_id": user_id},
                {"source": selected_document}
            ]
        }
        print("FILTER DATA:")
        print(filter_data)

    else:

        filter_data = {
            "user_id": user_id
        }

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        where=filter_data,
        include=[
            "documents",
            "metadatas",
            "distances"
        ]
    )

    print("RESULTS:")
    print(results)
    

    return {
        "documents": results["documents"][0],
        "sources": results["metadatas"][0],
        "distances": results["distances"][0]
    }