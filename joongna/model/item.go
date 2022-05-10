package model

type Item struct {
	Platform  string `json:"platform"`
	Name      string `json:"name"`
	Price     uint   `json:"price"`
	Url       string `json:"url"`
	ExtraInfo string `json:"extraInfo"`
}
