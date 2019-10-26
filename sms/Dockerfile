FROM python:3.7

ADD . /
RUN pip install -r requirements.txt

EXPOSE 50051
CMD ["python", "-u", "server.py"]