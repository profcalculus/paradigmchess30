FROM python:3.6-alpine

RUN adduser -D paradigmchess30

WORKDIR /home/paradigmchess30

COPY requirements.txt requirements.txt
RUN python -m venv venv
RUN venv/bin/pip install -r requirements.txt
RUN venv/bin/pip install gunicorn pymysql

COPY app app
COPY migrations migrations
COPY paradigmchess30.py config.py boot.sh ./
RUN chmod a+x boot.sh

ENV FLASK_APP paradigmchess30.py

RUN chown -R paradigmchess30:paradigmchess30 ./
USER paradigmchess30

EXPOSE 5000
ENTRYPOINT ["./boot.sh"]
