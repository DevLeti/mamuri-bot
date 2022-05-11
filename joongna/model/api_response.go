package model

type ApiResponse struct {
	LastBuildDate string            `json:"lastBuildDate"`
	Total         uint              `json:"total"`
	Start         uint              `json:"start"`
	Display       uint              `json:"display"`
	Items         []ApiResponseItem `json:"items"`
}

type ApiResponseItem struct {
	Title       string `json:"title"`
	Link        string `json:"link"`
	Description string `json:"description"`
	CafeName    string `json:"cafename"`
}
