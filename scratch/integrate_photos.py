# -*- coding: utf-8 -*-
import json

# 1. verified_element_photos.json 로드
with open("scratch/verified_element_photos.json", "r", encoding="utf-8") as f:
    verified_photos = json.load(f)

# 2. 특별 보정(인공 원소 과학자/연구소 및 미싱 원소)
# (num: (imgUrl, caption))
special_replacements = {
    61: (
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Promethium-147_solution.jpg/500px-Promethium-147_solution.jpg",
        "사진: 방사선을 방출하며 스스로 푸른 형광을 내뿜는 프로메튬-147 용액"
    ),
    86: (
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Radon_spectrum_visible.png/500px-Radon_spectrum_visible.png",
        "사진: 방사성 불활성 기체인 라돈의 고유 방전 발광 스펙트럼"
    ),
    87: (
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Francium-87.jpg/500px-Francium-87.jpg",
        "사진: 지구 전체에 20~30g만 존재하는 극초희귀 원소 프랑슘의 상징 도안"
    ),
    96: (
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Cm-Fluoreszenz.png/500px-Cm-Fluoreszenz.png",
        "사진: 어둠 속에서 주황빛 방사광을 스스로 내뿜는 퀴륨 용액"
    ),
    100: (
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Enrico_Fermi_1943-49.jpg/500px-Enrico_Fermi_1943-49.jpg",
        "사진: 페르뮴 명명의 기원이 된 원자 물리학의 거장 엔리코 페르미 (인공 합성 원소)"
    ),
    101: (
        "https://upload.wikimedia.org/wikipedia/commons/8/80/Dmitri_Mendeleev_1890s.jpg",
        "사진: 주기율표를 최초로 창안하여 멘델레븀의 이름이 헌정된 드미트리 멘델레예프 (인공 합성 원소)"
    ),
    102: (
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/AlfredNobel.jpg/500px-AlfredNobel.jpg",
        "사진: 노벨상을 제정한 알프레드 노벨을 기려 명명된 노벨륨 (인공 합성 원소)"
    ),
    103: (
        "https://upload.wikimedia.org/wikipedia/commons/6/6a/Ernest_Lawrence.jpg",
        "사진: 입자 가속기(사이클로트론)를 발명하여 로렌슘의 이름이 붙여진 어니스트 로렌스 (인공 합성 원소)"
    ),
    104: (
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6e/Ernest_Rutherford_LOC.jpg/500px-Ernest_Rutherford_LOC.jpg",
        "사진: 원자핵을 발견하여 현대 핵물리학의 아버지가 된 어니스트 러더퍼드 (인공 합성 원소)"
    ),
    105: (
        "https://upload.wikimedia.org/wikipedia/commons/6/6f/Dubna.house_of_scientiests.jpg",
        "사진: 더브늄과 수많은 초중원소를 합성해낸 러시아 두브나 과학자 회관 (인공 합성 원소)"
    ),
    106: (
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Glenn_Seaborg_-_1964.jpg/500px-Glenn_Seaborg_-_1964.jpg",
        "사진: 살아있는 동안 원소(시보귬)에 자신의 이름이 붙여진 노벨화학상 수상자 글렌 시보그 (인공 합성 원소)"
    ),
    107: (
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Niels_Bohr.jpg/500px-Niels_Bohr.jpg",
        "사진: 보어 원자 모형을 완성한 양자물리학의 거장 닐스 보어를 기린 보륨 (인공 합성 원소)"
    ),
    108: (
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/GSI-Darmstadt-S%C3%BCdbau.jpg/500px-GSI-Darmstadt-S%C3%BCdbau.jpg",
        "사진: 하슘(Hs)과 여러 초중원소를 탄생시킨 독일 헤센 중이온연구소(GSI) (인공 합성 원소)"
    ),
    109: (
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Lise_Meitner12.jpg/500px-Lise_Meitner12.jpg",
        "사진: 핵분열 메커니즘을 규명한 물리학의 선구자 리제 마이트너를 기린 마이트너륨 (인공 합성 원소)"
    ),
    110: (
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Luisenplatz%2C_Darmstadt.jpg/500px-Luisenplatz%2C_Darmstadt.jpg",
        "사진: 다름슈타튬이 최초 합성된 독일 과학 도시 다름슈타트의 루이젠 광장 (인공 합성 원소)"
    ),
    111: (
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ec/Wilhelm_Conrad_R%C3%B6ntgen_%281888-1900%29%2C_88374_p.jpg/500px-Wilhelm_Conrad_R%C3%B6ntgen_%281888-1900%29%2C_88374_p.jpg",
        "사진: 엑스선(X-ray)을 최초 발견하여 최초의 노벨물리학상을 수상한 빌헬름 뢴트겐 (인공 합성 원소)"
    ),
    112: (
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/Nikolaus_Kopernikus.jpg/500px-Nikolaus_Kopernikus.jpg",
        "사진: 지동설로 인류의 우주관을 바꾼 위대한 천문학자 니콜라우스 코페르니쿠스 (인공 합성 원소)"
    ),
    113: (
        "https://upload.wikimedia.org/wikipedia/commons/5/51/Kosuke_Morita_cropped_2_Kosuke_Morita_20161201.jpg",
        "사진: 아시아 최초로 113번 원소 니호늄을 합성한 일본 RIKEN 연구팀의 모리타 코스케 교수 (인공 합성 원소)"
    ),
    114: (
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/RUSMARKA-1660.jpg/500px-RUSMARKA-1660.jpg",
        "사진: 플레로븀의 기원이 된 초우라늄 원소 연구의 선구자 게오르기 플료로프 박사 기념 우표 (인공 합성 원소)"
    ),
    115: (
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/%D0%94%D1%83%D0%B1%D0%BD%D0%B0_%2850116392561%29.jpg/500px-%D0%94%D1%83%D0%B1%D0%BD%D0%B0_%2850116392561%29.jpg",
        "사진: 모스코븀(Mc)이 합성된 모스크바주의 세계적 과학 도시 두브나 전경 (인공 합성 원소)"
    ),
    116: (
        "https://upload.wikimedia.org/wikipedia/commons/6/6e/IMAG3049-livermore-lab_cropped.jpg",
        "사진: 리버모륨(Lv)을 공동 발견한 미국 로렌스 리버모어 국립연구소(LLNL) (인공 합성 원소)"
    ),
    117: (
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Oak_Ridge_National_Laboratory_Aerial_View.jpg/500px-Oak_Ridge_National_Laboratory_Aerial_View.jpg",
        "사진: 테네신(Ts) 표적 물질을 합성해낸 미국 테네시주 오크리지 국립연구소 (인공 합성 원소)"
    ),
    118: (
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Yuri_Oganessian.jpg/500px-Yuri_Oganessian.jpg",
        "사진: 살아있는 과학자로서 원소 이름의 주인공이 된 핵물리학자 유리 오가네시안 박사 (인공 합성 원소)"
    )
}

# 3. elements-data.js 원본 읽기
with open("js/elements-data.js", "r", encoding="utf-8") as f:
    js_text = f.read()

idx = js_text.find("window.PERIODIC_DATA =")
prefix = js_text[:idx + len("window.PERIODIC_DATA = ")]
json_str = js_text[idx + len("window.PERIODIC_DATA ="):].strip().rstrip(";")
data = json.loads(json_str)

std_list = data["standardElements"]
fut_list = data.get("futureElements", [])

# standardElements 업데이트
for el in std_list:
    num = el["num"]
    illus = el.get("illustration", {})
    
    if num in special_replacements:
        url, cap = special_replacements[num]
        illus["imgUrl"] = url
        illus["caption"] = cap
    else:
        vinfo = verified_photos.get(str(num), {})
        v_url = vinfo.get("url", "")
        if v_url:
            illus["imgUrl"] = v_url
        else:
            # 640px fallback
            curr_url = illus.get("imgUrl", "")
            illus["imgUrl"] = curr_url.replace("/640px-", "/500px-")
            
    el["illustration"] = illus

# futureElements 업데이트 (640px -> 500px)
for el in fut_list:
    illus = el.get("illustration", {})
    curr_url = illus.get("imgUrl", "")
    if curr_url:
        illus["imgUrl"] = curr_url.replace("/640px-", "/500px-")
    el["illustration"] = illus

# 4. 파일로 다시 쓰기
updated_json = json.dumps(data, ensure_ascii=False, indent=2)
new_js_text = f"// 118개 원소 + 8주기 미래 원소 데이터베이스 (책 스타일 일러스트, 희귀도, 기호비밀, 불꽃반응, 위험도 포함)\nwindow.PERIODIC_DATA = {updated_json};\n"

with open("js/elements-data.js", "w", encoding="utf-8") as f:
    f.write(new_js_text)

# android 웹뷰에도 동일하게 복사
with open("android/app/src/main/assets/www/js/elements-data.js", "w", encoding="utf-8") as f:
    f.write(new_js_text)

print("Successfully updated js/elements-data.js and android copy!")
