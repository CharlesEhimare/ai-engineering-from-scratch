FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir numpy
RUN pip install --no-cache-dir flask
WORKDIR /workspace
CMD ["python"]
