package router

import (
	"bunjang/controller"

	"github.com/labstack/echo/v4"
)

const (
	API        = "/api/v2"
	APIBunJang = API + "/bunjang"
	APIKeyword = APIBunJang + "/:keyword"
)

func Init(e *echo.Echo) {
	e.GET(APIKeyword, controller.Search)
}
