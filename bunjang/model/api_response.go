package model

type ApiResponse struct {
	Result   string            `json:"result"`
	NoResult bool              `json:"no_result"`
	Items    []ApiResponseItem `json:"list"`
}

type ApiResponseItem struct {
	Name         string `json:"name"`
	Pid          string `json:"pid"`
	Price        string `json:"price"`
	ProductImage string `json:"product_image"`
}
