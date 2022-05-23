package model

type ApiResponse struct {
	CafeId       int               `json:"cafeId"`
	ArticelCount int               `json:"articleCount"`
	Query        string            `json:"query"`
	Items        []ApiResponseItem `json:"articleList"`
}

type ApiResponseItem struct {
	ArticleId    int                 `json:"articleId"`
	Title        string              `json:"subject"`
	ExtraInfo    string              `json:"summary"`
	ThumbnailUrl string              `json:"thumbnailImageUrl"`
	ProductSale  ApiResponseItemSale `json:"productSale"`
}

type ApiResponseItemSale struct {
	SaleStatus string `json:"saleStatue"`
	Cost       string `json:"cost"`
}
