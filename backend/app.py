print("APP STARTING...")
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from database import engine, get_db
from models import Base, User
from schemas import UserCreate, UserLogin
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM
)
from models import User, Conversation, Message, Document
from schemas import (
    UserCreate,
    UserLogin,
    ConversationCreate
)

from schemas import (
    UserCreate,
    UserLogin,
    ConversationCreate,
    MessageCreate,
    CodeSnippetCreate
)
from fastapi import UploadFile, File
import shutil
import os

from rag.pdf_loader import extract_text_from_pdf
from rag.vectordb import search_chunks
from schemas import QuestionRequest

from rag.prompt_builder import build_prompt
from rag.llm import generate_answer

from rag.pdf_loader import extract_text_from_pdf
from rag.chunking import chunk_text
from rag.embeddings import create_embeddings
from rag.vectordb import store_chunks
from schemas import DocumentResponse

import subprocess
import tempfile
import os

from schemas import CodeRequest
from coding_assistant import explain_error

from models import CodeSnippet
import subprocess
import tempfile
import os
from fastapi.middleware.cors import CORSMiddleware
from rag.llm import generate_answer

print("IMPORTS FINISHED")
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)
Base.metadata.create_all(bind=engine)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login"
)


@app.get("/")
def home():
    return {
        "message": "AI Learning Assistant Backend Running"
    }


# ==========================
# REGISTER
# ==========================

@app.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User Registered Successfully"
    }


# ==========================
# LOGIN
# ==========================

@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email"
        )

    if not verify_password(
        form_data.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )

    token = create_access_token(
        {
            "user_id": db_user.id,
            "role": db_user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

# ==========================
# GET CURRENT USER
# ==========================

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    try:
        print("TOKEN RECEIVED:", token)

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        print("PAYLOAD:", payload)

        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid Token"
            )

        user = db.query(User).filter(
            User.id == user_id
        ).first()

        if user is None:
            raise HTTPException(
                status_code=401,
                detail="User Not Found"
            )

        return user

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )


# ==========================
# CURRENT USER DETAILS
# ==========================

@app.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }


# ==========================
# ADMIN ONLY
# ==========================

def admin_only(
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Access Denied"
        )

    return current_user


@app.get("/admin/dashboard")
def admin_dashboard(
    admin: User = Depends(admin_only)
):

    return {
        "message": f"Welcome Admin {admin.name}"
    }

@app.post("/conversation/create")
def create_conversation(
    conversation: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_conversation = Conversation(
        title=conversation.title,
        user_id=current_user.id
    )

    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)

    return {
        "message": "Conversation Created",
        "conversation_id": new_conversation.id
    }

@app.post("/message/send")
def send_message(
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    user_message = Message(
        conversation_id=message.conversation_id,
        sender="User",
        message=message.message
    )

    db.add(user_message)

    ai_response_text = generate_answer(
        message.message
    )

    ai_message = Message(
        conversation_id=message.conversation_id,
        sender="AI",
        message=ai_response_text
    )

    db.add(ai_message)

    db.commit()

    return {
        "message": "Messages Saved",
        "ai_response": ai_response_text
    }

@app.get("/conversation/{conversation_id}")
def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).all()

    return messages
@app.get("/conversations")
def get_all_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print("CURRENT USER:", current_user.email)

    conversations = db.query(
        Conversation
    ).filter(
        Conversation.user_id == current_user.id
    ).all()

    return conversations
@app.delete("/conversation/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    conversation = db.query(
        Conversation
    ).filter(
        Conversation.id == conversation_id
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation Not Found"
        )

    db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).delete()

    db.delete(conversation)

    db.commit()

    return {
        "message": "Conversation Deleted"
    }
@app.get("/search")
def search_messages(
    query: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    results = db.query(
        Message
    ).filter(
        Message.message.ilike(f"%{query}%")
    ).all()

    return results
@app.post("/upload-pdf")
def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    file_path = f"{UPLOAD_DIR}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract Text
    extracted_text = extract_text_from_pdf(file_path)
    

    print(
    extracted_text[:1000]
    )

    # Create Chunks
    # Create Chunks
    chunks = chunk_text(extracted_text)

    print("TOTAL CHUNKS:", len(chunks))

    for i, chunk in enumerate(chunks):
        print(f"\nCHUNK {i}")
        print(chunk)
        print("---------------------")

    

    # Generate Embeddings
    embeddings = create_embeddings(chunks)

    # Store in ChromaDB
    store_chunks(
        chunks,
        embeddings,
        file.filename,
        current_user.id
    )
    new_document = Document(
        filename=file.filename,
        uploaded_by=current_user.id
    )
    print("Saving document:", file.filename)
    db.add(new_document)
    db.commit()
    print("Document saved successfully")
    return {
        "filename": file.filename,
        "characters_extracted": len(extracted_text),
        "total_chunks": len(chunks),
        "message": "PDF Uploaded and Stored Successfully"
    }
@app.post("/ask")
def ask_question(
    request: QuestionRequest,
    current_user: User = Depends(
        get_current_user
    )
):

    query_embedding = create_embeddings(
        [request.question]
        )[0]

    results = search_chunks(
        query_embedding,
        current_user.id,
        request.selected_document
    )
    

    context = "\n".join(
        results["documents"]
    )

    prompt = build_prompt(
        request.question,
        context
    )

    answer = generate_answer(
        prompt
    )
    if not results["documents"]:

        return {
            "question": request.question,
            "answer": "No documents found. Please upload a PDF first.",
            "sources": [],
            "confidence": 0
        }
    distance = min(
        results["distances"]
    )

    confidence = round(
        100 / (1 + distance),
        2
    )
    sources = list(
        {
            source["source"]
            for source in results["sources"]
            if source
        }
    )
    return {
        "question": request.question,
        "answer": answer,
        "sources": sources,
        "confidence": confidence
    }
@app.get("/documents")
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    documents = (
        db.query(Document)
        .filter(
            Document.uploaded_by == current_user.id
        )
        .all()
    )

    return documents
@app.delete("/document/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db)
):

    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    db.delete(document)
    db.commit()

    return {
        "message": "Document Deleted Successfully"
    }
@app.post("/run-python")
def run_python(request: CodeRequest):

    with tempfile.NamedTemporaryFile(
        mode="w",
        suffix=".py",
        delete=False
    ) as temp_file:

        temp_file.write(request.code)
        temp_path = temp_file.name

    try:

        result = subprocess.run(
            ["python3", temp_path],
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.stderr:

            explanation = explain_error(
                result.stderr
            )

            return {
                "output": result.stdout,
                "error": result.stderr,
                "ai_explanation": explanation
            }

        return {
            "output": result.stdout,
            "error": ""
        }

    finally:
        os.remove(temp_path)
@app.post("/save-snippet")
def save_snippet(
    snippet: CodeSnippetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_snippet = CodeSnippet(
        user_id=current_user.id,
        language=snippet.language,
        code=snippet.code
    )

    db.add(new_snippet)
    db.commit()

    return {
        "message": "Snippet Saved"
    }
@app.get("/snippets")
def get_snippets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    snippets = db.query(
    CodeSnippet
        ).filter(
            CodeSnippet.user_id ==
            current_user.id
        ).all()

    return snippets
@app.delete("/snippet/{snippet_id}")
def delete_snippet(
    snippet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    snippet = db.query(
    CodeSnippet
).filter(
    CodeSnippet.id == snippet_id,
    CodeSnippet.user_id == current_user.id
).first()

    if not snippet:
        raise HTTPException(
            status_code=404,
            detail="Snippet not found"
        )

    db.delete(snippet)
    db.commit()

    return {
        "message": "Snippet Deleted"
    }
@app.post("/run-java")
def run_java(request: CodeRequest):

    with tempfile.TemporaryDirectory() as temp_dir:

        java_file = os.path.join(
            temp_dir,
            "Main.java"
        )

        with open(java_file, "w") as f:
            f.write(request.code)

        compile_result = subprocess.run(
            ["javac", java_file],
            capture_output=True,
            text=True
        )

        if compile_result.stderr:

            explanation = explain_error(
                compile_result.stderr
            )

            return {
                "output": "",
                "error": compile_result.stderr,
                "ai_explanation": explanation
            }

        run_result = subprocess.run(
            [
                "java",
                "-cp",
                temp_dir,
                "Main"
            ],
            capture_output=True,
            text=True
        )

        if run_result.stderr:

            explanation = explain_error(
                run_result.stderr
            )

            return {
                "output": "",
                "error": run_result.stderr,
                "ai_explanation": explanation
            }
        return {
            "output": run_result.stdout,
            "error": ""
        }
@app.post("/run-javascript")
def run_javascript(request: CodeRequest):

    with tempfile.NamedTemporaryFile(
        mode="w",
        suffix=".js",
        delete=False
    ) as temp_file:

        temp_file.write(request.code)
        temp_path = temp_file.name

    try:

        result = subprocess.run(
            ["node", temp_path],
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.stderr:

            explanation = explain_error(
                result.stderr
            )

            return {
                "output": "",
                "error": result.stderr,
                "ai_explanation": explanation
            }

        return {
            "output": result.stdout,
            "error": ""
        }

    finally:
        os.remove(temp_path)