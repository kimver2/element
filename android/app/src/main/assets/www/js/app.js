// 메인 애플리케이션 진입점 & 모달/TTS/탭 오케스트레이션

(function() {
  let currentModalElementNum = 1;

  // 탭 전환 제어
  function initTabs() {
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    const viewSections = document.querySelectorAll('.view-section');
    const filterBar = document.querySelector('.filter-bar');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetViewId = btn.dataset.view;

        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        viewSections.forEach(section => {
          if (section.id === targetViewId) {
            section.classList.add('active');
          } else {
            section.classList.remove('active');
          }
        });

        // 주기율표/카드도감 뷰에서만 검색/필터바 표시 (나머지 탭에서는 숨겨 화면 확보)
        if (filterBar) {
          if (targetViewId === 'view-table' || targetViewId === 'view-cards') {
            filterBar.style.display = 'flex';
          } else {
            filterBar.style.display = 'none';
          }
        }

        // 플로팅 줌 컨트롤은 주기율표 뷰에서만 표시
        const floatingZoomBar = document.getElementById('floating-zoom-bar');
        if (floatingZoomBar) {
          if (targetViewId === 'view-table') {
            floatingZoomBar.style.display = 'flex';
          } else {
            floatingZoomBar.style.display = 'none';
          }
        }
      });
    });
  }

  // 발음 듣기 (Web Speech Synthesis API) - 또렷한 여성 음성 최적화
  let cachedVoices = [];
  function loadVoices() {
    if ('speechSynthesis' in window) {
      cachedVoices = window.speechSynthesis.getVoices();
    }
  }

  if ('speechSynthesis' in window) {
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  function findBestVoice(lang) {
    if (!cachedVoices || cachedVoices.length === 0) {
      loadVoices();
    }
    const voices = cachedVoices || [];
    if (!voices.length) return null;

    const isEn = lang.toLowerCase().startsWith('en');
    const isKo = lang.toLowerCase().startsWith('ko');

    if (isEn) {
      const enVoices = voices.filter(v => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith('en'));
      if (!enVoices.length) return null;

      // 1순위: 명시적 여성 고품질 영어 음성 (Samantha, Victoria, Karen, Jenny, Aria, Zira 등)
      const preferredFemaleNames = [
        'samantha', 'victoria', 'karen', 'jenny', 'aria', 'zira', 'ava',
        'allison', 'serena', 'moira', 'fiona', 'tessa', 'susan', 'female'
      ];
      for (const name of preferredFemaleNames) {
        const found = enVoices.find(v => v.name.toLowerCase().includes(name));
        if (found) return found;
      }

      // 2순위: Google US English / Google English
      const googleVoice = enVoices.find(v => {
        const n = v.name.toLowerCase();
        return n.includes('google') && (n.includes('us english') || n.includes('english'));
      });
      if (googleVoice) return googleVoice;

      // 3순위: 남성 키워드가 없는 영어 음성
      const maleKeywords = ['male', 'david', 'mark', 'george', 'alex', 'daniel', 'fred', 'bruce', 'tom', 'guy', 'james', 'john'];
      const nonMale = enVoices.find(v => {
        const n = v.name.toLowerCase();
        return !maleKeywords.some(m => n.includes(m));
      });
      if (nonMale) return nonMale;

      return enVoices[0];
    }

    if (isKo) {
      const koVoices = voices.filter(v => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith('ko'));
      if (!koVoices.length) return null;

      const preferredKoFemales = ['yuna', 'sora', 'sunhi', 'heami', 'female', 'google'];
      for (const name of preferredKoFemales) {
        const found = koVoices.find(v => v.name.toLowerCase().includes(name));
        if (found) return found;
      }
      return koVoices[0];
    }

    return voices.find(v => v.lang && v.lang.toLowerCase().startsWith(lang.toLowerCase())) || null;
  }

  // 발음 듣기 (Web Speech Synthesis API)
  function speakElement(text, lang = 'ko-KR', triggerBtn = null) {
    if (!('speechSynthesis' in window)) {
      alert('이 브라우저는 음성 발음을 지원하지 않습니다.');
      return;
    }
    window.speechSynthesis.cancel();
    document.querySelectorAll('.speak-btn').forEach(b => b.classList.remove('playing'));

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;

    const voice = findBestVoice(lang);
    if (voice) {
      utter.voice = voice;
      if (voice.lang) utter.lang = voice.lang;
    }

    // 초등학생이 또렷하고 친근하게 들을 수 있도록 맑은 여성 톤 & 속도 세팅
    if (lang.toLowerCase().startsWith('en')) {
      utter.rate = 0.90;  // 영단어 발음이 뭉개지지 않는 또렷한 속도
      utter.pitch = 1.08; // 맑고 또렷한 톤
    } else {
      utter.rate = 0.92;
      utter.pitch = 1.05;
    }

    if (triggerBtn) {
      utter.onstart = () => triggerBtn.classList.add('playing');
      utter.onend = () => triggerBtn.classList.remove('playing');
      utter.onerror = () => triggerBtn.classList.remove('playing');
    }

    window.speechSynthesis.speak(utter);
  }

  // 원소 상세 모달 열기
  // 갤러리 탭 전환 함수
  function initGalleryTabs() {
    const tabBtns = document.querySelectorAll('.gallery-tab-btn');
    const panels = {
      'tab-illust': document.getElementById('gallery-panel-illust'),
      'tab-photo': document.getElementById('gallery-panel-photo'),
      'tab-atom': document.getElementById('gallery-panel-atom')
    };

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        Object.keys(panels).forEach(key => {
          if (panels[key]) {
            if (key === target) {
              panels[key].classList.add('active');
            } else {
              panels[key].classList.remove('active');
            }
          }
        });
      });
    });
  }

  window.openElementModal = function(num) {
    if (!window.PERIODIC_DATA) return;
    const all = [...window.PERIODIC_DATA.standardElements, ...window.PERIODIC_DATA.futureElements];
    const el = all.find(e => e.num === num);
    if (!el) return;

    currentModalElementNum = num;

    // 🏆 도감 탐험 업적에 등록
    if (window.markElementExplored) {
      window.markElementExplored(num);
    }

    const modalOverlay = document.getElementById('element-modal-overlay');
    const modalBox = document.getElementById('detail-modal-box');
    if (!modalOverlay || !modalBox) return;

    const catName = (window.CATEGORY_NAMES && window.CATEGORY_NAMES[el.category]) || el.category;
    const colorVar = `var(--cat-${el.category}, #00d2ff)`;
    modalBox.style.setProperty('--modal-color', colorVar);

    // 📖 1. 책 상단 헤더 & 페이지 번호
    const totalCount = 118;
    const isFuture = el.num > 118;
    const pageBadge = document.getElementById('modal-page-num');
    if (pageBadge) {
      if (isFuture) {
        pageBadge.innerText = `${el.nameKo} (#${el.num})`;
      } else {
        pageBadge.innerText = `${el.nameKo} (${el.num} / ${totalCount})`;
      }
    }

    // 모달 데이터 채우기
    document.getElementById('modal-elem-num').innerText = `#${el.num} ${el.symbol}`;
    document.getElementById('modal-elem-name-ko').innerText = el.nameKo;
    document.getElementById('modal-elem-name-en').innerText = el.nameEn;
    
    // 🎨 2. 책 삽화 & 실물 사진 데이터 바인딩
    const illus = el.illustration || {
      icon: '🔬',
      item: `${el.nameKo} 화합물 & 연구`,
      itemDesc: el.summary,
      caption: `사진: ${el.nameKo}`,
      imgUrl: ''
    };

    const illustIcon = document.getElementById('modal-illust-icon');
    const illustItem = document.getElementById('modal-illust-item');
    const illustDesc = document.getElementById('modal-illust-desc');
    if (illustIcon) illustIcon.innerText = illus.icon;
    if (illustItem) illustItem.innerText = illus.item;
    if (illustDesc) illustDesc.innerText = illus.itemDesc;

    // 실물 사진 바인딩
    const realPhotoImg = document.getElementById('modal-real-photo-img');
    const photoFallbackBox = document.getElementById('photo-fallback-box');
    const photoCaption = document.getElementById('modal-photo-caption');
    const photoSpinner = document.getElementById('photo-loading-spinner');

    if (photoCaption) {
      photoCaption.innerText = illus.caption || `사진: ${el.nameKo} 원소 표본`;
    }

    if (realPhotoImg && photoFallbackBox) {
      realPhotoImg.referrerPolicy = 'no-referrer';
      realPhotoImg.classList.remove('loaded');

      if (illus.imgUrl) {
        realPhotoImg.style.display = 'block';
        photoFallbackBox.style.display = 'none';
        if (photoSpinner) photoSpinner.style.display = 'flex';

        let retryDone = false;
        realPhotoImg.onload = () => {
          if (photoSpinner) photoSpinner.style.display = 'none';
          realPhotoImg.classList.add('loaded');
        };

        realPhotoImg.onerror = () => {
          // 쿼리 파라미터가 있을 경우 1회 제거 후 재시도
          if (!retryDone && realPhotoImg.src.includes('?')) {
            retryDone = true;
            realPhotoImg.src = realPhotoImg.src.split('?')[0];
            return;
          }

          if (photoSpinner) photoSpinner.style.display = 'none';
          realPhotoImg.style.display = 'none';
          photoFallbackBox.style.display = 'flex';

          const fallbackText = document.getElementById('photo-fallback-text');
          if (fallbackText) {
            if (el.num >= 100 || el.num === 87) {
              fallbackText.innerHTML = `<strong>인공 합성 원소 (실물 표본 부재)</strong><br><span style="font-size:0.8rem;color:#94a3b8;">이 원소는 입자 가속기에서 찰나의 순간 동안만 생성되어 육안 관찰 표본이 존재하지 않습니다.</span>`;
            } else {
              fallbackText.innerHTML = `오프라인 상태이거나 사진을 불러올 수 없습니다.<br>🎨 '책 속 그림' 탭에서 생생한 삽화를 확인하세요!`;
            }
          }
        };

        realPhotoImg.src = illus.imgUrl;
      } else {
        if (photoSpinner) photoSpinner.style.display = 'none';
        realPhotoImg.style.display = 'none';
        photoFallbackBox.style.display = 'flex';
      }
    }

    // 🌀 2D 보어 원자 모형 캔버스 애니메이션 가동!
    if (window.renderAtomModel) {
      window.renderAtomModel(el.num, el.symbol, el.shells);
    }

    // 📋 3. 원소 기본 제원 표 (책 속 팩트 시트)
    const specGrid = document.getElementById('modal-spec-grid');
    if (specGrid) {
      const stateLabel = el.state === 'gas' ? '💨 기체' : el.state === 'liquid' ? '💧 액체' : '🪨 고체';
      specGrid.innerHTML = `
        <div class="spec-cell"><span class="spec-k">주기 / 족</span><span class="spec-v">${el.period}주기 ${typeof el.group === 'number' ? el.group + '족' : el.group}</span></div>
        <div class="spec-cell"><span class="spec-k">원자량</span><span class="spec-v">${el.weight}</span></div>
        <div class="spec-cell"><span class="spec-k">상온 상태</span><span class="spec-v">${stateLabel}</span></div>
        <div class="spec-cell"><span class="spec-k">녹는점</span><span class="spec-v" style="color:var(--accent-gold);">${el.meltingPoint !== undefined ? el.meltingPoint + '℃' : '미정'}</span></div>
        <div class="spec-cell"><span class="spec-k">끓는점</span><span class="spec-v">${el.boilingPoint !== undefined ? el.boilingPoint + '℃' : '미정'}</span></div>
        <div class="spec-cell"><span class="spec-k">밀도</span><span class="spec-v">${el.density !== undefined ? el.density : '미정'}</span></div>
      `;
    }

    // 배지 (둥근 알약 버튼 형식)
    const badgeRow = document.getElementById('modal-badges');
    badgeRow.innerHTML = `
      <span class="modal-badge modal-badge-category" style="background:${colorVar}; color:#fff;">${catName}</span>
      <span class="modal-badge modal-badge-spec">${el.period}주기 · ${typeof el.group === 'number' ? el.group + '족' : el.group}</span>
      ${el.isRadioactive ? '<span class="modal-badge modal-badge-radioactive">☢️ 방사성</span>' : ''}
      ${isFuture ? '<span class="modal-badge modal-badge-future">🚀 8주기 미래 가상</span>' : ''}
    `;

    // 📖 4. 스토리텔링 텍스트 섹션 채우기
    document.getElementById('modal-summary-text').innerText = el.summary;
    document.getElementById('modal-uses-text').innerHTML = `
      <div class="story-highlight-box">
        <span class="story-highlight-lead">📌 대표적인 물건:</span>
        <b style="color:var(--accent-gold);">${illus.item}</b>
      </div>
      <p style="margin-top:8px; line-height:1.65;">${el.uses || illus.itemDesc}</p>
    `;
    document.getElementById('modal-discovery-text').innerHTML = `
      <p><b>🔬 발견 / 연구:</b> ${el.discovery || '기록 없음'}</p>
      <p style="margin-top:6px;"><b>🌱 이름의 유래:</b> ${el.origin || '기록 없음'}</p>
    `;
    document.getElementById('modal-funfact-text').innerText = el.funFact || '놀라운 비밀을 연구 중이에요!';

    // 🔤 원소 기호의 비밀 바인딩
    const secretBox = document.getElementById('modal-secret-text');
    if (secretBox) {
      secretBox.innerText = el.symbolSecret || '기호의 비밀 정보를 준비 중이에요!';
    }

    // 🔥 불꽃 반응 실험실 바인딩
    const flameContent = document.getElementById('modal-flame-content');
    if (flameContent) {
      if (el.flameColor) {
        flameContent.innerHTML = `
          <div class="flame-visual-wrap">
            <div class="animated-flame" style="--flame-color:${el.flameColor.color};"></div>
          </div>
          <div class="flame-info-wrap">
            <div class="flame-color-title" style="color:${el.flameColor.color}; font-size:1.1rem; font-weight:800;">
              ${el.flameColor.nameKo}
            </div>
            <div style="font-size:0.85rem; color:var(--text-muted); margin-top:2px;">
              영문 명칭: ${el.flameColor.nameEn}
            </div>
            <div style="font-size:0.88rem; color:var(--text-bright); margin-top:6px;">
              불꽃놀이 화약에 <b>${el.nameKo}</b> 화합물을 넣으면 이 아름다운 불꽃색이 밤하늘을 수놓아요! 🎆
            </div>
          </div>
        `;
      } else {
        flameContent.innerHTML = `
          <div style="font-size:0.88rem; color:var(--text-muted); padding:8px 0;">
            💡 이 원소는 고유의 뚜렷한 가시광선 불꽃 반응 색상을 나타내지 않습니다. (주로 알칼리/알칼리토 금속과 구리에서 관찰돼요)
          </div>
        `;
      }
    }

    // ⚠️ 위험도 & 빌런 등급 게이지 바인딩
    const hazardContent = document.getElementById('modal-hazard-content');
    if (hazardContent) {
      const h = el.hazard || { toxicity: 1, reactivity: 2, radiation: 1, safety: 'SAFE', safetyLabel: '안전', safetyColor: '#2ed573' };
      
      function getStars(cnt) {
        return '★'.repeat(cnt) + '☆'.repeat(5 - cnt);
      }

      hazardContent.innerHTML = `
        <div class="hazard-stat-row">
          <span class="h-name">☠️ 치사 독성 (Toxicity)</span>
          <span class="h-stars" style="color:#ff6b81;">${getStars(h.toxicity)}</span>
        </div>
        <div class="hazard-stat-row">
          <span class="h-name">💥 화학 반응성 (Reactivity)</span>
          <span class="h-stars" style="color:#ffa502;">${getStars(h.reactivity)}</span>
        </div>
        <div class="hazard-stat-row">
          <span class="h-name">☢️ 방사선 위험 (Radiation)</span>
          <span class="h-stars" style="color:#e056fd;">${getStars(h.radiation)}</span>
        </div>
        <div class="hazard-badge-banner" style="border:1px solid ${h.safetyColor}; color:${h.safetyColor}; background:rgba(0,0,0,0.3);">
          종합 안전도: <b>${h.safetyLabel}</b>
        </div>
      `;
    }

    // 이전/다음 버튼 제어
    const prevBtn = document.getElementById('modal-prev-btn');
    const nextBtn = document.getElementById('modal-next-btn');
    if (prevBtn) prevBtn.disabled = (num <= 1);
    if (nextBtn) nextBtn.disabled = (num >= 168);

    modalOverlay.classList.add('active');
  };

  function closeModal() {
    const modalOverlay = document.getElementById('element-modal-overlay');
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  }

  function initModalEvents() {
    const modalOverlay = document.getElementById('element-modal-overlay');
    const closeBtn = document.getElementById('modal-close-btn');
    const prevBtn = document.getElementById('modal-prev-btn');
    const nextBtn = document.getElementById('modal-next-btn');
    const speakKoBtn = document.getElementById('speak-ko-btn');
    const speakEnBtn = document.getElementById('speak-en-btn');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const all = [...window.PERIODIC_DATA.standardElements, ...window.PERIODIC_DATA.futureElements];
        const currentIndex = all.findIndex(e => e.num === currentModalElementNum);
        if (currentIndex > 0) {
          window.openElementModal(all[currentIndex - 1].num);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const all = [...window.PERIODIC_DATA.standardElements, ...window.PERIODIC_DATA.futureElements];
        const currentIndex = all.findIndex(e => e.num === currentModalElementNum);
        if (currentIndex < all.length - 1) {
          window.openElementModal(all[currentIndex + 1].num);
        }
      });
    }

    if (speakKoBtn) {
      speakKoBtn.addEventListener('click', () => {
        const nameKo = document.getElementById('modal-elem-name-ko').innerText;
        speakElement(nameKo, 'ko-KR', speakKoBtn);
      });
    }
    if (speakEnBtn) {
      speakEnBtn.addEventListener('click', () => {
        const nameEn = document.getElementById('modal-elem-name-en').innerText;
        speakElement(nameEn, 'en-US', speakEnBtn);
      });
    }

    window.addEventListener('keydown', (e) => {
      if (!modalOverlay || !modalOverlay.classList.contains('active')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft' && prevBtn && !prevBtn.disabled) prevBtn.click();
      if (e.key === 'ArrowRight' && nextBtn && !nextBtn.disabled) nextBtn.click();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initModalEvents();
    initGalleryTabs();

    if (window.initPeriodicTable) window.initPeriodicTable();
    if (window.initTempSlider) window.initTempSlider();
    if (window.initMoleculeLab) window.initMoleculeLab();
    if (window.initCardBattle) window.initCardBattle();
    if (window.initAchievements) window.initAchievements();
    if (window.initFutureLab) window.initFutureLab();
    if (window.initQuiz) window.initQuiz();
  });
})();
