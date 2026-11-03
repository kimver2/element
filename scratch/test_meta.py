# -*- coding: utf-8 -*-
"""
118개 원소 + 미래 원소에 《나의 첫 주기율표 공부》 책 스타일의
'illustration' (대표 사물 그림, 아이콘, 캡션, 실물 사진 URL) 메타데이터를 일괄 주입하는 스크립트
"""

import json

BOOK_ILLUSTRATIONS = {
    1: {
        "icon": "🚀",
        "item": "로켓 추진 연료 & 물(H₂O)",
        "itemDesc": "우주를 향해 솟구치는 거대한 로켓의 강력한 액체 연료이자, 우리 몸의 70%를 차지하는 생명의 물이에요!",
        "caption": "사진/삽화: 밤하늘로 솟구치는 우주 로켓과 수소 방전관의 보랏빛 빛",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Hydrogenglow.jpg/640px-Hydrogenglow.jpg"
    },
    2: {
        "icon": "🎈",
        "item": "둥둥 뜨는 파티 풍선 & MRI",
        "itemDesc": "공기보다 가벼워 하늘로 떠오르는 알록달록 풍선과, 병원에서 몸속을 정밀 검사하는 MRI의 초저온 냉각재예요!",
        "caption": "사진/삽화: 하늘 높이 날아가는 파티 풍선과 헬륨 기체의 주황빛 방전광",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Helium_discharge_tube.jpg/640px-Helium_discharge_tube.jpg"
    },
    3: {
        "icon": "🔋",
        "item": "스마트폰 & 전기차 배터리",
        "itemDesc": "우리가 매일 손에서 놓지 못하는 스마트폰과 미래 전기차를 쌩쌩 달리게 해주는 충전식 2차전지의 핵심 심장!",
        "caption": "사진/삽화: 석유 속에 보관된 순수 리튬 금속 덩어리와 스마트폰 배터리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Lithium_paraffin.jpg/640px-Lithium_paraffin.jpg"
    },
    4: {
        "icon": "💍",
        "item": "신비로운 에메랄드 보석 & 우주 망원경",
        "itemDesc": "영롱한 초록빛을 뽐내는 귀한 보석 에메랄드의 주성분이며, 제임스 웹 우주망원경의 금빛 거울을 만든 튼튼한 금속이에요!",
        "caption": "사진/삽화: 영롱한 초록 보석 에메랄드 원석과 베릴륨 금속 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Beryllium_%28Be%29.jpg/640px-Beryllium_%28Be%29.jpg"
    },
    5: {
        "icon": "🧪",
        "item": "열에 강한 파이렉스 냄비 & 테니스 라켓",
        "itemDesc": "뜨거운 불 위에서도 절대 깨지지 않는 내열 유리 주방용품과, 탄력 넘치는 고급 테니스 라켓에 쓰여요!",
        "caption": "사진/삽화: 반도체와 내열 유리에 쓰이는 흑갈색 순수 붕소 결정",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Boron_pieces.jpg/640px-Boron_pieces.jpg"
    },
    6: {
        "icon": "💎",
        "item": "영롱한 다이아몬드 & 부드러운 연필심",
        "itemDesc": "같은 탄소인데 배열에 따라 세상에서 가장 단단하고 빛나는 다이아몬드가 되기도 하고, 종이 위에 부드럽게 써지는 연필심(흑연)이 돼요!",
        "caption": "사진/삽화: 눈부시게 빛나는 다이아몬드 결정과 흑연(연필심)",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Diamond_and_graphite.jpg/640px-Diamond_and_graphite.jpg"
    },
    7: {
        "icon": "🥔",
        "item": "바삭한 과자 봉지 & 식물 비료",
        "itemDesc": "우리가 좋아하는 감자칩 과자가 눅눅해지지 않게 빵빵하게 채워주는 보호 기체이자, 식물이 쑥쑥 자라게 돕는 영양 비료예요!",
        "caption": "사진/삽화: 질소 충전 과자 봉지와 액체 질소의 자줏빛 기체 방전광",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Nitrogen_discharge_tube.jpg/640px-Nitrogen_discharge_tube.jpg"
    },
    8: {
        "icon": "🤿",
        "item": "잠수부 산소통 & 지구의 숨결",
        "itemDesc": "지구상의 모든 동물과 우리가 1초도 멈추지 않고 들이마시는 생명의 숨결이자, 깊은 바닷속 잠수부의 생명줄이에요!",
        "caption": "사진/삽화: 극저온에서 연한 하늘빛을 띠는 액체 산소와 호흡 마스크",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Liquid_Oxygen_in_a_beaker_%28transparent_background%29.png/640px-Liquid_Oxygen_in_a_beaker_%28transparent_background%29.png"
    },
    9: {
        "icon": "🪥",
        "item": "충치 예방 불소 치약 & 테플론 코팅",
        "itemDesc": "매일 치아를 튼튼하게 지켜주는 치약 속의 불소이자, 음식이 프라이팬에 눌어붙지 않게 해주는 코팅 재료예요!",
        "caption": "사진/삽화: 반응성이 극도로 강력해 특수 용기에 담긴 플루오린 액체",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Fluorine_liquid_in_gal_cryostat.png/640px-Fluorine_liquid_in_gal_cryostat.png"
    },
    10: {
        "icon": "🏮",
        "item": "화려한 밤거리의 네온사인 간판",
        "itemDesc": "유리관에 전기를 흘려주면 눈이 부실 정도로 찬란한 붉은 주황빛을 뿜어내며 도시의 밤거리를 아름답게 물들여요!",
        "caption": "사진/삽화: 어두운 밤을 화려하게 비추는 붉은 주황색 네온 방전관",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Neon_discharge_tube.jpg/640px-Neon_discharge_tube.jpg"
    },
    11: {
        "icon": "🧂",
        "item": "맛있는 식탁 소금 & 노란 터널등",
        "itemDesc": "음식에 절대 빠질 수 없는 짭짤한 소금(염화나트륨)의 주인공이자, 안개 낀 터널을 따뜻하게 밝히는 노란 가로등이에요!",
        "caption": "사진/삽화: 하얀 식탁 소금 결정과 칼로 잘라낸 은백색 나트륨 금속",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Na_%28Sodium%29.jpg/640px-Na_%28Sodium%29.jpg"
    },
    12: {
        "icon": "🎆",
        "item": "눈부신 백색 불꽃놀이 & 경량 자전거",
        "itemDesc": "불을 붙이면 눈이 멀 정도로 하얗고 찬란한 빛을 내어 야간 축제의 불꽃놀이에 쓰이고, 가볍고 튼튼한 자전거 프레임이 돼요!",
        "caption": "사진/삽화: 하얀 광택의 순수 마그네슘 결정 덩어리와 섬광 불꽃",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Magnesium_crystals.jpg/640px-Magnesium_crystals.jpg"
    },
    13: {
        "icon": "🥫",
        "item": "시원한 음료수 캔 & 거대한 비행기",
        "itemDesc": "우리가 마시는 시원한 탄산음료 캔, 은박 호일부터 하늘을 나는 거대한 여객기의 날개까지 가볍고 튼튼한 곳엔 어디든 있어요!",
        "caption": "사진/삽화: 가볍고 은은한 광택을 지닌 고순도 알루미늄 바와 음료 캔",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Aluminium-4.jpg/640px-Aluminium-4.jpg"
    },
    14: {
        "icon": "💻",
        "item": "스마트폰 두뇌 반도체 CPU & 해변 모래",
        "itemDesc": "해변의 반짝이는 모래와 유리의 주성분이자, 현대 디지털 문명을 만든 컴퓨터와 인공지능 반도체 칩의 마법 재료예요!",
        "caption": "사진/삽화: 반도체 웨이퍼를 만드는 거대한 실리콘(규소) 단결정 잉곳",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/SiliconCrook.jpg/640px-SiliconCrook.jpg"
    },
    15: {
        "icon": "🔥",
        "item": "슥 긁으면 불붙는 성냥 머리 & DNA",
        "itemDesc": "성냥갑 옆면을 긁어 불을 켤 때 쓰이는 붉은 인이자, 우리 몸의 모든 유전 정보를 담은 DNA 나선의 튼튼한 뼈대예요!",
        "caption": "사진/삽화: 성냥 머리에 쓰이는 선명한 붉은색 적린(인) 가루",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Phosphor_rot.jpg/640px-Phosphor_rot.jpg"
    },
    16: {
        "icon": "🌋",
        "item": "화산 온천의 노란 유황 & 자동차 타이어",
        "itemDesc": "화산 분화구 주변에서 노랗게 굳어 특유의 냄새를 풍기며, 자동차 타이어 고무를 팽팽하고 질기게 만들어주는 필수 원소예요!",
        "caption": "사진/삽화: 화산 지대에서 채취한 샛노란 순수 유황(황) 결정 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Sulfur-sample.jpg/640px-Sulfur-sample.jpg"
    },
    17: {
        "icon": "🏊",
        "item": "깨끗한 수영장 소독제 & 락스 표백제",
        "itemDesc": "수영장 물속의 유해한 세균을 없애 깨끗하게 유지해 주고, 옷의 얼룩을 지우는 표백제와 수돗물 정화에 쓰여요!",
        "caption": "사진/삽화: 앰플에 밀봉된 황록색 염소 기체와 깨끗한 수영장 물",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Chlorine_liquid_in_ampoule.jpg/640px-Chlorine_liquid_in_ampoule.jpg"
    },
    18: {
        "icon": "💡",
        "item": "백열전구 보호 기체 & 박물관 보존",
        "itemDesc": "전구 안의 뜨거운 필라멘트가 타서 끊어지지 않도록 보호해 주고, 역사적인 국보급 고문서가 낡지 않게 보관함에 채워 넣어요!",
        "caption": "사진/삽화: 아르곤 가스가 채워진 방전관의 은은하고 신비로운 하늘빛",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Argon_discharge_tube.jpg/640px-Argon_discharge_tube.jpg"
    },
    19: {
        "icon": "🍌",
        "item": "달콤한 바나나 & 식물 영양 비료",
        "itemDesc": "바나나와 감자에 듬뿍 들어 있어 우리 근육의 경련을 막아주고, 농작물이 열매를 맺도록 돕는 비료의 3대 영양소 중 하나예요!",
        "caption": "사진/삽화: 공기 중에서 산화되지 않도록 밀봉된 칼륨(포타슘) 금속 조각",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Potassium.jpg/640px-Potassium.jpg"
    },
    20: {
        "icon": "🦴",
        "item": "튼튼한 뼈와 치아 & 학교 분필",
        "itemDesc": "우리가 키가 쑥쑥 크고 뼈와 이가 단단해지도록 우유에 듬뿍 들어 있으며, 선생님이 칠판에 글씨를 쓰는 분필과 조개껍데기의 주성분!",
        "caption": "사진/삽화: 아르곤 가스 속에 보관된 하얀 칼슘 금속 결정과 조개껍데기",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Calcium_unter_Argon_Schutzgasatmosph%C3%A4re.jpg/640px-Calcium_unter_Argon_Schutzgasatmosph%C3%A4re.jpg"
    },
    26: {
        "icon": "🍳",
        "item": "요리용 프라이팬 & 거대한 다리 철골",
        "itemDesc": "지구 중심 핵의 대부분을 차지하고, 빌딩과 거대한 다리를 세우는 가장 든든한 금속이자 혈액 속 산소를 나르는 헤모글로빈의 핵심!",
        "caption": "사진/삽화: 99.9% 고순도 전해철 큐브와 튼튼한 프라이팬",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Iron_electrolytic_and_1cm3_cube.jpg/640px-Iron_electrolytic_and_1cm3_cube.jpg"
    },
    29: {
        "icon": "🔌",
        "item": "전기를 나르는 구리 전선 & 동상",
        "itemDesc": "전기와 열을 아주 잘 통과시켜 가정의 모든 전선 속에 숨어 있으며, 도시 광장의 멋진 청동 동상과 10원짜리 동전의 주인공!",
        "caption": "사진/삽화: 자연 상태에서 발견된 붉은빛 천연 구리 원석과 전선",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/NatCopper.jpg/640px-NatCopper.jpg"
    },
    47: {
        "icon": "🥈",
        "item": "올림픽 은메달 & 선명한 거울",
        "itemDesc": "모든 금속 중에서 빛을 가장 잘 반사하고 전기를 가장 잘 통하게 하여, 매일 보는 거울 뒷면의 반사막과 은수저에 쓰여요!",
        "caption": "사진/삽화: 나뭇가지처럼 아름답게 자란 순수 은(Silver) 결정 덩어리",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Silver_crystal.jpg/640px-Silver_crystal.jpg"
    },
    79: {
        "icon": "🪙",
        "item": "눈부신 황금 보물 & 우주복 헬멧 차광막",
        "itemDesc": "수천 년이 지나도 절대 녹슬거나 변색되지 않는 영원한 황금빛 보석이자, 우주비행사의 눈을 태양열로부터 보호하는 금 코팅막!",
        "caption": "사진/삽화: 자연 속에서 채취한 찬란한 순금 너깃 덩어리와 금화",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Gold-crystals.jpg/640px-Gold-crystals.jpg"
    },
    80: {
        "icon": "🌡️",
        "item": "은빛으로 찰랑이는 액체 수은 온도계",
        "itemDesc": "금속인데도 방 안 온도에서 유일하게 물처럼 찰랑찰랑 흐르는 신기한 은빛 액체로, 고전적인 온도계와 혈압계에 쓰였어요!",
        "caption": "사진/삽화: 비커에서 은빛 액체 방울로 찰랑거리는 신비로운 액체 수은",
        "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Pouring_liquid_mercury_bionerd.jpg/640px-Pouring_liquid_mercury_bionerd.jpg"
    }
}

print("Sample check loaded:", len(BOOK_ILLUSTRATIONS))
