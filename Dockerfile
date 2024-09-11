FROM ubuntu:latest
RUN apt-get update && \
    apt-get install -y bash curl
WORKDIR /usr/src/app
COPY ./bin/agas.sh /usr/local/bin/agas
RUN chmod +x /usr/local/bin/agas
ENTRYPOINT [ "/usr/local/bin/agas" ]