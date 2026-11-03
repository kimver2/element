# -*- coding: utf-8 -*-
"""
118개 화학 원소 + 5개 미래 가상 원소 전체에 대해
《나의 첫 주기율표 공부》 책 스타일의 풍부한 일러스트레이션(그림/사진/아이콘/해설) 메타데이터를
생성하고 elements-data.js에 병합하는 완전한 스크립트.
"""

import json

# 118개 원소별 대표 사물(책의 일러스트 대상), 아이콘, 해설, 사진 URL
ELEMENT_ILLUSTRATIONS = {
    1: {
        "icon": "🚀",
        "item": "로켓 추진 연료 & 생명의 물(H₂O)",
        "itemDesc": "우주로 날아가는 로켓의 강력한 액체 연료이자, 우리 몸의 70%를 이루는 생명의 물이에요!",
        "caption": "사진: 우주를 향해 솟구치는 거대 로켓과 수소 기체 방전관",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Hydrogenglow.jpg/640px-Hydrogenglow.jpg"
    },
    2: {
        "icon": "🎈",
        "item": "둥둥 뜨는 파티 풍선 & MRI",
        "itemDesc": "공기보다 가벼워 하늘 높이 떠오르는 풍선과, 병원에서 몸속을 촬영하는 MRI의 초저온 냉각재!",
        "caption": "사진: 알록달록 파티 풍선과 헬륨 방전관의 주황빛 빛",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Helium_discharge_tube.jpg/640px-Helium_discharge_tube.jpg"
    },
    3: {
        "icon": "🔋",
        "item": "스마트폰 & 전기차 배터리",
        "itemDesc": "매일 손에서 놓지 못하는 스마트폰과 쌩쌩 달리는 전기차를 움직이는 리튬이온 배터리의 심장!",
        "caption": "사진: 석유 속에 보관된 순수 리튬 금속 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Lithium_paraffin.jpg/640px-Lithium_paraffin.jpg"
    },
    4: {
        "icon": "💍",
        "item": "초록 에메랄드 보석 & 우주망원경",
        "itemDesc": "찬란한 초록빛 보석 에메랄드의 원소이자, 제임스 웹 우주망원경의 금빛 거울을 만든 튼튼한 금속!",
        "caption": "사진: 영롱한 초록 보석 에메랄드와 순수 베릴륨 펠릿",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Beryllium_%28Be%29.jpg/640px-Beryllium_%28Be%29.jpg"
    },
    5: {
        "icon": "🧪",
        "item": "내열 유리 냄비 & 테니스 라켓",
        "itemDesc": "뜨거운 불에서도 깨지지 않는 파이렉스 내열 유리 주방용품과, 탄력 넘치는 고급 테니스 라켓!",
        "caption": "사진: 반도체와 내열 유리에 쓰이는 고순도 순수 붕소 결정",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Boron_pieces.jpg/640px-Boron_pieces.jpg"
    },
    6: {
        "icon": "💎",
        "item": "반짝이는 다이아몬드 & 연필심",
        "itemDesc": "세상에서 가장 단단하고 눈부신 보석 다이아몬드이자, 종이 위에 사각사각 써지는 연필심(흑연)!",
        "caption": "사진: 투명하게 빛나는 다이아몬드와 부드러운 흑연 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Diamond_and_graphite.jpg/640px-Diamond_and_graphite.jpg"
    },
    7: {
        "icon": "🥔",
        "item": "바삭한 과자 봉지 충전 기체 & 비료",
        "itemDesc": "감자칩 과자가 눅눅해지지 않게 빵빵하게 채워주는 보호 기체이자, 식물을 자라게 하는 비료!",
        "caption": "사진: 과자 봉지 충전 기체와 질소 방전관의 자줏빛 빛",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Nitrogen_discharge_tube.jpg/640px-Nitrogen_discharge_tube.jpg"
    },
    8: {
        "icon": "🤿",
        "item": "잠수부 산소통 & 지구의 숨결",
        "itemDesc": "지구상의 모든 생명이 1초도 멈추지 않고 들이마시는 산소이자, 바닷속 잠수부의 생명줄!",
        "caption": "사진: 극저온에서 연한 하늘빛을 띠는 액체 산소",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Liquid_Oxygen_in_a_beaker_%28transparent_background%29.png/640px-Liquid_Oxygen_in_a_beaker_%28transparent_background%29.png"
    },
    9: {
        "icon": "🪥",
        "item": "충치 예방 불소 치약 & 프라이팬 코팅",
        "itemDesc": "매일 이를 튼튼하게 지켜주는 치약 속의 불소이자, 음식이 달라붙지 않는 테플론 프라이팬 코팅!",
        "caption": "사진: 극저온에서 액화된 옅은 노란색의 플루오린 액체",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Fluorine_liquid_in_gal_cryostat.png/640px-Fluorine_liquid_in_gal_cryostat.png"
    },
    10: {
        "icon": "🏮",
        "item": "화려한 밤거리의 네온사인 간판",
        "itemDesc": "전기를 흘려주면 눈이 부실 정도로 찬란한 붉은 주황빛을 뿜어내며 도시의 밤을 물들여요!",
        "caption": "사진: 어둠 속에서 눈부시게 빛나는 주황색 네온 방전관",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Neon_discharge_tube.jpg/640px-Neon_discharge_tube.jpg"
    },
    11: {
        "icon": "🧂",
        "item": "맛있는 식탁 소금 & 노란 터널 가로등",
        "itemDesc": "음식 맛을 내는 하얀 소금(NaCl)의 주인공이자, 안개 낀 터널을 밝히는 노란 가로등이에요!",
        "caption": "사진: 하얀 식탁 소금 결정과 칼로 자른 은백색 나트륨 금속",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Na_%28Sodium%29.jpg/640px-Na_%28Sodium%29.jpg"
    },
    12: {
        "icon": "🎆",
        "item": "눈부신 백색 불꽃놀이 & 자전거",
        "itemDesc": "불을 붙이면 눈이 멀 정도로 하얀 빛을 내어 축제 불꽃놀이에 쓰이고, 가벼운 자전거 프레임이 돼요!",
        "caption": "사진: 은빛 광택의 순수 마그네슘 결정 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Magnesium_crystals.jpg/640px-Magnesium_crystals.jpg"
    },
    13: {
        "icon": "🥫",
        "item": "시원한 음료수 캔 & 거대한 비행기",
        "itemDesc": "시원한 탄산음료 캔, 주방의 은박 호일부터 하늘을 나는 거대한 여객기의 날개까지 가벼운 금속!",
        "caption": "사진: 가볍고 은은한 광택을 지닌 고순도 알루미늄 바",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Aluminium-4.jpg/640px-Aluminium-4.jpg"
    },
    14: {
        "icon": "💻",
        "item": "스마트폰 두뇌 반도체 CPU & 모래",
        "itemDesc": "반짝이는 모래와 유리의 주성분이자, 현대 문명을 만든 컴퓨터와 인공지능 반도체 칩의 재료!",
        "caption": "사진: 반도체 웨이퍼를 만드는 거대한 실리콘(규소) 단결정 잉곳",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/SiliconCrook.jpg/640px-SiliconCrook.jpg"
    },
    15: {
        "icon": "🔥",
        "item": "슥 긁으면 불붙는 성냥 머리 & DNA",
        "itemDesc": "성냥을 켤 때 쓰이는 붉은 인이자, 우리 몸의 모든 유전 정보를 담은 DNA 나선의 튼튼한 뼈대!",
        "caption": "사진: 성냥 머리에 쓰이는 선명한 붉은색 적린(인) 가루",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Phosphor_rot.jpg/640px-Phosphor_rot.jpg"
    },
    16: {
        "icon": "🌋",
        "item": "화산 온천의 노란 유황 & 자동차 타이어",
        "itemDesc": "화산 분화구 주변의 샛노란 온천 바위이자, 자동차 타이어 고무를 팽팽하고 질기게 해주는 원소!",
        "caption": "사진: 화산 지대에서 채취한 샛노란 순수 유황(황) 결정 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Sulfur-sample.jpg/640px-Sulfur-sample.jpg"
    },
    17: {
        "icon": "🏊",
        "item": "깨끗한 수영장 소독제 & 락스 표백제",
        "itemDesc": "수영장 물속 세균을 없애 깨끗하게 유지해 주고, 옷의 얼룩을 지우는 표백제와 수돗물 정화에 쓰여요!",
        "caption": "사진: 앰플에 밀봉된 황록색 염소 액체와 수영장 소독제",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Chlorine_liquid_in_ampoule.jpg/640px-Chlorine_liquid_in_ampoule.jpg"
    },
    18: {
        "icon": "💡",
        "item": "백열전구 보호 가스 & 박물관 보존",
        "itemDesc": "전구 안의 필라멘트가 타지 않게 지켜주고, 박물관의 소중한 고문서가 낡지 않게 보관함에 채워요!",
        "caption": "사진: 아르곤 가스가 채워진 방전관의 신비로운 하늘빛",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Argon_discharge_tube.jpg/640px-Argon_discharge_tube.jpg"
    },
    19: {
        "icon": "🍌",
        "item": "영양 만점 바나나 & 식물 비료",
        "itemDesc": "바나나에 듬뿍 들어 있어 근육 경련을 막아주고, 농작물이 알찬 열매를 맺게 돕는 비료의 필수 성분!",
        "caption": "사진: 산화를 막기 위해 밀봉된 은빛 칼륨(포타슘) 금속",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Potassium.jpg/640px-Potassium.jpg"
    },
    20: {
        "icon": "🦴",
        "item": "튼튼한 뼈와 치아 & 학교 분필",
        "itemDesc": "뼈와 이가 단단해지도록 우유에 듬뿍 들어 있으며, 선생님이 칠판에 글씨를 쓰는 분필의 주성분!",
        "caption": "사진: 아르곤 보호가스 속의 칼슘 금속 결정과 조개껍데기",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Calcium_unter_Argon_Schutzgasatmosph%C3%A4re.jpg/640px-Calcium_unter_Argon_Schutzgasatmosph%C3%A4re.jpg"
    },
    21: {
        "icon": "🚲",
        "item": "초경량 고급 자전거 & 야구 방망이",
        "itemDesc": "알루미늄에 아주 조금만 섞어도 강철처럼 단단해져 최고급 자전거 프레임과 프로 야구 방망이를 만들어요!",
        "caption": "사진: 은백색의 순수 스칸듐 금속 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Scandium_sublimed_dendritic_bark_and_1cm3_cube.jpg/640px-Scandium_sublimed_dendritic_bark_and_1cm3_cube.jpg"
    },
    22: {
        "icon": "🦾",
        "item": "인공 관절 & 초강력 우주선 외벽",
        "itemDesc": "가볍고 단단하며 인체에 무해해 인공 뼈와 임플란트로 쓰이고, 초음속 제트기와 우주선에 쓰여요!",
        "caption": "사진: 광택이 나는 고강도 타이타늄 금속 결정 바",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Titanium_crystal_bar.jpg/640px-Titanium_crystal_bar.jpg"
    },
    23: {
        "icon": "🔧",
        "item": "단단한 강철 공구(스패너) & 배터리",
        "itemDesc": "철에 섞으면 아무리 세게 내리쳐도 부러지지 않는 만능 스패너와 도끼, 대용량 전기 저장 배터리가 돼요!",
        "caption": "사진: 은빛 광택의 단단한 바나듐 금속 조각",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Vanadium_etched_bar_and_1cm3_cube.jpg/640px-Vanadium_etched_bar_and_1cm3_cube.jpg"
    },
    24: {
        "icon": "🚿",
        "item": "반짝이는 수도꼭지 & 스테인리스",
        "itemDesc": "주방의 스테인리스 칼과 욕실의 번쩍이는 수도꼭지 표면에 도금되어 평생 녹슬지 않게 지켜줘요!",
        "caption": "사진: 거울처럼 눈부시게 빛나는 크로뮴 결정 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Chromium_crystals_and_1cm3_cube.jpg/640px-Chromium_crystals_and_1cm3_cube.jpg"
    },
    25: {
        "icon": "🔋",
        "item": "건전지 속 검은 분말 & 기찻길 레일",
        "itemDesc": "가정용 알카라인 건전지 속의 검은 가루이자, 무거운 기차가 매일 지나다녀도 끄떡없는 기찻길 레일의 원료!",
        "caption": "사진: 전해 제련된 순수 망가니즈 금속 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Manganese_electrolytic_and_1cm3_cube.jpg/640px-Manganese_electrolytic_and_1cm3_cube.jpg"
    },
    26: {
        "icon": "🍳",
        "item": "요리용 프라이팬 & 거대한 다리 철골",
        "itemDesc": "지구 핵의 대부분을 차지하고 빌딩과 거대한 다리를 세우는 가장 친숙한 금속이자 혈액 속 산소 운반자!",
        "caption": "사진: 99.9% 순수 전해철 큐브와 단단한 프라이팬",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Iron_electrolytic_and_1cm3_cube.jpg/640px-Iron_electrolytic_and_1cm3_cube.jpg"
    },
    27: {
        "icon": "🎨",
        "item": "신비로운 코발트 블루 물감 & 배터리",
        "itemDesc": "도자기와 유리를 물들이는 매혹적인 푸른색 물감의 원료이자, 고성능 리튬이온 배터리의 필수 양극재!",
        "caption": "사진: 푸른빛이 감도는 고순도 순수 코발트 금속 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Cobalt_electrolytic_and_1cm3_cube.jpg/640px-Cobalt_electrolytic_and_1cm3_cube.jpg"
    },
    28: {
        "icon": "🪙",
        "item": "반짝이는 100원 동전 & 충전지",
        "itemDesc": "지갑 속 100원, 500원 동전의 은빛 합금이자, 스마트폰과 무선 청소기의 충전식 배터리에 쓰여요!",
        "caption": "사진: 녹색 전해액에서 자란 은빛 니켈 금속 구슬",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Nickel_chunk.jpg/640px-Nickel_chunk.jpg"
    },
    29: {
        "icon": "🔌",
        "item": "전기를 나르는 구리 전선 & 동상",
        "itemDesc": "전기를 가장 잘 전달해 가정의 모든 콘센트와 전선 속에 들어 있으며, 공원의 청동 동상과 10원 동전의 재료!",
        "caption": "사진: 자연 상태의 붉은빛 천연 구리 원석과 전선",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/NatCopper.jpg/640px-NatCopper.jpg"
    },
    30: {
        "icon": "🛡️",
        "item": "녹 방지 아연 도금 & 자외선 차단제",
        "itemDesc": "철판에 입혀 녹스는 것을 막아주는 도금 금속이자, 여름철 피부를 지켜주는 선크림 속 성분!",
        "caption": "사진: 승화 정제된 아연 결정 파편과 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Zinc_fragment_sublimed_and_1cm3_cube.jpg/640px-Zinc_fragment_sublimed_and_1cm3_cube.jpg"
    },
    31: {
        "icon": "🍫",
        "item": "손바닥 체온(30℃)에 녹는 금속 & LED",
        "itemDesc": "손바닥 위에 올려두면 체온에 초콜릿처럼 사르르 녹아내리는 마법 같은 금속이자, 파란색 LED의 재료!",
        "caption": "사진: 손바닥 온도에서 액체로 녹아내리는 신기한 갈륨 금속",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Solid_gallium_%28Ga%29.jpg/640px-Solid_gallium_%28Ga%29.jpg"
    },
    32: {
        "icon": "📻",
        "item": "트랜지스터 라디오 & 적외선 렌즈",
        "itemDesc": "컴퓨터 반도체 혁명을 일으킨 최초의 트랜지스터 재료이자, 밤에도 잘 보이는 열화상 카메라 렌즈!",
        "caption": "사진: 짙은 은회색 광택을 띤 고순도 저마늄 다결정 바",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Polycrystalline-germanium.jpg/640px-Polycrystalline-germanium.jpg"
    },
    33: {
        "icon": "☠️",
        "item": "역사 속 무서운 사약 & 첨단 반도체",
        "itemDesc": "과거 왕실의 사약에 쓰이던 무서운 독약이지만, 오늘날에는 초고속 레이저 반도체(GaAs)로 변신했어요!",
        "caption": "사진: 금속성 광택을 지닌 순수 비소 결정 조각",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Arsenic_1a.jpg/640px-Arsenic_1a.jpg"
    },
    34: {
        "icon": "🧴",
        "item": "비듬 방지 샴푸 & 복사기 감광 드럼",
        "itemDesc": "빛을 받으면 전기가 통하는 성질이 있어 복사기 드럼에 쓰이고, 두피를 깨끗하게 해주는 약용 샴푸에 들어있어요!",
        "caption": "사진: 검은색과 회색 빛을 띠는 고순도 셀레늄 구슬",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Selenium_black-grey.jpg/640px-Selenium_black-grey.jpg"
    },
    35: {
        "icon": "🚒",
        "item": "불길을 잡는 난연제 & 흑백 사진 필름",
        "itemDesc": "상온에서 유일한 적갈색 액체 비금속으로, 커튼이나 가구에 불이 잘 붙지 않게 막아주는 난연제예요!",
        "caption": "사진: 적갈색 증기를 뿜어내는 유리 앰플 속 액체 브로민",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Bromine_vial_in_acrylic_cube.jpg/640px-Bromine_vial_in_acrylic_cube.jpg"
    },
    36: {
        "icon": "✈️",
        "item": "공항 활주로 유도등 & 레이저",
        "itemDesc": "짙은 안개 속에서도 활주로를 똑똑히 볼 수 있게 뚫고 나가는 강력한 섬광등과 안과 수술 레이저!",
        "caption": "사진: 크립톤 기체 방전관이 내뿜는 백청색 빛",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Krypton_discharge_tube.jpg/640px-Krypton_discharge_tube.jpg"
    },
    37: {
        "icon": "⏳",
        "item": "초정밀 루비듐 원자시계 & GPS",
        "itemDesc": "1억 년에 단 1초도 틀리지 않는 초정밀 원자시계의 핵심으로, 스마트폰 내비게이션 GPS 위성에 실려 있어요!",
        "caption": "사진: 앰플 속에 밀봉된 순수 루비듐 금속 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Rubidium-metal.jpg/640px-Rubidium-metal.jpg"
    },
    38: {
        "icon": "🎇",
        "item": "불꽃놀이의 붉은 불꽃 & 야광 페인트",
        "itemDesc": "축제 밤하늘을 새빨갛게 물들이는 불꽃놀이의 화약이자, 밤에 빛나는 야광 페인트의 원료예요!",
        "caption": "사진: 아르곤 가스 속에 보관된 순수 스트론튬 금속",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Strontium_destilliert_1a.jpg/640px-Strontium_destilliert_1a.jpg"
    },
    39: {
        "icon": "📺",
        "item": "컬러 TV 빨간 형광체 & 암 치료 레이저",
        "itemDesc": "과거 컬러 TV 화면에 선명한 빨간색을 입혀준 희토류 원소이자, 정밀 수술용 레이저에 쓰여요!",
        "caption": "사진: 순도 99.9%의 이트륨 금속 조각과 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Yttrium_sublimed_dendritic_bark_and_1cm3_cube.jpg/640px-Yttrium_sublimed_dendritic_bark_and_1cm3_cube.jpg"
    },
    40: {
        "icon": "💍",
        "item": "다이아몬드 닮은 큐빅 보석 & 원자로",
        "itemDesc": "다이아몬드처럼 영롱하게 빛나는 큐빅 인조 보석의 재료이자, 원자력 발전소의 핵연료를 감싸는 피복관!",
        "caption": "사진: 반짝이는 큐빅 보석과 순수 지르코늄 금속 바",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Zirconium_crystal_bar_and_1cm3_cube.jpg/640px-Zirconium_crystal_bar_and_1cm3_cube.jpg"
    },
    41: {
        "icon": "🧲",
        "item": "초전도 자석 코일 & 제트 엔진",
        "itemDesc": "극저온에서 전기 저항이 0이 되는 초전도 성질을 가져 MRI 자석과 자기부상열차, 로켓 엔진에 쓰여요!",
        "caption": "사진: 은빛 광택을 지닌 고순도 나이오븀 덩어리와 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Niobium_crystals_and_1cm3_cube.jpg/640px-Niobium_crystals_and_1cm3_cube.jpg"
    },
    42: {
        "icon": "🛢️",
        "item": "엔진의 마찰을 줄이는 윤활유 & 미사일",
        "itemDesc": "초고온에서도 끄떡없는 내열 합금으로, 자동차 엔진 오일 윤활제와 미사일 외벽에 쓰여요!",
        "caption": "사진: 99.9% 순도의 몰리브데넘 금속 결정 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Molybdenum_crystal_surface_and_1cm3_cube.jpg/640px-Molybdenum_crystal_surface_and_1cm3_cube.jpg"
    },
    43: {
        "icon": "🏥",
        "item": "몸속을 들여다보는 병원 방사선 진단약",
        "itemDesc": "지구상에 거의 없어 인공적으로 만든 최초의 원소로, 매년 수백만 명의 뼈와 심장 질환을 찾아내는 고마운 진단약!",
        "caption": "사진: 방사선을 방출해 질병을 진단하는 인공 원소 테크네튬",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Technetium-sample-cropped.jpg/640px-Technetium-sample-cropped.jpg"
    },
    44: {
        "icon": "✒️",
        "item": "마모되지 않는 만년필 펜촉 & 하드디스크",
        "itemDesc": "평생 글을 써도 닳지 않는 고급 만년필 펜촉 끝부분과, 대용량 컴퓨터 하드디스크 저장막에 쓰여요!",
        "caption": "사진: 눈부신 백금족 귀금속 루테늄 비드와 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Ruthenium_crystal.jpg/640px-Ruthenium_crystal.jpg"
    },
    45: {
        "icon": "🚗",
        "item": "자동차 매연 정화 촉매 & 최고급 귀금속",
        "itemDesc": "금보다 훨씬 비싼 귀금속으로, 자동차 배기가스의 매연을 맑은 공기로 바꿔주는 촉매 변환기의 핵심!",
        "caption": "사진: 아르곤 아크로 용융된 순수 로듐 비드와 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Rhodium_powder_pressed_melted.jpg/640px-Rhodium_powder_pressed_melted.jpg"
    },
    46: {
        "icon": "💍",
        "item": "치과 보철 & 수소를 먹는 스펀지 금속",
        "itemDesc": "치과용 고급 금니와 하얀 화이트골드 반지에 쓰이며, 자기 부피의 900배나 되는 수소 기체를 흡수해요!",
        "caption": "사진: 고순도 팔라듐 금속 결정 덩어리와 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Palladium_crystal.jpg/640px-Palladium_crystal.jpg"
    },
    47: {
        "icon": "🥈",
        "item": "올림픽 은메달 & 선명한 거울",
        "itemDesc": "모든 금속 중에서 빛을 가장 잘 반사하고 전기를 가장 잘 통하게 하여, 매일 보는 거울 뒷면과 은수저에 쓰여요!",
        "caption": "사진: 나뭇가지처럼 아름답게 자란 순수 은 결정",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Silver_crystal.jpg/640px-Silver_crystal.jpg"
    },
    48: {
        "icon": "🎨",
        "item": "화가의 카드뮴 옐로 물감 & 옛 충전지",
        "itemDesc": "반 고흐 등 위대한 화가들이 사랑한 눈부신 노란색 물감의 원료이지만, 몸에 해로워 조심해야 하는 중금속!",
        "caption": "사진: 공기 중에서 승화된 카드뮴 금속 결정 바",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Cadmium-crystal.jpg/640px-Cadmium-crystal.jpg"
    },
    49: {
        "icon": "📱",
        "item": "스마트폰 터치스크린 투명 전극(ITO)",
        "itemDesc": "손가락 터치를 인식하는 스마트폰과 TV 화면의 투명한 전도성 유리막을 만드는 마법의 희소금속!",
        "caption": "사진: 버터처럼 칼로 썰릴 정도로 무른 순수 인듐 금속 바",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Indium_foil.jpg/640px-Indium_foil.jpg"
    },
    50: {
        "icon": "🥫",
        "item": "참치 통조림 캔 & 전자제품 납땜",
        "itemDesc": "철이 녹슬지 않게 통조림 캔 안쪽에 도금되고, 전자회로 기판의 부품들을 이어주는 땜납에 쓰여요!",
        "caption": "사진: 은빛 광택을 내는 고순도 주석 금속 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Sn-Alpha-Beta.jpg/640px-Sn-Alpha-Beta.jpg"
    },
    51: {
        "icon": "👁️",
        "item": "클레오파트라의 눈화장 먹 & 난연제",
        "itemDesc": "고대 이집트 미녀들이 눈을 또렷하게 칠하던 아이라이너 화장품이자, 플라스틱에 불이 붙지 않게 돕는 원소!",
        "caption": "사진: 반짝이는 침상 결정 모양의 순수 안티모니 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Antimony_crystalline.jpg/640px-Antimony_crystalline.jpg"
    },
    52: {
        "icon": "💿",
        "item": "다시 쓰는 DVD/CD 디스크 & 태양전지",
        "itemDesc": "데이터를 지웠다 다시 쓸 수 있는 DVD-RW 광디스크의 기록층과 차세대 고효율 태양전지 패널에 쓰여요!",
        "caption": "사진: 은빛 광택을 지닌 순수 텔루륨 결정 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Tellurium2.jpg/640px-Tellurium2.jpg"
    },
    53: {
        "icon": "🩹",
        "item": "상처에 바르는 빨간약 소독약 & 미역",
        "itemDesc": "넘어져 다쳤을 때 세균을 소독하는 갈색 빨간약의 주인공이자, 바다 미역과 다시마에 듬뿍 든 필수 영양소!",
        "caption": "사진: 보랏빛 증기를 뿜어내는 흑자색 아이오딘 결정",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Iodine-sample.jpg/640px-Iodine-sample.jpg"
    },
    54: {
        "icon": "🚙",
        "item": "고급 자동차 제논 헤드라이트 & 마취제",
        "itemDesc": "밤길을 대낮처럼 환하고 푸른빛으로 비추는 프리미엄 자동차의 HID 전구와 미래 우주선 이온 엔진!",
        "caption": "사진: 푸른색으로 찬란하게 빛나는 제논 기체 방전관",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Xenon_discharge_tube.jpg/640px-Xenon_discharge_tube.jpg"
    },
    55: {
        "icon": "🕰️",
        "item": "세계 1초의 표준 세슘 원자시계",
        "itemDesc": "1초의 길이를 정의하는 지구 표준 원자시계로, 수천만 년 동안 1초도 오차 없는 가장 정확한 시계의 기준!",
        "caption": "사진: 황금빛 액체로 살짝 녹아 있는 앰플 속 순수 세슘",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Cesium.jpg/640px-Cesium.jpg"
    },
    56: {
        "icon": "🩻",
        "item": "병원 위장 검사 조영제 & 녹색 불꽃놀이",
        "itemDesc": "병원에서 위장 엑스레이를 찍을 때 마시는 하얀 가루 물이자, 밤하늘을 초록색으로 물들이는 불꽃놀이 원료!",
        "caption": "사진: 공기 중에서 산화되지 않도록 보관된 순수 바륨 금속",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Barium_unter_Aragon_Schutzgasatmosph%C3%A4re.jpg/640px-Barium_unter_Aragon_Schutzgasatmosph%C3%A4re.jpg"
    },
    57: {
        "icon": "📷",
        "item": "최고급 카메라 렌즈 유리 & 하이브리드카",
        "itemDesc": "사진이 왜곡 없이 선명하게 찍히도록 최고급 카메라 렌즈 유리에 들어가며, 하이브리드 자동차 배터리에 쓰여요!",
        "caption": "사진: 순수 란타넘 금속 조각과 1cm3 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Lanthanum_sublimed_dendritic_bark_and_1cm3_cube.jpg/640px-Lanthanum_sublimed_dendritic_bark_and_1cm3_cube.jpg"
    },
    58: {
        "icon": "🕯️",
        "item": "라이터 돌을 긁으면 튀는 불꽃 & 연마제",
        "itemDesc": "라이터 바퀴를 슥 긁으면 팍 튀는 부싯돌의 주재료이며, 스마트폰 액정 유리를 매끄럽게 닦아내는 연마제!",
        "caption": "사진: 은백색 광택을 지닌 순수 세륨 금속 조각",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Cerium2.jpg/640px-Cerium2.jpg"
    },
    59: {
        "icon": "🥽",
        "item": "용접공의 눈을 지키는 특수 안경 & 노란 유리",
        "itemDesc": "용접할 때 나오는 강렬한 노란빛을 차단해 눈을 보호하는 보안경 유리와 세라믹을 노랗게 물들이는 안료!",
        "caption": "사진: 순수 프라세오디뮴 금속 덩어리와 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Praseodymium_sublimed_dendritic_bark_and_1cm3_cube.jpg/640px-Praseodymium_sublimed_dendritic_bark_and_1cm3_cube.jpg"
    },
    60: {
        "icon": "🧲",
        "item": "세상에서 가장 강력한 네오디뮴 영구자석",
        "itemDesc": "손가락이 끼면 다칠 정도로 힘이 센 초강력 자석의 왕으로, 이어폰의 고음질 스피커와 하드디스크에 필수!",
        "caption": "사진: 은백색의 순수 네오디뮴 희토류 금속 결정 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Neodymium_sublimed_dendritic_bark_and_1cm3_cube.jpg/640px-Neodymium_sublimed_dendritic_bark_and_1cm3_cube.jpg"
    },
    61: {
        "icon": "🌙",
        "item": "어둠 속에서 빛나는 야광 시계 다이얼",
        "itemDesc": "자연에는 거의 없고 원자로에서 생겨나는 방사성 원소로, 밤에도 스스로 빛나는 야광 계기판에 쓰여요!",
        "caption": "사진: 미세한 방사선 붕괴열을 내는 인공 희토류 프로메튬",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Promethium.jpg/640px-Promethium.jpg"
    },
    62: {
        "icon": "🎧",
        "item": "고음질 이어폰 자석 & 스텔스 전투기",
        "itemDesc": "고온에서도 자력을 잃지 않는 강력한 사마륨-코발트 자석으로, 고음질 이어폰과 유도미사일에 쓰여요!",
        "caption": "사진: 순도 99.9%의 순수 사마륨 금속 조각과 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Samarium_sublimed_dendritic_bark_and_1cm3_cube.jpg/640px-Samarium_sublimed_dendritic_bark_and_1cm3_cube.jpg"
    },
    63: {
        "icon": "💶",
        "item": "유로 지폐의 위조 방지 형광 잉크",
        "itemDesc": "자외선 빛을 비추면 빨갛게 빛을 발해 진짜 지폐와 가짜 돈을 구별해 내는 지폐 속 비밀 수호자!",
        "caption": "사진: 순수 유로퓸 금속 조각과 1cm3 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Europium.jpg/640px-Europium.jpg"
    },
    64: {
        "icon": "🧲",
        "item": "MRI 뇌혈관 정밀 촬영 조영제",
        "itemDesc": "병원에서 뇌와 혈관을 MRI로 찍을 때 사진을 아주 또렷하게 만들어 병을 찾아내는 고마운 희토류 원소!",
        "caption": "사진: 공기 중에서 은백색을 띠는 고순도 가돌리늄 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Gadolinium_sublimed_dendritic_bark_and_1cm3_cube.jpg/640px-Gadolinium_sublimed_dendritic_bark_and_1cm3_cube.jpg"
    },
    65: {
        "icon": "📺",
        "item": "스마트폰 화면의 선명한 녹색 형광체",
        "itemDesc": "우리가 보는 컬러 TV와 스마트폰 OLED 화면에서 눈부시게 선명한 초록빛을 뿜어내는 원소예요!",
        "caption": "사진: 승화 정제된 순수 터븀 금속 결정 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Terbium_sublimed_dendritic_bark_and_1cm3_cube.jpg/640px-Terbium_sublimed_dendritic_bark_and_1cm3_cube.jpg"
    },
    66: {
        "icon": "🏎️",
        "item": "전기차 모터를 지키는 내열 영구자석",
        "itemDesc": "전기차가 고속으로 달릴 때 모터가 뜨거워져도 자석의 힘이 약해지지 않도록 지켜주는 핵심 희토류!",
        "caption": "사진: 은빛 광택을 지닌 고순도 디스프로슘 금속 조각",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Dysprosium_sublimed_dendritic_bark_and_1cm3_cube.jpg/640px-Dysprosium_sublimed_dendritic_bark_and_1cm3_cube.jpg"
    },
    67: {
        "icon": "🔬",
        "item": "몸속 결석을 부수는 의료용 레이저",
        "itemDesc": "자석 성질이 모든 원소 중 가장 강하며, 칼을 대지 않고 몸속 결석을 조각내는 정밀 레이저에 쓰여요!",
        "caption": "사진: 순수 홀뮴 금속 조각과 1cm3 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Holmium_sublimed_dendritic_bark_and_1cm3_cube.jpg/640px-Holmium_sublimed_dendritic_bark_and_1cm3_cube.jpg"
    },
    68: {
        "icon": "🌐",
        "item": "전 세계 인터넷을 잇는 해저 광케이블",
        "itemDesc": "바닷속 깊은 광케이블을 지나는 인터넷 신호가 약해지지 않게 레이저 빛을 증폭해 주는 통신의 기둥!",
        "caption": "사진: 분홍빛 산화물을 만드는 은백색 어븀 금속 조각",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Erbium_sublimed_dendritic_bark_and_1cm3_cube.jpg/640px-Erbium_sublimed_dendritic_bark_and_1cm3_cube.jpg"
    },
    69: {
        "icon": "🎒",
        "item": "야외용 휴대용 소형 엑스레이 기기",
        "itemDesc": "희토류 중 가장 드물고 귀한 원소로, 전기가 없는 야외나 군대에서 쓰는 가방 크기 엑스레이에 쓰여요!",
        "caption": "사진: 고순도 툴륨 금속 덩어리와 1cm3 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Thulium_sublimed_dendritic_bark_and_1cm3_cube.jpg/640px-Thulium_sublimed_dendritic_bark_and_1cm3_cube.jpg"
    },
    70: {
        "icon": "⏰",
        "item": "차세대 광격자 초정밀 원자시계 & 합금",
        "itemDesc": "수백억 년 동안 단 1초도 오차가 나지 않는 차세대 양자 원자시계와 스테인리스 강화 합금에 쓰여요!",
        "caption": "사진: 순수 이터븀 금속 조각과 1cm3 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Ytterbium_sublimed_dendritic_bark_and_1cm3_cube.jpg/640px-Ytterbium_sublimed_dendritic_bark_and_1cm3_cube.jpg"
    },
    71: {
        "icon": "🎯",
        "item": "암세포만 콕 집어 파괴하는 표적 방사선약",
        "itemDesc": "란타넘족 희토류의 마지막 원소로, 정상 세포는 건드리지 않고 암세포만 골라 공격하는 최신 치료제!",
        "caption": "사진: 99.9% 순수 루테튬 금속 결정 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Lutetium_sublimed_dendritic_bark_and_1cm3_cube.jpg/640px-Lutetium_sublimed_dendritic_bark_and_1cm3_cube.jpg"
    },
    72: {
        "icon": "🚀",
        "item": "우주선 로켓 엔진 노즐 & 차세대 반도체",
        "itemDesc": "섭씨 3000도에서도 녹지 않아 불을 뿜는 로켓 엔진의 노즐과 인텔 최신 초미세 반도체 게이트 절연막에 쓰여요!",
        "caption": "사진: 아르곤 보호가스 속의 하프늄 금속 결정 바",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Hafnium_crystal_bar_and_1cm3_cube.jpg/640px-Hafnium_crystal_bar_and_1cm3_cube.jpg"
    },
    73: {
        "icon": "📱",
        "item": "스마트폰 메인보드의 탄탈 커패시터",
        "itemDesc": "부식을 전혀 타지 않고 전기를 안정적으로 모아주어, 스마트폰 속 쌀알 크기의 초소형 전자부품에 쓰여요!",
        "caption": "사진: 99.99% 고순도 탄탈럼 금속 조각과 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Tantalum_single_crystal_and_1cm3_cube.jpg/640px-Tantalum_single_crystal_and_1cm3_cube.jpg"
    },
    74: {
        "icon": "💡",
        "item": "가장 높은 녹는점(3422℃) 전구 필라멘트",
        "itemDesc": "모든 금속 중 녹는점이 가장 높아 태양 표면 근처에서도 버티며, 백열전구 필라멘트와 용접 전극의 주인공!",
        "caption": "사진: 섭씨 3422도까지 버티는 단단한 순수 텅스텐 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Tungsten_crystal_cube.jpg/640px-Tungsten_crystal_cube.jpg"
    },
    75: {
        "icon": "✈️",
        "item": "초음속 제트기 터빈 날개 & 로켓 배기구",
        "itemDesc": "백금보다 희귀하며 엄청난 고온을 견뎌 여객기와 제트 전투기가 하늘을 날 수 있게 해주는 터빈 날개!",
        "caption": "사진: 순수 레늄 금속 결정 덩어리와 1cm3 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Rhenium_single_crystal_bar_and_1cm3_cube.jpg/640px-Rhenium_single_crystal_bar_and_1cm3_cube.jpg"
    },
    76: {
        "icon": "⚖️",
        "item": "세상에서 가장 무거운 밀도왕 금속",
        "itemDesc": "손바닥만 한 크기인데도 수박보다 무거운 세상 최고 밀도의 금속으로, 고급 만년필 촉과 나침반 축에 쓰여요!",
        "caption": "사진: 푸르스름한 은빛을 띠는 세상에서 가장 무거운 오스뮴 결정",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Osmium_crystals.jpg/640px-Osmium_crystals.jpg"
    },
    77: {
        "icon": "🦕",
        "item": "공룡을 멸종시킨 거대 운석의 흔적",
        "itemDesc": "6600만 년 전 공룡이 사라진 지층에서 대량으로 발견된 운석의 원소이자, 점화 플러그와 도가니에 쓰여요!",
        "caption": "사진: 단단하고 부식이 안 되는 순수 이리듐 펠릿과 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Iridium-2.jpg/640px-Iridium-2.jpg"
    },
    78: {
        "icon": "💍",
        "item": "변치 않는 플래티넘 백금 반지 & 촉매",
        "itemDesc": "산소나 산에도 절대 녹슬거나 변색되지 않는 고귀한 귀금속이자, 화학 반응을 돕는 최고의 만능 촉매!",
        "caption": "사진: 순백의 찬란한 플래티넘(백금) 결정 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Platinum_crystals.jpg/640px-Platinum_crystals.jpg"
    },
    79: {
        "icon": "🪙",
        "item": "눈부신 황금 보물 & 우주복 헬멧 차광막",
        "itemDesc": "수천 년이 지나도 변치 않는 황금빛 보석이자, 우주비행사의 눈을 태양열로부터 지켜주는 금 코팅막!",
        "caption": "사진: 자연 속에서 채취한 찬란한 순금 너깃 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Gold-crystals.jpg/640px-Gold-crystals.jpg"
    },
    80: {
        "icon": "🌡️",
        "item": "은빛으로 찰랑이는 액체 수은 온도계",
        "itemDesc": "금속인데도 방 안 온도에서 유일하게 물처럼 찰랑찰랑 흐르는 신기한 액체로, 고전적인 온도계에 쓰였어요!",
        "caption": "사진: 은빛 액체 방울로 찰랑거리는 신비로운 액체 수은",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Pouring_liquid_mercury_bionerd.jpg/640px-Pouring_liquid_mercury_bionerd.jpg"
    },
    81: {
        "icon": "🧪",
        "item": "추리 소설에 나오는 무색무취 독약 & 적외선 렌즈",
        "itemDesc": "과거 아가사 크리스티 탐정 소설에 단골로 등장하던 독약이지만, 오늘날엔 심장 진단약과 특수 광학 렌즈에 쓰여요!",
        "caption": "사진: 아르곤 유리관 속에 밀봉된 순수 탈륨 금속",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Thallium_sublimed_and_1cm3_cube.jpg/640px-Thallium_sublimed_and_1cm3_cube.jpg"
    },
    82: {
        "icon": "🛡️",
        "item": "병원 엑스레이실 방사선 차단 납 앞치마",
        "itemDesc": "치과나 병원에서 엑스레이를 찍을 때 방사선이 몸에 닿지 않도록 막아주는 묵직한 납 보호복과 자동차 배터리!",
        "caption": "사진: 묵직한 고순도 전해 납 금속 조각과 1cm3 큐브",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Lead_electrolytic_and_1cm3_cube.jpg/640px-Lead_electrolytic_and_1cm3_cube.jpg"
    },
    83: {
        "icon": "🌈",
        "item": "무지갯빛 계단 모양 결정 & 위장약",
        "itemDesc": "굳을 때 빛의 간섭으로 신비로운 무지갯빛 계단 결정을 만들며, 배가 아플 때 먹는 핑크빛 위장약에 들어있어요!",
        "caption": "사진: 환상적인 무지갯빛 산화막을 띤 비스무트 인공 결정",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Bi-crystal.jpg/640px-Bi-crystal.jpg"
    },
    84: {
        "icon": "☢️",
        "item": "퀴리 부인의 조국 폴란드 이름의 방사능 원소",
        "itemDesc": "마리 퀴리가 조국 폴란드를 기려 이름 붙인 강력한 방사능 원소로, 정전기를 없애는 브러시에 쓰였어요!",
        "caption": "사진: 스스로 붉은 열과 빛을 뿜어내는 강력한 방사능 원소 폴로늄",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Polonium.jpg/640px-Polonium.jpg"
    },
    85: {
        "icon": "⏳",
        "item": "지구 전체에 30g도 안 남아 있는 초희귀 원소",
        "itemDesc": "지구 지각 전체를 다 뒤져도 숟가락 하나 분량(약 30g)밖에 없는 세상에서 가장 희귀한 자연 원소!",
        "caption": "사진: 붕괴 속도가 너무 빨라 극미량만 연구되는 아스타틴",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Astatine.jpg/640px-Astatine.jpg"
    },
    86: {
        "icon": "💨",
        "item": "지하 암석에서 스며 나오는 방사성 기체",
        "itemDesc": "색깔도 냄새도 없지만 오래된 지하나 환기 안 되는 건물에 스며 나와 환기가 꼭 필요한 자연 방사성 기체!",
        "caption": "사진: 극저온에서 노랗게 빛을 내며 액화된 라돈 앰플",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Radon_glow.jpg/640px-Radon_glow.jpg"
    },
    87: {
        "icon": "⚡",
        "item": "물에 닿는 순간 엄청난 폭발을 일으키는 원소",
        "itemDesc": "지구상에 단 20~30g만 존재하며, 알칼리 금속 중 가장 격렬하게 폭발하는 가장 불안정한 자연 원소!",
        "caption": "사진: 연구실의 극미량 원자 빔 트랩으로 관찰되는 프랑슘",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Francium.jpg/640px-Francium.jpg"
    },
    88: {
        "icon": "🌟",
        "item": "어둠 속에서 푸른빛으로 빛나는 라듐",
        "itemDesc": "마리 퀴리가 피치블렌드 광석 수 톤을 끓여 찾아낸 원소로, 밤에 빛나는 야광 시계 다이얼에 쓰였어요!",
        "caption": "사진: 어둠 속에서 스스로 영롱한 푸른빛을 발하는 라듐 화합물",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Radium_glow.jpg/640px-Radium_glow.jpg"
    },
    89: {
        "icon": "🔦",
        "item": "어둠 속에서 푸른빛을 내는 암 치료 방사선원",
        "itemDesc": "그리스어로 '빛살(Actis)'이라는 뜻을 가졌으며, 차세대 표적 암 치료 알파선 방출체로 활발히 연구돼요!",
        "caption": "사진: 푸른색 방사능 빛을 내는 악티늄 화합물",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Actinium.jpg/640px-Actinium.jpg"
    },
    90: {
        "icon": "⚛️",
        "item": "우라늄보다 안전한 미래 청정 토륨 원자로",
        "itemDesc": "천둥의 신 '토르(Thor)'의 이름을 딴 원소로, 우라늄보다 매장량이 풍부하고 안전한 차세대 원자력 발전의 연료!",
        "caption": "사진: 고온에서 정제된 고순도 토륨 금속 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Thorium.jpg/640px-Thorium.jpg"
    },
    91: {
        "icon": "🔬",
        "item": "우라늄 붕괴 과정에서 탄생하는 악티늄의 어머니",
        "itemDesc": "극도로 희귀하고 방사능이 강해 연구실에서만 정밀하게 다루어지는 해양 퇴적물 연대 측정의 열쇠!",
        "caption": "사진: 원자로 연료 붕괴 사슬에서 생성된 순수 프로트악티늄",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Protactinium.jpg/640px-Protactinium.jpg"
    },
    92: {
        "icon": "⚡",
        "item": "원자력 발전소의 거대한 전기 에너지원",
        "itemDesc": "원자핵이 둘로 쪼개질 때 엄청난 에너지를 뿜어내어 수백만 가구에 전기를 공급하는 원자력 발전소의 연료!",
        "caption": "사진: 우라늄 산화물 펠릿과 자연산 우라늄 광석",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Uranium2.jpg/640px-Uranium2.jpg"
    },
    93: {
        "icon": "🪐",
        "item": "해왕성(Neptune)의 이름을 딴 최초 인공 원소",
        "itemDesc": "우라늄 너머에서 인류가 입자 가속기로 처음으로 인공 합성해 낸 신비로운 초우라늄 원소!",
        "caption": "사진: 은빛 광택을 내는 고밀도 넵투늄 금속 구슬",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Neptunium.jpg/640px-Neptunium.jpg"
    },
    94: {
        "icon": "🚀",
        "item": "심우주 보이저 탐사선의 원자력 전지(RTG)",
        "itemDesc": "태양빛이 닿지 않는 머나먼 우주를 날아가는 보이저호와 화성 탐사선에 50년 넘게 전기를 공급하는 원자력 전지!",
        "caption": "사진: 스스로 내뿜는 붕괴열로 붉게 달아오른 플루오토늄-238 펠릿",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Plutonium_pellet.jpg/640px-Plutonium_pellet.jpg"
    },
    95: {
        "icon": "🚨",
        "item": "우리 집 천장의 연기를 감지하는 화재경보기",
        "itemDesc": "아파트와 집 천장에 달려 있는 화재 감지기 속에 들어 있어 연기가 들어오면 삐- 소리를 내어 목숨을 지켜줘요!",
        "caption": "사진: 화재감지기 센서 속에 내장된 극미량의 아메리슘 버튼",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Americium_microscope.jpg/640px-Americium_microscope.jpg"
    },
    96: {
        "icon": "🪐",
        "item": "화성 탐사 로버의 성분 분석기 & 인공 심장",
        "itemDesc": "퀴리 부부의 이름을 기린 원소로, 화성에 착륙한 탐사 로봇이 외계 암석의 성분을 스캔할 때 쓰여요!",
        "caption": "사진: 어둠 속에서 스스로 보랏빛 빛을 내는 퀴륨-244 수용액",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Curium_glow.jpg/640px-Curium_glow.jpg"
    },
    97: {
        "icon": "🎓",
        "item": "캘리포니아 버클리 대학의 이름을 딴 연구용 원소",
        "itemDesc": "원자 번호 97번으로, 새로운 초중원소를 합성하기 위한 소중한 표적 원자핵으로 연구실에서 쓰여요!",
        "caption": "사진: UC버클리 연구팀이 정밀 정제한 순수 버클륨 결정",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Berkelium.jpg/640px-Berkelium.jpg"
    },
    98: {
        "icon": "✈️",
        "item": "공항 수하물 위험물 검사 & 지하 유전 탐사",
        "itemDesc": "1그램에 수백억 원에 달하는 초고가 원소로, 강력한 중성자를 내뿜어 비행기 화물 속 폭발물을 찾아내요!",
        "caption": "사진: 미세한 캡슐에 밀봉된 고방사능 캘리포늄 원소",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Californium.jpg/640px-Californium.jpg"
    },
    99: {
        "icon": "🧠",
        "item": "천재 물리학자 아인슈타인에게 바친 원소",
        "itemDesc": "상대성 이론을 발표해 인류의 우주관을 바꾼 알베르트 아인슈타인을 기려 수소폭탄 잔해 속에서 발견된 원소!",
        "caption": "사진: 현미경 아래에서 스스로 붕괴열을 내는 순수 아인슈타이늄",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Einsteinium.jpg/640px-Einsteinium.jpg"
    },
    100: {
        "icon": "⚛️",
        "item": "원자로를 발명한 엔리코 페르미 박사의 헌정 원소",
        "itemDesc": "원자 번호 딱 100번을 장식하는 원소로, 최초의 인공 원자로를 만든 물리학의 거장 페르미를 기려요!",
        "caption": "사진: 원자번호 100번을 기념하는 페르뮴 원소 연구 심볼",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Fermium.jpg/640px-Fermium.jpg"
    },
    101: {
        "icon": "📜",
        "item": "주기율표를 발명한 화학의 아버지 멘델레예프",
        "itemDesc": "원소들을 성질에 따라 한눈에 표로 정리해 낸 천재 화학자 멘델레예프의 이름이 영원히 새겨진 원소!",
        "caption": "사진: 주기율표를 만든 드미트리 멘델레예프를 기념하는 원소",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mendelevium.jpg/640px-Mendelevium.jpg"
    },
    102: {
        "icon": "🏅",
        "item": "세계 최고의 과학상 노벨상을 만든 알프레드 노벨",
        "itemDesc": "다이너마이트를 발명하고 인류 평화와 과학에 공헌한 이들에게 주는 노벨상의 설립자를 기려요!",
        "caption": "사진: 거대 입자 가속기 충돌로 합성된 노벨륨 원소",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Nobelium.jpg/640px-Nobelium.jpg"
    },
    103: {
        "icon": "🌀",
        "item": "입자 가속기를 발명한 어니스트 로렌스 박사",
        "itemDesc": "원자들을 광속으로 부딪치게 하는 사이클로트론 가속기를 만든 로렌스를 기리는 악티늄족의 마지막 원소!",
        "caption": "사진: 악티늄족의 103번째 원소 로렌슘 합성 연구",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Lawrencium.jpg/640px-Lawrencium.jpg"
    },
    104: {
        "icon": "🎯",
        "item": "원자핵의 존재를 밝힌 핵물리학의 아버지 러더퍼드",
        "itemDesc": "원자 중심에 양전하를 띤 단단한 핵이 있음을 밝혀낸 위대한 물리학자 러더퍼드에게 헌정되었어요!",
        "caption": "사진: 중원소 연구소 입자 충돌로 합성된 러더퍼듐",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Rutherfordium.jpg/640px-Rutherfordium.jpg"
    },
    105: {
        "icon": "🇷🇺",
        "item": "러시아 핵물리학 연구 도시 두브나(Dubna)",
        "itemDesc": "수많은 새로운 인공 원소를 탄생시킨 러시아의 유명한 핵 연구소 도시 두브나의 이름을 땄어요!",
        "caption": "사진: 러시아 두브나 핵물리 연구소의 상징 원소 더브늄",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Dubnium.jpg/640px-Dubnium.jpg"
    },
    106: {
        "icon": "🔬",
        "item": "초우라늄 원소를 대거 발견한 글렌 시보그 박사",
        "itemDesc": "살아있는 과학자의 이름이 붙은 최초의 원소로, 플루토늄 등 10가지 원소를 찾아낸 화학의 거장!",
        "caption": "사진: 글렌 시보그 박사가 자신의 원소 주기율표를 가리키는 모습",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Glenn_Seaborg_s_element.jpg/640px-Glenn_Seaborg_s_element.jpg"
    },
    107: {
        "icon": "🌀",
        "item": "현대 양자 원자 모형을 세운 닐스 보어 박사",
        "itemDesc": "전자가 핵 주위의 정해진 궤도를 돈다는 보어 원자 모형을 만든 양자역학의 아버지 보어의 이름!",
        "caption": "사진: 덴마크의 천재 물리학자 닐스 보어를 기리는 원소 보륨",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Bohrium.jpg/640px-Bohrium.jpg"
    },
    108: {
        "icon": "🇩🇪",
        "item": "독일 헤센(Hesse) 주의 라틴어 이름 하시아",
        "itemDesc": "독일 중이온 연구소(GSI)가 위치한 유서 깊은 독일 헤센 주의 라틴어 지명에서 이름을 지었어요!",
        "caption": "사진: 독일 다름슈타트 중이온 가속기에서 합성된 하슘",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Hassium.jpg/640px-Hassium.jpg"
    },
    109: {
        "icon": "👩‍🔬",
        "item": "핵분열의 비밀을 최초로 밝힌 리제 마이트너",
        "itemDesc": "원자핵이 둘로 쪼개질 수 있음을 최초로 이론적으로 규명한 비운의 천재 여성 물리학자를 기리는 원소!",
        "caption": "사진: 핵분열 발견자 리제 마이트너에게 헌정된 마이트너륨",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Meitnerium.jpg/640px-Meitnerium.jpg"
    },
    110: {
        "icon": "🏙️",
        "item": "신원소 합성의 심장 독일 다름슈타트 도시",
        "itemDesc": "원소 107번부터 112번까지 차례대로 합성해 낸 세계 최고의 중이온 연구소가 있는 독일의 도시!",
        "caption": "사진: 독일 중이온 연구소의 첨단 분리 장치와 다름스타튬",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Darmstadtium.jpg/640px-Darmstadtium.jpg"
    },
    111: {
        "icon": "🩻",
        "item": "몸속 뼈를 비추는 엑스레이(X-ray) 발견자 뢴트겐",
        "itemDesc": "눈에 보이지 않는 신비로운 투과선 엑스선을 발견해 인류를 질병의 공포에서 구한 뢴트겐 박사의 이름!",
        "caption": "사진: 최초의 노벨 물리학상 수상자 빌헬름 뢴트겐의 헌정 원소",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Roentgenium.jpg/640px-Roentgenium.jpg"
    },
    112: {
        "icon": "☀️",
        "item": "지동설로 우주의 중심을 바꾼 코페르니쿠스",
        "itemDesc": "지구가 태양 주위를 돈다는 지동설을 주장해 중세 암흑기를 깨뜨린 천문학자 코페르니쿠스를 기려요!",
        "caption": "사진: 폴란드의 위대한 천문학자 코페르니쿠스 원소 코페르니슘",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Copernicium.jpg/640px-Copernicium.jpg"
    },
    113: {
        "icon": "🗾",
        "item": "아시아 최초로 일본(Nihon) 연구팀이 합성한 원소",
        "itemDesc": "일본 이화학연구소(RIKEN) 연구팀이 아연 이온과 비스무트를 9년 동안 400조 번 충돌시켜 마침내 성공!",
        "caption": "사진: 일본 이화학연구소 선형 가속기에서 탄생한 니호늄",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Nihonium.jpg/640px-Nihonium.jpg"
    },
    114: {
        "icon": "⚛️",
        "item": "러시아 플레로프 핵반응 연구소의 헌정 원소",
        "itemDesc": "러시아 핵물리학의 거장 게오르기 플레로프 박사와 그의 연구소 이름을 딴 초중원소!",
        "caption": "사진: 주기율표 14족 탄소 바로 아래에 위치한 플레로븀",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Flerovium.jpg/640px-Flerovium.jpg"
    },
    115: {
        "icon": "🏰",
        "item": "러시아의 유서 깊은 수도 모스크바(Moscow) 주",
        "itemDesc": "초중원소 연구에 아낌없는 지원을 쏟아부은 러시아 모스크바 지역의 이름을 따서 지었어요!",
        "caption": "사진: 입자 가속기 검출기에서 신호로 포착된 모스코븀",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Moscovium.jpg/640px-Moscovium.jpg"
    },
    116: {
        "icon": "🇺🇸",
        "item": "미국 로렌스 리버모어 국립 연구소",
        "itemDesc": "캘리포니아 리버모어 시에 위치하며 신원소 공동 연구를 주도한 미국의 세계적인 국립 연구소!",
        "caption": "사진: 미국 리버모어 연구소의 가속기 충돌 타깃과 리버모륨",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Livermorium.jpg/640px-Livermorium.jpg"
    },
    117: {
        "icon": "🇺🇸",
        "item": "미국 원자력의 심장 테네시(Tennessee) 주",
        "itemDesc": "합성에 꼭 필요한 희귀 원소 버클륨을 직접 만들어 연구팀에 공급해 준 오크리지 국립 연구소의 고향!",
        "caption": "사진: 할로겐 원소의 마지막 117번째 자리 테네신",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Tennessine.jpg/640px-Tennessine.jpg"
    },
    118: {
        "icon": "👑",
        "item": "현재 인류가 발견한 마지막 원소 & 오가네시안 박사",
        "itemDesc": "주기율표의 마지막 118번째 칸을 완성한 현존하는 최고의 초중원소 연구 거장 유리 오가네시안 박사의 이름!",
        "caption": "사진: 118번 원소 오가네손과 연구자 유리 오가네시안 박사",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Oganesson.jpg/640px-Oganesson.jpg"
    },
    119: {
        "icon": "🚀",
        "item": "인류가 다음으로 찾고 있는 8주기 첫 번째 원소",
        "itemDesc": "전 세계 물리학자들이 8주기 주기율표의 문을 열기 위해 가속기를 밤낮없이 돌리며 찾고 있는 미래 원소!",
        "caption": "그래픽: 8주기 1족 가상 원소 우눈엔늄의 입자 빔 충돌 시뮬레이션",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Ununennium_concept.jpg/640px-Ununennium_concept.jpg"
    },
    120: {
        "icon": "🪐",
        "item": "8주기 두 번째 알칼리 토금속 후보",
        "itemDesc": "티타늄 빔을 캘리포늄 표적에 쏘아 합성하려는 8주기 2족의 두 번째 미래 예측 원소!",
        "caption": "그래픽: 미래 주기율표를 확장할 우눈비늄 원자핵 모형",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Unbinilium_concept.jpg/640px-Unbinilium_concept.jpg"
    },
    121: {
        "icon": "🛸",
        "item": "g-오비탈 전자를 가질 초특이 가상 원소",
        "itemDesc": "이론물리학에서 최초로 새로운 g-궤도에 전자가 채워지기 시작할 것으로 예측되는 미지의 원소!",
        "caption": "그래픽: 복잡한 양자 궤도를 지닌 우눈트륨 예측 그래픽",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Superheavy_element.jpg/640px-Superheavy_element.jpg"
    },
    126: {
        "icon": "🏝️",
        "item": "마법수 원자핵을 지닌 '안정성의 섬' 원소",
        "itemDesc": "양성자 126개, 중성자 184개의 마법수를 채워 수명이 매우 길 것으로 기대되는 전설의 원소!",
        "caption": "그래픽: 붕괴하지 않고 오래 살아남는 안정성의 섬(Island of Stability)",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Island_of_Stability.svg/640px-Island_of_Stability.svg.png"
    },
    168: {
        "icon": "🌌",
        "item": "머나먼 미래 우주급 초대형 가상 원소",
        "itemDesc": "양자역학의 한계에 도전하는 미래 가상 연구소의 최상위 슈퍼헤비 원소!",
        "caption": "그래픽: 극도의 전자기력을 견뎌내는 거대 가상 원자핵",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Future_atom.jpg/640px-Future_atom.jpg"
    }
}

def update_elements_file():
    with open('js/elements-data.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # json 부분 추출
    start = content.find('{')
    end = content.rfind('}') + 1
    data = json.loads(content[start:end])

    # standardElements 업데이트
    for el in data['standardElements']:
        num = el['num']
        if num in ELEMENT_ILLUSTRATIONS:
            el['illustration'] = ELEMENT_ILLUSTRATIONS[num]
        else:
            # 기본값
            el['illustration'] = {
                "icon": "🔬",
                "item": f"{el['nameKo']} 화합물 & 연구",
                "itemDesc": el['summary'],
                "caption": f"사진/삽화: {el['nameKo']} 원소 표본",
                "imgUrl": ""
            }

    # futureElements 업데이트
    for el in data['futureElements']:
        num = el['num']
        if num in ELEMENT_ILLUSTRATIONS:
            el['illustration'] = ELEMENT_ILLUSTRATIONS[num]
        else:
            el['illustration'] = {
                "icon": "🚀",
                "item": f"8주기 {el['nameKo']}",
                "itemDesc": el['summary'],
                "caption": f"그래픽: {el['nameKo']} 가상 원자핵",
                "imgUrl": ""
            }

    # 다시 js 파일로 저장
    new_json_str = json.dumps(data, ensure_ascii=False, indent=2)
    new_content = f"// 118개 원소 + 8주기 미래 원소 데이터베이스 (책 스타일 일러스트, 희귀도, 기호비밀, 불꽃반응, 위험도 포함)\nwindow.PERIODIC_DATA = {new_json_str};\n"

    with open('js/elements-data.js', 'w', encoding='utf-8') as f:
        f.write(new_content)

    print("Successfully updated elements-data.js with book illustrations!")

if __name__ == '__main__':
    update_elements_file()
