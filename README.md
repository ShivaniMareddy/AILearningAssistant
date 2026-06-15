# 🤖 AI Learning Assistant

A full-stack AI-powered learning platform built using **React, FastAPI, PostgreSQL, ChromaDB, and Ollama**. The application combines conversational AI, document question answering (RAG), code execution, and snippet management into a single intelligent learning environment.

---

## 🚀 Features

### 💬 Chat Assistant

* Create and manage conversations
* Send messages to an AI assistant
* Store conversation history in PostgreSQL
* Delete conversations when no longer needed

### 📄 Document Assistant (RAG)

* Upload PDF documents
* Extract text from PDFs
* Generate embeddings using Sentence Transformers
* Store embeddings in ChromaDB
* Ask questions about uploaded documents
* Display answer confidence score
* Show document sources used for answering

### 💻 Coding Playground

* Execute Python code
* Execute Java code
* Execute JavaScript code
* Capture output and runtime errors
* Generate AI-powered explanations for coding errors

### 📝 Code Snippets

* Save reusable code snippets
* Categorize snippets by language
* View saved snippets
* Delete snippets
* User-specific snippet storage

### 🔐 Authentication

* User Registration
* User Login
* JWT Token Authentication
* Protected Routes
* Secure API Access

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* CSS3

### Backend

* FastAPI
* Python

### Database

* PostgreSQL

### Vector Database

* ChromaDB

### AI & Machine Learning

* Ollama
* Sentence Transformers
* Embeddings
* Retrieval-Augmented Generation (RAG)

---

## 🏗️ System Architecture

```text
React Frontend
       |
       v
FastAPI Backend
       |
       +------ PostgreSQL
       |          |
       |          +-- Users
       |          +-- Conversations
       |          +-- Messages
       |          +-- Documents
       |          +-- Snippets
       |
       +------ ChromaDB
       |          |
       |          +-- Document Embeddings
       |
       +------ Ollama LLM
                  |
                  +-- Chat Responses
                  +-- Error Explanations
                  +-- Document QA
```

---

## 📂 Project Modules

### 1. Authentication Module

Handles user registration, login, password hashing, JWT generation, and protected routes.

### 2. Chat Assistant Module

Allows users to communicate with an AI assistant and maintain conversation history.

### 3. Document Assistant Module

Implements Retrieval-Augmented Generation (RAG) for answering questions from uploaded PDF documents.

### 4. Coding Playground Module

Provides an online environment for executing Python, Java, and JavaScript code.

### 5. Snippet Manager Module

Stores reusable code snippets for future reference.

---

## 📸 Screenshots

### Dashboard

*Add dashboard screenshot here*

### Chat Assistant

*Add chat screenshot here*

### Document Assistant

*Add document assistant screenshot here*

### Coding Playground

*Add coding playground screenshot here*

### Snippets

*Add snippets screenshot here*

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/AI-Learning-Assistant.git

cd AI-Learning-Assistant
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn app:app --reload
```

### Frontend Setup

```bash
cd frontend

npm install

npm start
```

---

## 🔑 Environment Requirements

* Python 3.10+
* Node.js
* PostgreSQL
* Ollama
* ChromaDB

---

## 🎯 Key Concepts Implemented

* JWT Authentication
* REST APIs
* Retrieval-Augmented Generation (RAG)
* Vector Embeddings
* ChromaDB
* PDF Processing
* Code Execution
* AI Error Explanation
* Full Stack Development

---

## 👩‍💻 Developed By

**Shivani Mareddy**

B.Tech – Computer Science & Engineering (Data Science)

AI Learning Assistant – Generative AI Project
