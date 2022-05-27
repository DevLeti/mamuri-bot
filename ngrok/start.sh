#!/bin/sh

echo "> Ngrok start in mamuri-server:8080"
/src/ngrok start --config=./ngrok.yml --all &

sleep 1s

public_url=$(curl -s localhost:4040/api/tunnels | jq -r .tunnels[0].public_url)
echo "> public_url: $public_url"

tail -f /dev/null