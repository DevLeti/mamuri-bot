#!/usr/bin/env bash

docker build -t mamuri-db ../database/
docker build -t mamuri-server .

docker-compose up -d