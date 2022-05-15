package router

import (
	"joongna/controller"

	"github.com/labstack/echo/v4"
)

const (
	API        = "/api/v2"
	APIJoongNa = API + "/joongna"
	APIKeyword = APIJoongNa + "/:keyword"
)

func Init(e *echo.Echo) {
	e.GET(APIKeyword, controller.Search)
}
