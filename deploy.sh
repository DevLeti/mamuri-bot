#!/usr/bin/env bash

docker build -t daangn-api-server ./daangn/
docker build -t joongna-api-server ./joongna/
docker build -t bunjang-api-server ./bunjang/
docker build -t mamuri-db ./database/

docker-compose up -d