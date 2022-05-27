FROM ubuntu:latest as builder

WORKDIR /src

RUN apt-get update \
    && apt-get install -y wget

RUN wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
RUN tar -xvzf ./ngrok-v3-stable-linux-amd64.tgz

FROM alpine

WORKDIR /src

COPY ngrok.yml /src
COPY start.sh /src
RUN chmod +x /src/start.sh

COPY --from=builder /src/ngrok /src/ngrok

RUN apk --no-cache add curl
RUN apk --no-cache add jq

EXPOSE 4040

CMD ["sh", "start.sh"]