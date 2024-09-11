FROM ubuntu:latest
LABEL maintainer="Shaggy bitsgenix@gmail.com"
LABEL description="This Docker image contains Agas script for managing HTTP requests."
LABEL license="MIT"
LABEL repository="https://github.com/m-mdy-m/agas.git"

RUN apt-get update && apt-get install -y \
    bash \
    curl
WORKDIR /usr/src/app
COPY ./bin/agas.sh /usr/local/bin/agas
RUN chmod +x /usr/local/bin/agas
ENTRYPOINT [ "/usr/local/bin/agas" ]
CMD [ "agas" ]