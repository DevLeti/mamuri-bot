#!/usr/bin/env bash

docker-compose down

docker image rm mamuri-server
docker image rm mamuri-db