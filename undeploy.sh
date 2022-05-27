#!/usr/bin/env bash

docker-compose down

docker image rm daangn-api-server
docker image rm joongna-api-server
docker image rm bunjang-api-server
docker image rm mamuri-db
docker image rm mamuri-server
docker image rm mamuri-ngrok