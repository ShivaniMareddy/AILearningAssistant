import os
import requests


def generate_answer(prompt):

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization":
            f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
            "Content-Type":
            "application/json"
        },
        json={
            "model":
            "meta-llama/llama-3.1-8b-instruct",

            "messages": [
                {
                    "role": "user",
                    "content":
                    f"""
You are an AI Learning Assistant.

Answer clearly and concisely.

Question:
{prompt}

Answer:
"""
                }
            ]
        }
    )

    print(response.json())

    data = response.json()

    print(data)

    if "error" in data:
        return data["error"]["message"]

    return data["choices"][0]["message"]["content"]