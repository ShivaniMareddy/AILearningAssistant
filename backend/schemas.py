from pydantic import BaseModel, EmailStr
from datetime import datetime



class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ConversationCreate(BaseModel):
    title: str


class ConversationResponse(BaseModel):
    id: int
    title: str

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    conversation_id: int
    message: str


class MessageResponse(BaseModel):
    id: int
    sender: str
    message: str
    timestamp: datetime

    class Config:
        from_attributes = True
class QuestionRequest(BaseModel):
    question: str
    selected_document: str | None = None
class DocumentResponse(BaseModel):
    id: int
    filename: str

    class Config:
        from_attributes = True
class CodeRequest(BaseModel):
    code: str
class CodeSnippetCreate(BaseModel):
    language: str
    code: str