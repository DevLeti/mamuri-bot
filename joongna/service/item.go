package service

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"joongna/config"
	"joongna/model"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"sync"
)

func GetItemByKeyword(keyword string) ([]model.Item, error) {
	var items []model.Item
	wg := sync.WaitGroup{}

	responseItems, err := getItemsInfoByKeyword(keyword)
	if err != nil {
		return nil, err
	}

	for _, responseItem := range responseItems {
		wg.Add(1)

		go func(responseItem model.ApiResponseItem) {
			defer wg.Done()
			if err != nil {
				log.Fatal(err)
			}
			item := model.Item{
				Platform:     "중고나라",
				Name:         responseItem.Title,
				Price:        priceStringToInt(responseItem.ProductSale.Cost),
				ThumbnailUrl: responseItem.ThumbnailUrl,
				ItemUrl:      fmt.Sprintf("https://m.cafe.naver.com/ca-fe/web/cafes/10050146/articles/%d", responseItem.ArticleId),
				ExtraInfo:    responseItem.ExtraInfo,
			}
			items = append(items, item)
		}(responseItem)
	}
	wg.Wait()

	return items, nil
}

func getItemsInfoByKeyword(keyword string) ([]model.ApiResponseItem, error) {
	encText := url.QueryEscape(keyword)
	apiUrl := fmt.Sprintf("https://apis.naver.com/cafe-web/cafe-mobile/CafeMobileWebArticleSearchListV3?cafeId=10050146&query=%s&searchBy=0&sortBy=sim&page=1&perPage=10&adUnit=MW_CAFE_BOARD", encText)

	req, err := http.NewRequest("GET", apiUrl, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("X-Naver-Client-Id", config.Cfg.Secret.CLIENTID)
	req.Header.Add("X-Naver-Client-Secret", config.Cfg.Secret.CLIENTSECRET)
	req.Header.Add("Cookie", config.Cfg.Header.Cookie)
	req.Header.Add("User-agent", config.Cfg.Header.UserAgent)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			log.Fatal(err)
		}
	}(resp.Body)

	response, _ := ioutil.ReadAll(resp.Body)

	var apiResult map[string]interface{}
	err = json.Unmarshal(response, &apiResult)
	if err != nil {
		return nil, err
	}

	result := apiResult["message"].(map[string]interface{})["result"]
	resultJson, err := json.Marshal(result)
	if err != nil {
		return nil, err
	}

	var apiResponse model.ApiResponse
	err = json.Unmarshal(resultJson, &apiResponse)
	if err != nil {
		return nil, err
	}

	return apiResponse.Items, nil
}

func priceStringToInt(priceString string) int {
	strings.TrimSpace(priceString)

	if priceString == "" {
		return 0
	}

	priceString = strings.ReplaceAll(priceString, "원", "")
	priceString = strings.ReplaceAll(priceString, ",", "")

	price, err := strconv.Atoi(priceString)
	if err != nil {
		log.Fatal(err)
	}
	return price
}
