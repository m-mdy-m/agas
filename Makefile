IMAGE_NAME = agas
CONTAINER_NAME = agas
all: build run
build:
	docker-compose build
run:
	docker-compose up
stop:
	docker-compose down
clean:
	docker rmi $(IMAGE_NAME)