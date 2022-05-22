FROM python:alpine

WORKDIR /usr/src/app

EXPOSE 8080

COPY . .
RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]