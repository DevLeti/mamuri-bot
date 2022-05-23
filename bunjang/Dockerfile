FROM golang:1.17.3-alpine AS builder

WORKDIR /src
COPY . /src

RUN go build -o bunjang_api_server

FROM alpine

WORKDIR /src
COPY --from=builder /src/bunjang_api_server /src/bunjang_api_server

EXPOSE 8080
CMD ["./bunjang_api_server"]
