package main

import "github.com/labstack/echo/v4"

func main() {
	//keyword := "m1 pro 맥북 프로 16인치"
	//encText := url2.QueryEscape("중고나라" + keyword)
	//url := "https://openapi.naver.com/v1/search/cafearticle.json?query=" + encText + "&sort=sim"
	//
	//req, err := http.NewRequest("GET", url, nil)
	//if err != nil {
	//	log.Fatal(err)
	//}
	//req.Header.Add("X-Naver-Client-Id", config.Cfg.Secret.CLIENTID)
	//req.Header.Add("X-Naver-Client-Secret", config.Cfg.Secret.CLIENTSECRET)
	//
	//client := &http.Client{}
	//resp, err := client.Do(req)
	//if err != nil {
	//	log.Fatal(err)
	//}
	//defer resp.Body.Close()
	//
	//bytes, _ := ioutil.ReadAll(resp.Body)
	//str := string(bytes)
	//fmt.Println(str)

	e := echo.New()

	e.Logger.Fatal(e.Start(":8080"))
}
