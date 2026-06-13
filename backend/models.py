from sqlalchemy import Column, Integer, String
from database import Base
from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy import Text
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False)

    password = Column(String, nullable=False)

    role = Column(String, default="Student")

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)

    conversation_id = Column(
        Integer,
        ForeignKey("conversations.id")
    )

    sender = Column(String)

    message = Column(String)

    timestamp = Column(
        DateTime,
        default=datetime.utcnow
    )
class Document(Base):
    __tablename__ = "documents"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    filename = Column(String)

    uploaded_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow
    )

class CodeSnippet(Base):
    __tablename__ = "code_snippets"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    language = Column(String)

    code = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )