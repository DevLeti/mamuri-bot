package service

import (
	"bytes"
	"encoding/json"
	"io"
	"io/ioutil"
	"joongna/config"
	"joongna/model"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/go-rod/rod"
)

func GetItemByKeyword(keyword string) ([]model.Item, error) {
	var items []model.Item

	itemsInfo := getItemsInfoByKeyword(keyword)
	for _, itemInfo := range itemsInfo {
		if itemInfo.CafeName != "중고나라" {
			continue
		}
		itemUrl := itemInfo.Link
		sold, price, thumbnailUrl, extraInfo := crawlingNaverCafe(itemUrl)

		if sold == "판매 완료" {
			continue
		}

		item := model.Item{
			Platform:     "중고나라",
			Name:         itemInfo.Title,
			Price:        price,
			ThumbnailUrl: thumbnailUrl,
			ItemUrl:      itemUrl,
			ExtraInfo:    extraInfo,
		}
		items = append(items, item)
	}
	return items, nil
}

func getItemsInfoByKeyword(keyword string) []model.ApiResponseItem {
	encText := url.QueryEscape("중고나라 " + keyword + " 판매중")
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

func crawlingNaverCafe(cafeUrl string) (string, int, string, string) {
	page := rod.New().MustConnect().MustPage(cafeUrl)

	time.Sleep(time.Second * 1)

	source := page.MustElement("iframe#cafe_main").MustFrame().MustHTML()
	html, err := goquery.NewDocumentFromReader(bytes.NewReader([]byte(source)))
	if err != nil {
		log.Fatal(err)
	}

	sold := html.Find("div.sold_area").Text()
	price := priceStringToInt(html.Find(".ProductPrice").Text())
	thumbnailUrl, _ := html.Find("div.product_thumb img").Attr("src")
	extraInfo := html.Find(".se-module-text").Text()

	sold = strings.TrimSpace(sold)
	thumbnailUrl = strings.TrimSpace(thumbnailUrl)
	extraInfo = strings.TrimSpace(extraInfo)

	return sold, price, thumbnailUrl, extraInfo
}

func priceStringToInt(priceString string) int {
	strings.TrimSpace(priceString)

	priceString = strings.ReplaceAll(priceString, "원", "")
	priceString = strings.ReplaceAll(priceString, ",", "")

	price, err := strconv.Atoi(priceString)
	if err != nil {
		log.Fatal(err)
	}
	return price
}
