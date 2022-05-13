package main

import (
	"joongna/router"

	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	router.Init(e)

	e.Logger.Fatal(e.Start(":8080"))
}
