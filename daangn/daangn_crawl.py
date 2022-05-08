from base64 import encode
from bs4 import BeautifulSoup
import requests
import json

# TODO: 크롤링한 데이터가 이미 서버에 있는지 확인하는 method 필요
def check_duplication_item(item):
    return

def save_json(parsed_items):
    with open('./sample.json', 'w') as f:
        json.dump(parsed_items, f, indent=2, ensure_ascii=False)
    
def convert_item_to_dict(item):
    dict_item = {}
    dict_item["item-thumbnail"] = item.find("img")["src"]
    dict_item["item-title"] = item.find("span", class_="article-title").text.strip()
    dict_item["item-content"] = item.find("span", class_="article-content").text.strip()
    dict_item["item-region"] = item.find("p", class_="article-region-name").text.strip()
    dict_item["item-price"] = item.find("p", class_="article-price").text.strip()
    if(item.find("span", class_="article-watch") == None):
        dict_item["item-watch-count"] = '0'
    else:
        dict_item["item-watch-count"] = item.find("span", class_="article-watch").text.strip()
    return dict_item

# def convert_item_to_json(item):
#     dict_item = {}
#     dict_item["item-thumbnail"] = item.find("img")["src"]
#     dict_item["item-title"] = item.find("span", class_="article-title").text.strip()
#     dict_item["item-content"] = item.find("span", class_="article-content").text.strip()
#     dict_item["item-region"] = item.find("p", class_="article-region-name").text.strip()
#     dict_item["item-price"] = item.find("p", class_="article-price").text.strip()
#     if(item.find("span", class_="article-watch") == None):
#         dict_item["item-watch-count"] = '0'
#     else:
#         dict_item["item-watch-count"] = item.find("span", class_="article-watch").text.strip()

#     json_item = json.dumps(dict_item, ensure_ascii=False)
#     return json_item

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
    
    save_json(parsed_items)
    json_items = json.dumps(parsed_items, ensure_ascii=False, indent=2)
    return json_items

if __name__ == "__main__":
    print(crawl("RTX 3080"))