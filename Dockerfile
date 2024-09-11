FROM ubuntu:latest

# Install necessary packages
RUN apt-get update && \
    apt-get install -y bash curl

# Set working directory
WORKDIR /usr/src/app

# Copy script to the container
COPY ./bin/agas.sh /usr/local/bin/agas

# Make the script executable
RUN chmod +x /usr/local/bin/agas

# Set entrypoint
ENTRYPOINT [ "/usr/local/bin/agas" ]

# Optional: Add debug output
CMD [ "--verbose" ]
