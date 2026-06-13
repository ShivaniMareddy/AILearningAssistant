def build_prompt(question, context):

    return f"""
You are a RAG assistant.

Use ONLY the information in the context.

Do NOT make assumptions.
Do NOT invent facts.
Do NOT continue the story.
Do NOT generate examples.
Do NOT add information not present in the context.

If the answer is not found in the context, respond exactly:

I could not find that information in the uploaded documents.

Context:
{context}

Question:
{question}

Give a short factual answer only.

Answer:
"""