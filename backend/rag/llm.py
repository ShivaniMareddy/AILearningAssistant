import requests

def generate_answer(prompt):

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        json={
            "model": "llama3.2",
            "prompt": f"""
You are an AI Learning Assistant.

Answer clearly and concisely.

Question:
{prompt}

Answer:
""",
            "stream": False,
            "options": {
                "temperature": 0.3,
                "num_predict": 200
            }
        }
    )

    return response.json()["response"]