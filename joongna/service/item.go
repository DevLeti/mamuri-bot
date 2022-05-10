package service

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"joongna/config"
	"joongna/model"
	"log"
	"net/http"
	"net/url"
)

func GetItemByKeyword(keyword string) ([]model.Item, error) {
	var items []model.Item
	return items, nil
}

func getItemsInfoByKeyword(keyword string) []model.ApiResponseItem {
	encText := url.QueryEscape("중고나라" + keyword)
	apiUrl := "https://openapi.naver.com/v1/search/cafearticle.json?query=" + encText + "&sort=sim"

	req, err := http.NewRequest("GET", apiUrl, nil)
	if err != nil {
		log.Fatal(err)
	}
	req.Header.Add("X-Naver-Client-Id", config.Cfg.Secret.CLIENTID)
	req.Header.Add("X-Naver-Client-Secret", config.Cfg.Secret.CLIENTSECRET)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			log.Fatal(err)
		}
	}(resp.Body)

	response, _ := ioutil.ReadAll(resp.Body)
	var apiResponse model.ApiResponse
	err = json.Unmarshal(response, &apiResponse)
	if err != nil {
		log.Fatal(err)
	}
	return apiResponse.Items
}
