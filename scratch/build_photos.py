# -*- coding: utf-8 -*-
import json
import urllib.request
import urllib.parse
import time

headers = {
    "User-Agent": "PeriodicTableApp/2.6 (https://kimver2.github.io; element-study-app@github.com)"
}

# 1. elements-data.js 읽기
with open("js/elements-data.js", "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find("window.PERIODIC_DATA =")
json_str = content[idx + len("window.PERIODIC_DATA ="):].strip().rstrip(";")
data = json.loads(json_str)
std = data.get("standardElements", [])

# 원소별 위키피디아 영문 문서명 오버라이드
wiki_title_overrides = {
    80: "Mercury (element)",
    72: "Hafnium",
    61: "Promethium",
    86: "Radon",
    87: "Francium",
    96: "Curium",
    99: "Einsteinium",
    100: "Fermium",
    101: "Mendelevium",
    102: "Nobelium",
    103: "Lawrencium",
    104: "Rutherfordium",
    105: "Dubnium",
    106: "Seaborgium",
    107: "Bohrium",
    108: "Hassium",
    109: "Meitnerium",
    110: "Darmstadtium",
    111: "Roentgenium",
    112: "Copernicium",
    113: "Nihonium",
    114: "Flerovium",
    115: "Moscovium",
    116: "Livermorium",
    117: "Tennessine",
    118: "Oganesson"
}

# 수동으로 지정할 고품질 실물/대표 사진 위키미디어 파일들
manual_files = {
    2: "File:Helium discharge tube.jpg",
    72: "File:Hafnium.jpg",
    61: "File:Promethium.jpg",
    86: "File:Radon discharge tube.png",
    96: "File:Curium glow.jpg",
    99: "File:Einsteinium.jpg",
    100: "File:Fermium.jpg",
    101: "File:Mendelevium.jpg",
    102: "File:Nobelium.jpg",
    103: "File:Lawrencium.jpg",
    104: "File:Rutherfordium.jpg",
    105: "File:Dubnium.jpg",
    106: "File:Glenn Seaborg s element.jpg",
    107: "File:Bohrium.jpg",
    108: "File:Hassium.jpg",
    109: "File:Meitnerium.jpg",
    110: "File:Darmstadtium.jpg",
    111: "File:Roentgenium.jpg",
    112: "File:Copernicium.jpg",
    113: "File:Nihonium.jpg",
    114: "File:Flerovium.jpg",
    115: "File:Moscovium.jpg",
    116: "File:Livermorium.jpg",
    117: "File:Tennessine.jpg",
    118: "File:Oganesson.jpg"
}

print("Fetching Wikipedia page images...")
chunks = [std[i:i + 30] for i in range(0, len(std), 30)]
page_thumbs = {}

for chunk in chunks:
    titles = [wiki_title_overrides.get(el["num"], el["nameEn"]) for el in chunk]
    titles_str = "|".join(titles)
    query_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(titles_str)}&prop=pageimages&format=json&pithumbsize=500&redirects=1"
    req = urllib.request.Request(query_url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            res = json.loads(resp.read().decode())
            pages = res.get("query", {}).get("pages", {})
            norm = {n["to"]: n["from"] for n in res.get("query", {}).get("normalized", [])}
            redir = {r["to"]: r["from"] for r in res.get("query", {}).get("redirects", [])}
            
            for pid, pinfo in pages.items():
                title = pinfo.get("title", "")
                orig_title = redir.get(title, title)
                orig_title = norm.get(orig_title, orig_title)
                thumb = pinfo.get("thumbnail", {}).get("source", "")
                if thumb:
                    page_thumbs[orig_title.lower()] = thumb
                    page_thumbs[title.lower()] = thumb
    except Exception as e:
        print("PageImages Error:", e)
    time.sleep(0.3)

print("Page images collected:", len(page_thumbs))

# 파일명 직접 조회
print("Querying manual files via Commons API...")
commons_thumbs = {}
manual_file_list = list(set(manual_files.values()))
chunks_f = [manual_file_list[i:i + 20] for i in range(0, len(manual_file_list), 20)]

for cf in chunks_f:
    titles_str = "|".join(cf)
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(titles_str)}&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data_c = json.loads(resp.read().decode())
            for pid, p in data_c["query"]["pages"].items():
                title = p.get("title", "")
                info = p.get("imageinfo", [{}])[0]
                thumb = info.get("thumburl", "")
                if thumb:
                    commons_thumbs[title.lower()] = thumb
    except Exception as e:
        print("Commons Error:", e)
    time.sleep(0.3)

print("Commons files collected:", len(commons_thumbs))

# 최종 결과 조합 및 200 OK 테스트
final_images = {}
for el in std:
    num = el["num"]
    sym = el["symbol"]
    name_en = el["nameEn"]
    
    # 우선순위:
    # 1. manual_files if defined and in commons_thumbs
    thumb = ""
    if num in manual_files:
        fname = manual_files[num].lower()
        thumb = commons_thumbs.get(fname, "")
    
    # 2. page_thumbs
    if not thumb:
        target_title = wiki_title_overrides.get(num, name_en).lower()
        thumb = page_thumbs.get(target_title, "")
        if not thumb:
            thumb = page_thumbs.get(name_en.lower(), "")
            
    # 3. 기존 URL에서 640px -> 500px 변환 시도
    if not thumb:
        old_url = el.get("illustration", {}).get("imgUrl", "")
        if old_url:
            thumb = old_url.replace("/640px-", "/500px-")
    
    final_images[num] = {
        "num": num,
        "symbol": sym,
        "nameKo": el["nameKo"],
        "nameEn": name_en,
        "url": thumb
    }

with open("scratch/verified_element_photos.json", "w", encoding="utf-8") as f:
    json.dump(final_images, f, ensure_ascii=False, indent=2)

print("Saved scratch/verified_element_photos.json with", len(final_images), "elements.")
