# Use x86 architecture Python 3.6 base image
FROM --platform=linux/amd64 python:3.6

# Set working directory
WORKDIR /app

# Copy project files into the container
COPY . /app
# 将 Stanford POSTagger 和模型文件复制到容器中
COPY stanford-postagger-full-2020-11-17/stanford-postagger.jar /app/
COPY stanford-postagger-full-2020-11-17/models/english-left3words-distsim.tagger /app/models/

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip

RUN pip install numpy==1.16.4 Cython==0.29.14
RUN pip install torch==1.1.0 -f https://download.pytorch.org/whl/torch_stable.html
RUN pip install "benepar[cpu]==0.1.2"
RUN pip install tqdm==4.32.1 nltk==3.4.5
RUN pip install boto3

# JAVA
RUN apt-get update && apt-get install -y openjdk-11-jdk && rm -rf /var/lib/apt/lists/*
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64
ENV PATH $JAVA_HOME/bin:$PATH

# jupyter
RUN pip install jupyter
# seaborn
RUN pip install seaborn
# matplotlib
RUN pip install matplotlib

CMD ["bash"]