FROM python:3.12

RUN apt-get update && \
    apt-get install -y openjdk-17-jdk

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

CMD uvicorn app:app --host 0.0.0.0 --port $PORT