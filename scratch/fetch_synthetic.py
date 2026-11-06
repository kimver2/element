# -*- coding: utf-8 -*-
import json
import urllib.request
import urllib.parse
import time

headers = {
    "User-Agent": "PeriodicTableApp/2.6 (https://kimver2.github.io; element-study-app@github.com)"
}

synthetic_files = {
    61: ("File:Promethium-147 solution.jpg", "사진: 방사선을 내뿜으며 스스로 푸른 형광을 내는 프로메튬-147 용액"),
    86: ("File:Radon spectrum visible.png", "사진: 방사성 불활성 기체인 라돈의 방전 발광 스펙트럼"),
    87: ("File:Francium-87.jpg", "사진: 지구 전체에 20~30g만 존재하는 극초희귀 원소 프랑슘의 상징 도안"),
    96: ("File:Cm-Fluoreszenz.png", "사진: 어둠 속에서 주황빛 방사광을 스스로 내뿜는 퀴륨 용액"),
    100: ("File:Enrico Fermi 1943-49.jpg", "사진: 페르뮴 원소의 기원이 된 노벨 물리학상 수상자 엔리코 페르미 (인공 합성 원소)"),
    101: ("File:Dmitri Mendeleev 1890s.jpg", "사진: 주기율표를 최초로 창안한 위대한 과학자 드미트리 멘델레예프 (인공 합성 원소)"),
    102: ("File:AlfredNobel.jpg", "사진: 다이너마이트 발명가이자 노벨상을 제정한 알프레드 노벨 (인공 합성 원소)"),
    103: ("File:Ernest Lawrence 1939.jpg", "사진: 입자 가속기(사이클로트론)를 발명한 어니스트 로렌스 박사 (인공 합성 원소)"),
    104: ("File:Ernest Rutherford LOC.jpg", "사진: 원자핵을 발견하여 현대 원자 물리학의 아버지가 된 어니스트 러더퍼드 (인공 합성 원소)"),
    105: ("File:Flerov Laboratory of Nuclear Reactions.jpg", "사진: 더브늄과 수많은 초중원소를 합성해낸 러시아 두브나 핵반응연구소(FLNR)"),
    106: ("File:Glenn Seaborg - 1964.jpg", "사진: 살아있는 동안 원소(시보귬)에 자신의 이름이 붙여진 글렌 시보그 박사"),
    107: ("File:Niels Bohr.jpg", "사진: 보어 원자 모형을 완성한 양자물리학의 거장 닐스 보어 (인공 합성 원소)"),
    108: ("File:GSI Helmholtz Centre for Heavy Ion Research.jpg", "사진: 하슘(Hs)과 여러 초우라늄 원소를 탄생시킨 독일 헤센 중이온연구소(GSI)"),
    109: ("File:Lise Meitner12.jpg", "사진: 핵분열 메커니즘을 최초로 밝혀낸 여성 물리학의 선구자 리제 마이트너"),
    110: ("File:Darmstadtium (symbol).svg", "사진: 독일 다름슈타트 중이온연구소에서 최초 합성된 110번 원소 다름슈타튬"),
    111: ("File:Wilhelm Conrad Röntgen 1901.jpg", "사진: 엑스선(X-ray)을 최초 발견하여 최초의 노벨 물리학상을 수상한 빌헬름 뢴트겐"),
    112: ("File:Nikolaus Kopernikus.jpg", "사진: 지동설을 주장하여 인류의 우주관을 바꾼 천문학자 니콜라우스 코페르니쿠스"),
    113: ("File:RIKEN-RIB-Project.jpg", "사진: 아시아 최초(일본 RIKEN)로 113번 원소를 합성해낸 중이온 선형 가속기"),
    114: ("File:Georgy Flyorov.jpg", "사진: 소련 원자력 및 초우라늄 원소 연구를 개척한 게오르기 플료로프 박사"),
    115: ("File:Dubna, Russia - Central Square.jpg", "사진: 모스코븀(Mc)이 합성된 모스크바주 과학 도시 두브나(Dubna)"),
    116: ("File:Lawrence Livermore National Laboratory entrance.jpg", "사진: 리버모륨(Lv)을 공동 발견한 미국 로렌스 리버모어 국립연구소(LLNL)"),
    117: ("File:Oak Ridge National Laboratory - High Flux Isotope Reactor.jpg", "사진: 테네신(Ts) 표적 물질 버클륨을 합성해낸 테네시주 오크리지 국립연구소"),
    118: ("File:Yuri Oganessian.jpg", "사진: 살아있는 인물로서 원소 이름의 주인공이 된 핵물리학자 유리 오가네시안 박사")
}

file_names = [v[0] for v in synthetic_files.values()]
url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={'|'.join([urllib.parse.quote(f) for f in file_names])}&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json"

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode())
    pages = data.get("query", {}).get("pages", {})
    resolved = {}
    for pid, p in pages.items():
        title = p.get("title", "")
        info = p.get("imageinfo", [{}])[0]
        thumb = info.get("thumburl", "")
        if thumb:
            resolved[title.lower()] = thumb
            print(f"FOUND: {title} -> {thumb[:50]}...")
        else:
            print(f"MISSING: {title}")

# 결과 저장
with open("scratch/synthetic_photos.json", "w", encoding="utf-8") as f:
    json.dump({
        num: {
            "file": fname,
            "caption": caption,
            "url": resolved.get(fname.lower(), "")
        }
        for num, (fname, caption) in synthetic_files.items()
    }, f, ensure_ascii=False, indent=2)
