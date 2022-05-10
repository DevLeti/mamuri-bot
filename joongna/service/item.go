package service

import (
	"fmt"
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

func GetItemInfoByKeyword(keyword string) {
	encText := url.QueryEscape("중고나라" + keyword)
	url := "https://openapi.naver.com/v1/search/cafearticle.json?query=" + encText + "&sort=sim"

	req, err := http.NewRequest("GET", url, nil)
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
	defer resp.Body.Close()

	bytes, _ := ioutil.ReadAll(resp.Body)
	str := string(bytes)
	fmt.Println(str)
}
