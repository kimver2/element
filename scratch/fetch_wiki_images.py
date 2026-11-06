# -*- coding: utf-8 -*-
import json
import urllib.request
import urllib.parse
import time

with open("js/elements-data.js", "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find("window.PERIODIC_DATA =")
json_str = content[idx + len("window.PERIODIC_DATA ="):].strip().rstrip(";")
data = json.loads(json_str)
std = data.get("standardElements", [])

headers = {"User-Agent": "PeriodicTableApp/2.6 (https://kimver2.github.io; element-study-app@github.com)"}

# 화학 원소 특수 위키피디아 제목 매핑
wiki_title_map = {
    "Mercury": "Mercury (element)",
    "Lead": "Lead",
    "Tin": "Tin",
    "Iron": "Iron",
    "Carbon": "Carbon",
    "Neon": "Neon",
    "Argon": "Argon",
    "Krypton": "Krypton",
    "Xenon": "Xenon",
    "Radon": "Radon"
}

chunks = [std[i:i + 25] for i in range(0, len(std), 25)]
results = {}

for chunk in chunks:
    titles = [wiki_title_map.get(el["nameEn"], el["nameEn"]) for el in chunk]
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
                results[orig_title.lower()] = thumb
                results[title.lower()] = thumb
    except Exception as e:
        print("API Error:", e)
    time.sleep(0.5)

output_summary = []
no_image_elements = []

for el in std:
    num = el["num"]
    sym = el["symbol"]
    name_en = el["nameEn"]
    target_title = wiki_title_map.get(name_en, name_en).lower()
    thumb = results.get(target_title, "")
    if not thumb:
        thumb = results.get(name_en.lower(), "")
    
    if thumb:
        output_summary.append({
            "num": num,
            "symbol": sym,
            "nameKo": el["nameKo"],
            "nameEn": name_en,
            "thumb": thumb
        })
    else:
        no_image_elements.append((num, sym, name_en))

print(f"Total: {len(std)}, Found Image: {len(output_summary)}, No Image: {len(no_image_elements)}")
print("No Image elements:", no_image_elements)

# Save results
with open("scratch/wiki_images.json", "w", encoding="utf-8") as out_f:
    json.dump(output_summary, out_f, ensure_ascii=False, indent=2)
