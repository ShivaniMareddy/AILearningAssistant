import requests
import os

OPENROUTER_API_KEY = os.getenv(
    "OPENROUTER_API_KEY"
)

def create_embeddings(texts):

    embeddings = []

    for text in texts:

        response = requests.post(
            "https://openrouter.ai/api/v1/embeddings",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openai/text-embedding-3-small",
                "input": text
            }
        )

        embedding = (
            response.json()["data"][0]["embedding"]
        )

        embeddings.append(embedding)

    return embeddings