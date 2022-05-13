package router

import "github.com/labstack/echo/v4"

const (
	API        = "/api/v2"
	APIJoongNa = API + "/JoongNa"
	APIKeyword = APIJoongNa + "/:keyword"
)

func Init(e *echo.Echo) {
	e.GET(APIKeyword, controller.Search)
}
