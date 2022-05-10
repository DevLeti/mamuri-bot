from base64 import encode
from bs4 import BeautifulSoup
import requests
import json

def save_json(parsed_items):
    with open('./sample.json', 'w') as f:
        json.dump(parsed_items, f, indent=2, ensure_ascii=False)
    
def convert_item_to_dict(item):
    dict_item = {}
    dict_item["platform"] = "daangn"
    dict_item["name"] = item.find("span", class_="article-title").text.strip()
    unparsed_price = item.find("p", class_="article-price").text.strip(" \n ")
    unparsed_price = unparsed_price.replace("원", "")\
                                   .replace("만", "0000")\
                                   .replace(",", "")
    parsed_price = int(unparsed_price)
    print(parsed_price)
    dict_item["price"] = parsed_price
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