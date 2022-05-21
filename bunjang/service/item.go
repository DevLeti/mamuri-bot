package service

import (
	"bunjang/model"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"
)

func GetItemByKeyword(keyword string) ([]model.Item, error) {
	var items []model.Item

	responseItems, err := getApiResponseItems(keyword)
	if err != nil {
		return nil, err
	}

	for _, responseItem := range responseItems {
		extraInfo, err := getItemExtraInfo(responseItem.Pid)
		if err != nil {
			return nil, err
		}
		item := model.Item{
			Platform:     "번개장터",
			Name:         responseItem.Name,
			Price:        priceStringToInt(responseItem.Price),
			ThumbnailUrl: responseItem.ProductImage,
			ItemUrl:      "https://m.bunjang.co.kr/products/" + responseItem.Pid,
			ExtraInfo:    extraInfo,
		}

		items = append(items, item)
	}

	return items, nil
}

func getApiResponseItems(keyword string) ([]model.ApiResponseItem, error) {
	encText := url.QueryEscape(keyword)
	apiUrl := fmt.Sprintf("https://api.bunjang.co.kr/api/1/find_v2.json?q=%s&order=score", encText)

	response, err := getResponse(apiUrl)
	if err != nil {
		return nil, err
	}

	var apiResponse model.ApiResponse
	err = json.Unmarshal(response, &apiResponse)
	if err != nil {
		return nil, err
	}

	return apiResponse.Items, nil
}

func getItemExtraInfo(pid string) (string, error) {
	apiUrl := fmt.Sprintf("https://api.bunjang.co.kr/api/1/product/%s/detail_info.json", pid)

	response, err := getResponse(apiUrl)
	if err != nil {
		return "", err
	}

	var itemInfo map[string]interface{}
	err = json.Unmarshal(response, &itemInfo)
	if err != nil {
		return "", err
	}

	extraInfo := itemInfo["item_info"].(map[string]interface{})["description_for_detail"].(string)

	return extraInfo, nil
}

func getResponse(url string) ([]byte, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

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

	return response, nil
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
