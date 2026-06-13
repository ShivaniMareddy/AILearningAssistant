import requests

def explain_error(error_message):

    prompt = f"""
You are a Python coding mentor.

Explain the following error in simple terms.

Error:
{error_message}

Give:
1. Cause of the error
2. How to fix it
3. Correct example code
"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3.2",
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0
            }
        }
    )

    return response.json()["response"]