package config

import (
	"log"

	"github.com/caarlos0/env/v6"
	"github.com/joho/godotenv"
)

type Config struct {
	Secret struct {
		CLIENTID     string `env:"SECRET.CLIENTID"`
		CLIENTSECRET string `env:"SECRET.CLIENTSECRET"`
	}
}

var Cfg *Config

func init() {
	err := godotenv.Load("./config/.env")
	if err != nil {
		log.Fatal("Load .env file failed.")
	}

	config := Config{}
	if err := env.Parse(&config); err != nil {
		log.Fatalf("%+v\n", err)
	}
	Cfg = &config
}
