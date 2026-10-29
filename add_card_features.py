# -*- coding: utf-8 -*-
"""
118개 원소 데이터셋에 1~4번 기능 메타데이터 보강 스크립트:
1. rarity: 'COMMON', 'RARE', 'LEGENDARY', 'MYTHIC'
2. symbolSecret: 원소 기호의 비밀(어원 및 라틴어/그리스어 스토리)
3. flameColor: 불꽃 반응 색상 (코드, 이름, 영문)
4. hazard: 독성(toxicity), 반응성(reactivity), 방사능(radiation), 안전등급(safetyLevel)
"""

import json

# 원소 기호의 비밀 특별 해설 딕셔너리
SYMBOL_SECRETS = {
    1: "수소의 기호 H는 그리스어로 '물을 만드는 것(Hydro + Genes)'에서 첫 글자를 땄어요!",
    2: "헬륨의 기호 He는 그리스 태양의 신 '헬리오스(Helios)'의 이름에서 유래했어요.",
    3: "리튬의 기호 Li는 그리스어로 '돌(Lithos)'을 뜻해요. 광물 속에서 처음 찾았기 때문이에요.",
    6: "탄소의 기호 C는 라틴어로 숯과 석탄을 뜻하는 '카르보(Carbo)'에서 유래했어요.",
    7: "질소의 기호 N은 초석(화약 원료)을 만드는 물질 '니트론(Nitron)'에서 유래했어요.",
    8: "산소의 기호 O는 그리스어로 산(Acid)을 만드는 것 '옥시스(Oxys)'에서 왔어요.",
    9: "플루오린의 기호 F는 잘 녹아 흐른다는 라틴어 '플루에레(Fluere)'에서 유래했어요.",
    11: "왜 Sodium인데 기호가 Na일까요? 고대 이집트의 천연 탄산소다 '나트론(Natron)'에서 이름을 따왔기 때문이에요! 영어권은 소듐, 독일/한국은 나트륨이라 불러요.",
    19: "왜 Potassium인데 기호가 K일까요? 식물의 재(Ash)를 뜻하는 아랍어 '알칼리(al-qaly)'에서 독일어 '칼륨(Kalium)'이 생겨 K가 되었답니다!",
    20: "칼슘의 기호 Ca는 라틴어로 석회석과 분필을 뜻하는 '칼크스(Calx)'에서 유래했어요.",
    26: "왜 Iron인데 기호가 Fe일까요? 고대 로마인들이 철을 부르던 라틴어 '페룸(Ferrum - 단단한 쇠)'에서 기호 Fe가 탄생했어요!",
    29: "왜 Copper인데 기호가 Cu일까요? 지중해의 아름다운 섬 '키프로스(Cyprus)'의 라틴어 이름 '쿠프룸(Cuprum)'에서 Cu가 유래했어요.",
    47: "왜 Silver인데 기호가 Ag일까요? 라틴어로 '하얗게 빛나는 보석'을 뜻하는 '아르겐툼(Argentum)'에서 Ag가 왔어요. 아르헨티나 나라 이름도 은에서 왔답니다!",
    50: "왜 Tin인데 기호가 Sn일까요? 고대 라틴어로 주석을 뜻하는 '스탄눔(Stannum)'에서 Sn이 유래했어요.",
    51: "왜 Antimony인데 기호가 Sb일까요? 클레오파트라의 눈화장 먹으로 쓰이던 라틴어 '스티비움(Stibium)'에서 Sb가 되었어요.",
    74: "왜 Tungsten인데 기호가 W일까요? 독일 광부들이 주석을 갉아먹는 괴물 돌이라며 붙인 '볼프람(Wolfram - 늑대의 침)'에서 기호 W가 탄생했어요!",
    79: "왜 Gold인데 기호가 Au일까요? 라틴어로 '눈부시게 빛나는 새벽빛'을 뜻하는 '아우룸(Aurum)'에서 가장 아름다운 기호 Au가 탄생했어요!",
    80: "왜 Mercury인데 기호가 Hg일까요? 라틴어로 '물(Hydro)처럼 찰랑거리는 은(Argyros)'이란 뜻의 '히드라르기룸(Hydrargyrum)'에서 Hg가 왔어요!",
    82: "왜 Lead인데 기호가 Pb일까요? 고대 로마의 수도관 파이프를 납으로 만들어 라틴어 '플룸붐(Plumbum)'이라 불렀고, 여기서 배관공(Plumber)과 기호 Pb가 유래했어요!",
    92: "우라늄의 기호 U는 당시 갓 발견된 미지의 푸른 행성 천왕성(Uranus)을 기념해 붙여졌어요.",
    94: "플루토늄의 기호 Pu는 태양계 끝 명왕성(Pluto)의 이름을 땄답니다.",
    99: "아인슈타이늄의 기호 Es는 상대성 이론의 천재 과학자 알베르트 아인슈타인의 이름을 헌정받았어요.",
    101: "멘델레븀의 기호 Md는 주기율표를 발명한 화학의 아버지 드미트리 멘델레예프의 이름이에요.",
    118: "오가네손의 기호 Og는 현존하는 세계 최고의 초중원소 연구 거장 유리 오가네시안 박사의 이름이에요!"
}

# 불꽃 반응 색상 데이터 (원자번호 -> 색상 정보)
FLAME_COLORS = {
    3: {"color": "#ff1744", "nameKo": "진홍색 (새빨간 불꽃)", "nameEn": "Crimson Red"},
    11: {"color": "#ffd600", "nameKo": "노란색 (눈부신 황금 불꽃)", "nameEn": "Intense Yellow"},
    19: {"color": "#b388ff", "nameKo": "보라색 (신비로운 연보라)", "nameEn": "Lilac Purple"},
    20: {"color": "#ff6d00", "nameKo": "주황색 (따뜻한 벽돌색)", "nameEn": "Brick Orange"},
    29: {"color": "#00e676", "nameKo": "청록색 (에메랄드빛 불꽃)", "nameEn": "Blue-Green"},
    37: {"color": "#ea80fc", "nameKo": "붉은 보라색", "nameEn": "Red-Violet"},
    38: {"color": "#ff0055", "nameKo": "짙은 빨간색 (화려한 불꽃놀이 적색)", "nameEn": "Deep Scarlet"},
    55: {"color": "#00e5ff", "nameKo": "하늘색 (시원한 푸른 불꽃)", "nameEn": "Sky Blue"},
    56: {"color": "#76ff03", "nameKo": "황록색 (사과빛 연두 불꽃)", "nameEn": "Apple Green"}
}

# 희귀도 계산 함수
def get_rarity(num, is_future, is_radioactive):
    if is_future or num == 118:
        return "MYTHIC" # 신화
    if num in [78, 79, 45, 46, 44, 98, 99, 100, 101, 88, 84, 43]:
        return "LEGENDARY" # 전설
    if is_radioactive or num in [22, 28, 30, 31, 35, 36, 47, 50, 53, 54, 74, 80, 83] or (num >= 57 and num <= 71):
        return "RARE" # 희귀
    return "COMMON" # 일반

# 위험도 및 빌런 등급 계산
def get_hazard(el):
    num = el["num"]
    cat = el["category"]
    is_rad = el.get("isRadioactive", False)

    # 기본값
    tox = 1
    react = 2
    rad = 5 if is_rad else 1

    # 독성 특별 원소
    if num in [33, 81]: tox = 5 # 비소, 탈륨
    elif num in [80, 82, 48]: tox = 4 # 수은, 납, 카드뮴
    elif num in [9, 17, 35]: tox = 3 # 할로겐 독가스
    elif num in [79, 10, 2, 18, 6]: tox = 1 # 무해

    # 반응성 특별 원소
    if cat == "alkali-metal":
        react = 5 if num >= 37 else 4
    elif cat == "halogen":
        react = 5 if num == 9 else 4
    elif cat == "noble-gas":
        react = 1
    elif cat == "alkaline-earth":
        react = 3

    # 방사선
    if num >= 92: rad = 5
    elif is_rad: rad = 4

    total_danger = tox + react + rad
    if total_danger >= 11 or is_rad or tox >= 5:
        safety = "DANGER" # 🔴 특급 위험 빌런
        safetyLabel = "위험 원소 (주의 필요!)"
        safetyColor = "#ff4757"
    elif total_danger >= 7 or react >= 4:
        safety = "WARNING" # 🟡 주의 요망
        safetyLabel = "반응성 높음 (조심!)"
        safetyColor = "#ffa502"
    else:
        safety = "SAFE" # 🟢 안전 무해
        safetyLabel = "안전하고 친근한 원소"
        safetyColor = "#2ed573"

    return {
        "toxicity": tox,
        "reactivity": react,
        "radiation": rad,
        "safety": safety,
        "safetyLabel": safetyLabel,
        "safetyColor": safetyColor
    }

# 데이터 파일 읽기
with open("js/elements-data.js", "r", encoding="utf-8") as f:
    content = f.read()

start_idx = content.find("window.PERIODIC_DATA = ") + len("window.PERIODIC_DATA = ")
end_idx = content.rfind(";")
raw_json = content[start_idx:end_idx].strip()
data = json.loads(raw_json)

# 표준 원소 강화
for el in data["standardElements"]:
    num = el["num"]
    el["rarity"] = get_rarity(num, False, el.get("isRadioactive", False))
    el["hazard"] = get_hazard(el)
    if num in SYMBOL_SECRETS:
        el["symbolSecret"] = SYMBOL_SECRETS[num]
    else:
        el["symbolSecret"] = f"기호 {el['symbol']}은(는) {el['nameEn']}의 이름에서 정밀하게 선정되었어요."

    if num in FLAME_COLORS:
        el["flameColor"] = FLAME_COLORS[num]

# 미래 가상 원소 강화
for el in data["futureElements"]:
    num = el["num"]
    el["rarity"] = "MYTHIC"
    el["hazard"] = {
        "toxicity": 3,
        "reactivity": 5,
        "radiation": 5,
        "safety": "DANGER",
        "safetyLabel": "미지의 초에너지 원소",
        "safetyColor": "#f1c40f"
    }
    el["symbolSecret"] = f"기호 {el['symbol']}은 IUPAC의 3글자 체계적 가상 원소 명명법에서 유래했어요."

with open("js/elements-data.js", "w", encoding="utf-8") as f:
    f.write(f"// 118개 원소 + 8주기 미래 원소 데이터베이스 (희귀도, 기호비밀, 불꽃반응, 위험도 포함)\nwindow.PERIODIC_DATA = {json.dumps(data, ensure_ascii=False, indent=2)};\n")

print("Successfully enriched elements-data.js with Rarity, Symbol Secrets, Flame Tests, and Hazard Ratings!")
