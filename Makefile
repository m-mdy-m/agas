IMAGE_NAME = agas
CONTAINER_NAME = agas
all: build run install
build:
	docker-compose build
run:
	docker-compose up
stop:
	docker-compose down
clean:
	docker rmi $(IMAGE_NAME)
install:
	install -m 755 ./bin/agas.sh /usr/local/bin/agas