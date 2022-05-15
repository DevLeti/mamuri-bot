package service

import (
	"bytes"
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
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/go-rod/rod"
)

func GetItemByKeyword(keyword string) ([]model.Item, error) {
	var items []model.Item
	wg := sync.WaitGroup{}

	itemsInfo := getItemsInfoByKeyword(keyword)

	for _, itemInfo := range itemsInfo {
		itemUrl := itemInfo.Link
		if itemInfo.CafeName != "중고나라" {
			continue
		}
		wg.Add(1)
		go func(itemUrl string) {
			defer wg.Done()
			err, item := crawlingNaverCafe(itemUrl)
			if err != nil {
				log.Fatal(err)
			}
			items = append(items, *item)
		}(itemUrl)
	}
	wg.Wait()

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

func crawlingNaverCafe(cafeUrl string) (error, *model.Item) {
	frame := rod.New().MustConnect().MustPage(cafeUrl).MustElement("iframe#cafe_main")
	time.Sleep(time.Second * 2)
	source := frame.MustFrame().MustHTML()
	html, err := goquery.NewDocumentFromReader(bytes.NewReader([]byte(source)))
	if err != nil {
		return err, nil
	}

	title := html.Find("h3.title_text").Text()
	sold := html.Find("div.sold_area").Text()
	price := priceStringToInt(html.Find(".ProductPrice").Text())
	thumbnailUrl, _ := html.Find("div.product_thumb img").Attr("src")
	extraInfo := html.Find(".se-module-text").Text()

	title = strings.TrimSpace(title)
	sold = strings.TrimSpace(sold)
	thumbnailUrl = strings.TrimSpace(thumbnailUrl)
	extraInfo = strings.TrimSpace(extraInfo)

	item := model.Item{
		Platform:     "중고나라",
		Name:         title,
		Price:        price,
		ThumbnailUrl: thumbnailUrl,
		ItemUrl:      cafeUrl,
		ExtraInfo:    extraInfo,
	}
	fmt.Println("crawling " + cafeUrl + " title: " + title)

	return nil, &item
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
