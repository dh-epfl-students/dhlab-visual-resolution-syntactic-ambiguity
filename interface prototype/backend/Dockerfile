FROM python:3.12-slim-bookworm AS base

# Copy requirements.txt to container
COPY app/requirements.txt /tmp/requirements.txt

# Upgrade pip and install Python requirements
RUN pip3 install --no-cache-dir -r /tmp/requirements.txt ; \
    rm /tmp/requirements.txt


FROM base AS service

# Copy app to container and verify
COPY app/src /usr/src/app
RUN ls -la /usr/src/app

# Set workdir to app
WORKDIR /usr/src/app
ENV PYTHONPATH "${PYTHONPATH}:/usr/src/app"

# Run app
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
