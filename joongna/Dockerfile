FROM golang:1.17.3

WORKDIR /src
COPY . /src

RUN apt-get update
RUN apt-get install -y libgconf-2-4 libatk1.0-0 libatk-bridge2.0-0 libgdk-pixbuf2.0-0 libgtk-3-0 libgbm-dev libnss3-dev libxss-dev libasound2
RUN go build -o Joongna_api_server

EXPOSE 8080
CMD ["./Joongna_api_server"]