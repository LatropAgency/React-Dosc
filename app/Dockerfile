FROM python:3.8-slim
ENV PYTHONUNBUFFERED 1
WORKDIR /app
COPY requirements.txt /app/

RUN pip install -r requirements.txt

COPY entrypoint.sh /app/
RUN chmod +x entrypoint.sh

COPY . /app/

CMD ./entrypoint.sh
