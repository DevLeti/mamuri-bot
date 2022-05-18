FROM golang:1.17.3-alpine AS builder

WORKDIR /src
COPY . /src

RUN go build -o joongna_api_server

FROM alpine

WORKDIR /src
COPY --from=builder /src/joongna_api_server /src/joongna_api_server
COPY --from=builder /src/config/.env /src/config/.env

RUN apk add chromium

EXPOSE 8080
CMD ["./joongna_api_server"]
