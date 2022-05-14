from base64 import encode
from bs4 import BeautifulSoup
import requests
import json

def parse_price(unparsed_price):
    over_ten_thousand = False
    if "만" in unparsed_price:
        over_ten_thousand = True

    unparsed_price = unparsed_price.replace("원", "")\
                                   .replace("만", "0000")\
                                   .replace(",", "")\
                                   .split()
    print(unparsed_price)
    if(over_ten_thousand):
        # 100만 2000원 같이 천원 단위가 있을 경우 split 과정에서 만의 단위, 천의 단위가 분리됩니다
        if len(unparsed_price) > 1:
            parsed_price = int(unparsed_price[0][0:-4] + unparsed_price[1])
        else:
            parsed_price = int(unparsed_price[0])
    else:
        parsed_price = int(unparsed_price[0])
    
    return parsed_price

def save_json(parsed_items):
    with open('./sample.json', 'w') as f:
        json.dump(parsed_items, f, indent=2, ensure_ascii=False)
    
def convert_item_to_dict(item):
    dict_item = {}
    dict_item["platform"] = "daangn"
    dict_item["name"] = item.find("span", class_="article-title").text.strip()
    unparsed_price = item.find("p", class_="article-price").text.strip(" \n ")
    dict_item["price"] = parse_price(unparsed_price)
    # dict_item["price"] = item.find("p", class_="article-price").text.strip()
    dict_item["thumbnailUrl"] = item.find("img")["src"]
    dict_item["itemUrl"] = "https://www.daangn.com" + item["href"]
    dict_item["extraInfo"] = item.find("span", class_="article-content").text.strip()
    # dict_item["item-region"] = item.find("p", class_="article-region-name").text.strip() # 거래 지역

    # 좋아요 개수
    # if(item.find("span", class_="article-watch") == None):
    #     dict_item["item-watch-count"] = '0'
    # else:
    #     dict_item["item-watch-count"] = item.find("span", class_="article-watch").text.strip()
    return dict_item


def crawl(keyword):
    if type(keyword) != type("test string"):
        return "Error: Invalid Keyword"

    BASE_URL = "https://www.daangn.com/search/"
    URL = BASE_URL + keyword
    res = requests.get(URL)
    html = res.text
    soup = BeautifulSoup(html, 'html.parser')

    items = soup.select('.flea-market-article-link')
    parsed_items = {}
    parsed_items["length"] = str(len(items))
    parsed_items["items"] = []
    for i in range (0, len(items)):
        item = items[i]
        json_item = convert_item_to_dict(item)
        parsed_items["items"].append(json_item)
    
    # sample 저장
    save_json(parsed_items)
    return parsed_items

if __name__ == "__main__":
    print(crawl("아메리카노"))