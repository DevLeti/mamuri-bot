package model

type Item struct {
	Platform     string `json:"platform"`
	Name         string `json:"name"`
	Price        uint   `json:"price"`
	ThumbnailUrl string `json:"thumbnailUrl"`
	ItemUrl      string `json:"itemUrl"`
	ExtraInfo    string `json:"extraInfo"`
}
