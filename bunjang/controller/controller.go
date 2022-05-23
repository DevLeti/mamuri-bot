package controller

import (
	"bunjang/service"
	"net/http"

	"github.com/labstack/echo/v4"
)

func Search(c echo.Context) error {
	keyword := c.Param("keyword")
	items, err := service.GetItemByKeyword(keyword)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, items)
}
